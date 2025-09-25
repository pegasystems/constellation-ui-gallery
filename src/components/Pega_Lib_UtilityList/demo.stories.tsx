import type { StoryObj } from '@storybook/react-webpack5';
import { PegaExtensionsUtilityList } from './index';

export default {
  title: 'Widgets/Utility List',
  argTypes: {
    dataPage: {
      table: {
        disable: true,
      },
    },
    setCaseID: {
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
            id: 'list',
            enabled: false,
          },
        ],
      },
    },
  },
  component: PegaExtensionsUtilityList,
};

const setPCore = () => {
  (window as any).PCore = {
    getConstants: () => {
      return {
        CASE_INFO: {},
      };
    },
    getSemanticUrlUtils: () => {
      return {
        getResolvedSemanticURL: () => {
          return '/case/case-1';
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
        getData: () => {
          return Promise.resolve({
            data: {
              data: [
                {
                  pzInsKey: 'OPGO8L-CARINSUR-WORK A-1004',
                  pxUpdateOpName: 'Marc Doe',
                  pxObjClass: 'OPGO8L-CarInsur-Work-Appointment',
                  pyID: 'A-1004',
                  pxCreateDateTime: '2023-07-21T18:45:38.411Z',
                  pyLabel: 'Appointment for John smith',
                  pxCreateOpName: 'Marc Doe',
                },
                {
                  pzInsKey: 'OPGO8L-CARINSUR-WORK A-1004',
                  pxUpdateOpName: 'Marc Doe',
                  pxObjClass: 'OPGO8L-CarInsur-Work-Appointment',
                  pyID: 'A-1005',
                  pxCreateDateTime: '2023-07-21T18:45:38.411Z',
                  pyLabel: 'Appointment for Sue Lee',
                  pxCreateOpName: 'John Louis',
                },
                {
                  pzInsKey: 'OPGO8L-CARINSUR-WORK A-1004',
                  pxUpdateOpName: 'Marc Doe',
                  pxObjClass: 'OPGO8L-CarInsur-Work-Appointment',
                  pyID: 'C-1005',
                  pxCreateDateTime: '2023-07-21T18:45:38.411Z',
                  pyLabel: 'Appointment for John Louis',
                  pxCreateOpName: 'John Louis',
                },
                {
                  pzInsKey: 'OPGO8L-CARINSUR-WORK A-1004',
                  pxUpdateOpName: 'Marc Doe',
                  pxObjClass: 'OPGO8L-CarInsur-Work-Appointment',
                  pyID: 'D-4045',
                  pxCreateDateTime: '2023-07-21T18:45:38.411Z',
                  pyLabel: 'Appointment for Mark Smith',
                  pxCreateOpName: 'John Louis',
                },
                {
                  pzInsKey: 'OPGO8L-CARINSUR-WORK A-1004',
                  pxUpdateOpName: 'Marc Doe',
                  pxObjClass: 'OPGO8L-CarInsur-Work-Appointment',
                  pyID: 'AB-305',
                  pxCreateDateTime: '2023-07-21T18:45:38.411Z',
                  pyLabel: 'Appointment for John Louis',
                  pxCreateOpName: 'John Louis',
                },
                {
                  pzInsKey: 'OPGO8L-CARINSUR-WORK A-1004',
                  pxUpdateOpName: 'Marc Doe',
                  pxObjClass: 'OPGO8L-CarInsur-Work-Appointment',
                  pyID: 'BD-85',
                  pxCreateDateTime: '2023-07-21T18:45:38.411Z',
                  pyLabel: 'Appointment for John Doe',
                  pxCreateOpName: 'John Louis',
                },
              ],
            },
          });
        },
      };
    },
    getPubSubUtils: () => {
      return {
        publish: () => {
          /* nothing */
        },
      };
    },
  };
};

type Story = StoryObj<typeof PegaExtensionsUtilityList>;
export const Default: Story = {
  render: (args) => {
    setPCore();
    const props = {
      ...args,
      getPConnect: () => {
        return {
          getContextName: () => '',
          getValue: () => 'C-123',
        };
      },
    };
    return <PegaExtensionsUtilityList {...props} />;
  },
  args: {
    heading: 'List of objects',
    iconName: 'clipboard',
    primaryField: 'pyLabel',
    secondaryFields: 'pyID,pxCreateDateTime,pxCreateOpName',
    secondaryFieldTypes: 'string,date,string',
    dataPage: 'D_myCases',
    setCaseID: false,
  },
};
