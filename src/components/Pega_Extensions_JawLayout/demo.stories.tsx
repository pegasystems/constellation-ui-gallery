import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useState } from 'react';
import { PegaExtensionsJawLayout } from './index';
import localizations from './localizations.json';

const meta: Meta<typeof PegaExtensionsJawLayout> = {
  title: 'Templates/Jaw Layout',
  component: PegaExtensionsJawLayout,
  argTypes: {
    getPConnect: {
      table: {
        disable: true,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof PegaExtensionsJawLayout>;

export const Default: Story = {
  render: (args) => {
    const initialStatuses = [
      'M',
      '',
      '',
      '',
      'E',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      'X',
      'E',
      '',
      '',
      '',
      'M',
      '',
      '',
      '',
      '',
      'X',
      '',
      '',
      'M',
      '',
      '',
      '',
      '',
      'E',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      'X',
      '',
      '',
      'E',
      '',
      '',
      '',
      'M',
      '',
      '',
    ];

    const [toothStatuses, setToothStatuses] = useState(initialStatuses);

    const genResponse = () => {
      const demoView: any = {
        name: 'demoView',
        type: 'View',
        config: {
          template: 'Pega_Extensions_JawLayout',
          ruleClass: 'Work-',
          heading: 'dental chart',
        },
        children: [
          {
            name: 'A',
            type: 'Region',
            config: {},
            children: [],
            getPConnect: () => {},
          },
        ],
        classID: 'Work-MyComponents',
      };

      if (demoView.children) {
        demoView.children[0].children = [
          {
            config: {
              value: toothStatuses,
              label: 'Tooth Status',
              propref: '.ToothData.ToothStatus',
              pageref: '.ToothData',
            },
            type: 'Group',
          },
        ];
        demoView.children[0].getPConnect = () => ({
          getRawMetadata: () => demoView.children?.[0],
        });
      }
      return demoView;
    };

    // Setup mock PCore
    if (!(window as any).PCore) {
      (window as any).PCore = {
        getLocaleUtils: () => ({
          getLocaleValue: (val: string) => val,
        }),
        getContextTreeManager: () => ({ addPageListNode: () => {} }),
        createPConnect: () => ({
          getPConnect: () => ({
            getActionsApi: () => ({
              updateFieldValue: (prop: string, value: string) => {
                console.log(`MOCK BACKEND: updateFieldValue called for ${prop} with value ${value}`);
              },
            }),
          }),
        }),
        getComponentsRegistry: () => ({ getLazyComponent: (f: string) => f }),
      };
    }

    const mockProps = genResponse();

    const props = {
      ...args,
      getPConnect: () => {
        return {
          getLocalizedValue: (key: string) => {
            return (localizations.fields as any)[key] || key;
          },
          getContextName: () => 'app/primary_1',
          getTarget: () => 'app/primary_1',
          getChildren: () => mockProps.children,
          getRawMetadata: () => mockProps,
          getInheritedProps: () => mockProps.config.inheritedProps,
          resolveConfigProps: (rawConfig: any) => ({ ...rawConfig }),
        };
      },
    };

    (props.getPConnect as any).updateToothStatus = (index: number, status: string) => {
      console.log(`STORY: Updating tooth at index ${index} to status ${status}`);
      const newStatuses = [...toothStatuses];
      newStatuses[index] = status;
      setToothStatuses(newStatuses);
    };

    return <PegaExtensionsJawLayout {...(props as any)} />;
  },
  args: {
    heading: 'Dental Chart',
    readOnly: false,
  },
};
