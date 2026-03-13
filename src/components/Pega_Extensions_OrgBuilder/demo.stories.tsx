import type { StoryObj } from '@storybook/react-webpack5';
import { PegaExtensionsOrgBuilder, type OrgBuilderProps } from './index';
import type { OrgBuilderDataPageResponse } from './OrgTypes';

// Sample reference organization for story mock (business context)
const referenceOrganization = {
  id: 'globex-holdings',
  name: 'Globex Holdings',
  shortName: 'Globex',
  type: 'corporation' as const,
  children: [
    {
      id: 'hq-operations',
      name: 'Headquarters Operations',
      shortName: 'HQ Ops',
      type: 'division' as const,
      children: [
        {
          id: 'hq-finance',
          name: 'Finance Department',
          shortName: 'Finance',
          type: 'department' as const,
          children: [
            {
              id: 'cfo',
              name: 'Chief Financial Officer',
              shortName: 'CFO',
              type: 'position' as const,
              postId: 'FIN1001',
              children: [],
            },
          ],
        },
        {
          id: 'hq-hr',
          name: 'Human Resources',
          shortName: 'HR',
          type: 'department' as const,
          children: [
            {
              id: 'hr-manager',
              name: 'HR Manager',
              shortName: '',
              type: 'position' as const,
              postId: 'HR2001',
              children: [],
            },
          ],
        },
      ],
    },
    {
      id: 'manufacturing-region',
      name: 'Manufacturing Region',
      shortName: 'MFG Region',
      type: 'division' as const,
      children: [
        {
          id: 'plant-1',
          name: 'Factory Alpha',
          shortName: 'Plant A',
          type: 'factory' as const,
          children: [
            {
              id: 'plant-1-assembly',
              name: 'Assembly Line',
              shortName: 'Assembly',
              type: 'department' as const,
              children: [
                {
                  id: 'assembly-supervisor',
                  name: 'Assembly Supervisor',
                  shortName: '',
                  type: 'position' as const,
                  postId: 'MFG3001',
                  children: [],
                },
                {
                  id: 'team-a',
                  name: 'Team A',
                  shortName: 'Team A',
                  type: 'team' as const,
                  children: [
                    {
                      id: 'team-lead-a',
                      name: 'Team Lead A',
                      shortName: '',
                      type: 'position' as const,
                      postId: 'MFG3002',
                      children: [],
                    },
                    {
                      id: 'worker-1',
                      name: 'Production Worker 1',
                      shortName: '',
                      type: 'position' as const,
                      postId: 'MFG3003',
                      children: [],
                    },
                    {
                      id: 'worker-2',
                      name: 'Production Worker 2',
                      shortName: '',
                      type: 'position' as const,
                      postId: 'MFG3004',
                      children: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: 'plant-2',
          name: 'Factory Beta',
          shortName: 'Plant B',
          type: 'company' as const,
          children: [
            {
              id: 'plant-2-logistics',
              name: 'Logistics Department',
              shortName: 'Logistics',
              type: 'company' as const,
              children: [
                {
                  id: 'logistics-manager',
                  name: 'Logistics Manager',
                  shortName: '',
                  type: 'position' as const,
                  postId: 'LOG4001',
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

const initialTargetOrganization = {
  id: 'globex-europe',
  name: 'Globex Europe Expansion',
  shortName: 'Globex EU',
  type: 'corporation' as const,
  children: [
    {
      id: 'eu-hq',
      name: 'European Headquarters',
      shortName: 'EU HQ',
      type: 'division' as const,
      children: [
        {
          id: 'eu-managing-director',
          name: 'Managing Director Europe',
          shortName: 'MD',
          type: 'position' as const,
          children: [],
        },
      ],
    },
    {
      id: 'eu-plant',
      name: 'EU Manufacturing Plant',
      shortName: 'EU Plant',
      type: 'factory' as const,
      children: [
        {
          id: 'eu-plant-ops',
          name: 'Plant Operations',
          shortName: 'Ops',
          type: 'department' as const,
          children: [],
        },
      ],
    },
  ],
};

const simpleReference = {
  id: 'ref-root',
  name: 'Reference Unit',
  shortName: 'Ref',
  type: 'corporation' as const,
  children: [
    { id: 'ref-a', name: 'Section A', shortName: 'A', type: 'department' as const, children: [] },
    { id: 'ref-b', name: 'Section B', shortName: 'B', type: 'department' as const, children: [] },
  ],
};

const simpleTarget = {
  id: 'target-root',
  name: 'Target Unit',
  shortName: 'Tgt',
  type: 'corporation' as const,
  children: [],
};

export default {
  title: 'Widgets/Org Builder',
  argTypes: {
    Example: {
      options: ['basic', 'simple'],
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
    getPConnect: {
      table: {
        disable: true,
      },
    },
    referenceHeading: {
      control: { type: 'text' },
      description: 'Left panel heading (reference organization)',
    },
    targetHeading: {
      control: { type: 'text' },
      description: 'Right panel heading (organization to create)',
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
  component: PegaExtensionsOrgBuilder,
};

const setPCore = (Example: string) => {
  let data: OrgBuilderDataPageResponse;
  if (Example === 'basic') {
    data = {
      pyReferenceOrganization: referenceOrganization,
      pyTargetOrganization: initialTargetOrganization,
    };
  } else {
    // 'simple'
    data = {
      pyReferenceOrganization: simpleReference,
      pyTargetOrganization: simpleTarget,
    };
  }
  (window as any).PCore = {
    getComponentsRegistry: () => {
      return {
        getLazyComponent: (f: string) => f,
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
    getDataPageUtils: () => {
      return {
        getPageDataAsync: () => {
          return Promise.resolve(data);
        },
      };
    },
  };
};

interface OrgBuilderPropsExt extends OrgBuilderProps {
  Example: string;
}

type Story = StoryObj<OrgBuilderPropsExt>;
export const Default: Story = {
  render: (args: OrgBuilderPropsExt) => {
    setPCore(args.Example);
    const props = {
      ...args,
      getPConnect: () => {
        return {
          getLocalizedValue: (val: string) => {
            return val;
          },
          getContextName: () => '',
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
        };
      },
    };
    return <PegaExtensionsOrgBuilder {...props} />;
  },
  args: {
    Example: 'basic',
    heading: 'Org Builder',
    referenceHeading: 'Reference organization',
    targetHeading: 'Organization to create',
    dataPage: 'D_OrgBuilder',
    height: '100%',
    showRefresh: true,
  },
};
