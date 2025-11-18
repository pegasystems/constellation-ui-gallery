import { Text } from '@pega/cosmos-react-core';
import { FieldComponent } from './FieldComponent';
import {
  createFieldConfig,
  generateFieldOptions,
  extractConfiguredFieldValue,
  getDepthPadding,
  TREE_CONSTANTS,
  STYLE_CONSTANTS,
} from '../utils';

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
  const fieldName = configItem.FieldName || configItem.Name;
  const fieldValueList = configItem.FieldValueList || [];
  const options = generateFieldOptions(fieldValueList);

  // Use controlled value from props if available, otherwise fall back to extracted value
  const currentValue = fieldValue !== undefined ? fieldValue : extractConfiguredFieldValue(configItem);

  const field = createFieldConfig('Dropdown', currentValue || '', options);

  // Add onChange handler to field config
  if (!readOnly && fieldId && !disabled && onFieldChange) {
    field.onChange = (newValue: string) => {
      onFieldChange(fieldId, newValue, configItem);
    };
  }

  return (
    <div
      key={`field-${index}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: getDepthPadding(depth),
        paddingRight: '16px',
        paddingTop: STYLE_CONSTANTS.PADDING_VERTICAL,
        paddingBottom: STYLE_CONSTANTS.PADDING_VERTICAL,
        borderBottom: `1px solid ${STYLE_CONSTANTS.BORDER_COLOR_LIGHT}`,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <div style={{ flex: '1 1 auto', fontWeight: '500', minWidth: 0, overflow: 'visible', whiteSpace: 'nowrap' }}>
        {fieldName}
      </div>
      <div style={{ flex: '0 0 auto', marginLeft: '16px', maxWidth: TREE_CONSTANTS.FIELD_MAX_WIDTH }}>
        {readOnly || disabled ? (
          <Text variant='secondary'>{currentValue || '-'}</Text>
        ) : (
          <FieldComponent field={field} index={index} />
        )}
      </div>
    </div>
  );
};
