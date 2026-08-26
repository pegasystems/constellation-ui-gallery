import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Text } from '@pega/cosmos-react-core';
import { PegaExtensionsExpandableTable, type ExpandableTableProps } from './index';

type configInfo = {
  value?: Array<any>;
  componentType?: string;
  label?: string;
  heading?: string;
  name?: string;
};

type info = {
  config: configInfo;
  type: string;
  children?: Array<info>;
};

const meta: Meta<typeof PegaExtensionsExpandableTable> = {
  title: 'Templates/Expandable Table',
  tags: ['Pega_Extensions_ExpandableTable'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['table', 'list', 'tabs'],
      labels: {
        table: 'Table',
        list: 'List',
        tabs: 'Tabs',
      },
      description: 'Layout variant: expandable table, accordion list, or category tabs',
    },
    detailViewName: {
      control: 'text',
      description: 'Name of the Pega view to render when a row is expanded',
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
            id: 'autocomplete-valid',
            enabled: false,
          },
        ],
      },
    },
  },
  component: PegaExtensionsExpandableTable,
};

export default meta;

const genResponse = () => {
  const demoView = {
    name: 'demoView',
    type: 'View',
    config: {
      template: 'ExpandableTable',
      ruleClass: 'Work-',
      inheritedProps: { label: 'Computer inventory' },
    },
    children: [
      {
        name: 'A',
        type: 'Region',
        children: [] as Array<info>,
        getPConnect: () => {},
      },
    ],
    classID: 'Work-MyComponents',
  };

  demoView.children[0].children = [
    {
      config: {
        value: ['HP EliteBook', 'Lenovo ThinkPad', 'Apple MacBook'],
        componentType: 'TextInput',
        label: 'Brand',
      },
      type: 'ScalarList',
    },
    {
      config: {
        value: ['16 GB', '8 GB', '16 GB'],
        componentType: 'TextInput',
        label: 'Memory',
      },
      type: 'ScalarList',
    },
    {
      config: {
        value: ['Intel i7', 'Intel i5', 'Apple M3'],
        componentType: 'TextInput',
        label: 'Processor',
      },
      type: 'ScalarList',
    },
    {
      config: {
        value: [1200.0, 1345.0, 1499.0],
        componentType: 'Currency',
        label: 'Price',
      },
      type: 'ScalarList',
    },
    {
      config: {
        value: ['Available', 'In Use', 'Available'],
        componentType: 'TextInput',
        label: 'Status',
      },
      type: 'ScalarList',
    },
  ];

  demoView.children[0].getPConnect = () => {
    return {
      getRawMetadata: () => {
        return demoView.children[0];
      },
    };
  };
  return demoView;
};

/** Mock detail content rendered in the expanded row */
const MockDetailView = ({ rowIndex, viewName }: { rowIndex: number; viewName: string }) => {
  const brands = ['HP EliteBook', 'Lenovo ThinkPad', 'Apple MacBook'];
  const serials = ['S-1001', 'S-2042', 'S-3087'];
  const locations = ['New York', 'London', 'San Francisco'];
  const assignees = ['Alice Johnson', 'Bob Smith', 'Carol Williams'];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem 2rem', padding: '0.5rem 0' }}>
      <Text>
        <strong>View:</strong> {viewName || 'ComputerDetails'}
      </Text>
      <Text>
        <strong>Device:</strong> {brands[rowIndex] ?? ''}
      </Text>
      <Text>
        <strong>Serial number:</strong> {serials[rowIndex] ?? ''}
      </Text>
      <Text>
        <strong>Location:</strong> {locations[rowIndex] ?? ''}
      </Text>
      <Text>
        <strong>Assigned to:</strong> {assignees[rowIndex] ?? ''}
      </Text>
    </div>
  );
};

type Story = StoryObj<typeof PegaExtensionsExpandableTable>;

export const Default: Story = {
  render: (args: ExpandableTableProps) => {
    window.PCore = {
      getLocaleUtils: () => ({
        getLocaleValue: (val: string) => val,
      }),
      getConstants: () => ({
        CASE_INFO: {
          CASE_INFO_ID: 'caseInfo.ID',
        },
      }),
      getContextTreeManager: () => ({
        addPageListNode: () => {},
      }),
      getViewResources: () => ({
        fetchViewResources: (name: string, _pConnect: any, ruleClass: string) => ({
          type: 'View',
          config: {
            name,
            ruleClass,
          },
        }),
        updateViewResources: () => Promise.resolve(),
      }),
      getRestClient: () => ({
        invokeRestApi: () =>
          Promise.resolve({
            data: {
              uiResources: {
                root: {
                  config: { name: args.detailViewName },
                },
              },
            },
          }),
      }),
      getStore: () => ({
        getState: () => ({
          data: {
            workarea: {
              caseInfo: {
                content: {
                  computers: [
                    { pxObjClass: 'Data-Computer' },
                    { pxObjClass: 'Data-Computer' },
                    { pxObjClass: 'Data-Computer' },
                  ],
                },
              },
            },
          },
        }),
        subscribe: () => () => {},
      }),
      createPConnect: (context: any) => ({
        getPConnect: () =>
          ({
            createComponent: (f: any) => {
              if (f.type === 'View' || f.config?.name) {
                const pageRef: string = context.options.pageReference ?? '';
                const match = pageRef.match(/\[(\d+)\]/);
                const rowIndex = match ? parseInt(match[1], 10) : 0;
                return <MockDetailView rowIndex={rowIndex} viewName={f.config?.name ?? ''} />;
              }
              const pageRef: string = context.options.pageReference ?? '';
              const match = pageRef.match(/\[(\d+)\]/);
              const rowIndex = match ? parseInt(match[1], 10) : 0;
              const val = Array.isArray(context.meta.config.value)
                ? context.meta.config.value[rowIndex]
                : context.meta.config.value;
              return <Text>{`${val ?? ''}`}</Text>;
            },
            getTarget: () => 'workarea',
            getActionsApi: () => ({
              updateFieldValue: () => {},
              triggerFieldChange: () => {},
            }),
          }) as unknown as typeof PConnect,
      }),
      getComponentsRegistry: () => ({
        getLazyComponent: (f: string) => f,
      }),
    } as unknown as typeof PCore;

    const props: ExpandableTableProps = {
      ...args,
      getPConnect: () =>
        ({
          meta: {
            name: '',
          },
          options: {
            viewName: '',
          },
          getLocalizedValue: (val: string) => val,
          getContextName: () => 'workarea',
          getTarget: () => 'workarea',
          getCaseInfo: () => ({
            getKey: () => 'S-123',
          }),
          getValue: () => 'S-123',
          getPageReference: () => 'caseInfo.content',
          getChildren: () => genResponse().children,
          getRawMetadata: () => genResponse(),
          getInheritedProps: () => genResponse().config.inheritedProps,
          setInheritedProp: () => {
            /* nothing */
          },
          setValue: () => {
            /* nothing */
          },
          resolveConfigProps: (f: any) => ({
            ...f,
            propref: f.value,
            pageref: 'computers',
            contextClass: 'Data-Computer',
          }),
        }) as unknown as typeof PConnect,
    };

    return <PegaExtensionsExpandableTable {...props} />;
  },
  args: {
    detailViewName: 'ComputerDetails',
  },
};

const genNestedLineItemsResponse = () => {
  const nestedView = {
    name: 'nestedLineItemsView',
    type: 'View',
    config: {
      template: 'ExpandableTable',
      ruleClass: 'Data-Order',
      inheritedProps: { label: 'Line items' },
    },
    children: [
      {
        name: 'A',
        type: 'Region',
        children: [
          {
            config: {
              value: ['Widget A', 'Widget B'],
              componentType: 'TextInput',
              label: 'Product',
            },
            type: 'ScalarList',
          },
          {
            config: {
              value: [2, 5],
              componentType: 'TextInput',
              label: 'Quantity',
            },
            type: 'ScalarList',
          },
        ] as Array<info>,
        getPConnect: () =>
          ({
            getRawMetadata: () => nestedView.children[0],
          }) as unknown as typeof PConnect,
      },
    ],
    classID: 'Data-Order',
  };
  return nestedView;
};

const getRowIndexFromPageRef = (pageRef: string): number => {
  const matches = [...pageRef.matchAll(/\[(\d+)\]/g)];
  return matches.length ? parseInt(matches[matches.length - 1][1], 10) : 0;
};

const createMockPCore = (args: ExpandableTableProps) => ({
  getLocaleUtils: () => ({
    getLocaleValue: (val: string) => val,
  }),
  getConstants: () => ({
    CASE_INFO: {
      CASE_INFO_ID: 'caseInfo.ID',
    },
  }),
  getContextTreeManager: () => ({
    addPageListNode: () => {},
  }),
  getViewResources: () => ({
    fetchViewResources: (name: string, _pConnect: any, ruleClass: string) => ({
      type: 'View',
      config: {
        name,
        ruleClass,
      },
    }),
    updateViewResources: () => Promise.resolve(),
  }),
  getRestClient: () => ({
    invokeRestApi: () =>
      Promise.resolve({
        data: {
          uiResources: {
            root: {
              config: { name: args.detailViewName },
            },
          },
        },
      }),
  }),
  getStore: () => ({
    getState: () => ({
      data: {
        workarea: {
          caseInfo: {
            content: {
              orders: [
                {
                  pxObjClass: 'Data-Order',
                  LineItems: [{ pxObjClass: 'Data-LineItem' }, { pxObjClass: 'Data-LineItem' }],
                },
                {
                  pxObjClass: 'Data-Order',
                  LineItems: [{ pxObjClass: 'Data-LineItem' }],
                },
              ],
            },
          },
        },
      },
    }),
    subscribe: () => () => {},
  }),
  createPConnect: (context: any) => ({
    getPConnect: () =>
      ({
        createComponent: (f: any) => {
          if (f.type === 'View' || f.config?.name) {
            const pageRef: string = context.options.pageReference ?? '';
            const rowIndex = getRowIndexFromPageRef(pageRef);

            if (f.config?.name === 'OrderLineItems') {
              const nestedView = genNestedLineItemsResponse();
              const nestedProps: ExpandableTableProps = {
                detailViewName: 'LineItemDetails',
                getPConnect: () =>
                  ({
                    meta: { name: 'NestedLineItems' },
                    options: { viewName: 'OrderLineItems', pageReference: pageRef },
                    getLocalizedValue: (val: string) => val,
                    getContextName: () => 'workarea',
                    getTarget: () => 'workarea',
                    getPageReference: () => pageRef,
                    getCaseInfo: () => ({ getKey: () => 'S-123' }),
                    getValue: () => 'S-123',
                    getChildren: () => nestedView.children,
                    getRawMetadata: () => nestedView,
                    getInheritedProps: () => nestedView.config.inheritedProps,
                    setInheritedProp: () => {},
                    setValue: () => {},
                    resolveConfigProps: (fieldConfig: any) => ({
                      ...fieldConfig,
                      propref: fieldConfig.value,
                      pageref: 'LineItems',
                      contextClass: 'Data-LineItem',
                    }),
                  }) as unknown as typeof PConnect,
              };
              return <PegaExtensionsExpandableTable {...nestedProps} />;
            }

            return <MockDetailView rowIndex={rowIndex} viewName={f.config?.name ?? ''} />;
          }
          const pageRef: string = context.options.pageReference ?? '';
          const rowIndex = getRowIndexFromPageRef(pageRef);
          const val = Array.isArray(context.meta.config.value)
            ? context.meta.config.value[rowIndex]
            : context.meta.config.value;
          return <Text>{`${val ?? ''}`}</Text>;
        },
        getTarget: () => 'workarea',
        getActionsApi: () => ({
          updateFieldValue: () => {},
          triggerFieldChange: () => {},
        }),
      }) as unknown as typeof PConnect,
  }),
  getComponentsRegistry: () => ({
    getLazyComponent: (f: string) => f,
  }),
  getAssetLoader: () => ({
    getLoader: () => () => Promise.resolve(),
  }),
});

const genOrdersResponse = () => {
  const demoView = {
    name: 'ordersView',
    type: 'View',
    config: {
      template: 'ExpandableTable',
      ruleClass: 'Work-',
      inheritedProps: { label: 'Order list' },
    },
    children: [
      {
        name: 'A',
        type: 'Region',
        children: [
          {
            config: {
              value: ['ORD-1001', 'ORD-1002'],
              componentType: 'TextInput',
              label: 'Order ID',
            },
            type: 'ScalarList',
          },
          {
            config: {
              value: ['Open', 'Closed'],
              componentType: 'TextInput',
              label: 'Status',
            },
            type: 'ScalarList',
          },
        ] as Array<info>,
        getPConnect: () =>
          ({
            getRawMetadata: () => demoView.children[0],
          }) as unknown as typeof PConnect,
      },
    ],
    classID: 'Work-MyComponents',
  };
  return demoView;
};

export const NestedTable: Story = {
  render: (args: ExpandableTableProps) => {
    window.PCore = createMockPCore(args) as unknown as typeof PCore;

    const ordersView = genOrdersResponse();
    const props: ExpandableTableProps = {
      ...args,
      getPConnect: () =>
        ({
          meta: { name: 'OrdersTable' },
          options: { viewName: 'OrdersTable' },
          getLocalizedValue: (val: string) => val,
          getContextName: () => 'workarea',
          getTarget: () => 'workarea',
          getPageReference: () => 'caseInfo.content',
          getCaseInfo: () => ({ getKey: () => 'S-123' }),
          getValue: () => 'S-123',
          getChildren: () => ordersView.children,
          getRawMetadata: () => ordersView,
          getInheritedProps: () => ordersView.config.inheritedProps,
          setInheritedProp: () => {},
          setValue: () => {},
          resolveConfigProps: (fieldConfig: any) => ({
            ...fieldConfig,
            propref: fieldConfig.value,
            pageref: 'orders',
            contextClass: 'Data-Order',
          }),
        }) as unknown as typeof PConnect,
    };

    return <PegaExtensionsExpandableTable {...props} />;
  },
  args: {
    detailViewName: 'OrderLineItems',
  },
};

const genAssetsWithIdUrlResponse = () => {
  const demoView = {
    name: 'assetsView',
    type: 'View',
    config: {
      template: 'ExpandableTable',
      ruleClass: 'Work-',
      inheritedProps: { label: 'Linked assets' },
    },
    children: [
      {
        name: 'A',
        type: 'Region',
        children: [
          {
            config: {
              value: ['Laptop', 'Monitor', 'Dock'],
              componentType: 'TextInput',
              label: 'Name',
            },
            type: 'ScalarList',
          },
          {
            config: {
              value: ['AST-1001', 'AST-1002', 'AST-1003'],
              componentType: 'TextInput',
              label: 'ID',
            },
            type: 'ScalarList',
          },
          {
            config: {
              value: [
                'https://example.com/assets/AST-1001',
                'https://example.com/assets/AST-1002',
                'https://example.com/assets/AST-1003',
              ],
              componentType: 'URL',
              label: 'Asset URL',
            },
            type: 'ScalarList',
          },
          {
            config: {
              value: ['Available', 'In Use', 'Available'],
              componentType: 'TextInput',
              label: 'Status',
            },
            type: 'ScalarList',
          },
        ] as Array<info>,
        getPConnect: () =>
          ({
            getRawMetadata: () => demoView.children[0],
          }) as unknown as typeof PConnect,
      },
    ],
    classID: 'Work-MyComponents',
  };
  return demoView;
};

/**
 * When Region A includes an `ID` column immediately followed by a `URL` column,
 * they are merged into one column: the cell is a link using the URL as href and the ID as the label.
 */
export const IdUrlLink: Story = {
  render: (args: ExpandableTableProps) => {
    window.PCore = createMockPCore(args) as unknown as typeof PCore;

    const assetsView = genAssetsWithIdUrlResponse();
    const props: ExpandableTableProps = {
      ...args,
      getPConnect: () =>
        ({
          meta: { name: 'AssetsTable' },
          options: { viewName: 'AssetsTable' },
          getLocalizedValue: (val: string) => val,
          getContextName: () => 'workarea',
          getTarget: () => 'workarea',
          getPageReference: () => 'caseInfo.content',
          getCaseInfo: () => ({ getKey: () => 'S-123' }),
          getValue: () => 'S-123',
          getChildren: () => assetsView.children,
          getRawMetadata: () => assetsView,
          getInheritedProps: () => assetsView.config.inheritedProps,
          setInheritedProp: () => {},
          setValue: () => {},
          resolveConfigProps: (fieldConfig: any) => ({
            ...fieldConfig,
            propref: fieldConfig.value,
            pageref: 'assets',
            contextClass: 'Data-Asset',
          }),
        }) as unknown as typeof PConnect,
    };

    return <PegaExtensionsExpandableTable {...props} />;
  },
  args: {
    detailViewName: 'AssetDetails',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Place a column with label `ID` immediately before a `URL` field. The table merges them into one column that renders a link: ID as the label, URL as the href.',
      },
    },
  },
};

/** Mutable store helpers for interactive select-all demos */
const getNestedPathValue = (obj: any, path: string) => {
  return path.split('.').reduce((current: any, key) => {
    if (current === null || current === undefined) {
      return undefined;
    }
    if (key.includes('[') && key.includes(']')) {
      const arrayKey = key.substring(0, key.indexOf('['));
      const index = parseInt(key.substring(key.indexOf('[') + 1, key.indexOf(']')), 10);
      return current[arrayKey]?.[index];
    }
    return current[key];
  }, obj);
};

const createMutableStore = (initialContent: any) => {
  const state = {
    data: {
      workarea: {
        caseInfo: {
          content: initialContent,
        },
      },
    },
  };
  const listeners: Array<() => void> = [];

  return {
    getState: () => state,
    subscribe: (listener: () => void) => {
      listeners.push(listener);
      return () => {
        const idx = listeners.indexOf(listener);
        if (idx >= 0) {
          listeners.splice(idx, 1);
        }
      };
    },
    updateFieldValue: (pageReference: string, field: string, value: boolean) => {
      const page = getNestedPathValue(state.data.workarea, pageReference);
      const propKey = field.startsWith('.') ? field.slice(1) : field;
      if (page && propKey) {
        page[propKey] = value;
        listeners.forEach((listener) => listener());
      }
    },
  };
};

const genDocumentsResponse = (selectedValues: boolean[]) => {
  const demoView = {
    name: 'documentsView',
    type: 'View',
    config: {
      template: 'ExpandableTable',
      ruleClass: 'Work-',
      inheritedProps: { label: 'Documents' },
    },
    children: [
      {
        name: 'A',
        type: 'Region',
        children: [
          {
            config: {
              value: selectedValues,
              componentType: 'Checkbox',
              label: 'Selected',
              name: 'IsSelected',
            },
            type: 'ScalarList',
          },
          {
            config: {
              value: ['Policy packet', 'Claims evidence'],
              componentType: 'TextInput',
              label: 'Name',
            },
            type: 'ScalarList',
          },
          {
            config: {
              value: ['Underwriting', 'Claims'],
              componentType: 'TextInput',
              label: 'Category',
            },
            type: 'ScalarList',
          },
        ] as Array<info>,
        getPConnect: () =>
          ({
            getRawMetadata: () => demoView.children[0],
          }) as unknown as typeof PConnect,
      },
    ],
    classID: 'Work-MyComponents',
  };
  return demoView;
};

const genNestedFilesResponse = (selectedValues: boolean[]) => {
  const nestedView = {
    name: 'nestedFilesView',
    type: 'View',
    config: {
      template: 'ExpandableTable',
      ruleClass: 'Data-Document',
      inheritedProps: { label: 'Files' },
    },
    children: [
      {
        name: 'A',
        type: 'Region',
        children: [
          {
            config: {
              value: selectedValues,
              componentType: 'Checkbox',
              label: 'Selected',
              name: 'IsSelected',
            },
            type: 'ScalarList',
          },
          {
            config: {
              value: ['cover.pdf', 'appendix.pdf', 'notes.txt'].slice(0, selectedValues.length),
              componentType: 'TextInput',
              label: 'Filename',
            },
            type: 'ScalarList',
          },
        ] as Array<info>,
        getPConnect: () =>
          ({
            getRawMetadata: () => nestedView.children[0],
          }) as unknown as typeof PConnect,
      },
    ],
    classID: 'Data-Document',
  };
  return nestedView;
};

/**
 * Interactive demo: checking a Document checkbox selects/unselects all nested File checkboxes.
 * Expand a document row to see the Files table update in sync with the parent selection.
 */
export const SelectAllNested: Story = {
  render: (args: ExpandableTableProps) => {
    const storeContent = {
      Documents: [
        {
          pxObjClass: 'Data-Document',
          Name: 'Policy packet',
          IsSelected: false,
          Files: [
            { pxObjClass: 'Data-File', Filename: 'cover.pdf', IsSelected: false },
            { pxObjClass: 'Data-File', Filename: 'appendix.pdf', IsSelected: false },
            { pxObjClass: 'Data-File', Filename: 'notes.txt', IsSelected: false },
          ],
        },
        {
          pxObjClass: 'Data-Document',
          Name: 'Claims evidence',
          IsSelected: false,
          Files: [
            { pxObjClass: 'Data-File', Filename: 'photo1.jpg', IsSelected: false },
            { pxObjClass: 'Data-File', Filename: 'receipt.pdf', IsSelected: false },
          ],
        },
      ],
    };
    const store = createMutableStore(storeContent);

    const documentsView = genDocumentsResponse(storeContent.Documents.map((doc: any) => !!doc.IsSelected));

    window.PCore = {
      getLocaleUtils: () => ({
        getLocaleValue: (val: string) => val,
      }),
      getConstants: () => ({
        CASE_INFO: {
          CASE_INFO_ID: 'caseInfo.ID',
        },
      }),
      getContextTreeManager: () => ({
        addPageListNode: () => {},
      }),
      getViewResources: () => ({
        fetchViewResources: (name: string, _pConnect: any, ruleClass: string) => ({
          type: 'View',
          config: {
            name,
            ruleClass,
          },
        }),
        updateViewResources: () => Promise.resolve(),
      }),
      getRestClient: () => ({
        invokeRestApi: () =>
          Promise.resolve({
            data: {
              uiResources: {
                root: {
                  config: { name: args.detailViewName },
                },
              },
            },
          }),
      }),
      getStore: () => store,
      createPConnect: (context: any) => ({
        getPConnect: () =>
          ({
            createComponent: (f: any) => {
              if (f.type === 'View' || f.config?.name) {
                const pageRef: string = context.options.pageReference ?? '';
                const rowIndex = getRowIndexFromPageRef(pageRef);

                if (f.config?.name === 'DocumentFiles') {
                  const doc = storeContent.Documents[rowIndex];
                  const fileSelected = (doc?.Files ?? []).map((file: any) => !!file.IsSelected);
                  const nestedView = genNestedFilesResponse(fileSelected);
                  const nestedProps: ExpandableTableProps = {
                    detailViewName: 'FileDetails',
                    getPConnect: () =>
                      ({
                        meta: { name: 'NestedFiles' },
                        options: { viewName: 'DocumentFiles', pageReference: pageRef },
                        getLocalizedValue: (val: string) => val,
                        getContextName: () => 'workarea',
                        getTarget: () => 'workarea',
                        getPageReference: () => pageRef,
                        getCaseInfo: () => ({ getKey: () => 'S-123' }),
                        getValue: () => 'S-123',
                        getChildren: () => nestedView.children,
                        getRawMetadata: () => nestedView,
                        getInheritedProps: () => nestedView.config.inheritedProps,
                        setInheritedProp: () => {},
                        setValue: () => {},
                        resolveConfigProps: (fieldConfig: any) => ({
                          ...fieldConfig,
                          propref: fieldConfig.name ? `.${fieldConfig.name}` : fieldConfig.value,
                          pageref: 'Files',
                          contextClass: 'Data-File',
                        }),
                      }) as unknown as typeof PConnect,
                  };
                  return <PegaExtensionsExpandableTable {...nestedProps} />;
                }

                return <MockDetailView rowIndex={rowIndex} viewName={f.config?.name ?? ''} />;
              }
              const pageRef: string = context.options.pageReference ?? '';
              const rowIndex = getRowIndexFromPageRef(pageRef);
              const val = Array.isArray(context.meta.config.value)
                ? context.meta.config.value[rowIndex]
                : context.meta.config.value;
              return <Text>{`${val ?? ''}`}</Text>;
            },
            getTarget: () => 'workarea',
            getActionsApi: () => ({
              updateFieldValue: (field: string, value: boolean) => {
                store.updateFieldValue(context.options.pageReference, field, value);
              },
              triggerFieldChange: () => {},
            }),
          }) as unknown as typeof PConnect,
      }),
      getComponentsRegistry: () => ({
        getLazyComponent: (f: string) => f,
      }),
      getAssetLoader: () => ({
        getLoader: () => () => Promise.resolve(),
      }),
    } as unknown as typeof PCore;

    const props: ExpandableTableProps = {
      ...args,
      getPConnect: () =>
        ({
          meta: { name: 'DocumentsTable' },
          options: { viewName: 'DocumentsTable' },
          getLocalizedValue: (val: string) => val,
          getContextName: () => 'workarea',
          getTarget: () => 'workarea',
          getPageReference: () => 'caseInfo.content',
          getCaseInfo: () => ({ getKey: () => 'S-123' }),
          getValue: () => 'S-123',
          getChildren: () => documentsView.children,
          getRawMetadata: () => documentsView,
          getInheritedProps: () => documentsView.config.inheritedProps,
          setInheritedProp: () => {},
          setValue: () => {},
          resolveConfigProps: (fieldConfig: any) => ({
            ...fieldConfig,
            propref: fieldConfig.name ? `.${fieldConfig.name}` : fieldConfig.value,
            pageref: 'Documents',
            contextClass: 'Data-Document',
          }),
        }) as unknown as typeof PConnect,
    };

    return <PegaExtensionsExpandableTable {...props} />;
  },
  args: {
    detailViewName: 'DocumentFiles',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Add a boolean (`Checkbox`) column such as `IsSelected`. Checking it updates that row and every nested boolean under the row (for example, `Files[].IsSelected`). Expand a document to watch nested file checkboxes follow the parent selection.',
      },
    },
  },
};

const genChecklistResponse = () => {
  const demoView = {
    name: 'checklistView',
    type: 'View',
    config: {
      template: 'ExpandableTable',
      ruleClass: 'Work-',
      inheritedProps: { label: 'Budget checklist' },
    },
    children: [
      {
        name: 'A',
        type: 'Region',
        children: [
          {
            config: {
              value: [
                'Feasibility',
                'Feasibility',
                'Feasibility',
                'Feasibility',
                'Contract and Budget Management',
                'Contract and Budget Management',
                'Project Management',
                'Project Management',
              ],
              componentType: 'TextInput',
              label: 'Category',
            },
            type: 'ScalarList',
          },
          {
            config: {
              value: [
                '1.2.2 - IVDR Requirements',
                '1.1.1 - Confidentiality Agreement(s) fully executed / NDA in place',
                '1.2.1 - Project Scope clearly defined and aligned with rate card assumptions',
                '1.3.1 - Site feasibility questionnaire completed',
                '2.1.1 - Budget line items mapped to approved rate card',
                '2.2.1 - Payment schedule agreed with finance',
                '3.1.1 - Project kickoff checklist completed',
                '3.2.1 - Risk register reviewed with stakeholders',
              ],
              componentType: 'TextInput',
              label: 'Title',
            },
            type: 'ScalarList',
          },
          {
            config: {
              value: [
                'Confirm IVDR documentation is current for this study.',
                'Ensure all parties have signed confidentiality agreements before sharing data.',
                'Validate scope boundaries against the contracted rate card.',
                'Capture site capability responses for feasibility scoring.',
                'Cross-check each budget row against the approved rate card codes.',
                'Confirm payment milestones with the finance stakeholder.',
                'Complete kickoff tasks before first subject enrollment.',
                'Review open risks and owners with the project team.',
              ],
              componentType: 'TextInput',
              label: 'Help',
            },
            type: 'ScalarList',
          },
        ] as Array<info>,
        getPConnect: () => ({
          getRawMetadata: () => demoView.children[0],
        }),
      },
    ],
    classID: 'Work-MyComponents',
  };
  return demoView;
};

const MockChecklistDetail = ({ rowIndex }: { rowIndex: number }) => {
  const statuses = [
    'In progress',
    'Complete',
    'Not started',
    'In review',
    'Complete',
    'In progress',
    'Not started',
    'In review',
  ];
  const owners = [
    'Alex Rivera',
    'Sam Chen',
    'Jordan Lee',
    'Taylor Brooks',
    'Casey Morgan',
    'Riley Quinn',
    'Jamie Ortiz',
    'Morgan Ellis',
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem 2rem', padding: '0.5rem 0' }}>
      <Text>
        <strong>Status:</strong> {statuses[rowIndex] ?? ''}
      </Text>
      <Text>
        <strong>Owner:</strong> {owners[rowIndex] ?? ''}
      </Text>
      <Text>
        <strong>Last updated:</strong> 2026-08-12
      </Text>
    </div>
  );
};

const createChecklistMockPCore = (args: ExpandableTableProps) => ({
  getLocaleUtils: () => ({
    getLocaleValue: (val: string) => val,
  }),
  getConstants: () => ({
    CASE_INFO: {
      CASE_INFO_ID: 'caseInfo.ID',
    },
  }),
  getContextTreeManager: () => ({
    addPageListNode: () => {},
  }),
  getViewResources: () => ({
    fetchViewResources: (name: string, _pConnect: any, ruleClass: string) => ({
      type: 'View',
      config: {
        name,
        ruleClass,
      },
    }),
    updateViewResources: () => Promise.resolve(),
  }),
  getRestClient: () => ({
    invokeRestApi: () =>
      Promise.resolve({
        data: {
          uiResources: {
            root: {
              config: { name: args.detailViewName },
            },
          },
        },
      }),
  }),
  getStore: () => ({
    getState: () => ({
      data: {
        workarea: {
          caseInfo: {
            content: {
              checklist: Array.from({ length: 8 }, () => ({ pxObjClass: 'Data-ChecklistItem' })),
            },
          },
        },
      },
    }),
    subscribe: () => () => {},
  }),
  createPConnect: (context: any) => ({
    getPConnect: () => ({
      createComponent: (f: any) => {
        if (f.type === 'View' || f.config?.name) {
          const pageRef: string = context.options.pageReference ?? '';
          const rowIndex = getRowIndexFromPageRef(pageRef);
          return <MockChecklistDetail rowIndex={rowIndex} />;
        }
        const pageRef: string = context.options.pageReference ?? '';
        const rowIndex = getRowIndexFromPageRef(pageRef);
        const val = Array.isArray(context.meta.config.value)
          ? context.meta.config.value[rowIndex]
          : context.meta.config.value;
        return <Text>{`${val ?? ''}`}</Text>;
      },
      getTarget: () => 'workarea',
      getActionsApi: () => ({
        updateFieldValue: () => {},
        triggerFieldChange: () => {},
      }),
    }),
  }),
  getComponentsRegistry: () => ({
    getLazyComponent: (f: string) => f,
  }),
  getAssetLoader: () => ({
    getLoader: () => () => Promise.resolve(),
  }),
});

/**
 * Accordion list variant — each row is an expandable item with optional help text.
 * Use a `Title` (or `Name`) column for the row header and an optional `Help` column for AdditionalInfo.
 */
export const ListVariant: Story = {
  render: (args: ExpandableTableProps) => {
    window.PCore = createChecklistMockPCore(args) as unknown as typeof PCore;
    const checklistView = genChecklistResponse();
    const props: ExpandableTableProps = {
      ...args,
      getPConnect: () =>
        ({
          meta: { name: 'ChecklistList' },
          options: { viewName: 'ChecklistList' },
          getLocalizedValue: (val: string) => val,
          getContextName: () => 'workarea',
          getTarget: () => 'workarea',
          getPageReference: () => 'caseInfo.content',
          getCaseInfo: () => ({ getKey: () => 'S-123' }),
          getValue: () => 'S-123',
          getChildren: () => checklistView.children,
          getRawMetadata: () => checklistView,
          getInheritedProps: () => checklistView.config.inheritedProps,
          setInheritedProp: () => {},
          setValue: () => {},
          resolveConfigProps: (fieldConfig: any) => ({
            ...fieldConfig,
            propref: fieldConfig.value,
            pageref: 'checklist',
            contextClass: 'Data-ChecklistItem',
          }),
        }) as unknown as typeof PConnect,
    };
    return <PegaExtensionsExpandableTable {...props} />;
  },
  args: {
    variant: 'list',
    detailViewName: 'ChecklistItemDetails',
  },
  parameters: {
    docs: {
      description: {
        story:
          'List variant renders each embedded row as an accordion item. Row titles come from a `Title` / `Name` column; an optional `Help` column shows Cosmos AdditionalInfo.',
      },
    },
  },
};

/**
 * Tabs variant matching the category checklist design: Category values become tabs,
 * and items in the selected category render as expandable list rows.
 */
export const TabsVariant: Story = {
  render: (args: ExpandableTableProps) => {
    window.PCore = createChecklistMockPCore(args) as unknown as typeof PCore;
    const checklistView = genChecklistResponse();
    const props: ExpandableTableProps = {
      ...args,
      getPConnect: () =>
        ({
          meta: { name: 'ChecklistTabs' },
          options: { viewName: 'ChecklistTabs' },
          getLocalizedValue: (val: string) => val,
          getContextName: () => 'workarea',
          getTarget: () => 'workarea',
          getPageReference: () => 'caseInfo.content',
          getCaseInfo: () => ({ getKey: () => 'S-123' }),
          getValue: () => 'S-123',
          getChildren: () => checklistView.children,
          getRawMetadata: () => checklistView,
          getInheritedProps: () => checklistView.config.inheritedProps,
          setInheritedProp: () => {},
          setValue: () => {},
          resolveConfigProps: (fieldConfig: any) => ({
            ...fieldConfig,
            propref: fieldConfig.value,
            pageref: 'checklist',
            contextClass: 'Data-ChecklistItem',
          }),
        }) as unknown as typeof PConnect,
    };
    return <PegaExtensionsExpandableTable {...props} />;
  },
  args: {
    variant: 'tabs',
    detailViewName: 'ChecklistItemDetails',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Tabs variant groups rows by a `Category` column using Cosmos Tabs. Selecting a tab filters the expandable checklist items. Colors come from the theme (interactive / secondary background / border-line).',
      },
    },
  },
};

/**
 * Tabs without a Category column — each list item becomes its own tab and the panel shows the detail view.
 */
export const TabsItemsAsTabs: Story = {
  render: (args: ExpandableTableProps) => {
    window.PCore = createMockPCore(args) as unknown as typeof PCore;

    const props: ExpandableTableProps = {
      ...args,
      getPConnect: () =>
        ({
          meta: { name: '' },
          options: { viewName: '' },
          getLocalizedValue: (val: string) => val,
          getContextName: () => 'workarea',
          getTarget: () => 'workarea',
          getCaseInfo: () => ({
            getKey: () => 'S-123',
          }),
          getValue: () => 'S-123',
          getPageReference: () => 'caseInfo.content',
          getChildren: () => genResponse().children,
          getRawMetadata: () => genResponse(),
          getInheritedProps: () => genResponse().config.inheritedProps,
          setInheritedProp: () => {},
          setValue: () => {},
          resolveConfigProps: (f: any) => ({
            ...f,
            propref: f.value,
            pageref: 'computers',
            contextClass: 'Data-Computer',
          }),
        }) as unknown as typeof PConnect,
    };

    return <PegaExtensionsExpandableTable {...props} />;
  },
  args: {
    variant: 'tabs',
    detailViewName: 'ComputerDetails',
  },
  parameters: {
    docs: {
      description: {
        story:
          'When Region A has no `Category` column, the tabs variant treats each row as its own tab. The tab label comes from the first display field (for example Brand), and the panel loads the detail view.',
      },
    },
  },
};
