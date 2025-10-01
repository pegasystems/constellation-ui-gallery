/* eslint-disable react/jsx-no-useless-fragment */
// @ts-nocheck
import type { Meta, StoryObj } from '@storybook/react';
import ManagerMonitoringDashboard from './index';
import configProps from './mock';

const meta: Meta<typeof ManagerMonitoringDashboard> = {
  title: 'ManagerMonitoringDashboard',
  component: ManagerMonitoringDashboard,
  excludeStories: /.*Data$/,
};

export default meta;

type Story = StoryObj<typeof ManagerMonitoringDashboard>;

if (!window.PCore) {
  window.PCore = {};
}

const mockData = {
  workBasketDataPage: {
    data: {
      data: [
        {
            "pxUrgencyAssign": 10,
            "pxProcessName": "Approval",
            "pxRefObjectInsName": "PAR-31046",
            "pxAssignedOperatorID": "Practice_Leads",
            "pxTaskLabel": "Get Approval",
            "pxRefObjectClass": "BIG-PAR-Work-AnnualPerformanceCycle",
            "pyAssignmentStatus": "Pending-KRA Assignment",
            "pyInstructions": "TASLIM SHAMSHUDDIN SAYYED",
            "pzInsKey": "ASSIGN-WORKBASKET BIG-PAR-WORK PAR-31046!PYCASCADINGGETAPPROVAL",
            "pxDeadlineTime": null,
            "pxObjClass": "Assign-WorkBasket",
            "pxGoalTime": null,
            "pxCreateDateTime": "2025-09-16T06:09:54.940Z",
            "pxRefObjectKey": "BIG-PAR-WORK PAR-31046",
            "pyLabel": "CTPL0375",
            "pxIsMultiStep": false
        },
        {
            "pxUrgencyAssign": 10,
            "pxProcessName": "Approval",
            "pxRefObjectInsName": "PAR-31054",
            "pxAssignedOperatorID": "Practice_Leads",
            "pxTaskLabel": "Get Approval",
            "pxRefObjectClass": "BIG-PAR-Work-AnnualPerformanceCycle",
            "pyAssignmentStatus": "Pending-KRA Assignment",
            "pyInstructions": "NILESH VIJAY PATIL",
            "pzInsKey": "ASSIGN-WORKBASKET BIG-PAR-WORK PAR-31054!PYCASCADINGGETAPPROVAL",
            "pxDeadlineTime": null,
            "pxObjClass": "Assign-WorkBasket",
            "pxGoalTime": null,
            "pxCreateDateTime": "2025-09-18T10:02:44.913Z",
            "pxRefObjectKey": "BIG-PAR-WORK PAR-31054",
            "pyLabel": "CTPL0178",
            "pxIsMultiStep": false
        }
      ]
    },
  },
  upcomingAppraisalsDataPage: {
    data: {
      data: [
        {
            "pxObjClass": "BIG-PAR-Data-EmployeeInformation",
            "pyNote": "Pending",
            "EmployeeID": "CTPL0386",
            "NextApparaisalDate": "2025-10-19T04:00:00.000Z",
            "EmployeeName": "ROHIT ARVIND CHAKRAPANI"
        },
        {
            "pxObjClass": "BIG-PAR-Data-EmployeeInformation",
            "pyNote": "Pending",
            "EmployeeID": "CTPL0213",
            "NextApparaisalDate": "2025-10-29T04:00:00.000Z",
            "EmployeeName": "ROHIT SINGH GUSAIN"
        }
      ],
    },
  }
};

window.PCore.getDataApiUtils = () => {
  return {
    getData: (endpoint) => {
      switch (endpoint) {
        case 'workBasketDataPage':
          return Promise.resolve(mockData.workBasketDataPage);
        case 'upcomingAppraisalsDataPage':
          return Promise.resolve(mockData.upcomingAppraisalsDataPage);
        default:
          return Promise.reject(new Error('Unknown endpoint'));
      }
    },
  };
};

export const BaseManagerMonitoringDashboard: Story = (args) => {
  const props = {
    ...configProps,
    getPConnect: () => ({
      getValue: (value) => value,
      getContextName: () => 'app/primary_1',
      getLocalizedValue: (value) => value,
      getActionsApi: () => ({
        updateFieldValue: () => {},
        triggerFieldChange: () => {},
      }),
      ignoreSuggestion: () => {},
      acceptSuggestion: () => {},
      setInheritedProps: () => {},
      resolveConfigProps: () => {},
    }),
  };

  return (
    <>
      <ManagerMonitoringDashboard {...props} {...args} />
    </>
  );
};

BaseManagerMonitoringDashboard.args = {
  workBasketDataPage: configProps.workBasketDataPage,
  upcomingAppraisalsDataPage: configProps.upcomingAppraisalsDataPage
};
