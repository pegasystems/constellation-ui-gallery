const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object' && !Array.isArray(value);

const SYSTEM_PROPERTY_PREFIXES = ['pxCreate', 'pxUpdate', 'pyTemp'];
const SYSTEM_PROPERTIES = new Set(['pzInsKey', 'pyID', 'pyStatusWork', 'pyLabel']);

const shouldStripProperty = (key: string): boolean => {
  if (SYSTEM_PROPERTIES.has(key)) {
    return true;
  }
  return SYSTEM_PROPERTY_PREFIXES.some((prefix) => key.startsWith(prefix));
};

/** Safely access nested store data using a dot/bracket path (e.g. caseInfo.content.Orders[0]). */
export const getNestedStoreValue = (obj: unknown, path: string) => {
  if (!obj || !path) {
    return undefined;
  }
  return path.split('.').reduce((current: unknown, key) => {
    if (current === null || current === undefined) {
      return undefined;
    }
    if (key.includes('[') && key.includes(']')) {
      const arrayKey = key.substring(0, key.indexOf('['));
      const index = parseInt(key.substring(key.indexOf('[') + 1, key.indexOf(']')), 10);
      const arr = (current as Record<string, unknown>)[arrayKey];
      if (!Array.isArray(arr) || index < 0 || index >= arr.length) {
        return undefined;
      }
      return arr[index];
    }
    return (current as Record<string, unknown>)[key];
  }, obj);
};

/** Normalize relative page references to absolute store paths. */
export const normalizePageReference = (pageRef: string): string => {
  if (!pageRef) {
    return '';
  }
  if (pageRef === 'content') {
    return 'caseInfo.content';
  }
  if (pageRef.startsWith('.')) {
    return `caseInfo.content${pageRef}`;
  }
  return pageRef;
};

export type EmbeddedRowContext = {
  rowPageRef: string;
  parentPageRef: string;
  listProperty: string;
  rowIndex: number;
  referenceList: string;
};

/** Parse a row pageReference into list context for duplicate-row insertion. */
export const parseEmbeddedRowContext = (pageRef: string): EmbeddedRowContext | null => {
  const rowPageRef = normalizePageReference(pageRef);
  const match = rowPageRef.match(/^(.*)\.([^.[]+)\[(\d+)\]$/);
  if (!match) {
    return null;
  }

  const [, parentPageRef, listProperty, rowIndexText] = match;
  const rowIndex = parseInt(rowIndexText, 10);
  if (!parentPageRef || !listProperty || Number.isNaN(rowIndex)) {
    return null;
  }

  return {
    rowPageRef,
    parentPageRef,
    listProperty,
    rowIndex,
    referenceList: `.${listProperty}`,
  };
};

/** Deep-clone row content for insert, stripping instance keys but preserving nested embeds. */
export const cloneRowContent = (rowData: unknown): Record<string, unknown> => {
  if (!isPlainObject(rowData)) {
    return {};
  }

  const cloneValue = (value: unknown): unknown => {
    if (Array.isArray(value)) {
      return value.map((item) => cloneValue(item));
    }
    if (isPlainObject(value)) {
      return cloneRowContent(value);
    }
    return value;
  };

  return Object.entries(rowData).reduce<Record<string, unknown>>((cloned, [key, value]) => {
    if (shouldStripProperty(key)) {
      return cloned;
    }
    cloned[key] = cloneValue(value);
    return cloned;
  }, {});
};

export const duplicateEmbeddedRow = (getPConnect: () => any, metaProps: unknown): boolean => {
  const pConn = getPConnect();
  const rawPageRef = pConn.getPageReference?.() || pConn.options?.pageReference || '';
  const rowContext = parseEmbeddedRowContext(rawPageRef);

  if (!rowContext) {
    console.warn('DuplicateRowButton: pageReference is missing or not inside an embedded page list.');
    return false;
  }

  const contextName = pConn.getContextName();
  const storeData = (window as any).PCore.getStore()?.getState()?.data?.[contextName];
  if (!storeData) {
    console.warn('DuplicateRowButton: store data is unavailable for the current context.');
    return false;
  }

  const rowData = getNestedStoreValue(storeData, rowContext.rowPageRef);
  if (!isPlainObject(rowData)) {
    console.warn('DuplicateRowButton: row data could not be read from the store.');
    return false;
  }

  const listPath = `${rowContext.parentPageRef}.${rowContext.listProperty}`;
  const listArray = getNestedStoreValue(storeData, listPath);
  if (!Array.isArray(listArray)) {
    console.warn('DuplicateRowButton: target page list could not be resolved.');
    return false;
  }

  const clonedContent = cloneRowContent(rowData);
  const insertIndex = listArray.length;

  const messageConfig = {
    meta: metaProps,
    options: {
      context: contextName,
      pageReference: rowContext.parentPageRef,
      referenceList: rowContext.referenceList,
      target: pConn.getTarget?.(),
      viewName: pConn.options?.viewName,
    },
  };

  const c11nEnv = (window as any).PCore.createPConnect(messageConfig);
  c11nEnv.getPConnect().getListActions().insert(clonedContent, insertIndex);
  return true;
};
