// Helper: safely access nested object properties with optional array indices like Section[0]
export const getNestedValue = (obj: any, path: string) => {
  if (!obj || !path) return undefined;
  return path.split('.').reduce((current, key) => {
    if (!current) return undefined;
    if (key.includes('[') && key.includes(']')) {
      const arrayKey = key.substring(0, key.indexOf('['));
      const index = parseInt(key.substring(key.indexOf('[') + 1, key.indexOf(']')), 10);
      const arr = (current as any)?.[arrayKey];
      if (!Array.isArray(arr) || index < 0 || index >= arr.length) return undefined;
      return arr[index];
    }
    return (current as any)?.[key];
  }, obj);
};

// Helper: last segment after dot, or entire string if no dot
export const getLastPathSegment = (path: string): string => {
  const idx = path.lastIndexOf('.');
  return idx === -1 ? path : path.slice(idx + 1);
};

// Update all boolean fields on the current page, excluding the triggering property
export const updateBooleanFieldsOnPage = (config: {
  pageRef: string;
  checked: boolean;
  actions: any;
  storeData: any;
  excludeProp: string;
}) => {
  const { pageRef, checked, actions, storeData, excludeProp } = config;
  if (!pageRef) return;
  const pageData = getNestedValue(storeData, pageRef);
  if (!pageData || typeof pageData !== 'object') return;
  Object.entries(pageData).forEach(([key, val]) => {
    if (typeof val === 'boolean') {
      const otherPropName = `.${key}`;
      if (otherPropName !== excludeProp) {
        actions.updateFieldValue(otherPropName, checked);
      }
    }
  });
};

// Bulk update for sibling checkbox rows inside an embedded page array
export const updateAllSiblingCheckboxes = (config: {
  selectAllProperty: string;
  checked: boolean;
  pConn: any;
  storeData: any;
}) => {
  const { selectAllProperty, checked, pConn, storeData } = config;
  if (!selectAllProperty) return;

  // Trim the selectAllProperty and remove any leading dots
  // The value should either contain a pagelist (e.g. Policies) or a single dot - e.g. Policies.IsSelected
  const trimmedSelectAllProperty = selectAllProperty.trim().replace(/^[.]+/, '');
  const isListPlusField = /^[^.]+\.[^.]+$/.test(trimmedSelectAllProperty); // e.g. Policies.IsSelected
  const basePageRef = pConn.options.pageReference;
  const pageRef = `${basePageRef}.${trimmedSelectAllProperty}`;
  const embeddedPageName = isListPlusField ? pageRef.substring(0, pageRef.lastIndexOf('.')) : pageRef;
  const embeddedArray = getNestedValue(storeData, embeddedPageName);
  if (!Array.isArray(embeddedArray) || embeddedArray.length === 0) return;

  const contextName = pConn.getContextName();
  const target = pConn.getTarget();

  // Helper to iterate each row and provide actions + indexed pageRef
  const forEachRow = (cb: (rowPageRef: string, actions: any) => void) => {
    for (let i = 0; i < embeddedArray.length; i += 1) {
      const rowPageRef = `${embeddedPageName}[${i}]`;
      const messageConfig = {
        meta: { config: { context: contextName } },
        options: { context: contextName, pageReference: rowPageRef, target },
      };
      const c11nEnv = (window as any).PCore.createPConnect(messageConfig);
      const actions = c11nEnv?.getPConnect()?.getActionsApi();
      if (actions) cb(rowPageRef, actions);
    }
  };
  if (!isListPlusField) {
    // Property points to the list itself (e.g. Policies): update all boolean fields in each row
    forEachRow((rowPageRef, actions) => {
      updateBooleanFieldsOnPage({
        pageRef: rowPageRef,
        checked,
        actions,
        storeData,
        excludeProp: '',
      });
    });
  } else {
    // Property points to a specific field in each list row (e.g. Policies.IsSelected)
    const fieldName = `.${getLastPathSegment(trimmedSelectAllProperty)}`;
    forEachRow((_rowPageRef, actions) => {
      actions.updateFieldValue(fieldName, checked);
    });
  }
};
