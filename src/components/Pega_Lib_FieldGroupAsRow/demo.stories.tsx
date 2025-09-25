import type { StoryObj } from '@storybook/react-webpack5';
import { FieldValueList } from '@pega/cosmos-react-core';
import { PegaExtensionsFieldGroupAsRow } from './index';

export default {
  title: 'Templates/Field Group As Row',
  argTypes: {
    getPConnect: {
      table: {
        disable: true,
      },
    },
  },
  component: PegaExtensionsFieldGroupAsRow,
};

const renderField = (resolvedProps: any) => {
  const { value = '', label = '', key } = resolvedProps;
  return <FieldValueList variant='stacked' fields={[{ name: label, value }]} key={key} />;
};

const mainResponse = {
  name: 'pyReview',
  type: 'View',
  config: {
    template: 'Details',
    ruleClass: 'Work-MyComponents',
    showLabel: true,
    label: '@L Details',
    localeReference: '@LR Details',
    inheritedProps: [],
  },
  children: [
    {
      name: 'A',
      type: 'Region',
      getPConnect: () => {
        return {
          getRawMetadata: () => {
            return mainResponse.children[0];
          },
        };
      },
      children: [
        {
          type: 'DateTime',
          config: {
            value: '@P .pySLADeadline',
            label: '@L SLA Deadline',
          },
          key: '1',
        },
        {
          type: 'DateTime',
          config: {
            value: '@P .pySLAGoal',
            label: '@L SLA Goal',
          },
          key: '2',
        },
        {
          type: 'DateTime',
          config: {
            value: '@P .pySLAStartTime',
            label: '@L SLA Start Time',
          },
          key: '3',
        },
      ],
    },
  ],
  classID: 'Work-MyComponents',
};

const regionChildrenResolved = [
  {
    readOnly: true,
    value: '30 days',
    label: 'SLA Deadline',
    key: 'SLA Deadline',
  },
  {
    readOnly: true,
    value: '10 days',
    label: 'SLA Goal',
    key: 'SLA Goal',
  },
  {
    readOnly: true,
    value: '2/12/2023',
    label: 'SLA Start Time',
    key: 'SLA Start Time',
  },
];

const createComponent = (config: any) => {
  switch (config.config.value) {
    case '@P .pySLADeadline':
      return renderField(regionChildrenResolved[0]);
    case '@P .pySLAGoal':
      return renderField(regionChildrenResolved[1]);
    case '@P .pySLAStartTime':
      return renderField(regionChildrenResolved[2]);
  }
};

type Story = StoryObj<typeof PegaExtensionsFieldGroupAsRow>;
export const Default: Story = {
  render: (args) => {
    const props = {
      template: 'FieldGroupAsRow',
      ...args,
      getPConnect: () => {
        return {
          getChildren: () => {
            return mainResponse.children;
          },
          getRawMetadata: () => {
            return mainResponse;
          },
          getInheritedProps: () => {
            return mainResponse.config.inheritedProps;
          },
          createComponent: (config: any) => {
            return createComponent(config);
          },
          setInheritedProp: () => {
            /* nothing */
          },
          resolveConfigProps: () => {
            /* nothing */
          },
        };
      },
    };
    const regionAChildren = mainResponse.children[0].children.map((child: any) => {
      return props.getPConnect().createComponent(child);
    });

    return <PegaExtensionsFieldGroupAsRow {...props}>{regionAChildren}</PegaExtensionsFieldGroupAsRow>;
  },
  args: {
    heading: 'Heading',
  },
};
