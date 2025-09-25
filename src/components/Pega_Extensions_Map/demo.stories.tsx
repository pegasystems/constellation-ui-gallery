import type { StoryObj } from '@storybook/react-webpack5';
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
      options: ['', 'DISPLAY_ONLY'],
      control: { type: 'radio', labels: { '': 'EDITABLE' } },
    },
    getPConnect: {
      table: {
        disable: true,
      },
    },
    locationInputType: {
      table: {
        disable: true,
      },
    },
    ZoomRef: {
      table: {
        disable: true,
      },
    },
  },
  component: PegaExtensionsMap,
};

const genComponent = (config: any) => {
  return config.config.text;
};

const setPCore = () => {
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
        getActionsApi: () => ({ updateFieldValue: () => {} }),
        getContextName: () => '',
        getValue: () => 'C-123',
        getListActions: () => {
          return {
            update: () => {},
            deleteEntry: () => {},
          };
        },
      }),
    }),
  };
};

const genResponse = (args: any) => {
  const demoView = {
    name: 'demoView',
    type: 'View',
    config: {
      template: 'Map',
      ruleClass: 'Work-',
      inheritedProps: [],
      selectionProperty: args.selectionProperty || '',
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
        values: [34, 30, 35],
        value: '@FILTERED_LIST .Positions[].pxPositionLatitude',
      },
      type: 'ScalarList',
    },
    {
      config: {
        values: [-118, -110, -114],
        value: '@FILTERED_LIST .Positions[].pxPositionLongitude',
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

type Story = StoryObj<typeof PegaExtensionsMap>;
export const Default: Story = {
  render: (args) => {
    const response = genResponse(args);
    setPCore();
    const props = {
      template: 'MapLayout',
      ...args,
      getPConnect: () => {
        return {
          meta: {
            name: '',
          },
          options: {
            viewName: '',
          },
          getLocalizedValue: (val: string) => {
            return val;
          },
          getListActions: () => {
            return {
              update: () => {},
              deleteEntry: () => {},
            };
          },
          getActionsApi: () => {
            return {
              updateFieldValue: (_key: string, value: string) => {
                console.log('Updating field', value);
              },
              triggerFieldChange: () => {
                /* nothing */
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
            return { value: f.values };
          },
        };
      },
    };
    return <PegaExtensionsMap {...props}></PegaExtensionsMap>;
  },
  args: {
    heading: 'Map',
    height: '20rem',
    Latitude: '35',
    Longitude: '-110',
    Zoom: '4',
    displayMode: '',
    bFreeFormDrawing: false,
    bShowSearch: false,
    createTools: 'point,polyline,polygon,rectangle,circle',
    selectionProperty:
      '{"shapes":[{"type":"polygon","coordinates":[{"x":-11902954.520884523,"y":4538976.751116623},{"x":-11902954.520884523,"y":4069347.6493326253},{"x":-12372583.622668521,"y":4069347.6493326253},{"x":-12372583.622668521,"y":4538976.751116623},{"x":-11902954.520884523,"y":4538976.751116623}]}]}',
    apiKey: '',
    locationInputType: 'constant',
    ZoomRef: '',
  },
};
