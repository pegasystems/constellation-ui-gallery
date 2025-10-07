/* eslint-disable react/jsx-no-useless-fragment */
// @ts-nocheck
import type { Meta, StoryObj } from '@storybook/react';
import EmployeeMonitoringDashboard from './index';
import configProps from './mock';

const meta: Meta<typeof EmployeeMonitoringDashboard> = {
  title: 'EmployeeReportingDashboard',
  component: EmployeeMonitoringDashboard,
  excludeStories: /.*Data$/,
};

export default meta;

type Story = StoryObj<typeof EmployeeMonitoringDashboard>;

if (!window.PCore) {
  window.PCore = {};
}

const mockData = {
  employeeAllAppraisalsDataPage: {
    data: {
      data: [
        {
            "pyStatusWork": "Resolved-Completed",
            "pyID": "PAR-31119",
            "FinalRatingOfEmployee": 2.000000000,
            "pxObjClass": "BIG-PAR-Work-AnnualPerformanceCycle",
            "pzInsKey": "BIG-PAR-WORK PAR-31119",
            "AppraisalTargetDate": "2026-08-29"
        },
        {
            "pyStatusWork": "Pending-KRA Assignment",
            "pyID": "PAR-31108",
            "FinalRatingOfEmployee": null,
            "pxObjClass": "BIG-PAR-Work-AnnualPerformanceCycle",
            "pzInsKey": "BIG-PAR-WORK PAR-31108",
            "AppraisalTargetDate": "2026-08-25"
        }
      ]
    },
  },
  currentAppraisalsDataPage: {
    data: {
      data: [{
          "pxObjClass": "BIG-PAR-Work-AnnualPerformanceCycle",
          "pyStatusWork": "Pending-KRA Assignment",
          "pyID": "PAR-31108",
          "FinalRatingOfEmployee": 2,
          "pyDateValue": [
              "2026-01-01"
          ],
          "KRACompRO": [
              {
                  "pxObjClass": "BIG-PAR-Data-CompetencyKRAsNew",
                  "CompetencyDescription": "Achieves effective business results through focusing on external and internal customer satisfaction. Is customer driven and changes mode of operation to meet customer needs.",
                  "HRCompFinalRatingValue": 0E-9,
                  "CompetencyName": "Policy Adherence",
                  "CompetencyID": "C065",
                  "Reviewer": "HR",
                  "JobTitle": "7A",
                  "Weightage": 25.000000000
              },
              {
                  "HRCompFinalRatingValue": 0E-9,
                  "CompetencyName": "Flexibility",
                  "pxUpdateSystemID": "pega",
                  "CompetencyID": "C002",
                  "pxUpdateDateTime": "2025-04-24T05:10:17.750Z",
                  "pxUpdateOpName": "Venkat Tama",
                  "pxUpdateOperator": "VenkatTama",
                  "Reviewer": "PL",
                  "JobTitle": "7A",
                  "pxObjClass": "BIG-PAR-Data-CompetencyKRAsNew",
                  "CompetencyDescription": "Modifies behavior and points of view in response to changing conditions. Adapts to change and integrates changes into existing strategies and processes. Seeks out different approaches to improve performance, streamline work and/or achieve high standards or",
                  "pxCreateOperator": "VenkatTama",
                  "pxCreateDateTime": "2025-04-24T05:09:47.293Z",
                  "pxCreateSystemID": "pega",
                  "pxCreateOpName": "Venkat Tama",
                  "Weightage": 15.000000000
              },
              {
                  "HRCompFinalRatingValue": 0E-9,
                  "pxUpdateSystemID": "pega",
                  "CompetencyName": "Job knowledge",
                  "CompetencyID": "C015",
                  "pxUpdateDateTime": "2025-04-24T05:19:21.983Z",
                  "pxUpdateOpName": "Venkat Tama",
                  "pxUpdateOperator": "VenkatTama",
                  "Reviewer": "PL",
                  "JobTitle": "7A",
                  "pxObjClass": "BIG-PAR-Data-CompetencyKRAsNew",
                  "CompetencyDescription": "Demonstrates proficiency, expertise and understanding of information necessary to perform job well. Is able to acquire and integrate knowledge to accomplish goals. Applies techniques, equipment and experience to perform job well. Takes personal responsibil",
                  "pxCreateOperator": "VenkatTama",
                  "pxCreateDateTime": "2025-04-24T05:18:47.194Z",
                  "pxCreateSystemID": "pega",
                  "pxCreateOpName": "Venkat Tama",
                  "Weightage": 15.000000000
              },
              {
                  "HRCompFinalRatingValue": 0E-9,
                  "pxUpdateSystemID": "pega",
                  "CompetencyName": "Initiative",
                  "CompetencyID": "C028",
                  "pxUpdateDateTime": "2025-04-24T05:27:16.624Z",
                  "pxUpdateOpName": "Venkat Tama",
                  "pxUpdateOperator": "VenkatTama",
                  "Reviewer": "PL",
                  "JobTitle": "7A",
                  "pxObjClass": "BIG-PAR-Data-CompetencyKRAsNew",
                  "CompetencyDescription": "Strives consistently to succeed. Begins and follows through on a course of action. Is self-motivated and strives to accomplish objectives. Seizes opportunities to make improvements. Strives continually to improve the quality of work and the work environmen",
                  "pxCreateOperator": "VenkatTama",
                  "pxCreateDateTime": "2025-04-24T05:25:57.689Z",
                  "pxCreateSystemID": "pega",
                  "pxCreateOpName": "Venkat Tama",
                  "Weightage": 20.000000000
              },
              {
                  "pxObjClass": "BIG-PAR-Data-CompetencyKRAsNew",
                  "CompetencyDescription": "Acquiring new skills enhances personal abilities and can open up new opportunities. Knowledge expansion understanding of various subjects, leading to intellectual growth.",
                  "HRCompFinalRatingValue": 0E-9,
                  "CompetencyName": "Learning",
                  "CompetencyID": "C041",
                  "Reviewer": "RMG",
                  "JobTitle": "7A",
                  "Weightage": 10.000000000
              },
              {
                  "HRCompFinalRatingValue": 0E-9,
                  "pxUpdateSystemID": "pega",
                  "CompetencyName": "Communication Skills",
                  "CompetencyID": "C064",
                  "pxUpdateDateTime": "2025-04-24T05:47:55.324Z",
                  "pxUpdateOpName": "Venkat Tama",
                  "pxUpdateOperator": "VenkatTama",
                  "Reviewer": "HR",
                  "JobTitle": "7A",
                  "pxObjClass": "BIG-PAR-Data-CompetencyKRAsNew",
                  "CompetencyDescription": "Influences and convinces others to support a course of action by presenting oral and written ideas and messages clearly. Uses appropriate vocabulary and grammar. Listens effectively and makes sure that he/she is understood. Provides effective performance f",
                  "pxCreateOperator": "VenkatTama",
                  "pxCreateDateTime": "2025-04-24T05:46:45.985Z",
                  "pxCreateSystemID": "pega",
                  "pxCreateOpName": "Venkat Tama",
                  "Weightage": 15.000000000
              }
          ],
          "pzInsKey": "BIG-PAR-WORK PAR-31108",
          "PerformanceKRAs": [
              {
                  "Goal1": "On time delivery (on project/lab assignments given by platform leads)",
                  "Goal2": "Participated in min 1 Service Line initiative.",
                  "Description": "Quality of Deliverables",
                  "pxUpdateSystemID": "pega24crochetech",
                  "pxUpdateDateTime": "2025-09-25T07:05:44.782Z",
                  "FinalReviewer": "HR",
                  "pxUpdateOpName": "Nilesh Patil",
                  "pxUpdateOperator": "nilesh.patil@bitsinglass.com",
                  "Department": "Pega",
                  "pxCreateDateTime": "2025-07-09T13:47:00.000Z",
                  "Weightage": 20.000000000,
                  "Designation": "Software Engineer",
                  "HRFinalRatingValue": 0E-9,
                  "PerformanceName": "Delivery",
                  "pxObjClass": "BIG-PAR-Data-PerformanceKRA",
                  "pxCreateOperator": "pavan.avula@bitsinglass.com",
                  "Skill": "Skill",
                  "pzIndexOwnerKey": "BIG-PAR-WORK PAR-31108",
                  "PerformanceID": "P009",
                  "Reviewer2": "RM",
                  "Reviewer1": "Employee",
                  "pxCreateSystemID": "pega",
                  "Reviewer4": "CSM",
                  "Reviewer3": "PL",
                  "pxCreateOpName": "Pavan A",
                  "Goal3": "Participated in min 1 Service Line initiatives."
              },
              {
                  "Designation": "Software Engineer",
                  "Goal1": "85%",
                  "Description": "Contribution within the projects (Internal/External)",
                  "pxUpdateSystemID": "pega",
                  "Goal2": "90%",
                  "pxUpdateDateTime": "2025-07-21T05:41:38.514Z",
                  "FinalReviewer": "HR",
                  "pxUpdateOpName": "Pavan A",
                  "HRFinalRatingValue": 0E-9,
                  "pxUpdateOperator": "pavan.avula@bitsinglass.com",
                  "PerformanceName": "Utilization",
                  "pxObjClass": "BIG-PAR-Data-PerformanceKRA",
                  "Skill": "Pega",
                  "Department": "Pega",
                  "PerformanceID": "P037",
                  "pzIndexOwnerKey": "BIG-PAR-WORK PAR-31108",
                  "Reviewer2": "RM",
                  "Reviewer1": "Employee",
                  "Reviewer4": "RMG",
                  "Reviewer3": "PL",
                  "Goal3": "100%",
                  "Weightage": 20.000000000
              },
              {
                  "Goal1": "1 platform specific training and certification\n\nWorking knowledge on foundation tools, frameworks. (e.g. CICD/ CSA/ CSSA) \n\nCompleted training and certification on time.",
                  "Goal2": "1  sector specific training.\n\n1 Pega academy mission to earn the badges (except CSA/CSSA and Pega express delivery badges)",
                  "Description": "Technical Trainings and Certifications",
                  "pxUpdateSystemID": "pega24crochetech",
                  "pxUpdateDateTime": "2025-09-25T07:09:05.421Z",
                  "FinalReviewer": "HR",
                  "pxUpdateOpName": "Nilesh Patil",
                  "pxUpdateOperator": "nilesh.patil@bitsinglass.com",
                  "Department": "Pega",
                  "pxCreateDateTime": "2025-09-25T07:09:05.421Z",
                  "Weightage": 20.000000000,
                  "Designation": "Software Engineer",
                  "HRFinalRatingValue": 0E-9,
                  "PerformanceName": "Capability - Training",
                  "pxObjClass": "BIG-PAR-Data-PerformanceKRA",
                  "pxCreateOperator": "nilesh.patil@bitsinglass.com",
                  "Skill": "Pega",
                  "pzIndexOwnerKey": "BIG-PAR-WORK PAR-31108",
                  "PerformanceID": "P038",
                  "Reviewer2": "RM",
                  "Reviewer1": "Employee",
                  "pxCreateSystemID": "pega24crochetech",
                  "Reviewer4": "RMG",
                  "Reviewer3": "PL",
                  "pxCreateOpName": "Nilesh Patil",
                  "Goal3": "1 any new-age tech. training and certification related to the platform \n\nExercise Sample Application development successfuly done single handedly."
              },
              {
                  "Goal1": "1 contribution by year end.",
                  "Goal2": "1 contribution by year end.",
                  "Description": "Instances of contributing to Asset/ Innovation/ IP development",
                  "pxUpdateSystemID": "pega24crochetech",
                  "pxUpdateDateTime": "2025-09-25T07:09:10.599Z",
                  "FinalReviewer": "HR",
                  "pxUpdateOpName": "Nilesh Patil",
                  "pxUpdateOperator": "nilesh.patil@bitsinglass.com",
                  "Department": "Pega",
                  "pxCreateDateTime": "2025-09-25T07:09:10.598Z",
                  "Weightage": 20.000000000,
                  "Designation": "Software Engineer",
                  "HRFinalRatingValue": 0E-9,
                  "PerformanceName": "Capability - Innovation",
                  "pxObjClass": "BIG-PAR-Data-PerformanceKRA",
                  "pxCreateOperator": "nilesh.patil@bitsinglass.com",
                  "Skill": "Pega",
                  "pzIndexOwnerKey": "BIG-PAR-WORK PAR-31108",
                  "PerformanceID": "P039",
                  "Reviewer2": "RM",
                  "Reviewer1": "Employee",
                  "pxCreateSystemID": "pega24crochetech",
                  "Reviewer3": "PL",
                  "pxCreateOpName": "Nilesh Patil",
                  "Goal3": "1 contribution by year end."
              },
              {
                  "Goal1": "NA",
                  "Goal2": "Mentoring of 1 associate",
                  "Description": "Next level of Grooming",
                  "pxUpdateSystemID": "pega24crochetech",
                  "pxUpdateDateTime": "2025-09-25T07:09:16.246Z",
                  "FinalReviewer": "HR",
                  "pxUpdateOpName": "Nilesh Patil",
                  "pxUpdateOperator": "nilesh.patil@bitsinglass.com",
                  "Department": "Pega",
                  "pxCreateDateTime": "2025-09-25T07:09:16.246Z",
                  "Weightage": 20.000000000,
                  "Designation": "Software Engineer",
                  "HRFinalRatingValue": 0E-9,
                  "PerformanceName": "People",
                  "pxObjClass": "BIG-PAR-Data-PerformanceKRA",
                  "pxCreateOperator": "nilesh.patil@bitsinglass.com",
                  "Skill": "Pega",
                  "pzIndexOwnerKey": "BIG-PAR-WORK PAR-31108",
                  "PerformanceID": "P041",
                  "Reviewer2": "RM",
                  "Reviewer1": "Employee",
                  "pxCreateSystemID": "pega24crochetech",
                  "Reviewer3": "PL",
                  "pxCreateOpName": "Nilesh Patil",
                  "Goal3": "Mentoring of  1  associate"
              }
          ],
          "AppraisalTargetDate": "2026-08-25"
      }]
    }
  },
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
        case 'currentAppraisalsDataPage':
          return Promise.resolve(mockData.currentAppraisalsDataPage);
        case 'employeeAllAppraisalsDataPage':
          return Promise.resolve(mockData.employeeAllAppraisalsDataPage);
        default:
          return Promise.reject(new Error('Unknown endpoint'));
      }
    },
  };
};

export const BaseEmployeeMonitoringDashboard: Story = (args) => {
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
      <EmployeeMonitoringDashboard {...props} {...args} />
    </>
  );
};

BaseEmployeeMonitoringDashboard.args = {
  currentAppraisalsDataPage: configProps.currentAppraisalsDataPage,
  employeeAllAppraisalsDataPage: configProps.employeeAllAppraisalsDataPage
};
