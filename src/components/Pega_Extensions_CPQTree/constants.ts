/**
 * Constants for CPQ Tree component
 */

/**
 * Constants for tree traversal and styling
 */
export const TREE_CONSTANTS = {
  MAX_DEPTH: 100,
  DEPTH_INDENT: 24, // pixels per depth level
  FIELD_LABEL_WIDTH: '200px',
  FIELD_MAX_WIDTH: '200px',
  DEFAULT_MAX_CARDINALITY: 7,
} as const;

/**
 * Style constants for consistent styling
 */
export const STYLE_CONSTANTS = {
  BORDER_COLOR_LIGHT: '#f0f0f0',
  BORDER_COLOR_MEDIUM: '#e0e0e0',
  PADDING_VERTICAL: '4px',
  FIELD_LABEL_FLEX: '0 0 200px',
  FIELD_VALUE_FLEX: '1',
} as const;

/**
 * Property name constants for CPQ Tree data structure
 *
 * These constants represent property names used throughout the CPQ tree data structure.
 * Using these constants instead of hardcoded strings ensures consistency and makes it easier
 * to maintain and update property names if the data structure changes.
 *
 * @example
 * // Instead of: if (item.Type === 'product')
 * // Use: if (item[PROPERTY_NAMES.TYPE] === NODE_TYPES.PRODUCT)
 */
export const PROPERTY_NAMES = {
  /**
   * Property name for node type (e.g., 'product', 'site')
   * Used to identify the type of tree node
   */
  TYPE: 'Type',

  /**
   * Property name for product offer object
   * Contains the product configuration and child specifications
   */
  PRODUCT_OFFER: 'ProductOffer',

  /**
   * Property name for product type
   * Identifies the type of product specification
   */
  PRODUCT_TYPE: 'ProductType',

  /**
   * Property name for specification name
   * Display name for child specifications and main specs
   */
  SPEC_NAME: 'SpecName',

  /**
   * Fallback property name for name/label
   * Used when SpecName or FieldName is not available
   */
  NAME: 'Name',

  /**
   * Property name for child specifications list
   * Array containing nested child specifications
   */
  CHILD_SPECIFICATIONS_LIST: 'ChildSpecificationsList',

  /**
   * Property name for configuration array
   * Contains configuration fields for a specification
   */
  CONFIGURATION: 'Configuration',

  /**
   * Property name for field name
   * Name of a configuration field
   */
  FIELD_NAME: 'FieldName',

  /**
   * Property name for maximum cardinality
   * Maximum quantity allowed for a specification
   */
  MAX_CARDINALITY: 'MaxCardinality',

  /**
   * Property name for configured field value object
   * Contains the actual value selected/entered for a configuration field
   */
  CONFIGURED_FIELD_VALUE: 'ConfiguredFieldValue',

  /**
   * Property name for field value within ConfiguredFieldValue
   * The actual string value of the configuration field
   */
  FIELD_VALUE: 'FieldValue',

  /**
   * Property name for field value list
   * Array of available options for dropdown fields
   */
  FIELD_VALUE_LIST: 'FieldValueList',

  /**
   * Property name for has value list flag
   * Boolean indicating if field has a dropdown list of options
   */
  HAS_VALUE_LIST: 'HasValueList',

  /**
   * Property name for is config required flag
   * Boolean indicating if configuration field is required
   */
  IS_CONFIG_REQUIRED: 'IsConfigRequired',

  /**
   * Property name for is config read only flag
   * Boolean indicating if configuration field is read-only
   */
  IS_CONFIG_READ_ONLY: 'IsConfigReadOnly',

  /**
   * Property name for field value details
   * Contains metadata about the field (e.g., PropertyReference)
   */
  FIELD_VALUE_DETAILS: 'FieldValueDetails',

  /**
   * Property name for property reference array
   * Contains Pega property metadata (e.g., pyCategory, pyLabel)
   */
  PROPERTY_REFERENCE: 'PropertyReference',

  /**
   * Property name for quantity
   */
  QUANTITY: 'quantity',

  /**
   * Property name for index
   * 1-based index from Pega (converted to 0-based in code)
   */
  INDEX: 'Index',

  /**
   * Property name for Pega object class
   * Identifies the Pega class of an object (e.g., 'ProductConfigItem')
   */
  PX_OBJ_CLASS: 'pxObjClass',

  /**
   * Property name for Pega property path
   * Full path to the property in the data structure (e.g., 'Tree[0].ProductOffer.ChildSpecificationsList[0].quantity')
   */
  PX_PROPERTY_PATH: 'pxPropertyPath',

  /**
   * Property name for Pega instance key
   * Unique identifier for a Pega object instance
   */
  PZ_INS_KEY: 'pzInsKey',

  /**
   * Property name for Pega ID
   * Alternative identifier for Pega objects
   */
  PY_ID: 'pyID',

  /**
   * Property name for Pega label
   * Display label for Pega properties
   */
  PY_LABEL: 'pyLabel',

  /**
   * Property name for Pega category
   * Category classification (e.g., 'FreeText' for paragraph fields)
   */
  PY_CATEGORY: 'pyCategory',

  /**
   * Property name for Pega class name
   * Class name of the Pega object
   */
  PY_CLASS_NAME: 'pyClassName',

  /**
   * Property name for ID
   * Generic identifier property
   */
  ID: 'ID',

  /**
   * Property name for parent ID
   * Identifier of parent object
   */
  PARENT_ID: 'ParentID',

  /**
   * Property name for product ID
   * Identifier for product items
   */
  PRODUCT_ID: 'ProductID',

  /**
   * Property name for product spec
   * Contains product specification data
   */
  PRODUCT_SPEC: 'ProductSpec',

  /**
   * Property name for tree array
   * Root array containing tree nodes
   */
  TREE: 'Tree',

  /**
   * Property name for pyLabel (alternative)
   * Display label property
   */
  PY_LABEL_ALT: 'pyLabel',
} as const;

/**
 * Node type values for CPQ Tree
 *
 * These constants represent the possible values for the Type property.
 * Used to identify different types of nodes in the tree structure.
 */
export const NODE_TYPES = {
  /**
   * Product node type
   * Represents a product in the tree
   */
  PRODUCT: 'product',

  /**
   * Site node type
   * Represents a site in the tree
   */
  SITE: 'site',
} as const;

/**
 * Object class values for CPQ Tree
 *
 * These constants represent the Pega object class values used in the tree.
 * Used to identify the type of object for rendering and processing.
 */
export const OBJECT_CLASSES = {
  /**
   * Configuration field object class
   * Used for configuration field nodes
   */
  CONFIGURATION_FIELD: 'ConfigurationField',

  /**
   * Child specification object class
   * Used for child specification nodes
   */
  CHILD_SPECIFICATION: 'ChildSpecification',

  /**
   * Configuration object class
   * Used for configuration section nodes
   */
  CONFIGURATION: 'Configuration',

  /**
   * Product config item object class
   * Used to identify configuration items in the tree
   */
  PRODUCT_CONFIG_ITEM: 'ProductConfigItem',
} as const;

/**
 * Flag property names for CPQ Tree
 *
 * These constants represent boolean flags used to mark special node types.
 * Used internally to identify node types during tree building.
 */
export const FLAG_PROPERTIES = {
  /**
   * Flag indicating a configuration field node
   * Set to true for configuration field items
   */
  IS_CONFIG_FIELD: 'isConfigField',

  /**
   * Flag indicating a child specification node
   * Set to true for child specification items
   */
  IS_CHILD_SPEC: 'isChildSpec',

  /**
   * Flag indicating a configuration section node
   * Set to true for configuration section items
   */
  IS_CONFIG_SECTION: 'isConfigSection',
} as const;

/**
 * Pega category values
 *
 * These constants represent Pega category values used for field type detection.
 */
export const PEGA_CATEGORIES = {
  /**
   * FreeText category
   * Used to identify paragraph/text area fields
   */
  FREE_TEXT: 'FreeText',
} as const;
