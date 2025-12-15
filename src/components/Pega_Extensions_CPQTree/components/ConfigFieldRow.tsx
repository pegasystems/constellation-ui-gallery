import { Text } from '@pega/cosmos-react-core';
import { FieldComponent } from './FieldComponent';
import { createFieldConfig, generateFieldOptions, extractConfiguredFieldValue, getDepthPadding } from '../utils';
import { PROPERTY_NAMES, PEGA_CATEGORIES } from '../constants';
import { ConfigFieldRowContainer, ConfigFieldLabelContainer, RequiredIndicator, FieldContainer } from '../styles';

type ConfigFieldRowProps = {
  configItem: any;
  index: number;
  depth?: number;
  fieldId?: string;
  disabled?: boolean;
  readOnly?: boolean;
  fieldValue?: string;
  onFieldChange?: (fieldId: string, newValue: string, configItem: any) => void;
};

/**
 * Extracts field metadata from configuration item
 */
const extractFieldMetadata = (configItem: any) => {
  const isRequired =
    configItem[PROPERTY_NAMES.IS_CONFIG_REQUIRED] === 'true' || configItem[PROPERTY_NAMES.IS_CONFIG_REQUIRED] === true;
  const isReadOnly =
    configItem[PROPERTY_NAMES.IS_CONFIG_READ_ONLY] === 'true' ||
    configItem[PROPERTY_NAMES.IS_CONFIG_READ_ONLY] === true;

  // Check for FreeText category (paragraph field)
  const propertyRef = configItem[PROPERTY_NAMES.FIELD_VALUE_DETAILS]?.[PROPERTY_NAMES.PROPERTY_REFERENCE]?.[0];
  const isParagraph = propertyRef?.[PROPERTY_NAMES.PY_CATEGORY] === PEGA_CATEGORIES.FREE_TEXT;

  // Extract tooltip text - only show tooltip for FreeText fields (based on image, "Codice Progetto" has info icon)
  // Use pyLabel as tooltip text for FreeText fields
  const tooltipText =
    isParagraph && propertyRef?.[PROPERTY_NAMES.PY_LABEL] ? propertyRef[PROPERTY_NAMES.PY_LABEL] : undefined;

  // Determine field type
  const hasValueList =
    configItem[PROPERTY_NAMES.HAS_VALUE_LIST] === 'true' || configItem[PROPERTY_NAMES.HAS_VALUE_LIST] === true;
  const fieldType =
    hasValueList && (configItem[PROPERTY_NAMES.FIELD_VALUE_LIST] || []).length > 0 ? 'Dropdown' : 'Input';

  return {
    isRequired,
    isReadOnly,
    isParagraph,
    tooltipText,
    fieldType,
  };
};

/**
 * Component for rendering a configuration field row
 */
export const ConfigFieldRow = ({
  configItem,
  index,
  depth = 2,
  fieldId,
  disabled = false,
  readOnly = false,
  fieldValue,
  onFieldChange,
}: ConfigFieldRowProps) => {
  const fieldName = configItem[PROPERTY_NAMES.FIELD_NAME] || configItem[PROPERTY_NAMES.NAME];
  const fieldValueList = configItem[PROPERTY_NAMES.FIELD_VALUE_LIST] || [];
  const options = generateFieldOptions(fieldValueList);

  // Use controlled value from props if available, otherwise fall back to extracted value
  const currentValue = fieldValue !== undefined ? fieldValue : extractConfiguredFieldValue(configItem);

  // Extract field metadata
  const { isRequired, isReadOnly, isParagraph, tooltipText, fieldType } = extractFieldMetadata(configItem);

  // Determine the actual field type
  const actualFieldType = isParagraph ? 'Paragraph' : fieldType;

  const field = createFieldConfig(
    actualFieldType === 'Paragraph' ? 'Input' : actualFieldType,
    currentValue || '',
    options,
  );

  // Add metadata to field config
  field.required = isRequired;
  field.disabled = isReadOnly || disabled;
  field.isParagraph = isParagraph;
  field.tooltipText = tooltipText;
  // Use the visible field label span as the accessible name for the control
  // Ensure the ID is unique on the page by incorporating the (unique) fieldId when available
  const fieldLabelId = fieldId ? `config-field-label-${fieldId}` : `config-field-label-${index}`;
  field.ariaLabelledById = fieldLabelId;

  // Add onChange handler to field config
  if (!readOnly && fieldId && !disabled && !isReadOnly && onFieldChange) {
    field.onChange = (newValue: string) => {
      onFieldChange(fieldId, newValue, configItem);
    };
  }

  const isFieldDisabled = readOnly || disabled || isReadOnly;

  return (
    <ConfigFieldRowContainer key={`field-${index}`} $paddingLeft={getDepthPadding(depth)} $isDisabled={isFieldDisabled}>
      <ConfigFieldLabelContainer container={{ gap: 0.5, alignItems: 'center' }}>
        <span id={fieldLabelId}>{fieldName}</span>
        {isRequired && <RequiredIndicator>*</RequiredIndicator>}
      </ConfigFieldLabelContainer>
      <FieldContainer>
        {isFieldDisabled ? (
          <Text variant='secondary'>{currentValue || '-'}</Text>
        ) : (
          <FieldComponent field={field} index={index} />
        )}
      </FieldContainer>
    </ConfigFieldRowContainer>
  );
};
