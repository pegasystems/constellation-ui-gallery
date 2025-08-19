/* eslint-disable react/jsx-no-useless-fragment */
// @ts-nocheck
import type { Meta, StoryObj } from '@storybook/react';

import PegaExtensionsEmployeeAppraisal from './index';


import configProps from './mock';

const meta: Meta<typeof PegaExtensionsEmployeeAppraisal> = {
  title: 'PegaExtensionsEmployeeAppraisal',
  component: PegaExtensionsEmployeeAppraisal,
  excludeStories: /.*Data$/
};

export default meta;
type Story = StoryObj<typeof PegaExtensionsEmployeeAppraisal>;

if (!window.PCore) {
  window.PCore = {};
}

const employeesData = {
  data: {
    data: [
      {
        "JobTitle": "Operations Manager",
        "EmailAddress": "fatima.noor@example.com",
        "Department": "Operations",
        "JoiningDate": "2021-03-08",
        "ContactNumber": "9001001018",
        "EmployeeID": "EMP018",
        "EmployeeName": "Fatima Noor"
      },
      {
        "JobTitle": "Business Analyst",
        "EmailAddress": "isabella.rossi@example.com",
        "Department": "Product",
        "JoiningDate": "2019-10-16",
        "ContactNumber": "9001001016",
        "EmployeeID": "EMP016",
        "EmployeeName": "Isabella Rossi"
      },
      {
        "JobTitle": "Security Analyst",
        "EmailAddress": "william.singh@example.com",
        "Department": "Cybersecurity",
        "JoiningDate": "2020-01-27",
        "ContactNumber": "9001001015",
        "EmployeeID": "EMP015",
        "EmployeeName": "William Singh"
      },
      {
        "JobTitle": "Frontend Developer",
        "EmailAddress": "grace.kim@example.com",
        "Department": "Engineering",
        "JoiningDate": "2022-10-10",
        "ContactNumber": "9001001010",
        "EmployeeID": "EMP010",
        "EmployeeName": "Grace Kim"
      },
      {
        "JobTitle": "Project Manager",
        "EmailAddress": "sophia.lee@example.com",
        "Department": "Management",
        "JoiningDate": "2020-12-10",
        "ContactNumber": "9001001004",
        "EmployeeID": "EMP004",
        "EmployeeName": "Sophia Lee"
      },
      {
        "JobTitle": "Content Writer",
        "EmailAddress": "nina.brown@example.com",
        "Department": "Marketing",
        "JoiningDate": "2023-02-20",
        "ContactNumber": "9001001012",
        "EmployeeID": "EMP012",
        "EmployeeName": "Nina Brown"
      },
      {
        "JobTitle": "Network Engineer",
        "EmailAddress": "daniel.moore@example.com",
        "Department": "Infrastructure",
        "JoiningDate": "2018-06-14",
        "ContactNumber": "9001001011",
        "EmployeeID": "EMP011",
        "EmployeeName": "Daniel Moore"
      },
      {
        "JobTitle": "Data Engineer",
        "EmailAddress": "ethan.tan@example.com",
        "Department": "Data",
        "JoiningDate": "2022-11-23",
        "ContactNumber": "9001001019",
        "EmployeeID": "EMP019",
        "EmployeeName": "Ethan Tan"
      },
      {
        "JobTitle": "Software Engineer",
        "EmailAddress": "john.doe@example.com",
        "Department": "Engineering",
        "JoiningDate": "2022-04-15",
        "ContactNumber": "9001001001",
        "EmployeeID": "EMP001",
        "EmployeeName": "John Doe"
      },
      {
        "JobTitle": "Backend Developer",
        "EmailAddress": "aisha.patel@example.com",
        "Department": "Engineering",
        "JoiningDate": "2021-05-18",
        "ContactNumber": "9001001008",
        "EmployeeID": "EMP008",
        "EmployeeName": "Aisha Patel"
      },
      {
        "JobTitle": "System Analyst",
        "EmailAddress": "liam.wong@example.com",
        "Department": "IT",
        "JoiningDate": "2020-08-25",
        "ContactNumber": "9001001009",
        "EmployeeID": "EMP009",
        "EmployeeName": "Liam Wong"
      },
      {
        "JobTitle": "Mobile Developer",
        "EmailAddress": "lucas.becker@example.com",
        "Department": "Engineering",
        "JoiningDate": "2023-06-30",
        "ContactNumber": "9001001017",
        "EmployeeID": "EMP017",
        "EmployeeName": "Lucas Becker"
      },
      {
        "JobTitle": "Product Manager",
        "EmailAddress": "chloe.dubois@example.com",
        "Department": "Product",
        "JoiningDate": "2020-09-19",
        "ContactNumber": "9001001020",
        "EmployeeID": "EMP020",
        "EmployeeName": "Chloe Dubois"
      }
    ]
  }
};

const appraisalData = {
  data: {
    data: [
      {
          "Emp_ID": "EMP014",
          "ManagerComments": "Test",
          "Year": 2024,
          "EmployeeComments": "Test",
          "HRFinalComments": "Test"
      },
      {
          "Emp_ID": "EMP015",
          "ManagerComments": "Test",
          "Year": 2024,
          "EmployeeComments": "Test",
          "HRFinalComments": "Test",
          "KRA": null
      },
      {
          "Emp_ID": "EMP016",
          "ManagerComments": "Test",
          "Year": 2025,
          "EmployeeComments": "Test",
          "HRFinalComments": "Test",
          "KRA": [
              {
                  "Learning": "5",
                  "Leadership": "5",
                  "JobKnowledge": "5",
                  "ID": "3",
                  "CommunicationSkills": "5",
                  "Flexibility": "5",
                  "Initiative": "5",
                  "PolicyAdherence": "5"
              },
              {
                  "Learning": "4",
                  "Leadership": "4",
                  "JobKnowledge": "2",
                  "ID": "2",
                  "CommunicationSkills": "4",
                  "Flexibility": "2",
                  "Initiative": "4",
                  "PolicyAdherence": "4"
              }
          ]
      }
    ]
  }
};

export const BasePegaExtensionsEmployeeAppraisal: Story = args => {
  window.PCore.getDataApiUtils = () => {
    return {
      getData: (dataPageName: string) => {
        return new Promise(resolve => {
          setTimeout(() => {
            if (dataPageName === 'D_Employee2List') {
              resolve(employeesData);
            } else if (dataPageName === 'D_EmployeeKRAList') {
              resolve(appraisalData);
            } else {
              resolve({ data: { data: [] } });
            }
          }, 2000)
        });
      },
      getDataAsync: () => {
        return new Promise(resolve => {
          resolve(employeesData);
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
        <PegaExtensionsEmployeeAppraisal {...props} {...args} />
      </>
    );
};

BasePegaExtensionsEmployeeAppraisal.args = {
  dataPage: configProps.dataPage,
  title: configProps.title,
  loadingMessage: configProps.loadingMessage,
  detailsDataPage: configProps.detailsDataPage
};
