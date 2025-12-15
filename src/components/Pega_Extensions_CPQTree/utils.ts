/**
 * Utility functions for CPQ Tree component
 */

import { TREE_CONSTANTS, PROPERTY_NAMES, NODE_TYPES } from './constants';

/**
 * Creates a regex from a pattern (handles both string and RegExp)
 * @param pattern - A string (regex pattern) or RegExp
 * @returns A new RegExp object
 */
export const createRegex = (pattern: string | RegExp): RegExp => {
  if (typeof pattern === 'string') {
    return new RegExp(pattern);
  }
  // Create a new RegExp from the existing one to avoid state issues
  return new RegExp(pattern.source, pattern.flags);
};

/**
 * Finds all properties matching a regex pattern and collects their arrays
 * @param obj - The object to search
 * @param pattern - A string (regex pattern) or RegExp to match property names
 * @returns An array of all items from matching properties that are arrays
 */
export const findMatchingChildren = (obj: any, pattern: string | RegExp | undefined): any[] => {
  if (!obj || !pattern) {
    return [];
  }

  const allChildren: any[] = [];

  // Iterate over all object keys
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      // Create a new regex for each test to avoid state issues
      const regex = createRegex(pattern);
      // Check if the key matches the regex pattern
      if (regex.test(key)) {
        const value = obj[key];
        // If the value is an array, add all its items
        if (Array.isArray(value)) {
          allChildren.push(...value);
        }
      }
    }
  }

  return allChildren;
};

/**
 * Generates a unique node ID from various possible sources
 * @param item - The item object to extract ID from
 * @param idPropertyName - The property name to use for ID extraction
 * @param fallbackIndex - Optional index to ensure uniqueness
 * @returns A unique node ID string
 */
export const generateNodeId = (item: any, idPropertyName: string = 'ProductID', fallbackIndex?: number): string => {
  const baseId =
    item[PROPERTY_NAMES.PZ_INS_KEY] ||
    item[PROPERTY_NAMES.PRODUCT_SPEC]?.[idPropertyName] ||
    item[PROPERTY_NAMES.PRODUCT_SPEC]?.[PROPERTY_NAMES.PZ_INS_KEY] ||
    item[idPropertyName] ||
    item[PROPERTY_NAMES.ID] ||
    item[PROPERTY_NAMES.PARENT_ID] ||
    `node-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  // Append index to ensure uniqueness if we have a fallback index
  // This prevents duplicate keys when multiple nodes share the same base ID
  return fallbackIndex !== undefined ? `${baseId}-${fallbackIndex}` : baseId;
};

/**
 * Generates a configuration section node ID
 * @param nodeId - The parent node ID
 * @returns A configuration section node ID
 */
export const generateConfigNodeId = (nodeId: string): string => {
  return `${nodeId}-config`;
};

/**
 * Generates a configuration field node ID
 * @param configNodeId - The configuration node ID
 * @param index - The field index
 * @returns A configuration field node ID
 */
export const generateConfigFieldId = (configNodeId: string, index: number): string => {
  return `${configNodeId}-field-${index}`;
};

/**
 * Generates a child specification node ID
 * @param configNodeId - The configuration node ID
 * @param index - The specification index
 * @returns A child specification node ID
 */
export const generateChildSpecId = (configNodeId: string, index: number): string => {
  return `${configNodeId}-spec-${index}`;
};

/**
 * Generates a configuration field ID from a configuration item
 * @param nodeId - The parent node ID
 * @param configItem - The configuration item
 * @returns A configuration field node ID
 */
export const generateConfigFieldIdFromItem = (nodeId: string, configItem: any): string => {
  return `${nodeId}-config-${configItem[PROPERTY_NAMES.FIELD_NAME]}-${configItem[PROPERTY_NAMES.PY_ID] || Date.now()}`;
};

/**
 * Extracts the display label from an item using various fallback options
 * @param item - The item object to extract label from
 * @param displayPropertyName - The property name to use for label extraction
 * @returns The display label string
 */
export const extractNodeLabel = (item: any, displayPropertyName: string = 'Name'): string => {
  return (
    item[PROPERTY_NAMES.PY_LABEL] ||
    item[PROPERTY_NAMES.FIELD_NAME] || // Handle Configuration items
    item[PROPERTY_NAMES.PRODUCT_SPEC]?.[displayPropertyName] ||
    item[PROPERTY_NAMES.PRODUCT_SPEC]?.[PROPERTY_NAMES.NAME] ||
    item[PROPERTY_NAMES.PRODUCT_SPEC]?.Description ||
    item[displayPropertyName] ||
    item[PROPERTY_NAMES.NAME] ||
    item[PROPERTY_NAMES.SPEC_NAME] || // Handle ChildSpecification items
    'Unknown Node'
  );
};

/**
 * Extracts the object class from an item
 * @param item - The item object to extract class from
 * @returns The object class string
 */
export const extractNodeClass = (item: any): string => {
  return (
    item[PROPERTY_NAMES.PY_CLASS_NAME] ||
    item[PROPERTY_NAMES.PRODUCT_SPEC]?.[PROPERTY_NAMES.PX_OBJ_CLASS] ||
    item[PROPERTY_NAMES.PX_OBJ_CLASS] ||
    'Unknown'
  );
};

/**
 * Extracts the work ID from an item
 * @param item - The item object to extract work ID from
 * @param idPropertyName - The property name to use for ID extraction
 * @returns The work ID string
 */
export const extractWorkId = (item: any, idPropertyName: string = 'ProductID'): string => {
  return (
    item[PROPERTY_NAMES.PY_ID] ||
    item[PROPERTY_NAMES.PRODUCT_SPEC]?.[idPropertyName] ||
    item[idPropertyName] ||
    item[PROPERTY_NAMES.PARENT_ID]
  );
};

/**
 * Generates a semantic URL for opening work by handle
 * @param nodeClass - The case class name
 * @param workId - The work ID
 * @param caseInstanceKey - The current case instance key
 * @param nodeId - The node ID to check against caseInstanceKey
 * @returns The resolved semantic URL or empty string
 */
export const generateLinkURL = (nodeClass: string, workId: string, caseInstanceKey: string, nodeId: string): string => {
  if (caseInstanceKey === nodeId) {
    return '';
  }

  return (window as any).PCore.getSemanticUrlUtils().getResolvedSemanticURL(
    (window as any).PCore.getSemanticUrlUtils().getActions().ACTION_OPENWORKBYHANDLE,
    { caseClassName: nodeClass },
    { workID: workId },
  );
};

/**
 * Finds the root tree array from a response object
 * @param response - The response object
 * @param childrenPropertyName - The property name or regex pattern to match
 * @returns The root tree array or null
 */
export const findRootTree = (response: any, childrenPropertyName?: string | RegExp): any[] | null => {
  if (!response) {
    return null;
  }

  let rootTree: any = null;

  if (childrenPropertyName) {
    if (typeof childrenPropertyName === 'string' || childrenPropertyName instanceof RegExp) {
      // Use regex pattern to find matching properties
      // Prefer "Tree" if it matches, otherwise use first matching property
      const regex = createRegex(childrenPropertyName);
      if (response.Tree && Array.isArray(response.Tree) && regex.test('Tree')) {
        rootTree = response.Tree;
      } else {
        // Find first matching property that is an array
        for (const key in response) {
          if (Object.prototype.hasOwnProperty.call(response, key)) {
            const testRegex = createRegex(childrenPropertyName);
            if (testRegex.test(key)) {
              const value = response[key];
              if (Array.isArray(value)) {
                rootTree = value;
                break;
              }
            }
          }
        }
      }
    } else {
      // Fallback to direct property access for backward compatibility
      rootTree = response[childrenPropertyName];
    }
  }

  // Fallback to standard properties if no root tree found via pattern
  if (!rootTree || !Array.isArray(rootTree)) {
    rootTree = response.Tree || response.pxResults;
  }

  return Array.isArray(rootTree) ? rootTree : null;
};

/**
 * Extracts children from an item using various methods
 * @param item - The item object to extract children from
 * @param childrenPropertyName - The property name or regex pattern to match
 * @returns An array of child items
 */
export const extractChildren = (item: any, childrenPropertyName?: string | RegExp): any[] => {
  if (!item) {
    return [];
  }

  let children: any[] = [];

  if (childrenPropertyName) {
    if (typeof childrenPropertyName === 'string' || childrenPropertyName instanceof RegExp) {
      // Use regex pattern to find matching properties
      children = findMatchingChildren(item, childrenPropertyName);
    } else {
      // Fallback to direct property access for backward compatibility
      const directChildren = item[childrenPropertyName];
      if (Array.isArray(directChildren)) {
        children = directChildren;
      }
    }
  }

  // Fallback to standard properties if no children found via pattern
  if (children.length === 0) {
    const fallbackChildren = item.pxResults || item.Tree;
    if (Array.isArray(fallbackChildren)) {
      children = fallbackChildren;
    }
  }

  return children;
};

/**
 * Extracts the configured field value from a configuration item
 * @param configItem - The configuration item
 * @returns The configured field value string
 */
export const extractConfiguredFieldValue = (configItem: any): string => {
  return configItem[PROPERTY_NAMES.CONFIGURED_FIELD_VALUE]?.[PROPERTY_NAMES.FIELD_VALUE] || configItem.Value || '';
};

/**
 * Extracts the quantity from a child specification
 * @param childSpec - The child specification item
 * @returns The quantity string
 */
export const extractQuantity = (childSpec: any): string => {
  return childSpec[PROPERTY_NAMES.QUANTITY] || '0';
};

/**
 * Generates dropdown options from a field value list
 * @param fieldValueList - The field value list array
 * @returns An array of option objects with label and value
 */
export const generateFieldOptions = (fieldValueList: any[]): Array<{ label: string; value: string }> => {
  return fieldValueList.map((item: any) => ({
    label: item[PROPERTY_NAMES.FIELD_VALUE] || item.label || item.value,
    value: item[PROPERTY_NAMES.FIELD_VALUE] || item.value,
  }));
};

/**
 * Generates quantity dropdown options from 0 to maxCardinality
 * @param maxCardinality - The maximum cardinality value
 * @returns An array of option objects with label and value
 */
export const generateQuantityOptions = (maxCardinality: number): Array<{ label: string; value: string }> => {
  return Array.from({ length: maxCardinality + 1 }, (_, i) => ({
    label: i.toString(),
    value: i.toString(),
  }));
};

/**
 * Collects all Configuration arrays from nested ChildSpecificationsList items
 * @param specs - The specifications array to process
 * @returns An array of objects containing spec and config arrays
 */
export const collectConfigurations = (specs: any[]): Array<{ spec: any; config: any[] }> => {
  const allConfigurations: Array<{ spec: any; config: any[] }> = [];

  const processSpecs = (specList: any[]) => {
    specList.forEach((spec: any) => {
      if (
        spec[PROPERTY_NAMES.CONFIGURATION] &&
        Array.isArray(spec[PROPERTY_NAMES.CONFIGURATION]) &&
        spec[PROPERTY_NAMES.CONFIGURATION].length > 0
      ) {
        allConfigurations.push({ spec, config: spec[PROPERTY_NAMES.CONFIGURATION] });
      }
      // Recursively check nested ChildSpecificationsList
      if (
        spec[PROPERTY_NAMES.CHILD_SPECIFICATIONS_LIST] &&
        Array.isArray(spec[PROPERTY_NAMES.CHILD_SPECIFICATIONS_LIST])
      ) {
        processSpecs(spec[PROPERTY_NAMES.CHILD_SPECIFICATIONS_LIST]);
      }
    });
  };

  processSpecs(specs);
  return allConfigurations;
};

/**
 * Finds the site node in a root tree array
 * @param rootTree - The root tree array
 * @returns The site node or null
 */
export const findSiteNode = (rootTree: any[]): any | null => {
  return (
    rootTree.find(
      (node: any) => node[PROPERTY_NAMES.TYPE] === NODE_TYPES.SITE || node[PROPERTY_NAMES.ID] === 'NoSite',
    ) || null
  );
};

/**
 * Extracts product ID from a product item
 * @param product - The product item
 * @param idPropertyName - The property name to use for ID extraction
 * @param fallbackId - A fallback ID to use if extraction fails
 * @returns The product ID string
 */
export const extractProductId = (product: any, idPropertyName: string = 'ProductID', fallbackId?: string): string => {
  return product[PROPERTY_NAMES.ID] || product[idPropertyName] || fallbackId || `product-${Date.now()}`;
};

/**
 * Extracts product name from a product item
 * @param product - The product item
 * @param displayPropertyName - The property name to use for name extraction
 * @returns The product name string
 */
export const extractProductName = (product: any, displayPropertyName: string = 'Name'): string => {
  return product.Name || product[displayPropertyName] || 'Unknown Product';
};

/**
 * Extracts ProductOffer from a product item, handling different data structures
 * @param productItem - The product item that may have ProductOffer directly or in Tree structure
 * @returns The ProductOffer object or null
 */
export const extractProductOffer = (productItem: any): any | null => {
  // Check if ProductOffer exists directly
  if (productItem?.[PROPERTY_NAMES.PRODUCT_OFFER]) {
    return productItem[PROPERTY_NAMES.PRODUCT_OFFER];
  }

  // Try to extract from Tree structure (Tree[].ChildSpecification pattern)
  if (
    productItem?.[PROPERTY_NAMES.TREE] &&
    Array.isArray(productItem[PROPERTY_NAMES.TREE]) &&
    productItem[PROPERTY_NAMES.TREE].length > 0
  ) {
    const firstTreeItem = productItem[PROPERTY_NAMES.TREE][0];
    if (firstTreeItem?.ChildSpecification) {
      // Convert ChildSpecification structure to ProductOffer structure
      const childSpec = firstTreeItem.ChildSpecification;
      return {
        [PROPERTY_NAMES.CHILD_SPECIFICATIONS_LIST]: [childSpec],
        [PROPERTY_NAMES.PRODUCT_TYPE]: productItem[PROPERTY_NAMES.PRODUCT_TYPE],
        [PROPERTY_NAMES.ID]: productItem[PROPERTY_NAMES.ID],
        name: productItem[PROPERTY_NAMES.NAME],
      };
    }
  }

  return null;
};

/**
 * Gets the main child specification from a product offer
 * @param productOffer - The product offer object
 * @returns The main child specification or null
 */
export const getMainChildSpec = (productOffer: any): any | null => {
  const childSpecsList = productOffer?.[PROPERTY_NAMES.CHILD_SPECIFICATIONS_LIST] || [];
  return childSpecsList.length > 0 ? childSpecsList[0] : null;
};

/**
 * Toggles a value in a Set
 * @param set - The Set to toggle in
 * @param value - The value to toggle
 * @returns A new Set with the value toggled
 */
export const toggleSetValue = <T>(set: Set<T>, value: T): Set<T> => {
  const newSet = new Set(set);
  if (newSet.has(value)) {
    newSet.delete(value);
  } else {
    newSet.add(value);
  }
  return newSet;
};

/**
 * Creates a field configuration object for PConnect
 * @param type - The field type
 * @param value - The field value
 * @param options - Optional dropdown options
 * @returns A field configuration object
 */
export const createFieldConfig = (
  type: string,
  value: string,
  options?: Array<{ label: string; value: string }>,
): {
  type: string;
  label: string;
  value: string;
  displayMode: 'EDIT';
  options?: Array<{ label: string; value: string }>;
  onChange?: (newValue: string) => void;
  required?: boolean;
  disabled?: boolean;
  isParagraph?: boolean;
  tooltipText?: string;
  ariaLabel?: string;
  ariaLabelledById?: string;
} => {
  return {
    type,
    label: '',
    value,
    displayMode: 'EDIT' as const,
    ...(options && options.length > 0 ? { options } : {}),
  };
};

/**
 * Calculates padding left based on depth
 * @param depth - The depth level
 * @returns Padding left in pixels
 */
export const getDepthPadding = (depth: number): string => {
  return `${depth * TREE_CONSTANTS.DEPTH_INDENT}px`;
};

/**
 * Builds a property path for tree items
 * @param parentPath - The parent path (e.g., "Tree[0].Tree[0]")
 * @param treeIndex - The index in the Tree array (0-based)
 * @param propertyPath - Optional property path to append (e.g., ".Configuration.test")
 * @returns The full property path
 */
export const buildPropertyPath = (parentPath: string, treeIndex: number, propertyPath?: string): string => {
  const treeSegment = `Tree[${treeIndex}]`;
  const basePath = parentPath ? `${parentPath}.${treeSegment}` : treeSegment;
  return propertyPath ? `${basePath}${propertyPath}` : basePath;
};

/**
 * Configuration for generic path building
 * Defines which properties should be included in paths and how to handle them
 */
export interface PathBuildingConfig {
  /**
   * Properties that should be traversed as object properties (not arrays)
   * These will be added to the path as .PropertyName
   */
  objectProperties?: string[];
  /**
   * Properties that are arrays and should be indexed
   * These will be added to the path as .PropertyName[index]
   */
  arrayProperties?: string[];
  /**
   * Properties that contain field-like data (e.g., Configuration arrays)
   * Items in these arrays will get pxPropertyPath set
   */
  fieldArrayProperties?: string[];
  /**
   * Properties that contain quantity-like data
   * These properties will get pxPropertyPath set on the parent object
   */
  quantityProperties?: string[];
  /**
   * Function to determine if a property should be included in path building
   * @param key - Property name
   * @param value - Property value
   * @returns true if property should be included
   */
  shouldIncludeProperty?: (key: string, value: any) => boolean;
  /**
   * Function to get the field name from a field item
   * @param item - Field item
   * @returns Field name
   */
  getFieldName?: (item: any) => string;
}

/**
 * Default configuration for CPQ tree path building
 */
const DEFAULT_PATH_CONFIG: PathBuildingConfig = {
  objectProperties: [PROPERTY_NAMES.PRODUCT_OFFER],
  arrayProperties: [PROPERTY_NAMES.CHILD_SPECIFICATIONS_LIST, PROPERTY_NAMES.TREE, PROPERTY_NAMES.CONFIGURATION],
  fieldArrayProperties: [PROPERTY_NAMES.CONFIGURATION],
  quantityProperties: [PROPERTY_NAMES.QUANTITY],
  shouldIncludeProperty: (key: string, value: any) => {
    // Include arrays and objects, exclude primitives and special properties
    const excludeKeys = [
      PROPERTY_NAMES.PX_OBJ_CLASS,
      PROPERTY_NAMES.PZ_INS_KEY,
      PROPERTY_NAMES.PY_ID,
      'pxCreateDateTime',
      'pxCreateOperator',
    ];
    if (excludeKeys.includes(key)) return false;
    return Array.isArray(value) || (typeof value === 'object' && value !== null);
  },
  getFieldName: (item: any) =>
    item[PROPERTY_NAMES.FIELD_NAME] || item[PROPERTY_NAMES.NAME] || item[PROPERTY_NAMES.SPEC_NAME] || 'Unknown',
};

/**
 * Builds a path segment for a property
 * @param propertyName - Name of the property
 * @param isArray - Whether this is an array property
 * @param index - Index in the array (0-based, only used if isArray is true)
 * @returns Path segment string
 */
const buildPathSegment = (propertyName: string, isArray: boolean, index?: number): string => {
  if (isArray && index !== undefined) {
    return `.${propertyName}[${index}]`;
  }
  return `.${propertyName}`;
};

/**
 * Generic function to build property paths for nested object structures
 * Traverses the object tree and sets pxPropertyPath on items that need it
 * @param obj - The object to traverse
 * @param basePath - The base path to start from (e.g., "Tree[0].Tree[0]")
 * @param config - Configuration for path building
 * @param visited - Set to track visited objects and prevent circular references
 * @returns The updated object with pxPropertyPath set on relevant items
 */
export const buildGenericPropertyPaths = (
  obj: any,
  basePath: string,
  config: PathBuildingConfig = DEFAULT_PATH_CONFIG,
  visited: WeakSet<object> = new WeakSet(),
): any => {
  if (!obj || typeof obj !== 'object' || visited.has(obj)) {
    return obj;
  }

  visited.add(obj);
  const result = Array.isArray(obj) ? [...obj] : { ...obj };

  // Process object properties
  if (!Array.isArray(result)) {
    for (const key in result) {
      if (!Object.prototype.hasOwnProperty.call(result, key)) continue;

      const value = result[key];
      const currentPath = `${basePath}${buildPathSegment(key, false)}`;

      // Check if property should be included
      const shouldInclude =
        config.shouldIncludeProperty?.(key, value) ??
        (config.objectProperties?.includes(key) ||
          config.arrayProperties?.includes(key) ||
          config.fieldArrayProperties?.includes(key) ||
          Array.isArray(value) ||
          (typeof value === 'object' && value !== null));

      if (!shouldInclude) continue;

      // Handle array properties
      if (Array.isArray(value)) {
        const isFieldArray = config.fieldArrayProperties?.includes(key) ?? false;

        result[key] = value.map((item: any, index: number) => {
          const arrayIndex = index; // 0-based indexing for JavaScript
          const itemPath = `${currentPath}[${arrayIndex}]`;

          // Create a copy of the item to avoid mutating the original
          let processedItem = item;
          if (item && typeof item === 'object') {
            processedItem = Array.isArray(item) ? [...item] : { ...item };
          }

          // Recursively process nested structures first
          if (processedItem && typeof processedItem === 'object') {
            processedItem = buildGenericPropertyPaths(processedItem, itemPath, config, visited);
          }

          // After processing, set pxPropertyPath for array items
          // For items with quantity and no children, set path to quantity property
          // For configuration fields with no children, set path to ConfiguredFieldValue.FieldValue
          // For items with children, set path to the item itself (for reference)
          if (processedItem && typeof processedItem === 'object') {
            // Check if this item has children (Configuration or ChildSpecificationsList)
            const hasChildren =
              (processedItem[PROPERTY_NAMES.CONFIGURATION] &&
                Array.isArray(processedItem[PROPERTY_NAMES.CONFIGURATION]) &&
                processedItem[PROPERTY_NAMES.CONFIGURATION].length > 0) ||
              (processedItem[PROPERTY_NAMES.CHILD_SPECIFICATIONS_LIST] &&
                Array.isArray(processedItem[PROPERTY_NAMES.CHILD_SPECIFICATIONS_LIST]) &&
                processedItem[PROPERTY_NAMES.CHILD_SPECIFICATIONS_LIST].length > 0);

            // Set pxPropertyPath - either to quantity path, ConfiguredFieldValue.FieldValue path (if no children), or item path (if has children)
            if (!hasChildren) {
              // Item has no children, check for configuration field value first, then quantity property
              if (isFieldArray && processedItem[PROPERTY_NAMES.CONFIGURED_FIELD_VALUE]) {
                const configuredFieldValue = processedItem[PROPERTY_NAMES.CONFIGURED_FIELD_VALUE];
                if (configuredFieldValue && typeof configuredFieldValue === 'object') {
                  // If FieldValue is not present, set it to empty string
                  if (configuredFieldValue[PROPERTY_NAMES.FIELD_VALUE] === undefined) {
                    configuredFieldValue[PROPERTY_NAMES.FIELD_VALUE] = '';
                  }
                  // Set path to ConfiguredFieldValue for leaf configuration fields
                  // The actual FieldValue is accessed via ConfiguredFieldValue.FieldValue, but we register ConfiguredFieldValue
                  processedItem[PROPERTY_NAMES.PX_PROPERTY_PATH] =
                    `${itemPath}.${PROPERTY_NAMES.CONFIGURED_FIELD_VALUE}`;
                } else if (!processedItem[PROPERTY_NAMES.PX_PROPERTY_PATH] && config.quantityProperties) {
                  // No ConfiguredFieldValue.FieldValue, fall back to quantity property if available
                  for (const qtyProp of config.quantityProperties) {
                    if (processedItem[qtyProp] !== undefined) {
                      processedItem[PROPERTY_NAMES.PX_PROPERTY_PATH] = `${itemPath}.${qtyProp}`;
                      break; // Use first matching quantity property
                    }
                  }
                }
              } else if (!processedItem[PROPERTY_NAMES.PX_PROPERTY_PATH] && config.quantityProperties) {
                // Item has no children, set path to quantity property
                for (const qtyProp of config.quantityProperties) {
                  if (processedItem[qtyProp] !== undefined) {
                    processedItem[PROPERTY_NAMES.PX_PROPERTY_PATH] = `${itemPath}.${qtyProp}`;
                    break; // Use first matching quantity property
                  }
                }
              }
            } else {
              // Item has children, set path to the item itself (override any previously set path)
              processedItem[PROPERTY_NAMES.PX_PROPERTY_PATH] = itemPath;
            }
          }

          return processedItem;
        });
      }
      // Handle object properties
      else if (value && typeof value === 'object') {
        // Recursively process nested objects first
        result[key] = buildGenericPropertyPaths(value, currentPath, config, visited);

        // After processing, check if this object has quantity properties that should be set
        if (config.quantityProperties && result[key]) {
          // Check if this object has children (Configuration or ChildSpecificationsList)
          const hasChildren =
            (result[key][PROPERTY_NAMES.CONFIGURATION] &&
              Array.isArray(result[key][PROPERTY_NAMES.CONFIGURATION]) &&
              result[key][PROPERTY_NAMES.CONFIGURATION].length > 0) ||
            (result[key][PROPERTY_NAMES.CHILD_SPECIFICATIONS_LIST] &&
              Array.isArray(result[key][PROPERTY_NAMES.CHILD_SPECIFICATIONS_LIST]) &&
              result[key][PROPERTY_NAMES.CHILD_SPECIFICATIONS_LIST].length > 0);

          // For object properties (like ProductOffer), always set quantity path
          // For array items (like ChildSpecs), only set quantity path if no children
          const isObjectProperty = config.objectProperties?.includes(key) ?? false;
          const shouldSetQuantityPath = isObjectProperty || !hasChildren;

          if (shouldSetQuantityPath) {
            for (const qtyProp of config.quantityProperties) {
              if (result[key][qtyProp] !== undefined) {
                const qtyPath = `${currentPath}.${qtyProp}`;
                // Set pxPropertyPath if not already set (might have been set by nested processing)
                if (!result[key][PROPERTY_NAMES.PX_PROPERTY_PATH]) {
                  result[key][PROPERTY_NAMES.PX_PROPERTY_PATH] = qtyPath;
                }
              }
            }
          }
        }
      }
    }
  }

  return result;
};

/**
 * Builds property paths for a product node and its nested structure
 * This is a convenience wrapper around buildGenericPropertyPaths
 * @param productItem - The product tree item
 * @param basePath - The base path (e.g., "Tree[0].Tree[0]")
 * @param config - Optional custom configuration
 * @returns The product item with paths set
 */
export const buildProductPropertyPaths = (
  productItem: any,
  basePath: string,
  config?: Partial<PathBuildingConfig>,
): any => {
  const mergedConfig: PathBuildingConfig = {
    ...DEFAULT_PATH_CONFIG,
    ...config,
  };

  return buildGenericPropertyPaths(productItem, basePath, mergedConfig);
};

/**
 * Set to track registered page list paths to prevent duplicate registrations
 * This ensures each path is only registered once, even if called multiple times
 */
const registeredPageListPaths = new Set<string>();

/**
 * Set to track registered property paths to prevent duplicate registrations
 * This ensures each property path is only registered once
 */
const registeredPropertyPaths = new Set<string>();

/**
 * Clears the registered page list paths cache
 * This should be called when the component is unmounted or data is reloaded
 */
export const clearRegisteredPageListPaths = (): void => {
  registeredPageListPaths.clear();
  registeredPropertyPaths.clear();
};

/**
 * Adds a page list node to the context tree manager for a given path
 * This should be called once during initialization for each pagelist found when loading the tree
 *
 * IMPORTANT: The duplicate check is performed on the whole path string, which means
 * paths with different indices (e.g., ".Tree[0]" and ".Tree[1]") will be registered separately.
 * Each unique path (including its index) will result in a separate call to addPageListNode.
 *
 * @param path - The path to the pagelist (e.g., "Tree[0].ProductOffer.ChildSpecificationsList[0].ChildSpecificationsList")
 * @param getPConnect - Function to get PConnect instance
 * @param index - Optional index to use when calling addViewNode (defaults to 0)
 */
export const addPageListNodeForPath = (path: string, getPConnect: any, index: number = 0): void => {
  const PCore = (window as any).PCore;
  if (!PCore || !PCore.getContextTreeManager || !getPConnect) {
    return;
  }

  // Check if this path has already been registered
  if (registeredPageListPaths.has(path)) {
    return;
  }

  // Mark this path as registered
  registeredPageListPaths.add(path);

  // Extract the page name (the last part after the last dot)
  // For example: "Tree[0].ProductOffer.ChildSpecificationsList[0].ChildSpecificationsList" -> ".ChildSpecificationsList"
  // Special case: if path is just "Tree" (root), pageName should be ".Tree"
  const lastDotIndex = path.lastIndexOf('.');
  let pageName: string;
  let fullPath: string;

  if (lastDotIndex < 0) {
    // Root path (e.g., "Tree") - no dots
    pageName = `.${path}`;
    fullPath = 'caseInfo.content';
  } else {
    // Nested path (e.g., "Tree[0].ProductOffer.ChildSpecificationsList")
    pageName = path.substring(lastDotIndex);
    fullPath = `caseInfo.content.${path.substring(0, lastDotIndex)}`;
  }

  // Call addPageListNode with the required parameters
  // For root path (Tree), set target; for nested paths, target should be undefined
  console.log('addPageListNodeForPath', fullPath, pageName);
  const isRootPath = lastDotIndex < 0;
  PCore.getContextTreeManager().addPageListNode(
    getPConnect().getContextName(),
    fullPath,
    getPConnect().viewName,
    pageName,

    {
      target: isRootPath ? getPConnect().getTarget() : undefined,
      context: getPConnect().getContextName(),
      pageReference: fullPath,
      propertyName: pageName,
      componentName: 'View',
      type: 'multirecordlist',
      hasSuggestions: false,
      isInsideList: false,
      renderMode: 'Editable',
      referenceList: '@P ' + pageName,
      index: 1,
    },
  );

  PCore.getContextTreeManager().addViewNode(
    getPConnect().getContextName(),
    'caseInfo.content.' + path + `[${index}]`,
    getPConnect().viewName,
  );
};

/**
 * Extracts all pagelist paths and their corresponding indices from a property path.
 * For example, from "TreeGroup[0].Tree[0].ProductOffer.ChildSpecificationsList[5].Configuration[2].ConfiguredFieldValue"
 * it would extract: [
 *   { path: "TreeGroup", index: 0 },
 *   { path: "TreeGroup[0].Tree", index: 0 },
 *   { path: "TreeGroup[0].Tree[0].ProductOffer.ChildSpecificationsList", index: 5 },
 *   { path: "TreeGroup[0].Tree[0].ProductOffer.ChildSpecificationsList[5].Configuration", index: 2 }
 * ]
 *
 * @param propertyPath - The full property path
 * @returns Array of objects containing pagelist paths and their indices
 */
const extractPagelistPathsFromPropertyPath = (propertyPath: string): Array<{ path: string; index: number }> => {
  const pagelistPaths: Array<{ path: string; index: number }> = [];
  const segments = propertyPath.split('.');
  let pathWithoutIndex = ''; // Path without the current segment's index
  let accumulatedPath = ''; // Full path with indices

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];

    // Remove index brackets to check the property name
    const propertyName = segment.replace(/\[.*$/, '');

    // Extract index from current segment (e.g., "Tree[0]" -> 0, "Tree" -> undefined)
    const indexMatch = segment.match(/\[(\d+)\]$/);
    const segmentIndex = indexMatch ? parseInt(indexMatch[1], 10) : undefined;

    // Build path up to this property (without the index on the current segment)
    let pathToProperty: string;
    if (pathWithoutIndex) {
      pathToProperty = pathWithoutIndex + '.' + propertyName;
    } else {
      pathToProperty = propertyName;
    }

    // Build accumulated path with indices
    if (accumulatedPath) {
      accumulatedPath += '.' + segment;
    } else {
      accumulatedPath = segment;
    }

    // Register TreeGroup at root
    if (i === 0 && propertyName === 'TreeGroup') {
      // For TreeGroup, use index 0 if available, otherwise 0
      const index = segmentIndex !== undefined ? segmentIndex : 0;
      if (!pagelistPaths.some((p) => p.path === 'TreeGroup')) {
        pagelistPaths.push({ path: 'TreeGroup', index });
      }
    }

    // Register Tree arrays (anywhere in the path)
    if (propertyName === PROPERTY_NAMES.TREE) {
      // The index is from the segment that contains this Tree property
      // For "TreeGroup[0].Tree[0]", we want index 0 (from Tree[0])
      // For "Tree[0]", we want index 0 (from Tree[0])
      let index = 0; // Default to 0
      if (segmentIndex !== undefined) {
        index = segmentIndex;
      }

      if (!pagelistPaths.some((p) => p.path === pathToProperty)) {
        pagelistPaths.push({ path: pathToProperty, index });
      }
    }

    // Register ChildSpecificationsList arrays
    if (propertyName === PROPERTY_NAMES.CHILD_SPECIFICATIONS_LIST) {
      // The index is from the segment that follows this pagelist property
      // For "ChildSpecificationsList[5].Configuration[2]", the segment is "ChildSpecificationsList[5]"
      // We want index 5, which is the index of the item in ChildSpecificationsList
      // But wait - the segment format is "ChildSpecificationsList[5]" where [5] is the index of the item
      // So segmentIndex should already be 5
      let index = 0; // Default to 0
      if (segmentIndex !== undefined) {
        index = segmentIndex;
      } else if (i < segments.length - 1) {
        // If the segment doesn't have an index, look at the next segment
        // The next segment might be something like "Configuration[2]" where [2] is the index
        // But that's the index of Configuration, not ChildSpecificationsList
        // We need to look at the accumulated path to find the index
        // Actually, if ChildSpecificationsList doesn't have an index in the segment,
        // it means we're looking at the list itself, not an item, so default to 0
      }

      if (!pagelistPaths.some((p) => p.path === pathToProperty)) {
        pagelistPaths.push({ path: pathToProperty, index });
      }
    }

    // Register Configuration arrays
    if (propertyName === PROPERTY_NAMES.CONFIGURATION) {
      // The index is from the segment itself
      // For "Configuration[2].ConfiguredFieldValue", the segment is "Configuration[2]"
      // We want index 2, which is the index of the item in Configuration
      let index = 0; // Default to 0
      if (segmentIndex !== undefined) {
        index = segmentIndex;
      }

      if (!pagelistPaths.some((p) => p.path === pathToProperty)) {
        pagelistPaths.push({ path: pathToProperty, index });
      }
    }

    // Update pathWithoutIndex for next iteration (include the full segment with index)
    if (pathWithoutIndex) {
      pathWithoutIndex += '.' + segment;
    } else {
      pathWithoutIndex = segment;
    }
  }

  return pagelistPaths;
};

/**
 * Adds a view node for a property path to the context tree manager.
 * Before registering the view node, it automatically registers all pagelists in the path
 * that haven't been registered yet.
 * This should be called for individual property paths (e.g., ConfiguredFieldValue.FieldValue, quantity)
 * @param path - The full property path (e.g., "Tree[0].Tree[0].ProductOffer.ChildSpecificationsList[0].Configuration[0].ConfiguredFieldValue.FieldValue")
 * @param getPConnect - Function to get PConnect instance
 */
export const addViewNodeForPropertyPath = (path: string, getPConnect: any): void => {
  console.log('addViewNodeForPropertyPath', path);
  const PCore = (window as any).PCore;
  if (!PCore || !PCore.getContextTreeManager || !getPConnect) {
    return;
  }

  // Check if this path has already been registered
  if (registeredPropertyPaths.has(path)) {
    return;
  }

  // Extract and register all pagelists in the path that haven't been registered yet
  const pagelistPaths = extractPagelistPathsFromPropertyPath(path);
  pagelistPaths.forEach(({ path: pagelistPath, index }) => {
    if (!registeredPageListPaths.has(pagelistPath)) {
      addPageListNodeForPath(pagelistPath, getPConnect, index);
    }
  });

  // Mark this path as registered
  registeredPropertyPaths.add(path);

  // Add view node for the property path
  PCore.getContextTreeManager().addViewNode(
    getPConnect().getContextName(),
    'caseInfo.content.' + path,
    getPConnect().viewName,
  );
};

/**
 * Recursively finds properties with pxPropertyPath and registers them as view nodes.
 * Pagelists in the path will be automatically registered by addViewNodeForPropertyPath.
 * This function no longer directly registers pagelists - it only registers view nodes for editable properties.
 *
 * @param obj - The object to traverse
 * @param basePath - The base path (e.g., "Tree[0].ProductOffer")
 * @param getPConnect - Function to get PConnect instance
 * @param visited - Set to track visited objects and prevent circular references
 */
export const findAndRegisterPageLists = (
  obj: any,
  basePath: string,
  getPConnect: any,
  visited: WeakSet<object> = new WeakSet(),
): void => {
  if (!obj || typeof obj !== 'object' || visited.has(obj)) {
    return;
  }

  visited.add(obj);

  // Check if this object has a pxPropertyPath set (for leaf nodes with quantity or ConfiguredFieldValue)
  // This is the key - when we find a property that needs to be edited, register it.
  // addViewNodeForPropertyPath will automatically register all necessary pagelists in the path.
  if (obj[PROPERTY_NAMES.PX_PROPERTY_PATH]) {
    const propertyPath = obj[PROPERTY_NAMES.PX_PROPERTY_PATH];
    // Register the property path as a view node (e.g., ConfiguredFieldValue or quantity)
    // This will also register all pagelists in the path automatically
    addViewNodeForPropertyPath(propertyPath, getPConnect);
  }

  // Recursively process nested structures to find all properties with pxPropertyPath
  // We don't register pagelists here - only when we encounter editable properties
  if (obj[PROPERTY_NAMES.CONFIGURATION] && Array.isArray(obj[PROPERTY_NAMES.CONFIGURATION])) {
    obj[PROPERTY_NAMES.CONFIGURATION].forEach((configItem: any, index: number) => {
      if (configItem && typeof configItem === 'object') {
        const configItemPath = `${basePath}.${PROPERTY_NAMES.CONFIGURATION}[${index}]`;
        findAndRegisterPageLists(configItem, configItemPath, getPConnect, visited);
      }
    });
  }

  if (obj[PROPERTY_NAMES.CHILD_SPECIFICATIONS_LIST] && Array.isArray(obj[PROPERTY_NAMES.CHILD_SPECIFICATIONS_LIST])) {
    obj[PROPERTY_NAMES.CHILD_SPECIFICATIONS_LIST].forEach((childSpec: any, index: number) => {
      if (childSpec && typeof childSpec === 'object') {
        const childSpecPath = `${basePath}.${PROPERTY_NAMES.CHILD_SPECIFICATIONS_LIST}[${index}]`;
        findAndRegisterPageLists(childSpec, childSpecPath, getPConnect, visited);
      }
    });
  }

  // Also check other properties that might contain nested structures
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      // Skip properties we've already processed
      if (key === PROPERTY_NAMES.CONFIGURATION || key === PROPERTY_NAMES.CHILD_SPECIFICATIONS_LIST) {
        continue;
      }
      const value = obj[key];
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        const nestedPath = `${basePath}.${key}`;
        findAndRegisterPageLists(value, nestedPath, getPConnect, visited);
      } else if (Array.isArray(value)) {
        value.forEach((item: any, index: number) => {
          if (item && typeof item === 'object') {
            const itemPath = `${basePath}.${key}[${index}]`;
            findAndRegisterPageLists(item, itemPath, getPConnect, visited);
          }
        });
      }
    }
  }
};

/**
 * Registers a Tree pagelist for a given path if it hasn't been registered yet.
 * This should be called when a Tree path is actually used during tree building.
 *
 * @param path - The path to the Tree pagelist (e.g., "Tree", "Tree[0].Tree", "TreeGroup[0].Tree")
 * @param getPConnect - Function to get PConnect instance
 * @param index - Optional index to use when calling addViewNode (defaults to 0)
 */
export const registerTreePagelistForPath = (path: string, getPConnect: any, index: number = 0): void => {
  if (!path || !getPConnect) {
    return;
  }
  addPageListNodeForPath(path, getPConnect, index);
};

/**
 * Derives and registers Tree pagelists from a parent path that contains Tree segments.
 * When a path like "TreeGroup[0].Tree[0]" is used, this registers:
 * - "TreeGroup" (if at root)
 * - "TreeGroup[0].Tree" (the Tree array being accessed)
 * - Any nested Tree arrays as they're encountered
 *
 * @param parentPath - The parent path being used (e.g., "TreeGroup[0].Tree[0]", "Tree[0]")
 * @param getPConnect - Function to get PConnect instance
 */
export const registerTreePagelistsFromPath = (parentPath: string, getPConnect: any): void => {
  if (!parentPath || !getPConnect) {
    return;
  }

  // Split the path into segments
  const segments = parentPath.split('.');
  let accumulatedPath = '';

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];

    // Register TreeGroup at the root if we encounter it
    if (i === 0 && (segment === 'TreeGroup' || segment.startsWith('TreeGroup['))) {
      registerTreePagelistForPath('TreeGroup', getPConnect);
    }

    // If this segment is a Tree property (with or without index), register it as a pagelist
    if (segment === PROPERTY_NAMES.TREE || segment.startsWith(PROPERTY_NAMES.TREE + '[')) {
      // Build the path up to this Tree property (without the index on Tree)
      // For "TreeGroup[0].Tree[0]", we want to register "TreeGroup[0].Tree"
      // For "Tree[0]", we want to register "Tree"
      let pathToTree: string;
      if (accumulatedPath) {
        // Remove any index from the Tree segment and build the full path
        pathToTree = accumulatedPath + '.' + PROPERTY_NAMES.TREE;
      } else {
        // Root Tree
        pathToTree = PROPERTY_NAMES.TREE;
      }
      registerTreePagelistForPath(pathToTree, getPConnect);
    }

    // Build up the accumulated path for the next iteration
    if (accumulatedPath) {
      accumulatedPath += '.' + segment;
    } else {
      accumulatedPath = segment;
    }
  }
};

/**
 * Set to track which view names have had their resources loaded
 * This ensures we only call updateViewResources on the first call
 */
const loadedViewResources = new Set<string>();

/**
 * Recursively searches for a child spec by ID in a child specifications list
 * @param childSpecs - Array of child specifications to search
 * @param id - The ID to search for (pyID, SpecID, etc.)
 * @returns The found child spec or null
 */
const findChildSpecById = (childSpecs: any[], id: string): any | null => {
  if (!childSpecs || !Array.isArray(childSpecs)) {
    return null;
  }

  for (const childSpec of childSpecs) {
    // Check if this child spec matches the ID
    if (childSpec[PROPERTY_NAMES.PY_ID] === id || childSpec['SpecID'] === id) {
      return childSpec;
    }

    // Recursively search nested child specifications
    const nestedChildSpecs = childSpec[PROPERTY_NAMES.CHILD_SPECIFICATIONS_LIST] || [];
    const found = findChildSpecById(nestedChildSpecs, id);
    if (found) {
      return found;
    }
  }

  return null;
};

/**
 * Finds a node in the tree by ID
 * @param nodes - Array of tree nodes to search
 * @param id - The ID to search for
 * @param idPropertyName - The property name to use for ID matching
 * @returns The found node's itemData or null
 */
export const findNodeById = (nodes: any[], id: string): any | null => {
  for (const node of nodes) {
    if (node.itemData) {
      // Check if this is the node we're looking for by various ID fields
      if (
        id === node.itemData['ID'] ||
        id === node.itemData[PROPERTY_NAMES.PY_ID] ||
        id === node.itemData['SpecID'] ||
        id === node.itemData[PROPERTY_NAMES.PRODUCT_ID]
      ) {
        return node.itemData;
      }

      // If this is a product node, search its child specifications
      if (node.itemData[PROPERTY_NAMES.TYPE] === NODE_TYPES.PRODUCT) {
        const productOffer = node.itemData[PROPERTY_NAMES.PRODUCT_OFFER];
        if (productOffer) {
          // Search in main child specifications list (recursively searches nested specs)
          const childSpecsList = productOffer[PROPERTY_NAMES.CHILD_SPECIFICATIONS_LIST] || [];
          const foundChildSpec = findChildSpecById(childSpecsList, id);
          if (foundChildSpec) {
            // Check if the Tree structure has LineItem for this child spec
            // Search in the Tree structure to find matching node with LineItem
            const treeNodeWithLineItem = findTreeNodeWithLineItem(node, id);
            if (treeNodeWithLineItem?.itemData?.LineItem) {
              // Merge LineItem into the found child spec
              return {
                ...foundChildSpec,
                LineItem: treeNodeWithLineItem.itemData.LineItem,
              };
            }
            return foundChildSpec;
          }
        }
      }

      // Also search in Tree structure (for nodes that have Tree children)
      // This handles cases where LineItem is at the Tree node level
      if (node.itemData[PROPERTY_NAMES.TREE] && Array.isArray(node.itemData[PROPERTY_NAMES.TREE])) {
        const foundInTree = findInTreeStructure(node.itemData[PROPERTY_NAMES.TREE], id);
        if (foundInTree) {
          return foundInTree;
        }
      }

      // Recursively search in child nodes
      if (node.nodes && Array.isArray(node.nodes)) {
        const foundInChildren = findNodeById(node.nodes, id);
        if (foundInChildren) {
          return foundInChildren;
        }
      }
    }
  }
  return null;
};

/**
 * Finds a tree node that contains LineItem for a given child spec ID
 * @param node - The tree node to search
 * @param id - The child spec ID to search for
 * @returns The tree node with LineItem or null
 */
const findTreeNodeWithLineItem = (node: any, id: string): any | null => {
  if (!node || !node.itemData) {
    return null;
  }

  // Check if this node matches the ID and has LineItem
  if (
    (node.itemData['ID'] === id || node.itemData[PROPERTY_NAMES.PY_ID] === id || node.itemData['SpecID'] === id) &&
    node.itemData['LineItem']
  ) {
    return node;
  }

  // Recursively search in child nodes
  if (node.nodes && Array.isArray(node.nodes)) {
    for (const childNode of node.nodes) {
      const found = findTreeNodeWithLineItem(childNode, id);
      if (found) {
        return found;
      }
    }
  }

  return null;
};

/**
 * Searches in the Tree structure array for a node matching the ID
 * @param treeArray - Array of Tree nodes
 * @param id - The ID to search for
 * @returns The found node or null
 */
const findInTreeStructure = (treeArray: any[], id: string): any | null => {
  for (const treeNode of treeArray) {
    // Check if this tree node matches the ID
    if (treeNode['ID'] === id || treeNode[PROPERTY_NAMES.PY_ID] === id || treeNode['SpecID'] === id) {
      return treeNode;
    }

    // Recursively search in nested Tree arrays
    if (treeNode[PROPERTY_NAMES.TREE] && Array.isArray(treeNode[PROPERTY_NAMES.TREE])) {
      const found = findInTreeStructure(treeNode[PROPERTY_NAMES.TREE], id);
      if (found) {
        return found;
      }
    }
  }
  return null;
};

/* This function calls the DX Constellation API to load a specific view for the case - The view is passed
   as parameter to this widget. You can have when and custom conditions on some of the fields that would allow you
  to customize the look and field of the cards

  the id parameter is the ID of the case (pyID)

  On the first call, it makes the API call to get UI meta and updates view resources.
  On subsequent calls, it skips the API call and uses tree data instead.

  */
type LoadDetailsProps = {
  id: string;
  classname: string;
  detailsDataPage: string;
  detailsViewName: string;
  getPConnect: any;
  nodeData?: any; // The node's itemData to use (should be passed directly from the selected node)
};
export const loadDetails = async (props: LoadDetailsProps) => {
  const { id, classname, detailsDataPage, detailsViewName, getPConnect, nodeData } = props;
  let myElem;
  // Check if this is the first call for this view name
  const isFirstCall = !loadedViewResources.has(detailsViewName);

  if (isFirstCall) {
    // First call: Make API call to get UI meta and update view resources
    // But use tree data (not API response data) for the transient data
    await (window as any).PCore.getDataApiUtils()
      .getDataObjectView(detailsDataPage, detailsViewName, { caseInstanceKey: id })
      .then(async (res: any) => {
        const { fetchViewResources, updateViewResources } = (window as any).PCore.getViewResources();
        await updateViewResources(res.data);
        loadedViewResources.add(detailsViewName);

        const transientItemID = getPConnect()
          .getContainerManager()
          .addTransientItem({
            id: `${detailsViewName}${id}`,
            data: {},
          });
        getPConnect()
          .getContainerManager()
          .updateTransientData({
            transientItemID,
            data: { content: nodeData },
          });
        const messageConfig = {
          meta: fetchViewResources(detailsViewName, getPConnect(), classname),
          options: {
            contextName: transientItemID,
            context: transientItemID,
            pageReference: 'content',
          },
        };
        messageConfig.meta.config.showLabel = false;
        messageConfig.meta.config.pyID = id;
        const c11nEnv = (window as any).PCore.createPConnect(messageConfig);

        myElem = c11nEnv.getPConnect().createComponent(messageConfig.meta);
      });
  } else {
    // Subsequent calls: Skip API call and updateViewResources, use tree data instead
    const { fetchViewResources } = (window as any).PCore.getViewResources();

    // Get or create transient item (addTransientItem handles existing items)
    const transientItemID = getPConnect()
      .getContainerManager()
      .addTransientItem({
        id: `${detailsViewName}${id}`,
        data: {},
      });

    // Update transient data with the subtree copy
    // This data comes from the tree, not from the API response
    getPConnect()
      .getContainerManager()
      .updateTransientData({
        transientItemID,
        data: { content: nodeData },
      });

    // Fetch view resources (already loaded from first call, just fetch them)
    const messageConfig = {
      meta: fetchViewResources(detailsViewName, getPConnect(), classname),
      options: {
        contextName: transientItemID,
        context: transientItemID,
        pageReference: 'content',
      },
    };
    messageConfig.meta.config.showLabel = false;
    messageConfig.meta.config.pyID = id;
    const c11nEnv = (window as any).PCore.createPConnect(messageConfig);

    myElem = c11nEnv.getPConnect().createComponent(messageConfig.meta);
  }

  return myElem;
};
