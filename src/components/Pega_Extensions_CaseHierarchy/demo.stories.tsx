import type { StoryObj } from '@storybook/react';
import { PegaExtensionsCaseHierarchy } from './index';

export default {
  title: 'Widgets/Case Hierarchy',
  argTypes: {
    dataPage: {
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
      element: '#storybook-root',
      config: {
        rules: [
          {
            id: 'aria-required-children',
            enabled: false,
          },
          {
            id: 'listitem',
            enabled: false,
          },
        ],
      },
    },
  },
  component: PegaExtensionsCaseHierarchy,
};

const setPCore = () => {
  (window as any).PCore = {
    getConstants: () => {
      return {
        CASE_INFO: {
          CASE_INFO_ID: 'ID',
        },
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
    getDataPageUtils: () => {
      return {
        getPageDataAsync: (data: string, context: string, parameters: { showParent: boolean }) => {
          const { showParent } = parameters;
          if (showParent) {
            return Promise.resolve({
              pzInsKey: 'OPGO8L-CARINSUR-WORK A-1',
              pxObjClass: 'Work',
              pyClassName: 'OPGO8L-CarInsur-Work',
              pyID: '1',
              pyLabel: 'Parent',
              pxResults: [
                {
                  pzInsKey: 'OPGO8L-CARINSUR-WORK A-2',
                  pxObjClass: 'Work',
                  pyClassName: 'OPGO8L-CarInsur-Work',
                  pyID: '2',
                  pyLabel: 'Child Case 1',
                  pxResults: [
                    {
                      pzInsKey: 'OPGO8L-TY-WORK A-3',
                      pxObjClass: 'Work',
                      pyClassName: 'OPGO8L-CarInsur-Work',
                      pyID: '3',
                      pyLabel: 'Child Child Case 1',
                    },
                    {
                      pzInsKey: 'OPGO8L-TY-WORK A-4',
                      pxObjClass: 'Work',
                      pyClassName: 'OPGO8L-CarInsur-Work',
                      pyID: '4',
                      pyLabel: 'Child Child Case 2',
                    },
                  ],
                },
                {
                  pzInsKey: 'OPGO8L-CARINSUR-WORK A-5',
                  pxObjClass: 'Work',
                  pyClassName: 'OPGO8L-CarInsur-Work',
                  pyID: '5',
                  pyLabel: 'Child Case 2',
                  pxResults: [
                    {
                      pzInsKey: 'OPGO8L-TY-WORK A-6',
                      pxObjClass: 'Work',
                      pyClassName: 'OPGO8L-CarInsur-Work',
                      pyID: '6',
                      pyLabel: 'Scheduling',
                    },
                    {
                      pzInsKey: 'OPGO8L-TY-WORK A-7',
                      pxObjClass: 'Work',
                      pyClassName: 'OPGO8L-CarInsur-Work',
                      pyID: '7',
                      pyLabel: 'Provisioning',
                    },
                  ],
                },
                {
                  pzInsKey: 'OPGO8L-CARINSUR-WORK A-18',
                  pxObjClass: 'Work',
                  pyClassName: 'OPGO8L-CarInsur-Work',
                  pyID: '18',
                  pyLabel: 'Request Approval',
                },
                {
                  pzInsKey: 'OPGO8L-CARINSUR-WORK A-8',
                  pxObjClass: 'Work',
                  pyClassName: 'OPGO8L-CarInsur-Work',
                  pyID: '8',
                  pyLabel: 'Service Request',
                  pxResults: [
                    {
                      pzInsKey: 'OPGO8L-TY-WORK A-9',
                      pxObjClass: 'Work',
                      pyClassName: 'OPGO8L-CarInsur-Work',
                      pyID: '9',
                      pyLabel: 'Scheduling Child',
                    },
                  ],
                },
              ],
            });
          } else {
            return Promise.resolve({
              pzInsKey: 'OPGO8L-CARINSUR-WORK A-5',
              pxObjClass: 'Work',
              pyClassName: 'OPGO8L-CarInsur-Work',
              pyID: '5',
              pyLabel: 'Child Case type 2 with a very long description',
              pxResults: [
                {
                  pzInsKey: 'OPGO8L-TY-WORK A-6',
                  pxObjClass: 'Work',
                  pyClassName: 'OPGO8L-CarInsur-Work',
                  pyID: '6',
                  pyLabel: 'Scheduling case type with a very long description',
                },
                {
                  pzInsKey: 'OPGO8L-TY-WORK A-7',
                  pxObjClass: 'Work',
                  pyClassName: 'OPGO8L-CarInsur-Work',
                  pyID: '7',
                  pyLabel: 'Provisioning',
                },
              ],
            });
          }
        },
      };
    },
  };
};

type Story = StoryObj<typeof PegaExtensionsCaseHierarchy>;
export const Default: Story = {
  render: (args) => {
    setPCore();
    const props = {
      ...args,
      getPConnect: () => {
        return {
          getLocalizedValue: (val: string) => {
            return val;
          },
          getActionsApi: () => {
            return {
              openWorkByHandle: () => {
                /* nothing */
              },
              showCasePreview: () => {
                /* nothing */
              },
            };
          },
          getContextName: () => '',
          getValue: () => 'OPGO8L-CARINSUR-WORK A-5',
        };
      },
    };
    return <PegaExtensionsCaseHierarchy {...props} />;
  },
  args: {
    heading: 'Case Hierarchy',
    dataPage: 'D_myCases',
    showParent: false,
  },
};
