const loadedViewResources = new Set<string>();

type LoadRowDetailProps = {
  detailViewName: string;
  embedClass: string;
  embedDataRef: string;
  rowIndex: number;
  getPConnect: any;
};

const hasViewMetadata = (metadata: any) =>
  !!(metadata?.children?.length || metadata?.config?.template || metadata?.config?.name);

/** Safely access nested store data using a dot/bracket path (e.g. caseInfo.content.Orders[0]). */
export const getNestedStoreValue = (obj: any, path: string) => {
  if (!obj || !path) {
    return undefined;
  }
  return path.split('.').reduce((current: any, key) => {
    if (current === null || current === undefined) {
      return undefined;
    }
    if (key.includes('[') && key.includes(']')) {
      const arrayKey = key.substring(0, key.indexOf('['));
      const index = parseInt(key.substring(key.indexOf('[') + 1, key.indexOf(']')), 10);
      const arr = current[arrayKey];
      if (!Array.isArray(arr) || index < 0 || index >= arr.length) {
        return undefined;
      }
      return arr[index];
    }
    return current[key];
  }, obj);
};

const isPlainObject = (value: any): boolean => !!value && typeof value === 'object' && !Array.isArray(value);

/** True when a column should render as an interactive checkbox. */
export const isBooleanField = (field: any, rowIndex?: number): boolean => {
  if (field?.componentType === 'Checkbox') {
    return true;
  }
  if (typeof rowIndex === 'number') {
    return typeof field?.value?.[rowIndex] === 'boolean';
  }
  return Array.isArray(field?.value) && field.value.some((val: any) => typeof val === 'boolean');
};

/** True when a column label is exactly `ID` (used for ID + URL merging). */
export const isIdColumn = (field: any): boolean => field?.label === 'ID';

/** True when a column is a URL field type. */
export const isUrlColumn = (field: any): boolean => field?.componentType === 'URL';

export type DisplayColumn =
  | { kind: 'field'; field: any; index: number }
  | { kind: 'idUrlLink'; idField: any; urlField: any; idIndex: number; urlIndex: number };

/**
 * Collapses consecutive ID + URL columns into a single display column.
 * Boolean (checkbox) columns are sorted to the front so they appear first after the expand control.
 */
export const buildDisplayColumns = (fields: any[]): DisplayColumn[] => {
  const columns: DisplayColumn[] = [];
  for (let i = 0; i < fields.length; i += 1) {
    const field = fields[i];
    const next = fields[i + 1];
    if (isIdColumn(field) && next && isUrlColumn(next)) {
      columns.push({
        kind: 'idUrlLink',
        idField: field,
        urlField: next,
        idIndex: i,
        urlIndex: i + 1,
      });
      i += 1;
    } else {
      columns.push({ kind: 'field', field, index: i });
    }
  }

  const booleanColumns = columns.filter((col) => col.kind === 'field' && isBooleanField(col.field));
  const otherColumns = columns.filter((col) => !(col.kind === 'field' && isBooleanField(col.field)));
  return [...booleanColumns, ...otherColumns];
};

/** Resolves a relative property name (e.g. `.IsSelected`) from field metadata. */
export const getRelativePropName = (field: any): string => {
  const candidates = [field?.propref, field?.name];
  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate) {
      const cleaned = candidate.replace(/^@P\s+/, '');
      const segment = cleaned.includes('.') ? cleaned.slice(cleaned.lastIndexOf('.') + 1) : cleaned;
      const prop = segment.replace(/\[\d*\]/g, '');
      if (prop) {
        return `.${prop}`;
      }
    }
  }
  return '';
};

const createActionsForPage = (contextName: string, pageReference: string, target?: string) => {
  const messageConfig = {
    meta: { config: { context: contextName } },
    options: { context: contextName, pageReference, target },
  };
  const c11nEnv = (window as any).PCore.createPConnect(messageConfig);
  return c11nEnv?.getPConnect()?.getActionsApi();
};

const updateBooleanFieldsOnPage = (config: {
  pageRef: string;
  pageData: any;
  checked: boolean;
  contextName: string;
  target?: string;
}) => {
  const { pageRef, pageData, checked, contextName, target } = config;
  const actions = createActionsForPage(contextName, pageRef, target);
  if (!actions || !isPlainObject(pageData)) {
    return;
  }
  Object.entries(pageData).forEach(([key, val]) => {
    if (typeof val === 'boolean') {
      actions.updateFieldValue(`.${key}`, checked);
    }
  });
};

/**
 * Walk nested pages and page lists under a row and set every boolean field to `checked`.
 * Unlike CheckboxRow, children live on nested objects — not as siblings on the same page.
 */
export const updateNestedBooleanFields = (config: {
  pageRef: string;
  pageData: any;
  checked: boolean;
  contextName: string;
  target?: string;
}) => {
  const { pageRef, pageData, checked, contextName, target } = config;
  if (!isPlainObject(pageData)) {
    return;
  }

  Object.entries(pageData).forEach(([key, val]) => {
    if (Array.isArray(val)) {
      val.forEach((item, index) => {
        if (!isPlainObject(item)) {
          return;
        }
        const childPageRef = `${pageRef}.${key}[${index}]`;
        updateBooleanFieldsOnPage({
          pageRef: childPageRef,
          pageData: item,
          checked,
          contextName,
          target,
        });
        updateNestedBooleanFields({
          pageRef: childPageRef,
          pageData: item,
          checked,
          contextName,
          target,
        });
      });
      return;
    }
    if (isPlainObject(val)) {
      const childPageRef = `${pageRef}.${key}`;
      updateBooleanFieldsOnPage({
        pageRef: childPageRef,
        pageData: val,
        checked,
        contextName,
        target,
      });
      updateNestedBooleanFields({
        pageRef: childPageRef,
        pageData: val,
        checked,
        contextName,
        target,
      });
    }
  });
};

/** Updates the row's boolean property, then select/unselect nested boolean children. */
export const applyBooleanSelectAll = (config: {
  rowPageRef: string;
  field: any;
  checked: boolean;
  contextName: string;
  target?: string;
  storeData: any;
}) => {
  const { rowPageRef, field, checked, contextName, target, storeData } = config;
  const actions = createActionsForPage(contextName, rowPageRef, target);
  const propName = getRelativePropName(field);
  if (actions && propName) {
    actions.updateFieldValue(propName, checked);
  }

  const rowData = getNestedStoreValue(storeData, rowPageRef);
  updateNestedBooleanFields({
    pageRef: rowPageRef,
    pageData: rowData,
    checked,
    contextName,
    target,
  });
};

/** Returns the page reference for the current view context (supports nested embeds). */
export const getBasePageReference = (getPConnect: any): string => {
  const pConn = getPConnect();
  const pageRef = pConn.getPageReference?.() || pConn.options?.pageReference || 'caseInfo.content';
  if (pageRef === 'content') {
    return 'caseInfo.content';
  }
  if (pageRef.startsWith('.')) {
    return `caseInfo.content${pageRef}`;
  }
  return pageRef;
};

const normalizeListName = (embedDataRef: string): string =>
  embedDataRef.startsWith('.') ? embedDataRef.slice(1) : embedDataRef;

const segmentInPath = (path: string, segment: string): boolean => new RegExp(`\\.${segment}\\[\\d+\\]`).test(path);

/** Extracts the embedded page-list path from a Pega field config value. */
export const extractPageRefFromConfig = (configValue: string): string => {
  const marker = ' .';
  const start = configValue.indexOf(marker);
  if (start === -1) {
    return '';
  }
  const pathPart = configValue.substring(start + marker.length);
  const listEnd = pathPart.lastIndexOf('[].');
  if (listEnd === -1) {
    return '';
  }
  return pathPart.substring(0, listEnd).trim();
};

/** Builds the pageReference for a row in the embedded page list. */
export const buildRowPageReference = (basePageRef: string, embedDataRef: string, rowIndex: number): string => {
  const listPath = normalizeListName(embedDataRef);
  if (!listPath.includes('[].')) {
    return `${basePageRef}.${listPath}[${rowIndex}]`;
  }

  const segments = listPath.split('[].');
  let current = basePageRef;

  for (let i = 0; i < segments.length - 1; i += 1) {
    const segment = segments[i];
    if (!segmentInPath(current, segment)) {
      current = `${current}.${segment}[0]`;
    }
  }

  const lastSegment = segments[segments.length - 1];
  return `${current}.${lastSegment}[${rowIndex}]`;
};

/**
 * Re-reads boolean column values from the Redux store so nested tables re-render
 * after a parent select-all updates IsSelected via SetProperty.
 */
export const syncBooleanFieldValuesFromStore = (config: {
  fields: any[];
  storeData: any;
  basePageRef: string;
  embedDataRef: string;
}): { fields: any[]; changed: boolean } => {
  const { fields, storeData, basePageRef, embedDataRef } = config;
  let changed = false;

  const nextFields = fields.map((field) => {
    if (!isBooleanField(field) || !Array.isArray(field.value)) {
      return field;
    }
    const propName = getRelativePropName(field);
    const propKey = propName.startsWith('.') ? propName.slice(1) : propName;
    if (!propKey) {
      return field;
    }
    const nextValues = field.value.map((current: any, rowIndex: number) => {
      const rowPageRef = buildRowPageReference(basePageRef, embedDataRef, rowIndex);
      const rowData = getNestedStoreValue(storeData, rowPageRef);
      const storeValue = rowData?.[propKey];
      if (typeof storeValue === 'boolean') {
        return storeValue;
      }
      return current;
    });
    if (nextValues.some((val: any, index: number) => val !== field.value[index])) {
      changed = true;
      return { ...field, value: nextValues };
    }
    return field;
  });

  return { fields: nextFields, changed };
};

/** Builds the referenceList option for createPConnect. */
export const buildReferenceList = (embedDataRef: string): string => {
  const listPath = normalizeListName(embedDataRef);
  if (!listPath.includes('[].')) {
    return `.${listPath}`;
  }
  const lastSegment = listPath.split('[].').pop() ?? listPath;
  return `.${lastSegment}`;
};

/** Resolves parent path and list property for context-tree registration. */
export const getPageListRegistration = (
  basePageRef: string,
  embedDataRef: string,
): { parentPath: string; listProperty: string } => {
  const listPath = normalizeListName(embedDataRef);
  if (!listPath.includes('[].')) {
    return { parentPath: basePageRef, listProperty: listPath };
  }

  const segments = listPath.split('[].');
  const listProperty = segments[segments.length - 1];
  let parentPath = basePageRef;

  for (let i = 0; i < segments.length - 1; i += 1) {
    const segment = segments[i];
    if (!segmentInPath(parentPath, segment)) {
      parentPath = `${parentPath}.${segment}[0]`;
    }
  }

  return { parentPath, listProperty };
};

const getRowEmbedClass = (getPConnect: any, embedDataRef: string, rowIndex: number, fallbackClass: string) => {
  if (fallbackClass) {
    return fallbackClass;
  }
  const basePageRef = getBasePageReference(getPConnect);
  const rowPageRef = buildRowPageReference(basePageRef, embedDataRef, rowIndex);
  const context = getPConnect().getContextName();
  const storeData = (window as any).PCore.getStore()?.getState()?.data?.[context];
  const row = getNestedStoreValue(storeData, rowPageRef);
  return row?.pxObjClass || row?.pyObjClass || '';
};

const ensureViewResources = async (detailViewName: string, embedClass: string, getPConnect: any) => {
  const cacheKey = `${detailViewName}:${embedClass}`;
  if (loadedViewResources.has(cacheKey)) {
    return;
  }

  const { fetchViewResources, updateViewResources } = (window as any).PCore.getViewResources();
  const cachedMetadata = fetchViewResources(detailViewName, getPConnect(), embedClass);
  if (hasViewMetadata(cachedMetadata)) {
    loadedViewResources.add(cacheKey);
    return;
  }

  const pConnect = getPConnect();
  const caseInstanceKey =
    pConnect.getCaseInfo?.()?.getKey?.() ||
    pConnect.getValue?.((window as any).PCore.getConstants().CASE_INFO.CASE_INFO_ID);

  const response = await (window as any).PCore.getRestClient().invokeRestApi(
    'loadView',
    {
      queryPayload: {
        caseClassName: embedClass,
        caseID: caseInstanceKey,
        viewID: detailViewName,
      },
    },
    pConnect.getContextName(),
  );

  await updateViewResources(response.data);
  loadedViewResources.add(cacheKey);
};

/**
 * Lazy-loads and renders the detail view for an embedded page-list row.
 * Follows the DynamicHierarchicalForm pattern: fetch view metadata for the
 * embedded data class and bind createPConnect to the row pageReference.
 */
export const loadRowDetailView = async (props: LoadRowDetailProps) => {
  const { detailViewName, embedDataRef, rowIndex, getPConnect } = props;
  const embedClass = getRowEmbedClass(getPConnect, embedDataRef, rowIndex, props.embedClass);

  if (!embedClass) {
    return null;
  }

  await ensureViewResources(detailViewName, embedClass, getPConnect);

  const pConnect = getPConnect();
  const contextName = pConnect.getContextName();
  const basePageRef = getBasePageReference(getPConnect);
  const pageReference = buildRowPageReference(basePageRef, embedDataRef, rowIndex);
  const metadata = (window as any).PCore.getViewResources().fetchViewResources(detailViewName, pConnect, embedClass);

  const messageConfig = {
    meta: metadata,
    options: {
      contextName,
      context: contextName,
      pageReference,
      referenceList: buildReferenceList(embedDataRef),
      target: pConnect.getTarget(),
    },
  };

  const c11nEnv = (window as any).PCore.createPConnect(messageConfig);
  return c11nEnv.getPConnect().createComponent(messageConfig.meta);
};

/**
 * Given the PConnect object of a Template component, retrieve the children
 * metadata of all regions.
 * @param {Function} pConnect PConnect of a Template component.
 */
export default function getAllFields(pConnect: any) {
  const metadata = pConnect().getRawMetadata();
  if (!metadata.children) {
    return [];
  }

  let allFields = [];

  const makeField = (f: any) => {
    if (typeof f.config.value === 'string') {
      return {
        ...pConnect().resolveConfigProps(f.config),
        type: f.type,
        propref: `@P ${f.config.value.substring(f.config.value.lastIndexOf('.'))}`,
        pageref: extractPageRefFromConfig(f.config.value),
      };
    }
    return {
      ...pConnect().resolveConfigProps(f.config),
      type: f.type,
    };
  };

  const hasRegions = !!metadata.children[0]?.children;
  if (hasRegions) {
    metadata.children.forEach((region: any) =>
      region.children.forEach((field: any) => {
        allFields.push(makeField(field));
        if (field.type === 'Group' && field.children) {
          field.children.forEach((gf: any) => allFields.push(makeField(gf)));
        }
      }),
    );
  } else {
    allFields = metadata.children.map(makeField);
  }
  return allFields;
}
