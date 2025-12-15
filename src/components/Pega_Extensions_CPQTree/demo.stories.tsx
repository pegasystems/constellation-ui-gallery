import type { StoryObj } from '@storybook/react-webpack5';
import { FieldValueItem } from '@pega/cosmos-react-core';
import { Details, DetailsList } from '@pega/cosmos-react-work';
import { PegaExtensionsCPQTree, type CPQTreeProps } from './index';
import sampleData1 from './sample1.json';
import sampleData2 from './sample2.json';

// Shared transient data store accessible to both getContainerManager and createComponent
const transientDataStore = new Map<string, any>();
// Store mapping of ID to nodeData for easier lookup
const nodeDataStore = new Map<string, any>();

export default {
  title: 'Fields/CPQ Tree',
  argTypes: {
    Example: {
      options: ['sample1', 'sample2'],
      control: { type: 'radio' },
    },
    dataPage: {
      table: {
        disable: true,
      },
    },
    selectionProperty: {
      table: {
        disable: true,
      },
    },
    childrenPropertyName: {
      table: {
        disable: true,
      },
    },
    displayPropertyName: {
      table: {
        disable: true,
      },
    },
    idPropertyName: {
      table: {
        disable: true,
      },
    },
    getPConnect: {
      table: {
        disable: true,
      },
    },
  },
  parameters: {
    a11y: {
      context: '#storybook-root',
      config: {
        rules: [
          {
            id: 'nested-interactive',
            enabled: false,
          },
        ],
      },
    },
  },
  component: PegaExtensionsCPQTree,
};

const setPCore = (Example: string) => {
  // Use data from sample.json regardless of example selection for now
  let data = {};
  switch (Example) {
    case 'sample1':
      data = sampleData1;
      break;
    case 'sample2':
      data = sampleData2;
      break;
  }

  (window as any).PCore = {
    getLocaleUtils: () => {
      return {
        getLocaleValue: (val: string) => {
          return val;
        },
      };
    },
    createPConnect: (messageConfig?: any) => {
      // Store messageConfig in closure for access in createComponent
      const storedMessageConfig = messageConfig;
      return {
        getPConnect: () => ({
          createComponent: (meta: any) => {
            const id = meta.config.pyID;

            // Try to retrieve node data from transient data store
            let nodeData: any = null;

            // First try: get from contextName if available in meta.options
            const contextName = meta.options?.contextName || meta.options?.context;
            if (contextName && transientDataStore.has(contextName)) {
              const transientItem = transientDataStore.get(contextName);
              nodeData = transientItem?.data?.content || null;
            }

            // Second try: if we have stored messageConfig, try to get contextName from there
            if (!nodeData && storedMessageConfig?.options?.contextName) {
              const msgContextName = storedMessageConfig.options.contextName;
              if (transientDataStore.has(msgContextName)) {
                const transientItem = transientDataStore.get(msgContextName);
                nodeData = transientItem?.data?.content || null;
              }
            }

            // Third try: lookup by ID directly from nodeDataStore
            if (!nodeData && id && nodeDataStore.has(id)) {
              nodeData = nodeDataStore.get(id);
            }

            // Fourth try: search all transient items for matching ID
            if (!nodeData && id) {
              for (const [, value] of transientDataStore.entries()) {
                const itemData = value?.data?.content;
                if (itemData && (itemData.ID === id || itemData.ProductOffer?.ID === id)) {
                  nodeData = itemData;
                  break;
                }
              }
            }

            // Build highlighted data - show Name and ID
            const highlightedData = [];
            if (nodeData?.Name) {
              highlightedData.push(<FieldValueItem key='Name' variant='stacked' name='Name' value={nodeData.Name} />);
            }
            if (id) {
              highlightedData.push(<FieldValueItem key='ID' variant='stacked' name='ID' value={id} />);
            }

            // Build details items from node data if available
            const detailsItems = [];
            if (nodeData) {
              // For product nodes
              if (nodeData.Type === 'product' && nodeData.ProductOffer) {
                if (nodeData.ProductOffer.description) {
                  detailsItems.push({
                    id: 'Description',
                    name: 'Description',
                    value: nodeData.ProductOffer.description,
                  });
                } else if (nodeData.ProductOffer.name) {
                  detailsItems.push({
                    id: 'Description',
                    name: 'Description',
                    value: nodeData.ProductOffer.name,
                  });
                }
                if (nodeData.ProductOffer.status) {
                  detailsItems.push({
                    id: 'Status',
                    name: 'Status',
                    value: nodeData.ProductOffer.status,
                  });
                }
                if (nodeData.ProductOffer.ProductType) {
                  detailsItems.push({
                    id: 'Product Type',
                    name: 'Product Type',
                    value: nodeData.ProductOffer.ProductType,
                  });
                }
                if (nodeData.ProductOffer.quantity) {
                  detailsItems.push({
                    id: 'Quantity',
                    name: 'Quantity',
                    value: String(nodeData.ProductOffer.quantity),
                  });
                }
                if (nodeData.ProductOffer.TotalPOMRC) {
                  detailsItems.push({
                    id: 'Total MRC',
                    name: 'Total MRC',
                    value: String(nodeData.ProductOffer.TotalPOMRC),
                  });
                }
                if (nodeData.ProductOffer.TotalPONRC) {
                  detailsItems.push({
                    id: 'Total NRC',
                    name: 'Total NRC',
                    value: String(nodeData.ProductOffer.TotalPONRC),
                  });
                }
                if (nodeData.ProductOffer.TotalPOPrice) {
                  detailsItems.push({
                    id: 'Total Price',
                    name: 'Total Price',
                    value: String(nodeData.ProductOffer.TotalPOPrice),
                  });
                }
                if (nodeData.ProductOffer.Catalog?.name) {
                  detailsItems.push({
                    id: 'Catalog',
                    name: 'Catalog',
                    value: nodeData.ProductOffer.Catalog.name,
                  });
                }
              }
              // For site nodes
              else if (nodeData.Type === 'site' && nodeData.Site) {
                if (nodeData.Site.FullAddress) {
                  detailsItems.push({
                    id: 'Address',
                    name: 'Address',
                    value: nodeData.Site.FullAddress,
                  });
                }
                if (nodeData.Site.City) {
                  detailsItems.push({
                    id: 'City',
                    name: 'City',
                    value: nodeData.Site.City,
                  });
                }
                if (nodeData.Site.stateOrProvince) {
                  detailsItems.push({
                    id: 'State',
                    name: 'State',
                    value: nodeData.Site.stateOrProvince,
                  });
                }
                if (nodeData.Site.postcode) {
                  detailsItems.push({
                    id: 'Postcode',
                    name: 'Postcode',
                    value: nodeData.Site.postcode,
                  });
                }
                if (nodeData.Site.ConnectivityStatusValue) {
                  detailsItems.push({
                    id: 'Connectivity Status',
                    name: 'Connectivity Status',
                    value: nodeData.Site.ConnectivityStatusValue,
                  });
                }
                if (nodeData.Site.CustomerID) {
                  detailsItems.push({
                    id: 'Customer ID',
                    name: 'Customer ID',
                    value: nodeData.Site.CustomerID,
                  });
                }
                if (nodeData.TotalSiteMRC) {
                  detailsItems.push({
                    id: 'Total Site MRC',
                    name: 'Total Site MRC',
                    value: String(nodeData.TotalSiteMRC),
                  });
                }
                if (nodeData.TotalSiteNRC) {
                  detailsItems.push({
                    id: 'Total Site NRC',
                    name: 'Total Site NRC',
                    value: String(nodeData.TotalSiteNRC),
                  });
                }
              }
              // For child spec nodes (have SpecCategory, SpecID, SpecName)
              if (nodeData.SpecCategory || nodeData.SpecID || nodeData.SpecName) {
                if (nodeData.SpecName) {
                  detailsItems.push({
                    id: 'Spec Name',
                    name: 'Spec Name',
                    value: nodeData.SpecName,
                  });
                }
                if (nodeData.SpecID) {
                  detailsItems.push({
                    id: 'Spec ID',
                    name: 'Spec ID',
                    value: nodeData.SpecID,
                  });
                }
                if (nodeData.SpecCategory) {
                  detailsItems.push({
                    id: 'Spec Category',
                    name: 'Spec Category',
                    value: nodeData.SpecCategory,
                  });
                }
                if (nodeData.Version) {
                  detailsItems.push({
                    id: 'Version',
                    name: 'Version',
                    value: String(nodeData.Version),
                  });
                }
                if (nodeData.quantity) {
                  detailsItems.push({
                    id: 'Quantity',
                    name: 'Quantity',
                    value: String(nodeData.quantity),
                  });
                }
                if (nodeData.MinCardinality !== undefined) {
                  detailsItems.push({
                    id: 'Min Cardinality',
                    name: 'Min Cardinality',
                    value: String(nodeData.MinCardinality),
                  });
                }
                if (nodeData.MaxCardinality !== undefined) {
                  detailsItems.push({
                    id: 'Max Cardinality',
                    name: 'Max Cardinality',
                    value: String(nodeData.MaxCardinality),
                  });
                }
              }
              // For other node types or fallback
              else {
                if (nodeData.Type) {
                  detailsItems.push({
                    id: 'Type',
                    name: 'Type',
                    value: nodeData.Type,
                  });
                }
                if (nodeData.ProductCount) {
                  detailsItems.push({
                    id: 'Product Count',
                    name: 'Product Count',
                    value: String(nodeData.ProductCount),
                  });
                }
                if (nodeData.TotalSiteMRC) {
                  detailsItems.push({
                    id: 'Total Site MRC',
                    name: 'Total Site MRC',
                    value: String(nodeData.TotalSiteMRC),
                  });
                }
                if (nodeData.TotalSiteNRC) {
                  detailsItems.push({
                    id: 'Total Site NRC',
                    name: 'Total Site NRC',
                    value: String(nodeData.TotalSiteNRC),
                  });
                }
              }
            }

            // Fallback to default items if no node data available
            if (detailsItems.length === 0) {
              detailsItems.push({
                id: 'Description',
                name: 'Description',
                value: 'No data available',
              });
            }

            return (
              <Details
                name='Details'
                highlightedData={highlightedData}
                collapsible={false}
                columns={{
                  a: <DetailsList items={detailsItems} />,
                }}
              />
            );
          },
        }),
      };
    },
    getComponentsRegistry: () => {
      return {
        getLazyComponent: (f: string) => f,
      };
    },
    getViewResources: () => {
      return {
        fetchViewResources: () => {
          return {
            config: {
              showLabel: true,
            },
          };
        },
        updateViewResources: () => {},
      };
    },
    getConstants: () => {
      return {
        CASE_INFO: {
          AVAILABLEACTIONS: '',
          CASE_INFO_ID: 'CASE_INFO_ID',
        },
      };
    },
    getEnvironmentInfo: () => {
      return {
        getTimeZone: () => 'local',
      };
    },
    getEvents: () => {
      return {
        getCaseEvent: () => {
          return {
            ASSIGNMENT_SUBMISSION: 'ASSIGNMENT_SUBMISSION',
          };
        },
      };
    },
    getPubSubUtils: () => {
      return {
        subscribe: () => {
          /* nothing */
        },
        unsubscribe: () => {
          /* nothing */
        },
      };
    },
    getSemanticUrlUtils: () => {
      return {
        getResolvedSemanticURL: () => {
          return window.location.href;
        },
        getActions: () => {
          return {
            ACTION_OPENWORKBYHANDLE: 'openWorkByHandle',
          };
        },
      };
    },
    getDataApiUtils: () => {
      return {
        getDataObjectView: () => {
          return Promise.resolve({
            data: {
              data: {},
            },
          });
        },
        getData: (dataPage: string, payload: any) => {
          console.log('getData', dataPage, payload);
          return Promise.resolve({ data: { data: [data] } });
        },
      };
    },
  };
};

interface CPQTreePropsExt extends CPQTreeProps {
  Example: string;
}

type Story = StoryObj<CPQTreePropsExt>;
export const Default: Story = {
  render: (args: CPQTreePropsExt) => {
    setPCore(args.Example);
    const props = {
      ...args,
      // Use Example as dataPage to force reset when example changes
      dataPage: args.Example,
      getPConnect: () => {
        return {
          getLocalizedValue: (val: string) => {
            return val;
          },
          getContextName: () => '',
          getValue: (key?: string) => {
            if (key === 'CASE_INFO_ID') {
              return 'test-case-instance-key';
            }
            return [{ ID: 'pyEditDetails', name: 'Edit Details' }];
          },

          getActionsApi: () => {
            return {
              openWorkByHandle: () => {
                /* nothing */
              },
              updateFieldValue: () => {
                /* nothing */
              },
              triggerFieldChange: () => {
                /* nothing */
              },
              showCasePreview: () => {
                /* nothing */
              },
            };
          },
          ignoreSuggestion: () => {
            /* nothing */
          },
          acceptSuggestion: () => {
            /* nothing */
          },
          setInheritedProps: () => {
            /* nothing */
          },
          resolveConfigProps: () => {
            /* nothing */
          },
          getContainerManager: () => {
            return {
              addTransientItem: (item: any) => {
                const id = item.id || `transient-${Date.now()}`;
                transientDataStore.set(id, { ...item, data: item.data || {} });
                return id;
              },
              updateTransientData: ({ transientItemID, data }: any) => {
                if (transientDataStore.has(transientItemID)) {
                  const item = transientDataStore.get(transientItemID);
                  transientDataStore.set(transientItemID, { ...item, data });
                } else {
                  // If item doesn't exist, create it
                  transientDataStore.set(transientItemID, { id: transientItemID, data });
                }

                // Also store nodeData by ID for easier lookup
                // The transientItemID format is: `${detailsViewName}${id}`
                // Extract the ID part (everything after the view name)
                if (data?.content) {
                  const nodeData = data.content;
                  // Try to extract ID from transientItemID or use nodeData.ID
                  const nodeId = nodeData.ID || transientItemID.replace(/^InfoDetails/, '');
                  if (nodeId) {
                    nodeDataStore.set(nodeId, nodeData);
                  }
                }
              },
            };
          },
        };
      },
    };
    return <PegaExtensionsCPQTree {...props} />;
  },
  args: {
    Example: 'sample1',
    dataPage: '',
    heading: 'CPQ Tree',
    showDetailsInfo: false,
    detailsDataPage: 'D_Details',
    detailsViewName: 'InfoDetails',
    readOnly: false,
    childrenPropertyName: 'Tree|Configuration',
  },
};
