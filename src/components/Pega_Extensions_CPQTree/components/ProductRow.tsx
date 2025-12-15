import { Text, Flex, Button } from '@pega/cosmos-react-core';
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
  extractProductOffer,
  collectConfigurations,
  extractQuantity,
  generateQuantityOptions,
  createFieldConfig,
  getDepthPadding,
} from '../utils';
import { TREE_CONSTANTS, PROPERTY_NAMES } from '../constants';
import {
  ProductContainer,
  ProductHeader,
  ProductExpandIcon,
  ProductInfoContainer,
  ConfigSectionHeader,
  ConfigExpandIcon,
  MainSpecRow,
  SpecNameLabel,
  FieldContainer,
  ConfigSectionTitle,
} from '../styles';

type ProductRowProps = {
  product: any;
  productIndex: number;
  idPropertyName: string;
  displayPropertyName: string;
  readOnly?: boolean;
  showDetailsInfo?: boolean;
  isConfigExpanded: boolean;
  isProductExpanded: boolean;
  fieldValues: Map<string, string>;
  onToggleProductExpanded: (productId: string) => void;
  onToggleConfigExpanded: (configSectionId: string) => void;
  onQuantityChange: (fieldId: string, newValue: string, specItem: any) => void;
  onConfigFieldChange: (fieldId: string, newValue: string, configItem: any) => void;
  onChildSpecToggleExpanded: (childSpecId: string) => void;
  expandedChildSpecs: Set<string>;
  onLoadDetails?: (key: string) => void;
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
  showDetailsInfo = false,
  isConfigExpanded,
  isProductExpanded,
  fieldValues,
  onToggleProductExpanded,
  onToggleConfigExpanded,
  onQuantityChange,
  onConfigFieldChange,
  onChildSpecToggleExpanded,
  expandedChildSpecs,
  onLoadDetails,
}: ProductRowProps) => {
  const productId = extractProductId(product, idPropertyName, `product-${productIndex}`);
  const productName = extractProductName(product, displayPropertyName);
  // Use ProductOffer directly from product (already merged in loadTree if available)
  // Only extract if ProductOffer doesn't exist (fallback for edge cases)
  const productOffer = product[PROPERTY_NAMES.PRODUCT_OFFER] || extractProductOffer(product) || {};
  const productType = productOffer[PROPERTY_NAMES.PRODUCT_TYPE] || product[PROPERTY_NAMES.TYPE] || '';
  const configSectionId = generateConfigNodeId(productId);

  // Get the main child specification (e.g., "Broadband connection")
  const mainChildSpec = getMainChildSpec(productOffer);
  const configuration = mainChildSpec?.[PROPERTY_NAMES.CONFIGURATION] || [];
  const childSpecifications = mainChildSpec?.[PROPERTY_NAMES.CHILD_SPECIFICATIONS_LIST] || [];

  // Check if mainChildSpec name matches product name - if so, skip the intermediate node
  const shouldSkipConfigHeader =
    mainChildSpec?.[PROPERTY_NAMES.SPEC_NAME] &&
    mainChildSpec[PROPERTY_NAMES.SPEC_NAME].trim().toLowerCase() === productName.trim().toLowerCase();

  // Collect all Configuration arrays from nested ChildSpecificationsList items
  const allConfigurations: Array<{ spec: any; config: any[] }> = [];
  if (mainChildSpec?.[PROPERTY_NAMES.CONFIGURATION]) {
    allConfigurations.push({ spec: mainChildSpec, config: mainChildSpec[PROPERTY_NAMES.CONFIGURATION] });
  }

  if (childSpecifications.length > 0) {
    allConfigurations.push(...collectConfigurations(childSpecifications));
  }

  // Also check all child specs in the main list
  const childSpecsList = productOffer[PROPERTY_NAMES.CHILD_SPECIFICATIONS_LIST] || [];
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
  const mainSpecLabelId = `${configSectionId}-main-spec-label`;

  return (
    <ProductContainer key={productId}>
      {/* Product Header Row */}
      <ProductHeader>
        <ProductExpandIcon
          name='caret-right'
          $isExpanded={isProductExpanded}
          onClick={() => onToggleProductExpanded(productId)}
        />
        <ProductInfoContainer container={{ direction: 'column', gap: 0.5 }}>
          {showDetailsInfo && onLoadDetails ? (
            <Button
              variant='link'
              type='button'
              onClick={() => onLoadDetails(productId)}
              aria-label={`View details for product ${productName}`}
            >
              <Flex container={{ direction: 'column', gap: 0.5, alignItems: 'start' }}>
                <Text variant='h4'>{productName}</Text>
                <Text variant='secondary'>
                  {productId} | Product specification type {productType}
                </Text>
              </Flex>
            </Button>
          ) : (
            <>
              <Text variant='h4'>{productName}</Text>
              <Text variant='secondary'>
                {productId} | Product specification type {productType}
              </Text>
            </>
          )}
        </ProductInfoContainer>
      </ProductHeader>

      {/* Configuration Section Row */}
      {isProductExpanded && mainChildSpec && (
        <>
          {/* Only show configuration section header if names don't match */}
          {!shouldSkipConfigHeader && (
            <ConfigSectionHeader $paddingLeft={getDepthPadding(1)} $showBorder={isConfigExpanded}>
              <Flex container={{ gap: 1, alignItems: 'center' }}>
                <ConfigExpandIcon
                  name='caret-right'
                  $isExpanded={isConfigExpanded}
                  onClick={() => onToggleConfigExpanded(configSectionId)}
                />
                <Text variant='secondary'>
                  <ConfigSectionTitle>{mainChildSpec[PROPERTY_NAMES.SPEC_NAME] || 'Configuration'}</ConfigSectionTitle>
                </Text>
              </Flex>
            </ConfigSectionHeader>
          )}

          {/* Nested Configuration Fields Rows */}
          {/* When skipping header, show children directly when product is expanded */}
          {(shouldSkipConfigHeader ? isProductExpanded : isConfigExpanded) && (
            <>
              {/* Main spec itself as first row (e.g., "Broadband connection": "1") */}
              {/* Skip if mainChildSpec has the same name as the product - show its children directly instead */}
              {/* Also skip quantity dropdown if mainChildSpec has children (Configuration or ChildSpecificationsList) */}
              {mainChildSpec[PROPERTY_NAMES.SPEC_NAME] &&
                mainChildSpec[PROPERTY_NAMES.SPEC_NAME].trim().toLowerCase() !== productName.trim().toLowerCase() && (
                  <MainSpecRow $paddingLeft={getDepthPadding(shouldSkipConfigHeader ? 1 : 2)}>
                    <SpecNameLabel id={mainSpecLabelId}>{mainChildSpec[PROPERTY_NAMES.SPEC_NAME]}</SpecNameLabel>
                    <FieldContainer>
                      {/* Only show quantity dropdown if mainChildSpec has no children */}
                      {(() => {
                        const hasConfiguration = (mainChildSpec[PROPERTY_NAMES.CONFIGURATION] || []).length > 0;
                        const hasChildSpecs =
                          (mainChildSpec[PROPERTY_NAMES.CHILD_SPECIFICATIONS_LIST] || []).length > 0;
                        const hasChildren = hasConfiguration || hasChildSpecs;

                        // If it has children, don't show quantity dropdown
                        if (hasChildren) {
                          return null;
                        }

                        // Otherwise show quantity dropdown
                        if (readOnly) {
                          return (
                            <Text variant='secondary'>
                              {fieldValues.get(`${configSectionId}-main-spec`) || extractQuantity(mainChildSpec) || '1'}
                            </Text>
                          );
                        } else {
                          const mainSpecId = `${configSectionId}-main-spec`;
                          const currentQuantity = fieldValues.has(mainSpecId)
                            ? fieldValues.get(mainSpecId) || '1'
                            : extractQuantity(mainChildSpec) || '1';
                          const maxCardinality = parseInt(
                            mainChildSpec[PROPERTY_NAMES.MAX_CARDINALITY] ||
                              TREE_CONSTANTS.DEFAULT_MAX_CARDINALITY.toString(),
                            10,
                          );
                          const field = createFieldConfig(
                            'Dropdown',
                            currentQuantity,
                            generateQuantityOptions(maxCardinality),
                          );
                          field.ariaLabelledById = mainSpecLabelId;
                          field.onChange = (newValue: string) => {
                            onQuantityChange(mainSpecId, newValue, mainChildSpec);
                          };
                          return <FieldComponent field={field} />;
                        }
                      })()}
                    </FieldContainer>
                  </MainSpecRow>
                )}

              {/* Configuration Fields as nested rows - from main spec */}
              {configuration.map((configItem: any, index: number) => {
                const fieldId = generateConfigFieldId(configSectionId, index);
                // Ensure pxPropertyPath is set on configItem if missing
                // Construct from parent spec's path if available
                if (!configItem[PROPERTY_NAMES.PX_PROPERTY_PATH] && mainChildSpec?.[PROPERTY_NAMES.PX_PROPERTY_PATH]) {
                  const parentPath = mainChildSpec[PROPERTY_NAMES.PX_PROPERTY_PATH];
                  // Construct path: parentPath.Configuration[index].ConfiguredFieldValue
                  configItem[PROPERTY_NAMES.PX_PROPERTY_PATH] =
                    `${parentPath}.${PROPERTY_NAMES.CONFIGURATION}[${index}].${PROPERTY_NAMES.CONFIGURED_FIELD_VALUE}`;
                }
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
                    expandedChildSpecs={expandedChildSpecs}
                    showDetailsInfo={showDetailsInfo}
                    onQuantityChange={onQuantityChange}
                    onToggleExpanded={onChildSpecToggleExpanded}
                    onConfigFieldChange={onConfigFieldChange}
                    onLoadDetails={onLoadDetails}
                  />
                );
              })}

              {/* Configuration Fields from all other nested specs */}
              {allConfigurations
                .filter(({ spec }) => spec !== mainChildSpec && !childSpecifications.includes(spec))
                .map(({ spec, config }, groupIndex) => {
                  return (
                    <div key={`config-group-${groupIndex}`}>
                      {config.map((configItem: any, configIndex: number) => {
                        // Generate a unique field ID for nested configurations
                        const fieldId = `${configSectionId}-nested-${groupIndex}-field-${configIndex}`;
                        // Ensure pxPropertyPath is set on configItem if missing
                        // Construct from parent spec's path if available
                        if (!configItem[PROPERTY_NAMES.PX_PROPERTY_PATH] && spec?.[PROPERTY_NAMES.PX_PROPERTY_PATH]) {
                          const parentPath = spec[PROPERTY_NAMES.PX_PROPERTY_PATH];
                          // Construct path: parentPath.Configuration[index].ConfiguredFieldValue
                          configItem[PROPERTY_NAMES.PX_PROPERTY_PATH] =
                            `${parentPath}.${PROPERTY_NAMES.CONFIGURATION}[${configIndex}].${PROPERTY_NAMES.CONFIGURED_FIELD_VALUE}`;
                        }
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
    </ProductContainer>
  );
};
