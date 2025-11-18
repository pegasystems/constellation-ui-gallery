import { Icon, Text, Flex } from '@pega/cosmos-react-core';
import { FieldComponent } from './FieldComponent';
import { ConfigFieldRow } from './ConfigFieldRow';
import { ChildSpecRow } from './ChildSpecRow';
import {
  extractProductId,
  extractProductName,
  generateConfigNodeId,
  generateConfigFieldId,
  generateChildSpecId,
  getMainChildSpec,
  collectConfigurations,
  extractQuantity,
  generateQuantityOptions,
  createFieldConfig,
  getDepthPadding,
  TREE_CONSTANTS,
  STYLE_CONSTANTS,
} from '../utils';

type ProductRowProps = {
  product: any;
  productIndex: number;
  idPropertyName: string;
  displayPropertyName: string;
  readOnly?: boolean;
  isConfigExpanded: boolean;
  isProductExpanded: boolean;
  fieldValues: Map<string, string>;
  onToggleProductExpanded: (productId: string) => void;
  onToggleConfigExpanded: (configSectionId: string) => void;
  onQuantityChange: (fieldId: string, newValue: string, specItem: any) => void;
  onConfigFieldChange: (fieldId: string, newValue: string, configItem: any) => void;
  onChildSpecToggleExpanded: (childSpecId: string) => void;
  expandedChildSpecs: Set<string>;
};

/**
 * Component for rendering a product row with nested tree structure
 */
export const ProductRow = ({
  product,
  productIndex,
  idPropertyName,
  displayPropertyName,
  readOnly = false,
  isConfigExpanded,
  isProductExpanded,
  fieldValues,
  onToggleProductExpanded,
  onToggleConfigExpanded,
  onQuantityChange,
  onConfigFieldChange,
  onChildSpecToggleExpanded,
  expandedChildSpecs,
}: ProductRowProps) => {
  const productId = extractProductId(product, idPropertyName, `product-${productIndex}`);
  const productName = extractProductName(product, displayPropertyName);
  const productOffer = product.ProductOffer || {};
  const productType = productOffer.ProductType || product.Type || '';
  const configSectionId = generateConfigNodeId(productId);

  // Get the main child specification (e.g., "Broadband connection")
  const mainChildSpec = getMainChildSpec(productOffer);
  const configuration = mainChildSpec?.Configuration || [];
  const childSpecifications = mainChildSpec?.ChildSpecificationsList || [];

  // Check if mainChildSpec name matches product name - if so, skip the intermediate node
  const shouldSkipConfigHeader =
    mainChildSpec?.SpecName && mainChildSpec.SpecName.trim().toLowerCase() === productName.trim().toLowerCase();

  // Collect all Configuration arrays from nested ChildSpecificationsList items
  const allConfigurations: Array<{ spec: any; config: any[] }> = [];
  if (mainChildSpec?.Configuration) {
    allConfigurations.push({ spec: mainChildSpec, config: mainChildSpec.Configuration });
  }

  if (childSpecifications.length > 0) {
    allConfigurations.push(...collectConfigurations(childSpecifications));
  }

  // Also check all child specs in the main list
  const childSpecsList = productOffer.ChildSpecificationsList || [];
  if (childSpecsList.length > 1) {
    allConfigurations.push(...collectConfigurations(childSpecsList.slice(1)));
  }

  // Helper to get main spec quantity
  const getMainSpecQuantity = () => {
    const mainSpecId = `${configSectionId}-main-spec`;
    return fieldValues.has(mainSpecId) ? fieldValues.get(mainSpecId) || '1' : extractQuantity(mainChildSpec) || '1';
  };

  const mainSpecQuantity = getMainSpecQuantity();
  const isDisabled = mainSpecQuantity === '0';

  return (
    <div key={productId} style={{ borderBottom: `1px solid ${STYLE_CONSTANTS.BORDER_COLOR_MEDIUM}` }}>
      {/* Product Header Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '12px 0',
          paddingLeft: '0px',
        }}
      >
        <Icon
          name='caret-right'
          style={{
            cursor: 'pointer',
            width: '16px',
            height: '16px',
            marginRight: '8px',
            flexShrink: 0,
            transform: isProductExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
          }}
          onClick={() => onToggleProductExpanded(productId)}
        />
        <Flex container={{ direction: 'column', gap: 0.5 }} style={{ flex: 1 }}>
          <Text variant='h4'>{productName}</Text>
          <Text variant='secondary'>
            {productId} | Product specification type {productType}
          </Text>
        </Flex>
      </div>

      {/* Configuration Section Row */}
      {isProductExpanded && mainChildSpec && (
        <>
          {/* Only show configuration section header if names don't match */}
          {!shouldSkipConfigHeader && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 0',
                paddingLeft: getDepthPadding(1),
                borderBottom: isConfigExpanded ? `1px solid ${STYLE_CONSTANTS.BORDER_COLOR_MEDIUM}` : 'none',
              }}
            >
              <Flex container={{ gap: 1, alignItems: 'center' }}>
                <Icon
                  name='caret-right'
                  style={{
                    cursor: 'pointer',
                    width: '16px',
                    height: '16px',
                    transform: isConfigExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                  }}
                  onClick={() => onToggleConfigExpanded(configSectionId)}
                />
                <Text variant='secondary' style={{ fontWeight: '500' }}>
                  {mainChildSpec.SpecName || 'Configuration'}
                </Text>
              </Flex>
            </div>
          )}

          {/* Nested Configuration Fields Rows */}
          {/* When skipping header, show children directly when product is expanded */}
          {(shouldSkipConfigHeader ? isProductExpanded : isConfigExpanded) && (
            <>
              {/* Main spec itself as first row (e.g., "Broadband connection": "1") */}
              {/* Skip if mainChildSpec has the same name as the product - show its children directly instead */}
              {mainChildSpec.SpecName &&
                mainChildSpec.SpecName.trim().toLowerCase() !== productName.trim().toLowerCase() && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingLeft: getDepthPadding(shouldSkipConfigHeader ? 1 : 2),
                      paddingRight: '16px',
                      paddingTop: STYLE_CONSTANTS.PADDING_VERTICAL,
                      paddingBottom: STYLE_CONSTANTS.PADDING_VERTICAL,
                      borderBottom: `1px solid ${STYLE_CONSTANTS.BORDER_COLOR_LIGHT}`,
                    }}
                  >
                    <div
                      style={{
                        flex: '1 1 auto',
                        fontWeight: '500',
                        minWidth: 0,
                        overflow: 'visible',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {mainChildSpec.SpecName}
                    </div>
                    <div style={{ flex: '0 0 auto', marginLeft: '16px', maxWidth: TREE_CONSTANTS.FIELD_MAX_WIDTH }}>
                      {readOnly ? (
                        <Text variant='secondary'>
                          {fieldValues.get(`${configSectionId}-main-spec`) || extractQuantity(mainChildSpec) || '1'}
                        </Text>
                      ) : (
                        (() => {
                          const mainSpecId = `${configSectionId}-main-spec`;
                          const currentQuantity = fieldValues.has(mainSpecId)
                            ? fieldValues.get(mainSpecId) || '1'
                            : extractQuantity(mainChildSpec) || '1';
                          const field = createFieldConfig('Dropdown', currentQuantity, generateQuantityOptions(1));
                          if (!readOnly) {
                            field.onChange = (newValue: string) => {
                              onQuantityChange(mainSpecId, newValue, mainChildSpec);
                            };
                          }
                          return <FieldComponent field={field} />;
                        })()
                      )}
                    </div>
                  </div>
                )}

              {/* Configuration Fields as nested rows - from main spec */}
              {configuration.map((configItem: any, index: number) => {
                const fieldId = generateConfigFieldId(configSectionId, index);
                return (
                  <ConfigFieldRow
                    key={fieldId}
                    configItem={configItem}
                    index={index}
                    depth={shouldSkipConfigHeader ? 1 : 2}
                    fieldId={fieldId}
                    disabled={isDisabled}
                    readOnly={readOnly}
                    fieldValue={fieldValues.get(fieldId)}
                    onFieldChange={onConfigFieldChange}
                  />
                );
              })}

              {/* Child Specifications as nested rows */}
              {childSpecifications.map((childSpec: any, index: number) => {
                const childSpecId = generateChildSpecId(configSectionId, index);
                return (
                  <ChildSpecRow
                    key={childSpecId}
                    childSpec={childSpec}
                    index={index}
                    depth={shouldSkipConfigHeader ? 1 : 2}
                    productId={productId}
                    configSectionId={configSectionId}
                    disabled={isDisabled}
                    readOnly={readOnly}
                    fieldValue={fieldValues.get(childSpecId)}
                    isExpanded={expandedChildSpecs.has(childSpecId)}
                    fieldValues={fieldValues}
                    onQuantityChange={onQuantityChange}
                    onToggleExpanded={onChildSpecToggleExpanded}
                    onConfigFieldChange={onConfigFieldChange}
                  />
                );
              })}

              {/* Configuration Fields from all other nested specs */}
              {allConfigurations
                .filter(({ spec }) => spec !== mainChildSpec && !childSpecifications.includes(spec))
                .map(({ config }, groupIndex) => {
                  return (
                    <div key={`config-group-${groupIndex}`}>
                      {config.map((configItem: any, configIndex: number) => {
                        // Generate a unique field ID for nested configurations
                        const fieldId = `${configSectionId}-nested-${groupIndex}-field-${configIndex}`;
                        return (
                          <ConfigFieldRow
                            key={fieldId}
                            configItem={configItem}
                            index={configIndex}
                            depth={shouldSkipConfigHeader ? 1 : 2}
                            fieldId={fieldId}
                            disabled={isDisabled}
                            readOnly={readOnly}
                            fieldValue={fieldValues.get(fieldId)}
                            onFieldChange={onConfigFieldChange}
                          />
                        );
                      })}
                    </div>
                  );
                })}
            </>
          )}
        </>
      )}
    </div>
  );
};
