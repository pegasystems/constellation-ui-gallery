import { Text, Button } from '@pega/cosmos-react-core';
import { FieldComponent } from './FieldComponent';
import { ConfigFieldRow } from './ConfigFieldRow';
import {
  createFieldConfig,
  generateQuantityOptions,
  extractQuantity,
  generateChildSpecId,
  getDepthPadding,
} from '../utils';
import { TREE_CONSTANTS, PROPERTY_NAMES } from '../constants';
import {
  ChildSpecRowContainer,
  ChildSpecContent,
  ChildSpecExpandIcon,
  IconSpacer,
  ChildSpecLabel,
  FieldContainer,
} from '../styles';

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
  expandedChildSpecs?: Set<string>;
  showDetailsInfo?: boolean;
  onQuantityChange?: (fieldId: string, newValue: string, specItem: any) => void;
  onToggleExpanded?: (childSpecId: string) => void;
  onConfigFieldChange?: (fieldId: string, newValue: string, configItem: any) => void;
  onLoadDetails?: (key: string) => void;
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
  expandedChildSpecs,
  showDetailsInfo = false,
  onQuantityChange,
  onToggleExpanded,
  onConfigFieldChange,
  onLoadDetails,
}: ChildSpecRowProps) => {
  const specName = childSpec[PROPERTY_NAMES.SPEC_NAME] || childSpec[PROPERTY_NAMES.NAME] || 'Unknown';
  const maxCardinality = parseInt(
    childSpec[PROPERTY_NAMES.MAX_CARDINALITY] || TREE_CONSTANTS.DEFAULT_MAX_CARDINALITY.toString(),
    10,
  );
  const options = generateQuantityOptions(maxCardinality);
  const childSpecConfig = childSpec[PROPERTY_NAMES.CONFIGURATION] || [];
  const hasConfigFields = childSpecConfig.length > 0;
  const hasChildSpecs = (childSpec[PROPERTY_NAMES.CHILD_SPECIFICATIONS_LIST] || []).length > 0;
  const hasChildren = hasConfigFields || hasChildSpecs;

  // Generate a unique ID for this child spec
  const childSpecId = configSectionId
    ? generateChildSpecId(configSectionId, index)
    : `child-spec-${productId}-${index}`;

  // Use controlled value from props if available, otherwise fall back to extracted value
  const currentQuantity = fieldValue !== undefined ? fieldValue : extractQuantity(childSpec);

  const field = createFieldConfig('Dropdown', currentQuantity, options);

  // Tie the dropdown's accessible name to the visible spec label
  const childSpecLabelId = `${childSpecId}-label`;
  field.ariaLabelledById = childSpecLabelId;

  // Add onChange handler to field config
  if (!readOnly && !disabled && onQuantityChange) {
    field.onChange = (newValue: string) => {
      onQuantityChange(childSpecId, newValue, childSpec);
    };
  }

  const nestedChildSpecs = childSpec[PROPERTY_NAMES.CHILD_SPECIFICATIONS_LIST] || [];

  // Generate ID for loading details - use pyID if available, otherwise SpecID, or fallback to childSpecId
  const detailsId = childSpec[PROPERTY_NAMES.PY_ID] || childSpec['SpecID'] || childSpecId;

  return (
    <div key={`spec-${index}`}>
      <ChildSpecRowContainer $paddingLeft={getDepthPadding(depth)} $isDisabled={disabled}>
        <ChildSpecContent>
          {hasChildren && (
            <ChildSpecExpandIcon
              name='caret-right'
              $isExpanded={isExpanded}
              $isDisabled={disabled}
              onClick={() => !disabled && onToggleExpanded && onToggleExpanded(childSpecId)}
            />
          )}
          {!hasChildren && <IconSpacer />}
          {hasChildren && showDetailsInfo && !disabled && onLoadDetails ? (
            <Button
              variant='link'
              type='button'
              onClick={() => onLoadDetails(detailsId)}
              aria-label={`View details for ${specName}`}
            >
              <ChildSpecLabel as='span' id={childSpecLabelId}>
                {specName}
              </ChildSpecLabel>
            </Button>
          ) : (
            <ChildSpecLabel id={childSpecLabelId}>{specName}</ChildSpecLabel>
          )}
        </ChildSpecContent>
        <FieldContainer>
          {/* Only show quantity dropdown if child spec has no children */}
          {hasChildren ? null : readOnly || disabled ? ( // If it has children, don't show quantity dropdown
            <Text variant='secondary'>{currentQuantity || '-'}</Text>
          ) : (
            <FieldComponent field={field} index={index} />
          )}
        </FieldContainer>
      </ChildSpecRowContainer>
      {/* Render Configuration items and nested ChildSpecificationsList for this child spec if they exist and are expanded */}
      {hasChildren && isExpanded && (
        <>
          {/* Render Configuration items */}
          {childSpecConfig.map((configItem: any, configIndex: number) => {
            const nestedFieldId = `${childSpecId}-field-${configIndex}`;
            // Ensure pxPropertyPath is set on configItem if missing
            // Construct from parent spec's path if available
            if (!configItem[PROPERTY_NAMES.PX_PROPERTY_PATH] && childSpec?.[PROPERTY_NAMES.PX_PROPERTY_PATH]) {
              const parentPath = childSpec[PROPERTY_NAMES.PX_PROPERTY_PATH];
              // Construct path: parentPath.Configuration[index].ConfiguredFieldValue
              configItem[PROPERTY_NAMES.PX_PROPERTY_PATH] =
                `${parentPath}.${PROPERTY_NAMES.CONFIGURATION}[${configIndex}].${PROPERTY_NAMES.CONFIGURED_FIELD_VALUE}`;
            }
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
          {/* Render nested ChildSpecificationsList items */}
          {nestedChildSpecs.map((nestedChildSpec: any, nestedIndex: number) => {
            // Use generateChildSpecId for consistency - this ensures the ID matches what the nested component will generate
            const nestedChildSpecId = generateChildSpecId(childSpecId, nestedIndex);
            return (
              <ChildSpecRow
                key={nestedChildSpecId}
                childSpec={nestedChildSpec}
                index={nestedIndex}
                depth={depth + 1}
                productId={productId}
                configSectionId={childSpecId}
                disabled={disabled}
                readOnly={readOnly}
                fieldValue={fieldValues?.get(nestedChildSpecId)}
                isExpanded={expandedChildSpecs?.has(nestedChildSpecId) ?? false}
                fieldValues={fieldValues}
                expandedChildSpecs={expandedChildSpecs}
                showDetailsInfo={showDetailsInfo}
                onQuantityChange={onQuantityChange}
                onToggleExpanded={onToggleExpanded}
                onConfigFieldChange={onConfigFieldChange}
                onLoadDetails={onLoadDetails}
              />
            );
          })}
        </>
      )}
    </div>
  );
};
