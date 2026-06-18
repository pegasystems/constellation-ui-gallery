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
    if (current == null) {
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

const segmentInPath = (path: string, segment: string): boolean =>
  new RegExp(`\\.${segment}\\[\\d+\\]`).test(path);

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
export const buildRowPageReference = (
  basePageRef: string,
  embedDataRef: string,
  rowIndex: number,
): string => {
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
  const metadata = (window as any).PCore.getViewResources().fetchViewResources(
    detailViewName,
    pConnect,
    embedClass,
  );

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
