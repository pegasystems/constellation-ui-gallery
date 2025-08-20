
/* eslint-disable react/jsx-no-useless-fragment */
// @ts-nocheck
import type { Meta, StoryObj } from '@storybook/react';

import PegaExtensionsEmployeeProfile from './index';


import configProps from './mock';

const meta: Meta<typeof PegaExtensionsEmployeeProfile> = {
  title: 'PegaExtensionsEmployeeProfile',
  component: PegaExtensionsEmployeeProfile,
  excludeStories: /.*Data$/
};

export default meta;
type Story = StoryObj<typeof PegaExtensionsEmployeeProfile>;

if (!window.PCore) {
  window.PCore = {};
}

const empData = {
  data: {
    data:
    {
      "JobTitle": "Operations Manager",
      "EmailAddress": "fatima.noor@example.com",
      "Department": "Operations",
      "JoiningDate": "2021-03-08",
      "ContactNumber": "9001001018",
      "EmployeeID": "EMP018",
      "EmployeeName": "Fatima Noor"
    }
  }
};

export const BasePegaExtensionsEmployeeProfile: Story = args => {
  window.PCore.getDataApiUtils = () => {
    return {
      getData: () => {
        return new Promise(resolve => {
          resolve(empData);
        });
      },
      getDataAsync: () => {
        return new Promise(resolve => {
          resolve(empData);
        });
      }
    };
  };

  const props = {
    ...configProps,
    getPConnect: () => {
      return {
        getValue: value => {
          return value;
        },
        getContextName: () => {
          return 'app/primary_1';
        },
        getLocalizedValue: value => {
          return value;
        },
        getActionsApi: () => {
          return {
            updateFieldValue: () => {
              /* nothing */
            },
            triggerFieldChange: () => {
              /* nothing */
            }
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
        }
      };
    }
  };

  return (
      <>
        <PegaExtensionsEmployeeProfile {...props} {...args} />
      </>
    );
};

BasePegaExtensionsEmployeeProfile.args = {
  dataPageName: configProps.dataPageName,
};
