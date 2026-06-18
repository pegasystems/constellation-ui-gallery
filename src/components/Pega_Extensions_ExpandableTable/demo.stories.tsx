import type { StoryObj } from '@storybook/react-webpack5';
import { Text } from '@pega/cosmos-react-core';
import { PegaExtensionsExpandableTable, type ExpandableTableProps } from './index';

type configInfo = {
  value?: Array<any>;
  componentType?: string;
  label?: string;
  heading?: string;
};

type info = {
  config: configInfo;
  type: string;
  children?: Array<info>;
};

export default {
  title: 'Templates/Expandable Table',
  tags: ['Pega_Extensions_ExpandableTable'],
  argTypes: {
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
    (window as any).PCore = {
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
                  computers: [{ pxObjClass: 'Data-Computer' }],
                },
              },
            },
          },
        }),
      }),
      createPConnect: (context: any) => ({
        getPConnect: () => ({
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
        }),
      }),
      getComponentsRegistry: () => ({
        getLazyComponent: (f: string) => f,
      }),
    };

    const props: ExpandableTableProps = {
      ...args,
      getPConnect: () => ({
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
      }),
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
        getPConnect: () => ({
          getRawMetadata: () => nestedView.children[0],
        }),
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
              orders: [{ pxObjClass: 'Data-Order', LineItems: [{ pxObjClass: 'Data-LineItem' }] }],
            },
          },
        },
      },
    }),
  }),
  createPConnect: (context: any) => ({
    getPConnect: () => ({
      createComponent: (f: any) => {
        if (f.type === 'View' || f.config?.name) {
          const pageRef: string = context.options.pageReference ?? '';
          const rowIndex = getRowIndexFromPageRef(pageRef);

          if (f.config?.name === 'OrderLineItems') {
            const nestedView = genNestedLineItemsResponse();
            const nestedProps: ExpandableTableProps = {
              detailViewName: '',
              getPConnect: () => ({
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
              }),
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
    }),
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
        getPConnect: () => ({
          getRawMetadata: () => demoView.children[0],
        }),
      },
    ],
    classID: 'Work-MyComponents',
  };
  return demoView;
};

export const NestedTable: Story = {
  render: (args: ExpandableTableProps) => {
    (window as any).PCore = createMockPCore(args);

    const ordersView = genOrdersResponse();
    const props: ExpandableTableProps = {
      ...args,
      getPConnect: () => ({
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
      }),
    };

    return <PegaExtensionsExpandableTable {...props} />;
  },
  args: {
    detailViewName: 'OrderLineItems',
  },
};
