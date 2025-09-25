import type { StoryObj } from '@storybook/react-webpack5';
import { PegaExtensionsDynamicHierarchicalForm, type DynamicHierarchicalFormProps } from './index';
import { Checkbox, CheckboxGroup, Grid, Input, RadioButton, RadioButtonGroup, TextArea } from '@pega/cosmos-react-core';

type configInfo = {
  values?: Array<any>;
  value?: string;
  componentType?: string;
  pyGUID?: string;
  authorContext?: string;
  pyLabel?: string;
  label?: string;
  IsSelected?: boolean;
  heading?: string;
  inheritedProps?: Array<any>;
  name?: string;
  ruleClass?: string;
};

type info = {
  config: configInfo;
  type: string;
  children?: Array<info>;
};

export default {
  title: 'Templates/Dynamic Hierarchical Form',
  argTypes: {
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
          {
            id: 'autocomplete-valid',
            enabled: false,
          },
        ],
      },
    },
  },
  component: PegaExtensionsDynamicHierarchicalForm,
};

const genComponent = (config: any) => {
  return config.config.text;
};

const setPCore = (numProducts: number) => {
  const productsConfig: any[] = [];
  for (let i = 1; i <= numProducts; i += 1) {
    productsConfig.push({
      pyLabel: `Product #${i}`,
      pyGUID: `product${i}`,
      IsSelected: true,
      RuleClass: `Class-Product-${i}` /* The classID must match the ruleClass from the embedded obj */,
    });
  }

  (window as any).PCore = {
    getLocaleUtils: () => {
      return {
        getLocaleValue: (val: string) => {
          return val;
        },
      };
    },
    getContextTreeManager: () => {
      return {
        addPageListNode: () => {},
      };
    },
    createPConnect: () => ({
      getPConnect: () => ({
        createComponent: (meta: any) => {
          return (
            <Grid container={{ gap: 1, cols: `repeat(1, minmax(0, 1fr))` }} style={{ maxWidth: '80ch' }}>
              {Math.random() < 0.8 ? <Input name={`${meta.config.name}field1`} label='Field1' /> : null}
              {Math.random() < 0.8 ? <Input name={`${meta.config.name}field2`} label='Field2' /> : null}
              {Math.random() < 0.8 ? <TextArea name={`${meta.config.name}field3`} label='Field3' /> : null}
              {Math.random() < 0.8 ? <Input name={`${meta.config.name}field4`} label='Field4' /> : null}
              {Math.random() < 0.8 ? <Input name={`${meta.config.name}field5`} label='Field5' /> : null}
              {Math.random() < 0.8 ? (
                <CheckboxGroup name={`${meta.config.name}options`} label='Options'>
                  {['Option1', 'Option2', 'Option3'].map((option) => (
                    <Checkbox key={option} label={option} value={option} />
                  ))}
                </CheckboxGroup>
              ) : null}
              {Math.random() < 0.8 ? (
                <RadioButtonGroup name={`${meta.config.name}choice`} label='Choice'>
                  {['Yes', 'No'].map((option) => (
                    <RadioButton key={option} label={option} value={option} />
                  ))}
                </RadioButtonGroup>
              ) : null}
            </Grid>
          );
        },
        getActionsApi: () => {
          return {
            updateFieldValue: () => {},
          };
        },
      }),
    }),
    getComponentsRegistry: () => {
      return {
        getLazyComponent: (f: string) => f,
      };
    },
    getViewResources: () => {
      return {
        fetchViewResources: (name: string) => {
          return {
            config: {
              name,
            },
          };
        },
        updateViewResources: () => {},
      };
    },
    getStore: () => {
      return {
        getState: () => {
          return {
            data: {
              primary: {
                caseInfo: {
                  content: {
                    Products: productsConfig,
                  },
                },
              },
            },
          };
        },
        dispatch: () => {},
      };
    },
  };
};

const genResponse = (numProducts: number) => {
  const demoView = {
    name: 'demoView',
    type: 'View',
    config: {
      template: 'DynamicHierarchicalForm',
      ruleClass: 'Work-',
      inheritedProps: [],
    },
    children: [
      {
        name: 'Selection',
        type: 'Region',
        children: [] as Array<info>,
        getPConnect: () => {},
      },
      {
        name: 'Tabs',
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
        authorContext: '.Products',
        inheritedProps: [{ prop: 'label', value: 'Products' }],
      },
      type: 'reference',
    },
  ];

  const productsConfig = [];
  for (let i = 1; i <= numProducts; i += 1) {
    productsConfig.push({
      config: {
        name: `Product #${i}`,
        ruleClass: `Class-Product-${i}`,
        inheritedProps: [{ value: `Product #${i}` }],
      },
      type: 'reference',
    });
  }

  demoView.children[1].children = productsConfig;
  demoView.children[0].getPConnect = () => {
    return {
      getRawMetadata: () => {
        return demoView.children[0];
      },
    };
  };
  demoView.children[1].getPConnect = () => {
    return {
      getRawMetadata: () => {
        return demoView.children[1];
      },
    };
  };
  return demoView;
};

interface DynamicHierarchicalFormPropsExt extends DynamicHierarchicalFormProps {
  numProducts: number;
}
type Story = StoryObj<DynamicHierarchicalFormPropsExt>;
export const Default: Story = {
  render: (args: any) => {
    const response = genResponse(args.numProducts);
    setPCore(args.numProducts);
    const props = {
      template: 'DynamicTabs',
      ...args,
      getPConnect: () => {
        return {
          meta: {
            name: '',
          },
          options: {
            viewName: '',
          },
          getListActions: () => {
            return {
              update: () => {},
            };
          },
          getCaseInfo: () => {
            return {
              getKey: () => 'S-123',
              getCurrentAssignmentViewName: () => 'Enter info',
            };
          },
          getActionsApi: () => {
            return {
              updateFieldValue: () => {},
              refreshCaseView: () => {
                alert('Refresh UI');
              },
            };
          },
          getChildren: () => {
            return response.children;
          },
          getRawMetadata: () => {
            return response;
          },
          getInheritedProps: () => {
            return response.config.inheritedProps;
          },
          getContextName: () => {
            return 'primary';
          },
          getTarget: () => {
            return 'caseInfo';
          },
          createComponent: (config: any) => {
            return genComponent(config);
          },
          setInheritedProp: () => {
            /* nothing */
          },
          setValue: () => {
            /* nothing */
          },
          resolveConfigProps: (f: any) => {
            return f;
          },
        };
      },
    };
    return <PegaExtensionsDynamicHierarchicalForm {...props}></PegaExtensionsDynamicHierarchicalForm>;
  },
  args: {
    label: 'Select your products',
    showLabel: true,
    refreshActionLabel: 'Refresh product',
    showRefreshAction: true,
    enableItemSelection: true,
    numProducts: 3,
  },
};
