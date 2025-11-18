import { Icon, Text } from '@pega/cosmos-react-core';
import { FieldComponent } from './FieldComponent';
import { ConfigFieldRow } from './ConfigFieldRow';
import {
  createFieldConfig,
  generateQuantityOptions,
  extractQuantity,
  generateChildSpecId,
  getDepthPadding,
  TREE_CONSTANTS,
  STYLE_CONSTANTS,
} from '../utils';

type ChildSpecRowProps = {
  childSpec: any;
  index: number;
  depth?: number;
  productId?: string;
  configSectionId?: string;
  disabled?: boolean;
  readOnly?: boolean;
  fieldValue?: string;
  isExpanded?: boolean;
  fieldValues?: Map<string, string>;
  onQuantityChange?: (fieldId: string, newValue: string, specItem: any) => void;
  onToggleExpanded?: (childSpecId: string) => void;
  onConfigFieldChange?: (fieldId: string, newValue: string, configItem: any) => void;
};

/**
 * Component for rendering a child spec field row
 */
export const ChildSpecRow = ({
  childSpec,
  index,
  depth = 2,
  productId,
  configSectionId,
  disabled = false,
  readOnly = false,
  fieldValue,
  isExpanded = false,
  fieldValues,
  onQuantityChange,
  onToggleExpanded,
  onConfigFieldChange,
}: ChildSpecRowProps) => {
  const specName = childSpec.SpecName || childSpec.Name || 'Unknown';
  const maxCardinality = parseInt(childSpec.MaxCardinality || TREE_CONSTANTS.DEFAULT_MAX_CARDINALITY.toString(), 10);
  const options = generateQuantityOptions(maxCardinality);
  const childSpecConfig = childSpec.Configuration || [];
  const hasConfigFields = childSpecConfig.length > 0;

  // Generate a unique ID for this child spec
  const childSpecId = configSectionId
    ? generateChildSpecId(configSectionId, index)
    : `child-spec-${productId}-${index}`;

  // Use controlled value from props if available, otherwise fall back to extracted value
  const currentQuantity = fieldValue !== undefined ? fieldValue : extractQuantity(childSpec);

  const field = createFieldConfig('Dropdown', currentQuantity, options);

  // Add onChange handler to field config
  if (!readOnly && !disabled && onQuantityChange) {
    field.onChange = (newValue: string) => {
      onQuantityChange(childSpecId, newValue, childSpec);
    };
  }

  return (
    <div key={`spec-${index}`}>
      <div
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
        <div style={{ display: 'flex', alignItems: 'center', flex: '1 1 auto', minWidth: 0 }}>
          {hasConfigFields && (
            <Icon
              name='caret-right'
              style={{
                cursor: disabled ? 'not-allowed' : 'pointer',
                width: '16px',
                height: '16px',
                marginRight: '8px',
                flexShrink: 0,
                transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
                opacity: disabled ? 0.5 : 1,
              }}
              onClick={() => !disabled && onToggleExpanded && onToggleExpanded(childSpecId)}
            />
          )}
          {!hasConfigFields && <div style={{ width: '24px' }} />}
          <div
            style={{
              flex: '1 1 auto',
              fontWeight: '500',
              minWidth: 0,
              overflow: 'visible',
              whiteSpace: 'nowrap',
            }}
          >
            {specName}
          </div>
        </div>
        <div style={{ flex: '0 0 auto', marginLeft: '16px', maxWidth: TREE_CONSTANTS.FIELD_MAX_WIDTH }}>
          {readOnly || disabled ? (
            <Text variant='secondary'>{currentQuantity || '-'}</Text>
          ) : (
            <FieldComponent field={field} index={index} />
          )}
        </div>
      </div>
      {/* Render Configuration items for this child spec if they exist and are expanded */}
      {hasConfigFields && isExpanded && (
        <>
          {childSpecConfig.map((configItem: any, configIndex: number) => {
            const nestedFieldId = `${childSpecId}-field-${configIndex}`;
            return (
              <ConfigFieldRow
                key={nestedFieldId}
                configItem={configItem}
                index={configIndex}
                depth={depth + 1}
                fieldId={nestedFieldId}
                disabled={disabled}
                readOnly={readOnly}
                fieldValue={fieldValues?.get(nestedFieldId)}
                onFieldChange={onConfigFieldChange}
              />
            );
          })}
        </>
      )}
    </div>
  );
};
