import { useMemo, useState } from 'react';
import { withConfiguration, Flex, Text, Progress, registerIcon, Button, Icon } from '@pega/cosmos-react-core';
import { extractProductId, generateConfigNodeId, loadDetails, findNodeById } from './utils';
import { PROPERTY_NAMES, NODE_TYPES } from './constants';
import { useExpandedState } from './hooks/useExpandedState';
import { useFieldValues } from './hooks/useFieldValues';
import { useCPQTreeData } from './hooks/useCPQTreeData';
import { useTreeBuilder } from './hooks/useTreeBuilder';
import { useTreeActions } from './hooks/useTreeActions';
import { ProductRow } from './components/ProductRow';
import {
  StyledCard,
  MasterDetailsLayout,
  ProductsListContainer,
  DetailsPanelContainer,
  DetailsCloseButtonContainer,
} from './styles';
import '../shared/create-nonce';
import * as caretRightIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/caret-right.icon';
import * as informationIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/information.icon';
import * as listIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/list.icon';
import * as timesIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/times.icon';

registerIcon(caretRightIcon, informationIcon, listIcon, timesIcon);

export type CPQTreeProps = {
  heading?: string;
  dataPage: string;
  childrenPropertyName?: string | RegExp;
  displayPropertyName?: string;
  idPropertyName?: string;
  showDetailsInfo?: boolean;
  readOnly?: boolean;
  detailsDataPage?: string;
  detailsViewName?: string;
  getPConnect: any;
};

export const PegaExtensionsCPQTree = (props: CPQTreeProps) => {
  const {
    dataPage = '',
    childrenPropertyName = 'Tree|Configuration',
    displayPropertyName = 'Name',
    idPropertyName = 'ProductID',
    showDetailsInfo = false,
    readOnly = false,
    detailsDataPage = 'D_Details',
    detailsViewName = 'InfoDetails',
    getPConnect,
  } = props;
  const heading = props.heading ?? getPConnect().getLocalizedValue('Site independent products');

  // State for details panel
  const [selectedProductKey, setSelectedProductKey] = useState<string | null>(null);
  const [detailsContent, setDetailsContent] = useState<React.ReactNode | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Custom hooks for state management
  const expandedState = useExpandedState();
  const fieldValuesHook = useFieldValues(idPropertyName);

  // Tree building hook
  const { loadTree } = useTreeBuilder(childrenPropertyName, displayPropertyName, idPropertyName, getPConnect);

  // Handle loading details
  const handleLoadDetails = async (key: string) => {
    setLoadingDetails(true);
    setSelectedProductKey(key);
    try {
      // Find the selected node in the tree first
      const nodeData = findNodeById(objects, key);

      const details = await loadDetails({
        id: key,
        classname: 'PegaComm-FW-CPQ-Data-Tree',
        detailsDataPage,
        detailsViewName,
        getPConnect,
        nodeData, // Pass the node's itemData directly
      });
      setDetailsContent(details);
    } catch (error) {
      console.error('Error loading details:', error);
      setDetailsContent(<Text>Error loading details</Text>);
    } finally {
      setLoadingDetails(false);
    }
  };

  // Handle closing details
  const handleCloseDetails = () => {
    setSelectedProductKey(null);
    setDetailsContent(null);
  };

  // Data initialization config - memoized to prevent unnecessary re-renders
  const initConfig = useMemo(
    () => ({
      idPropertyName,
      initializeFieldValues: fieldValuesHook.initializeFieldValues,
      setExpandedConfigSectionsInitial: expandedState.setExpandedConfigSectionsInitial,
      setExpandedProductsInitial: expandedState.setExpandedProductsInitial,
    }),
    [
      idPropertyName,
      fieldValuesHook.initializeFieldValues,
      expandedState.setExpandedConfigSectionsInitial,
      expandedState.setExpandedProductsInitial,
    ],
  );

  // Data loading with automatic initialization
  const { objects, loading, reloadTree } = useCPQTreeData(dataPage, getPConnect, loadTree, childrenPropertyName, initConfig);

  // Tree actions hook - pass reloadTree to enable tree reload after save
  const { handleConfigFieldChange, handleQuantityChange } = useTreeActions({
    getPConnect,
    updateFieldValue: fieldValuesHook.updateFieldValue,
    dataPage,
    reloadTree,
  });

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
    <StyledCard>
      {/* Header */}
      <Flex container={{ justify: 'between', alignItems: 'center' }}>
        <Flex container={{ gap: 1, alignItems: 'center' }}>
          <Text variant='h3'>{heading}</Text>
        </Flex>
      </Flex>

      {/* Master/Details Layout */}
      <MasterDetailsLayout container={{ gap: 2 }}>
        {/* Products List with Nested Tree Structure */}
        <ProductsListContainer>
          {objects.map((node, index) => {
            if (node.itemData && node.itemData[PROPERTY_NAMES.TYPE] === NODE_TYPES.PRODUCT) {
              const productId = extractProductId(node.itemData, idPropertyName, node.id);
              const configSectionId = generateConfigNodeId(productId);
              return (
                <ProductRow
                  key={`${node.id}-${index}-${productId}`}
                  product={node.itemData}
                  productIndex={index}
                  idPropertyName={idPropertyName}
                  displayPropertyName={displayPropertyName}
                  readOnly={readOnly}
                  showDetailsInfo={showDetailsInfo}
                  isConfigExpanded={expandedState.expandedConfigSections.has(configSectionId)}
                  isProductExpanded={expandedState.expandedProducts.has(productId)}
                  fieldValues={fieldValuesHook.fieldValues}
                  onToggleProductExpanded={expandedState.toggleProductExpanded}
                  onToggleConfigExpanded={expandedState.toggleConfigExpanded}
                  onQuantityChange={handleQuantityChange}
                  onConfigFieldChange={handleConfigFieldChange}
                  onChildSpecToggleExpanded={expandedState.toggleChildSpecExpanded}
                  expandedChildSpecs={expandedState.expandedChildSpecs}
                  onLoadDetails={handleLoadDetails}
                />
              );
            }
            return null;
          })}
        </ProductsListContainer>

        {/* Details Panel - Only rendered when showDetailsInfo is true */}
        {showDetailsInfo && (
          <DetailsPanelContainer $isVisible={!!selectedProductKey}>
            {selectedProductKey && (
              <>
                <DetailsCloseButtonContainer>
                  <Button
                    variant='simple'
                    label={getPConnect().getLocalizedValue('Close')}
                    icon
                    compact
                    onClick={handleCloseDetails}
                  >
                    <Icon name='times' />
                  </Button>
                </DetailsCloseButtonContainer>
                {loadingDetails ? (
                  <Progress placement='local' message='Loading details...' />
                ) : (
                  <div>{detailsContent}</div>
                )}
              </>
            )}
          </DetailsPanelContainer>
        )}
      </MasterDetailsLayout>
    </StyledCard>
  );
};
export default withConfiguration(PegaExtensionsCPQTree);
