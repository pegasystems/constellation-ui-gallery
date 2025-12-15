import { useCallback, useRef, useEffect } from 'react';
import { PROPERTY_NAMES } from '../constants';

type UpdateFieldValueFn = (fieldId: string, newValue: string) => void;
type ReloadTreeFn = (updatedData?: any) => Promise<void>;

/**
 * Change entry structure for tracking user modifications
 */
interface ChangeEntry {
  path: string;
  value: string;
}

/**
 * Configuration options for tree actions hook
 */
interface TreeActionsConfig {
  getPConnect: any;
  updateFieldValue: UpdateFieldValueFn;
  dataPage: string;
  reloadTree?: ReloadTreeFn;
}

/**
 * Creates a PConnect environment for dispatching actions
 */
const createPConnectEnv = (getPConnect: any, reference: string, isConfigField: boolean = false) => {
  const PCore = (window as any).PCore;
  if (!PCore?.getStore) return null;

  // For configuration fields, the reference already points to ConfiguredFieldValue
  // We want the pageReference to include ConfiguredFieldValue (not strip it)
  // So the target will be .Configuration.ConfiguredFieldValue
  // For other fields, strip the last property name to get the parent page reference
  const pageReference = isConfigField
    ? reference // Keep full reference including ConfiguredFieldValue
    : reference.substring(0, reference.lastIndexOf('.'));

  const messageConfig = {
    options: {
      context: getPConnect().getContextName(),
      pageReference: pageReference,
      hasForm: true,
      viewName: getPConnect().viewName,
      target: getPConnect().getTarget(),
    },
  };

  return PCore.createPConnect(messageConfig);
};

/**
 * Dispatches field value update to PCore store
 */
const dispatchFieldUpdate = (
  getPConnect: any,
  reference: string,
  value: number | string,
  isConfigField: boolean = false,
) => {
  const c11nEnv = createPConnectEnv(getPConnect, reference, isConfigField);
  if (!c11nEnv) return;

  const actions = c11nEnv.getPConnect()?.getActionsApi();
  if (!actions) return;

  // For configuration fields, the property name should be .FieldValue, not .ConfiguredFieldValue
  // The reference points to ConfiguredFieldValue, but we need to update FieldValue within it
  const propertyName = isConfigField
    ? `.${PROPERTY_NAMES.FIELD_VALUE}`
    : reference.substring(reference.lastIndexOf('.'));
  actions.updateFieldValue(propertyName, value);
  actions.triggerFieldChange(propertyName, value);
};

/**
 * Calls the data page to persist changes using the same data page used to load the tree
 * Returns the updated tree data from the data page
 */
const saveTreeData = async (getPConnect: any, dataPage: string, changes: ChangeEntry[]): Promise<any> => {
  const PCore = (window as any).PCore;
  if (!PCore?.getDataPageUtils || !dataPage) return null;
  const caseInstanceKey = getPConnect().getValue(PCore.getConstants().CASE_INFO.CASE_INFO_ID);

  const payload = {
    dataViewParameters: {
      changes: JSON.stringify(changes),
      caseInstanceKey,
    },
  };
  const response = await PCore.getDataApiUtils().getData(dataPage, payload);
  return response.data.data[0];
};

/**
 * Custom hook for handling tree field actions (config field and quantity changes)
 * Centralizes data persistence and PCore integration logic
 */
export const useTreeActions = ({ getPConnect, updateFieldValue, dataPage, reloadTree }: TreeActionsConfig) => {
  // Track all changes since component mount
  const changesRef = useRef<Map<string, ChangeEntry>>(new Map());
  const lastDataPageRef = useRef<string>('');

  // Reset changes when data page changes (e.g., when switching examples in Storybook)
  useEffect(() => {
    if (lastDataPageRef.current !== dataPage && lastDataPageRef.current !== '') {
      // Data page changed, reset accumulated changes
      changesRef.current.clear();
    }
    lastDataPageRef.current = dataPage;
  }, [dataPage]);

  /**
   * Helper function to build the full path for a change entry
   * For config fields, appends .FieldValue to the pxPropertyPath
   * For quantity fields, uses the pxPropertyPath directly
   *
   * Converts array notation to Pega format:
   * - Tree and ChildSpecificationsList: [index] -> (index+1)
   * - Configuration: [index] -> [index+1] (keeps bracket notation)
   */
  const buildChangePath = (propertyPath: string, isConfigField: boolean): string => {
    if (!propertyPath) return '';

    let path = propertyPath;

    // Process each array index in the path
    const arrayPattern = /\[(\d+)\]/g;
    let match;
    const replacements: Array<{ start: number; end: number; replacement: string }> = [];

    while ((match = arrayPattern.exec(propertyPath)) !== null) {
      const numIndex = parseInt(match[1], 10);
      const oneBasedIndex = numIndex + 1;
      const matchStart = match.index;
      const beforeMatch = propertyPath.substring(0, matchStart);

      // Check if this is a Configuration array - keep bracket notation
      const isConfiguration = beforeMatch.includes('.Configuration') || beforeMatch.endsWith('Configuration');

      replacements.push({
        start: matchStart,
        end: matchStart + match[0].length,
        replacement: isConfiguration ? `[${oneBasedIndex}]` : `(${oneBasedIndex})`,
      });
    }

    // Apply replacements in reverse order to maintain correct indices
    for (let i = replacements.length - 1; i >= 0; i--) {
      const { start, end, replacement } = replacements[i];
      path = path.substring(0, start) + replacement + path.substring(end);
    }

    // For config fields, append .FieldValue since pxPropertyPath points to ConfiguredFieldValue
    if (isConfigField) {
      path = `${path}.${PROPERTY_NAMES.FIELD_VALUE}`;
    }

    // Ensure path starts with a dot
    if (!path.startsWith('.')) {
      path = `.${path}`;
    }

    return path;
  };

  /**
   * Helper function to add or update a change entry
   */
  const addChange = (path: string, value: string) => {
    changesRef.current.set(path, { path, value });
  };

  /**
   * Get all accumulated changes as an array
   */
  const getAllChanges = (): ChangeEntry[] => {
    return Array.from(changesRef.current.values());
  };

  /**
   * Common function to persist changes and reload tree
   * Handles PCore dispatch, data page save, and tree reload
   */
  const persistAndReload = useCallback(
    async (propertyPath: string, changePath: string, value: string | number, isConfigField: boolean) => {
      // Add change to tracking
      addChange(changePath, String(value));

      // Dispatch to PCore store
      const PCore = (window as any).PCore;
      if (PCore?.getStore) {
        const reference = `caseInfo.content.${propertyPath}`;
        dispatchFieldUpdate(getPConnect, reference, value, isConfigField);
      }

      // Persist all changes to data page
      const updatedTreeData = await saveTreeData(getPConnect, dataPage, getAllChanges());

      // Reload tree with updated data (business rules may have modified the tree)
      if (reloadTree) {
        await reloadTree(updatedTreeData);
      }
    },
    [getPConnect, dataPage, reloadTree],
  );

  /**
   * Handler for configuration field changes
   * Updates local state, underlying data, and persists to PCore
   */
  const handleConfigFieldChange = useCallback(
    async (fieldId: string, newValue: string, configItem: any) => {
      // Update local state
      updateFieldValue(fieldId, newValue);

      // Update the underlying data structure
      if (configItem) {
        if (!configItem[PROPERTY_NAMES.CONFIGURED_FIELD_VALUE]) {
          configItem[PROPERTY_NAMES.CONFIGURED_FIELD_VALUE] = {};
        }
        configItem[PROPERTY_NAMES.CONFIGURED_FIELD_VALUE][PROPERTY_NAMES.FIELD_VALUE] = newValue;
      }

      // Track change and persist
      try {
        const propertyPath = configItem?.[PROPERTY_NAMES.PX_PROPERTY_PATH];
        if (propertyPath) {
          const changePath = buildChangePath(propertyPath, true);
          await persistAndReload(propertyPath, changePath, newValue, true);
        } else {
          // Log warning if path is missing - this should not happen if paths are set correctly
          console.warn('Cannot dispatch field update: pxPropertyPath is missing', {
            fieldId,
            fieldName: configItem?.[PROPERTY_NAMES.FIELD_NAME],
            configItem,
          });
        }
      } catch (error) {
        // Ignore errors in Storybook/mock environment
        console.warn('Failed to save tree data:', error);
      }
    },
    [getPConnect, updateFieldValue, persistAndReload],
  );

  /**
   * Handler for quantity field changes (child specs and main spec)
   * Updates local state, underlying data, and persists to PCore
   */
  const handleQuantityChange = useCallback(
    async (fieldId: string, newValue: string, specItem: any) => {
      // Update local state
      updateFieldValue(fieldId, newValue);

      // Update the underlying data structure
      const quantityValue = parseInt(newValue, 10);
      if (specItem) {
        specItem[PROPERTY_NAMES.QUANTITY] = quantityValue;
      }

      // Track change and persist
      try {
        const propertyPath = specItem?.[PROPERTY_NAMES.PX_PROPERTY_PATH];
        if (propertyPath) {
          const changePath = buildChangePath(propertyPath, false);
          await persistAndReload(propertyPath, changePath, quantityValue, false);
        }
      } catch (error) {
        // Ignore errors in Storybook/mock environment
        console.warn('Failed to save tree data:', error);
      }
    },
    [getPConnect, updateFieldValue, persistAndReload],
  );

  return {
    handleConfigFieldChange,
    handleQuantityChange,
  };
};
