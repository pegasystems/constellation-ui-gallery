import type { Meta, StoryObj } from '@storybook/react';

import { HijriCalendar } from './index'; 
import type { HijriCalendarProps } from './index';

const meta: Meta<HijriCalendarProps> = {
  
  title: 'OrgLibraryHijriCalendar', 
  component: HijriCalendar,
  argTypes: {
    label: { 
      control: 'text',
      description: 'The label for the Hijri Date field' 
    },
    value: { 
      control: 'text',
      description: 'The current value of the field' 
    },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    required: { control: 'boolean' },
    helperText: { control: 'text' },
    validatemessage: { control: 'text' },
    minYear: { 
      control: { type: 'number' },
      defaultValue: 1400 
    },
    maxYear: { 
      control: { type: 'number' },
      defaultValue: 1500 
    },
    storeAsHijri: { 
      control: 'boolean',
      description: 'If true, stores DD/MM/YYYY. If false, stores YYYY-MM-DD (Gregorian)'
    }
  }
};

export default meta;

type Story = StoryObj<HijriCalendarProps>;

export const BaseOrgLibraryHijriCalendar: Story = {
  args: {
    label: 'Hijri Date',
    minYear: 1400,
    maxYear: 1500,
    storeAsHijri: true,
    helperText: 'Please select a Hijri date',
    // Mocking PConnect for Storybook functionality
    getPConnect: () => ({
      getStateProps: () => ({
        value: 'pyValue'
      }),
      getActionsApi: () => ({
        updateFieldValue: (prop: string, val: string) => {
          console.log(`%c Pega Update API %c Field: ${prop} | Value: ${val}`, 'background: #222; color: #bada55', 'background: #fff; color: #000');
        }
      })
    })
  }
};