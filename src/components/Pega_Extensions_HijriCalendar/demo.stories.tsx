import React from 'react';
// Use 'import type' to satisfy the 'verbatimModuleSyntax' in your tsconfig
import type { ComponentMeta, ComponentStory } from '@storybook/react';
import HijriCalendar from './index';

export default {
  title: 'Components/HijriCalendar',
  component: HijriCalendar,
  parameters: {
    layout: 'centered',
  },
  // Adding argTypes allows the Storybook UI to auto-generate controls
  argTypes: {
    label: { control: 'text', defaultValue: 'Select Hijri Date' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    required: { control: 'boolean' },
    helperText: { control: 'text' },
  },
} as ComponentMeta<typeof HijriCalendar>;

// Define the template with explicit types for the props
const Template: ComponentStory<typeof HijriCalendar> = (args) => {
  // Mock PConnect for the Storybook environment
  const mockPConnect = () => ({
    getActionsApi: () => ({
      updateFieldValue: (prop: string, val: string) => console.log(`Updating ${prop} to ${val}`),
      triggerFieldChange: () => {}
    }),
    getStateProps: () => ({
      value: 'dummyField'
    }),
    getComponentConfig: () => ({})
  });

  return <HijriCalendar {...args} getPConnect={mockPConnect} />;
};

export const Default = Template.bind({});
Default.args = {
  label: 'Hijri Date of Birth',
  helperText: 'Please select a date from the Hijri calendar',
};

export const RequiredField = Template.bind({});
RequiredField.args = {
  label: 'Required Date',
  required: true,
};

export const Disabled = Template.bind({});
Disabled.args = {
  label: 'Disabled Calendar',
  disabled: true,
  value: '15/09/1447'
};