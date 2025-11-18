import { useCallback, useRef, useEffect } from 'react';
import { withConfiguration, Flex, Card, Text, Progress, registerIcon } from '@pega/cosmos-react-core';
import { type CustomTreeNode } from './CustomTree.types';
import {
  generateNodeId,
  generateConfigNodeId,
  generateConfigFieldId,
  generateChildSpecId,
  generateConfigFieldIdFromItem,
  extractNodeLabel,
  extractNodeClass,
  extractWorkId,
  generateLinkURL,
  extractChildren,
  extractProductId,
  generateConfigNodeId as genConfigNodeId,
  getMainChildSpec,
} from './utils';
import { useExpandedState } from './hooks/useExpandedState';
import { useFieldValues } from './hooks/useFieldValues';
import { useCPQTreeData } from './hooks/useCPQTreeData';
import { ProductRow } from './components/ProductRow';
import '../shared/create-nonce';
import * as caretRightIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/caret-right.icon';

registerIcon(caretRightIcon);

export type CPQTreeProps = {
  heading?: string;
  dataPage: string;
  childrenPropertyName?: string | RegExp;
  displayPropertyName?: string;
  idPropertyName?: string;
  readOnly?: boolean;
  getPConnect: any;
};

export const PegaExtensionsCPQTree = (props: CPQTreeProps) => {
  const {
    dataPage = '',
    childrenPropertyName = 'Tree|Configuration',
    displayPropertyName = 'Name',
    idPropertyName = 'ProductID',
    readOnly = false,
    getPConnect,
  } = props;
  console.log('readOnly', readOnly);
  const heading = props.heading ?? getPConnect().getLocalizedValue('Site independent products');

  // Custom hooks for state management
  const expandedState = useExpandedState();
  const fieldValuesHook = useFieldValues(idPropertyName);

  // Ref to track if data has been initialized to prevent re-initialization
  const dataInitializedRef = useRef(false);

  // Handler for configuration field changes
  const handleConfigFieldChange = (fieldId: string, newValue: string, configItem: any) => {
    fieldValuesHook.updateFieldValue(fieldId, newValue);

    // Update the underlying data structure
    if (configItem) {
      if (!configItem.ConfiguredFieldValue) {
        configItem.ConfiguredFieldValue = {};
      }
      configItem.ConfiguredFieldValue.FieldValue = newValue;
    }

    // Trigger PConnect field change if available
    try {
      const actionsApi = getPConnect().getActionsApi();
      if (actionsApi && actionsApi.triggerFieldChange) {
        // Note: In a real Pega environment, you would need the proper property reference
        // For now, we just update the local state
      }
    } catch {
      // Ignore errors in Storybook/mock environment
    }
  };

  // Handler for quantity field changes (child specs and main spec)
  const handleQuantityChange = (fieldId: string, newValue: string, specItem: any) => {
    fieldValuesHook.updateFieldValue(fieldId, newValue);

    // Update the underlying data structure
    if (specItem) {
      specItem.quantity = newValue;
      specItem.Quantity = newValue;
    }

    // Trigger PConnect field change if available
    try {
      const actionsApi = getPConnect().getActionsApi();
      if (actionsApi && actionsApi.triggerFieldChange) {
        // Note: In a real Pega environment, you would need the proper property reference
        // For now, we just update the local state
      }
    } catch {
      // Ignore errors in Storybook/mock environment
    }
  };

  // Tree loading logic
  const loadTree = useCallback(
    (
      item: any,
      cases: Array<CustomTreeNode>,
      caseInstanceKey: string,
      visitedItems: WeakSet<object> = new WeakSet(),
      depth: number = 0,
    ) => {
      const TREE_CONSTANTS = { MAX_DEPTH: 100 };
      if (depth > TREE_CONSTANTS.MAX_DEPTH) {
        console.warn('loadTree - Maximum depth reached, stopping to prevent infinite loop.');
        return;
      }

      if (visitedItems.has(item)) {
        console.warn('loadTree - Circular reference detected for item object. Skipping to prevent infinite loop.');
        return;
      }

      const nodeId = generateNodeId(item, idPropertyName);
      visitedItems.add(item);

      const childcases: Array<CustomTreeNode> = [];

      // For product nodes, add configuration section as a child
      if (item.Type === 'product' && item.ProductOffer) {
        const productOffer = item.ProductOffer || {};
        const mainChildSpec = getMainChildSpec(productOffer);

        if (mainChildSpec) {
          const configNodeId = generateConfigNodeId(nodeId);
          const configLabel = mainChildSpec.SpecName || 'Configuration';

          // Create configuration fields as child nodes
          const configChildren: Array<CustomTreeNode> = [];

          // Add configuration items as nodes
          const configuration = mainChildSpec.Configuration || [];
          configuration.forEach((configItem: any, index: number) => {
            const fieldName = configItem.FieldName || configItem.Name || `Config-${index}`;
            const fieldId = generateConfigFieldId(configNodeId, index);
            configChildren.push({
              id: fieldId,
              label: fieldName,
              objclass: 'ConfigurationField',
              expanded: false,
              href: '',
              itemData: { ...configItem, isConfigField: true },
            });
          });

          // Add child specifications as nodes
          const childSpecifications = mainChildSpec.ChildSpecificationsList || [];
          childSpecifications.forEach((childSpec: any, index: number) => {
            const specName = childSpec.SpecName || childSpec.Name || `Spec-${index}`;
            const specId = generateChildSpecId(configNodeId, index);
            configChildren.push({
              id: specId,
              label: specName,
              objclass: 'ChildSpecification',
              expanded: false,
              href: '',
              itemData: { ...childSpec, isChildSpec: true },
            });
          });

          // Add configuration node as a child of the product
          childcases.push({
            id: configNodeId,
            label: configLabel,
            objclass: 'Configuration',
            expanded: true,
            href: '',
            itemData: { ...mainChildSpec, isConfigSection: true },
            nodes: configChildren.length > 0 ? configChildren : undefined,
          });
        }
      }

      // Handle configurable children structure (for nested specs)
      const children = extractChildren(item, childrenPropertyName);
      const parentName = extractNodeLabel(item, displayPropertyName);

      if (children && Array.isArray(children) && children.length > 0) {
        children.forEach((childcase: any) => {
          // Skip if it's a product type (already handled above)
          if (childcase.Type !== 'product') {
            // Check if this is a Configuration item (has FieldName property)
            if (childcase.FieldName && childcase.pxObjClass?.includes('ProductConfigItem')) {
              // Handle Configuration items as leaf nodes
              const configFieldId = generateConfigFieldIdFromItem(nodeId, childcase);
              const configFieldLabel = childcase.FieldName || 'Unknown Field';
              childcases.push({
                id: configFieldId,
                label: configFieldLabel,
                objclass: childcase.pxObjClass || 'ConfigurationField',
                expanded: false,
                href: '',
                itemData: { ...childcase, isConfigField: true },
              });
            } else {
              // Check if child has the same name as parent and is not a product
              const childName = extractNodeLabel(childcase, displayPropertyName);
              const isDuplicateName =
                childName && parentName && childName.trim().toLowerCase() === parentName.trim().toLowerCase();

              if (isDuplicateName && childcase.Type !== 'product') {
                // Skip the duplicate node and process its children directly
                const childChildren = extractChildren(childcase, childrenPropertyName);
                if (childChildren && Array.isArray(childChildren) && childChildren.length > 0) {
                  childChildren.forEach((grandchild: any) => {
                    if (grandchild.Type !== 'product') {
                      if (grandchild.FieldName && grandchild.pxObjClass?.includes('ProductConfigItem')) {
                        const configFieldId = generateConfigFieldIdFromItem(nodeId, grandchild);
                        const configFieldLabel = grandchild.FieldName || 'Unknown Field';
                        childcases.push({
                          id: configFieldId,
                          label: configFieldLabel,
                          objclass: grandchild.pxObjClass || 'ConfigurationField',
                          expanded: false,
                          href: '',
                          itemData: { ...grandchild, isConfigField: true },
                        });
                      } else {
                        loadTree(grandchild, childcases, caseInstanceKey, visitedItems, depth + 1);
                      }
                    }
                  });
                }
              } else {
                // Regular tree node - process recursively
                loadTree(childcase, childcases, caseInstanceKey, visitedItems, depth + 1);
              }
            }
          }
        });
      }

      const nodeLabel = extractNodeLabel(item, displayPropertyName);
      const nodeClass = extractNodeClass(item);
      const workId = extractWorkId(item, idPropertyName);
      const linkURL = generateLinkURL(nodeClass, workId, caseInstanceKey, nodeId);

      const node = {
        id: nodeId,
        label: nodeLabel,
        objclass: nodeClass,
        expanded: true,
        href: linkURL,
        itemData: item,
        ...(childcases.length > 0 ? { nodes: childcases } : null),
      };
      cases.push(node);
    },
    [childrenPropertyName, displayPropertyName, idPropertyName],
  );

  // Data loading callback to initialize field values and expanded state
  const handleDataLoaded = useCallback(
    (nodes: CustomTreeNode[]) => {
      // Prevent re-initialization if data has already been loaded
      if (dataInitializedRef.current) {
        return;
      }

      dataInitializedRef.current = true;

      // Initialize field values
      fieldValuesHook.initializeFieldValues(nodes);

      // Expand all configuration sections and products by default
      const configSectionIds = new Set<string>();
      const productIds = new Set<string>();
      nodes.forEach((node) => {
        if (node.itemData && node.itemData.Type === 'product') {
          const productId = extractProductId(node.itemData, idPropertyName, node.id);
          if (productId) {
            configSectionIds.add(genConfigNodeId(productId));
            productIds.add(productId);
          }
        }
      });
      expandedState.setExpandedConfigSectionsInitial(configSectionIds);
      expandedState.setExpandedProductsInitial(productIds);
    },
    [
      fieldValuesHook.initializeFieldValues,
      expandedState.setExpandedConfigSectionsInitial,
      expandedState.setExpandedProductsInitial,
      idPropertyName,
    ],
  );

  // Reset initialization flag when dataPage changes
  const prevDataPageRef = useRef(dataPage);
  useEffect(() => {
    if (prevDataPageRef.current !== dataPage) {
      prevDataPageRef.current = dataPage;
      dataInitializedRef.current = false;
    }
  }, [dataPage]);

  // Data loading with callback to initialize field values and expanded state
  const { objects, loading } = useCPQTreeData(
    dataPage,
    getPConnect,
    loadTree,
    childrenPropertyName,
    idPropertyName,
    handleDataLoaded,
  );

  if (loading) {
    return (
      <Progress
        placement='local'
        message={
          (window as any).PCore?.getLocaleUtils()?.getLocaleValue(
            'Loading content...',
            'Generic',
            '@BASECLASS!GENERIC!PYGENERICFIELDS',
          ) || 'Loading content...'
        }
      />
    );
  }

  return (
    <Card style={{ padding: '16px' }}>
      {/* Header */}
      <Flex container={{ justify: 'between', alignItems: 'center' }}>
        <Flex container={{ gap: 1, alignItems: 'center' }}>
          <Text variant='h3'>{heading}</Text>
        </Flex>
      </Flex>

      {/* Products List with Nested Tree Structure */}
      <div>
        {objects.map((node, index) => {
          if (node.itemData && node.itemData.Type === 'product') {
            const productId = extractProductId(node.itemData, idPropertyName, node.id);
            const configSectionId = genConfigNodeId(productId);
            return (
              <ProductRow
                key={node.id}
                product={node.itemData}
                productIndex={index}
                idPropertyName={idPropertyName}
                displayPropertyName={displayPropertyName}
                readOnly={readOnly}
                isConfigExpanded={expandedState.expandedConfigSections.has(configSectionId)}
                isProductExpanded={expandedState.expandedProducts.has(productId)}
                fieldValues={fieldValuesHook.fieldValues}
                onToggleProductExpanded={expandedState.toggleProductExpanded}
                onToggleConfigExpanded={expandedState.toggleConfigExpanded}
                onQuantityChange={handleQuantityChange}
                onConfigFieldChange={handleConfigFieldChange}
                onChildSpecToggleExpanded={expandedState.toggleChildSpecExpanded}
                expandedChildSpecs={expandedState.expandedChildSpecs}
              />
            );
          }
          return null;
        })}
      </div>
    </Card>
  );
};
export default withConfiguration(PegaExtensionsCPQTree);
