/* eslint-disable react/jsx-no-useless-fragment */
// @ts-nocheck
import type { Meta, StoryObj } from '@storybook/react';

import PegaExtensionsEmployeeAppraisalReport from './index';


import configProps from './mock';

const meta: Meta<typeof PegaExtensionsEmployeeAppraisalReport> = {
  title: 'PegaExtensionsEmployeeAppraisalReport',
  component: PegaExtensionsEmployeeAppraisalReport,
  excludeStories: /.*Data$/
};

export default meta;
type Story = StoryObj<typeof PegaExtensionsEmployeeAppraisalReport>;

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
    data: [{"pyID":"PAR-30002","KRACompRO":[{"HRCompFinalRatingValue":0E-9,"CompetencyName":"Flexibility","pxUpdateSystemID":"pega","CompetencyReviewerComments":"yuyio","CompetencyID":"C007","pxUpdateDateTime":"2025-04-24T05:14:36.593Z","pxUpdateOpName":"Venkat Tama","pxUpdateOperator":"VenkatTama","Reviewer":"PL","PLReviewerComments_Comp":"yuyio","CompReviewerRating":5,"JobTitle":"5B","pxObjClass":"BIG-PAR-Data-CompetencyKRAsNew","CompetencyDescription":"Modifies behavior and points of view in response to changing conditions. Adapts to change and integrates changes into existing strategies and processes. Seeks out different approaches to improve performance, streamline work and/or achieve high standards or","pxCreateOperator":"VenkatTama","pxCreateDateTime":"2025-04-24T05:13:53.930Z","pxCreateSystemID":"pega","pxCreateOpName":"Venkat Tama","Weightage":15.000000000},{"HRCompFinalRatingValue":0E-9,"CompetencyName":"Job knowledge","pxUpdateSystemID":"pega","CompetencyReviewerComments":"ytfgyut","CompetencyID":"C020","pxUpdateDateTime":"2025-04-24T05:22:06.332Z","pxUpdateOpName":"Venkat Tama","pxUpdateOperator":"VenkatTama","JobTitle":"5B","Reviewer":"PL","CompReviewerRating":5,"PLReviewerComments_Comp":"ytfgyut","pxObjClass":"BIG-PAR-Data-CompetencyKRAsNew","CompetencyDescription":"Demonstrates proficiency, expertise and understanding of information necessary to perform job well. Is able to acquire and integrate knowledge to accomplish goals. Applies techniques, equipment and experience to perform job well. Takes personal responsibil","pxCreateOperator":"VenkatTama","pxCreateDateTime":"2025-04-24T05:21:31.503Z","pxCreateSystemID":"pega","pxCreateOpName":"Venkat Tama","Weightage":15.000000000}],"pxObjClass":"BIG-PAR-Work-AnnualPerformanceCycle","TotalPerformanceKRARating":4.500000000,"SearchByEmployee":"CTPL0380","HRReviewComments":" Test by an HR","SystemCalculatedFinalRating":4.5900000000,"TotalCompetencyKRARating":4.80,"PLInitialComments":"test by a PL","PerformanceKRAs":[{"Goal1":"85%","Description":"Contribution within the projects (Internal/External)","pxUpdateSystemID":"pega","Goal2":"90%","pxUpdateDateTime":"2025-07-21T05:41:38.517Z","EmpReviewComments_perf":"pop[","HRRating":5,"FinalReviewer":"HR","pxUpdateOpName":"Pavan A","PLRating":5,"pxUpdateOperator":"pavan.avula@bitsinglass.com","Emp_InitialComments_Perf":"Test","Department":"Quality Analyst","RMGRating":5,"RM_Ratings_Perf":5,"FinalHRComments_Perf":"ilio","RMInitialComments_Perf":"yuiyo","Weightage":10,"Designation":"Associate Technical Architect","RMGreviewerComments_Perf":"kh","PLReviewerComments_Perf":"uiouip","HRFinalRatingValue":0.50,"PerformanceName":"Utilization","pxObjClass":"BIG-PAR-Data-PerformanceKRA","Skill":"QA","PerformanceID":"P122","pzIndexOwnerKey":"BIG-PAR-WORK PAR-30002","Reviewer2":"RM","Reviewer1":"Employee","Emp_SelfRating_Perf":5,"Reviewer4":"RMG","PLinitialComments_perf":"futhytu","Reviewer3":"PL","Goal3":"100%"},{"Goal1":"� Productivity meets the set standards\n","Description":"Technical Trainings and Certifications","pxUpdateSystemID":"pega","Goal2":"� Productivity is above the set standards\n","pxUpdateDateTime":"2025-07-21T05:41:38.517Z","EmpReviewComments_perf":"khjlo","HRRating":4,"pxUpdateOpName":"Pavan A","FinalReviewer":"HR","PLRating":4,"pxUpdateOperator":"pavan.avula@bitsinglass.com","Emp_InitialComments_Perf":"wrwea","RMGRating":4,"Department":"Quality Analyst","RM_Ratings_Perf":4,"FinalHRComments_Perf":"yuio9","RMInitialComments_Perf":"fgjgh","Weightage":20.000000000,"Designation":"Associate Technical Architect","RMGreviewerComments_Perf":"jkghk","PLReviewerComments_Perf":"ujghikgh","HRFinalRatingValue":0.800000000,"TestGoal1":"41beca99-a5c9-45d7-8275-89b1d2baf494","PerformanceName":"Capability - Training","pxObjClass":"BIG-PAR-Data-PerformanceKRA","Skill":"QA","pzIndexOwnerKey":"BIG-PAR-WORK PAR-30002","PerformanceID":"P123","Reviewer2":"RM","Reviewer1":"Employee","Reviewer4":"RMG","Emp_SelfRating_Perf":4,"Reviewer3":"PL","PLinitialComments_perf":"iyuio","Goal3":"� Always produces more than the acceptable standards within defined timeframe"}],"AppraisalDate":"2025-09-03"}]
  }
};

export const BasePegaExtensionsEmployeeAppraisalReport: Story = args => {
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
        <PegaExtensionsEmployeeAppraisalReport {...props} {...args} />
      </>
    );
};

BasePegaExtensionsEmployeeAppraisalReport.args = {
  dataPage: configProps.dataPage,
  title: configProps.title,
  loadingMessage: configProps.loadingMessage,
  detailsDataPage: configProps.detailsDataPage
};
