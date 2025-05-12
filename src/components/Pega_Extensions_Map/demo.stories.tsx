import type { StoryObj } from '@storybook/react';
import { PegaExtensionsMap } from './index';

type configInfo = {
  values?: Array<any>;
  value?: string;
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
  title: 'Templates/Map',
  argTypes: {
    displayMode: {
      options: ['EDITABLE', 'DISPLAY_ONLY'],
      control: { type: 'radio' }
    },
    getPConnect: {
      table: {
        disable: true
      }
    }
  },
  component: PegaExtensionsMap
};

const genComponent = (config: any) => {
  return config.config.text;
};

const setPCore = () => {
  (window as any).PCore = {
    getContextTreeManager: () => {
      return {
        addPageListNode: () => {}
      };
    },
    createPConnect: () => ({
      getPConnect: () => ({
        getActionsApi: () => ({ updateFieldValue: () => {} }),
        getContextName: () => '',
        getValue: () => 'C-123',
        getListActions: () => {
          return {
            update: () => {},
            deleteEntry: () => {}
          };
        }
      })
    })
  };
};

const genResponse = () => {
  const demoView = {
    name: 'demoView',
    type: 'View',
    config: {
      template: 'Pega_Extensions_Map',
      ruleClass: 'Work-',
      inheritedProps: []
    },
    children: [
      {
        name: 'A',
        type: 'Region',
        children: [] as Array<info>,
        getPConnect: () => {}
      }
    ],
    classID: 'Work-MyComponents'
  };
  demoView.children[0].children = [
    {
      config: {
        values: [34, 30, 35],
        value: '@FILTERED_LIST .Positions[].pxPositionLatitude'
      },
      type: 'ScalarList'
    },
    {
      config: {
        values: [-118, -110, -114],
        value: '@FILTERED_LIST .Positions[].pxPositionLongitude'
      },
      type: 'ScalarList'
    }
  ];

  demoView.children[0].getPConnect = () => {
    return {
      getRawMetadata: () => {
        return demoView.children[0];
      }
    };
  };
  return demoView;
};

type Story = StoryObj<typeof PegaExtensionsMap>;
export const Default: Story = {
  render: args => {
    const response = genResponse();
    setPCore();
    const props = {
      template: 'MapLayout',
      ...args,
      getPConnect: () => {
        return {
          meta: {
            name: ''
          },
          options: {
            viewName: ''
          },
          getListActions: () => {
            return {
              update: () => {},
              deleteEntry: () => {}
            };
          },
          getActionsApi: () => {
            return {
              updateFieldValue: () => {}
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
            return { value: f.values };
          }
        };
      }
    };
    return <PegaExtensionsMap {...props}></PegaExtensionsMap>;
  },
  args: {
    height: '20rem',
    heading: 'Map',
    Latitude: '35',
    Longitude: '-110',
    Zoom: '4',
    displayMode: 'EDITABLE',
    bFreeFormDrawing: false,
    bShowSearch: false
  }
};
