/* eslint-disable react/jsx-no-useless-fragment */
// @ts-nocheck
import type { Meta, StoryObj } from '@storybook/react';
import HRAppraisalMonitoringDashboard from './index';
import configProps from './mock';

const meta: Meta<typeof HRAppraisalMonitoringDashboard> = {
  title: 'HRAppraisalMonitoringDashboard',
  component: HRAppraisalMonitoringDashboard,
  excludeStories: /.*Data$/,
};

export default meta;

type Story = StoryObj<typeof HRAppraisalMonitoringDashboard>;

if (!window.PCore) {
  window.PCore = {};
}

const mockData = {
  inProgressAppraisalsData: {
    data: {
      data: [{ pySummaryCount: [10] }],
    },
  },
  departmentalWorkloadChartData: {
    data: {
      data: [
        { pyOrg: 'HR', pySummaryCount: [100] },
        { pyOrg: 'Finance', pySummaryCount: [80] },
      ],
    },
  },
  upcomingAppraisalsData: {
    data: {
      data: [
        { EmployeeName: 'John Doe', Department: 'HR', Date: '2025-10-15' },
        { EmployeeName: 'Jane Smith', Department: 'Finance', Date: '2025-10-18' },
      ],
    },
  },
  recentAppraisalsData: {
    data: {
      data: [
        { EmployeeName: 'Alice Brown', pyOrg: 'HR', pxCurrentStageLabel: 'Stage 1', AppraisalTargetDate: '2025-10-10', pyIntegerValue: 5 },
        { EmployeeName: 'Bob White', pyOrg: 'Finance', pxCurrentStageLabel: 'Stage 2', AppraisalTargetDate: '2025-09-30', pyIntegerValue: 2 },
      ],
    },
  },
  kraRejectionData: {
    data: {
      data: [
        { Employee: 'Charlie Green', PracticeLead: 'John Doe', Timestamp: '2025-09-20', Reason: 'Reason 1', Comments: 'No comments' },
        { Employee: 'David Black', PracticeLead: 'Jane Smith', Timestamp: '2025-09-21', Reason: 'Reason 2', Comments: 'No comments' },
      ],
    },
  },
  overdueProposalsData: {
    data: {
      data: [{ EmployeeName: 'Alice Brown', Department: 'HR', Date: '2025-09-25' }],
    },
  },
  stageDistributionData: {
    data: {
      data: [
        { pyStatusWork: 'Stage 1', pySummaryCount: [30] },
        { pyStatusWork: 'Stage 2', pySummaryCount: [20] },
        { pyStatusWork: 'Stage 3', pySummaryCount: [50] },
      ],
    },
  },
};

window.PCore.getDataApiUtils = () => {
  return {
    getData: (endpoint) => {
      switch (endpoint) {
        case 'inProgressAppraisalsDataPage':
          return Promise.resolve(mockData.inProgressAppraisalsData);
        case 'departmentalWorkloadChartDataPage':
          return Promise.resolve(mockData.departmentalWorkloadChartData);
        case 'upcomingAppraisalsDataPage':
          return Promise.resolve(mockData.upcomingAppraisalsData);
        case 'recentAppraisalsDataPage':
          return Promise.resolve(mockData.recentAppraisalsData);
        case 'kraRejectionDataPage':
          return Promise.resolve(mockData.kraRejectionData);
        case 'overdueProposalsDataPage':
          return Promise.resolve(mockData.overdueProposalsData);
        case 'stageDistributionDataPage':
          return Promise.resolve(mockData.stageDistributionData);
        default:
          return Promise.reject(new Error('Unknown endpoint'));
      }
    },
  };
};

export const BaseHRAppraisalMonitoringDashboard: Story = (args) => {
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
      <HRAppraisalMonitoringDashboard {...props} {...args} />
    </>
  );
};

BaseHRAppraisalMonitoringDashboard.args = {
  inProgressAppraisalsDataPage: configProps.inProgressAppraisalsDataPage,
  departmentalWorkloadChartDataPage: configProps.departmentalWorkloadChartDataPage,
  overdueProposalsDataPage: configProps.overdueProposalsDataPage,
  stageDistributionDataPage: configProps.stageDistributionDataPage,
  upcomingAppraisalsDataPage: configProps.upcomingAppraisalsDataPage,
  recentAppraisalsDataPage: configProps.recentAppraisalsDataPage,
  kraRejectionDataPage: configProps.kraRejectionDataPage
};
