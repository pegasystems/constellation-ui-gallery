/* eslint-disable react/jsx-no-useless-fragment */
// @ts-nocheck
import type { Meta, StoryObj } from '@storybook/react';
import ExportComponentNew from './index';
import configProps from './mock';

const meta: Meta<typeof ExportComponentNew> = {
  title: 'ExportComponentNew',
  component: ExportComponentNew,
  excludeStories: /.*Data$/,
};

export default meta;

type Story = StoryObj<typeof ExportComponentNew>;

if (!window.PCore) {
  window.PCore = {};
}

const mockData = {
  autoCompleteDataPage: {
    data : {
      data: [
          {
              "pxObjClass": "Rule-Obj-Property",
              "pyPropertyName": "pyDependsOnName"
          },
          {
              "pxObjClass": "Rule-Obj-Property",
              "pyPropertyName": "windchill_f"
          },
          {
              "pxObjClass": "Rule-Obj-Property",
              "pyPropertyName": "pyOTP"
          },
          {
              "pxObjClass": "Rule-Obj-Property",
              "pyPropertyName": "pySingleRunExplanation"
          },
          {
              "pxObjClass": "Rule-Obj-Property",
              "pyPropertyName": "iCalUID"
          },
          {
              "pxObjClass": "Rule-Obj-Property",
              "pyPropertyName": "pyUndefinedPageCountDesc"
          },
          {
              "pxObjClass": "Rule-Obj-Property",
              "pyPropertyName": "pyFileNameWithExtension"
          }
      ]
    }
  },
  D_LoadTableStructure: {
    data : {
      data : [
        {
            "pxObjClass": "Migration-Data",
            "schema": "static_tables",
            "physicalTableName": "clientonboard_address",
            "catalog": "avneet_kumar_catalog",
            "columns": [
                {
                    "pxObjClass": "Migration-Data",
                    "nullable": "false",
                    "Expression": {
                        "pxObjClass": "PegaGadget-ExpressionBuilder",
                        "pyLabel": "Test"
                    },
                    "name": "Address_id",
                    "type": "STRING"
                },
                {
                    "pxObjClass": "Migration-Data",
                    "nullable": "false",
                    "Expression": {
                        "pxObjClass": "PegaGadget-ExpressionBuilder",
                        "pyLabel": "Test"
                    },
                    "name": "pzInsKey",
                    "type": "STRING"
                },
                {
                    "pxObjClass": "Migration-Data",
                    "nullable": "true",
                    "Expression": {
                        "pxObjClass": "PegaGadget-ExpressionBuilder",
                        "pyLabel": "Test"
                    },
                    "name": "pxExtractIdentifier",
                    "type": "STRING"
                },
                {
                    "pxObjClass": "Migration-Data",
                    "nullable": "true",
                    "Expression": {
                        "pxObjClass": "PegaGadget-ExpressionBuilder",
                        "pyLabel": "Test"
                    },
                    "name": "pxExtractDateTime",
                    "type": "STRING"
                },
                {
                    "pxObjClass": "Migration-Data",
                    "nullable": "true",
                    "Expression": {
                        "pxObjClass": "PegaGadget-ExpressionBuilder",
                        "pyLabel": "Test"
                    },
                    "name": "AddressType",
                    "type": "STRING"
                },
                {
                    "pxObjClass": "Migration-Data",
                    "nullable": "true",
                    "Expression": {
                        "pxObjClass": "PegaGadget-ExpressionBuilder",
                        "pyLabel": "Test"
                    },
                    "name": "Country",
                    "type": "STRING"
                },
                {
                    "pxObjClass": "Migration-Data",
                    "nullable": "true",
                    "Expression": {
                        "pxObjClass": "PegaGadget-ExpressionBuilder",
                        "pyLabel": "Test"
                    },
                    "name": "Street",
                    "type": "STRING"
                },
                {
                    "pxObjClass": "Migration-Data",
                    "nullable": "true",
                    "Expression": {
                        "pxObjClass": "PegaGadget-ExpressionBuilder",
                        "pyLabel": "Test"
                    },
                    "name": "Town",
                    "type": "STRING"
                }
            ],
            "tableName": "clientonboard_address"
        },
        {
            "schema": "static_tables",
            "pxObjClass": "Migration-Data",
            "physicalTableName": "clientonboard",
            "columns": [
                {
                    "pxObjClass": "Migration-Data",
                    "nullable": "false",
                    "Expression": {
                        "pxObjClass": "PegaGadget-ExpressionBuilder",
                        "pyLabel": "Test"
                    },
                    "name": "Address_id",
                    "type": "STRING"
                },
                {
                    "pxObjClass": "Migration-Data",
                    "nullable": "false",
                    "Expression": {
                        "pxObjClass": "PegaGadget-ExpressionBuilder",
                        "pyLabel": "Test"
                    },
                    "name": "pzInsKey",
                    "type": "STRING"
                },
                {
                    "pxObjClass": "Migration-Data",
                    "nullable": "true",
                    "Expression": {
                        "pxObjClass": "PegaGadget-ExpressionBuilder",
                        "pyLabel": "Test"
                    },
                    "name": "pxExtractIdentifier",
                    "type": "STRING"
                },
                {
                    "pxObjClass": "Migration-Data",
                    "nullable": "true",
                    "Expression": {
                        "pxObjClass": "PegaGadget-ExpressionBuilder",
                        "pyLabel": "Test"
                    },
                    "name": "pxExtractDateTime",
                    "type": "STRING"
                },
                {
                    "pxObjClass": "Migration-Data",
                    "nullable": "true",
                    "Expression": {
                        "pxObjClass": "PegaGadget-ExpressionBuilder",
                        "pyLabel": "Test"
                    },
                    "name": "AddressType",
                    "type": "STRING"
                },
                {
                    "pxObjClass": "Migration-Data",
                    "nullable": "true",
                    "Expression": {
                        "pxObjClass": "PegaGadget-ExpressionBuilder",
                        "pyLabel": "Test"
                    },
                    "name": "Country",
                    "type": "STRING"
                },
                {
                    "pxObjClass": "Migration-Data",
                    "nullable": "true",
                    "Expression": {
                        "pxObjClass": "PegaGadget-ExpressionBuilder",
                        "pyLabel": "Test"
                    },
                    "name": "Street",
                    "type": "STRING"
                },
                {
                    "pxObjClass": "Migration-Data",
                    "nullable": "true",
                    "Expression": {
                        "pxObjClass": "PegaGadget-ExpressionBuilder",
                        "pyLabel": "Test"
                    },
                    "name": "Town",
                    "type": "STRING"
                },
                {
                    "pxObjClass": "Migration-Data",
                    "nullable": "false",
                    "Expression": {
                        "pxObjClass": "PegaGadget-ExpressionBuilder",
                        "pyLabel": "Test"
                    },
                    "name": "pzInsKey",
                    "type": "STRING"
                },
                {
                    "pxObjClass": "Migration-Data",
                    "nullable": "true",
                    "Expression": {
                        "pxObjClass": "PegaGadget-ExpressionBuilder",
                        "pyLabel": "Test"
                    },
                    "name": "pxExtractIdentifier",
                    "type": "STRING"
                },
                {
                    "pxObjClass": "Migration-Data",
                    "nullable": "true",
                    "Expression": {
                        "pxObjClass": "PegaGadget-ExpressionBuilder",
                        "pyLabel": "Test"
                    },
                    "name": "pxExtractDateTime",
                    "type": "STRING"
                },
                {
                    "pxObjClass": "Migration-Data",
                    "nullable": "true",
                    "Expression": {
                        "pxObjClass": "PegaGadget-ExpressionBuilder",
                        "pyLabel": "Test"
                    },
                    "name": "AccountNumber",
                    "type": "STRING"
                },
                {
                    "pxObjClass": "Migration-Data",
                    "nullable": "true",
                    "Expression": {
                        "pxObjClass": "PegaGadget-ExpressionBuilder",
                        "pyLabel": "Test"
                    },
                    "name": "Name",
                    "type": "STRING"
                },
                {
                    "pxObjClass": "Migration-Data",
                    "nullable": "true",
                    "Expression": {
                        "pxObjClass": "PegaGadget-ExpressionBuilder",
                        "pyLabel": "Test"
                    },
                    "name": "SortCode",
                    "type": "STRING"
                },
                {
                    "pxObjClass": "Migration-Data",
                    "nullable": "true",
                    "Expression": {
                        "pxObjClass": "PegaGadget-ExpressionBuilder",
                        "pyLabel": "Test"
                    },
                    "name": "pyID",
                    "type": "STRING"
                },
                {
                    "pxObjClass": "Migration-Data",
                    "nullable": "true",
                    "Expression": {
                        "pxObjClass": "PegaGadget-ExpressionBuilder",
                        "pyLabel": "Test"
                    },
                    "name": "FirstName",
                    "type": "STRING"
                },
                {
                    "pxObjClass": "Migration-Data",
                    "nullable": "true",
                    "Expression": {
                        "pxObjClass": "PegaGadget-ExpressionBuilder",
                        "pyLabel": "Test"
                    },
                    "name": "LastName",
                    "type": "STRING"
                },
                {
                    "pxObjClass": "Migration-Data",
                    "nullable": "true",
                    "Expression": {
                        "pxObjClass": "PegaGadget-ExpressionBuilder",
                        "pyLabel": "Test"
                    },
                    "name": "MiddleName",
                    "type": "STRING"
                }
            ],
            "catalog": "avneet_kumar_catalog",
            "primaryKey": [
                "pzInsKey"
            ],
            "tableName": "clientonboard"
        }
    ]
    }
  },
  caseTypesDataPage: {
    pxResults: [
      {
          "pyClassName": "BIG-ClientOnBoard-Work-ClientOnboard",
          "pyLabel": "Client Onboard"
      },
      {
          "pyClassName": "BIG-ClientOnBoard-Work-MerchantOnboard",
          "pyLabel": "Merchant Onboard"
      }]
  },
  treeData: {
    data : {
        pyTreeNodes: [
            {
                "pyNodeCaption": "BIG-ClientOnBoard-Work-ClientOnboard",
                "pyExpanded": "true",
                "pyUserData": {
                    "pySelectedValue": "BIG-ClientOnBoard-Work-ClientOnboard",
                    "pyOutputFormat": "CSV",
                    "pyPropertyMode": "Class",
                    "pyPageClass": "BIG-ClientOnBoard-Work-ClientOnboard",
                    "pyOutputName": "BIG-ClientOnBoard-Work-ClientOnboard",
                    "pyProperties": [
                        {
                            "pyNodeCaption": "BankDetails",
                            "pyPropertyMode": "Page",
                            "pyPageClass": "BIG-ClientOnBoard-Data-BankDetails",
                            "pyMaxLength": 0,
                            "pyStringType": "Text",
                            "pyPropertyName": "BankDetails"
                        },
                        {
                            "pyNodeCaption": "FirstName",
                            "pyPropertyMode": "String",
                            "pyPageClass": "",
                            "pyMaxLength": 0,
                            "pyStringType": "Text",
                            "pyPropertyName": "FirstName"
                        },
                        {
                            "pyNodeCaption": "MiddleName",
                            "pyPropertyMode": "String",
                            "pyPageClass": "",
                            "pyMaxLength": 0,
                            "pyStringType": "Text",
                            "pyPropertyName": "MiddleName"
                        }
                    ],
                    "pyType": "Class",
                    "pyMapName": "",
                    "pyFilterString": "",
                    "pxWarningsToDisplay": []
                },
                "pyTreeNodes": [
                    {
                        "pyNodeCaption": "BankDetails",
                        "pyUserData": {
                            "pySelectedValue": "BIG-ClientOnBoard-Data-BankDetails",
                            "pyPrecision": "",
                            "pyOutputFormat": "CSV",
                            "pyPropertyMode": "Page",
                            "pyPageClass": "BIG-ClientOnBoard-Data-BankDetails",
                            "pyKeyName": "BankDetails_id",
                            "pyProperties": [
                                {
                                    "pyNodeCaption": "AccountNumber",
                                    "pyPropertyMode": "String",
                                    "pyPageClass": "",
                                    "pyMaxLength": 0,
                                    "pyStringType": "Integer",
                                    "pyPropertyName": "AccountNumber"
                                },
                                {
                                    "pyNodeCaption": "Name",
                                    "pyPropertyMode": "String",
                                    "pyPageClass": "",
                                    "pyMaxLength": 256,
                                    "pyStringType": "Text",
                                    "pyPropertyName": "Name"
                                },
                                {
                                    "pyNodeCaption": "SortCode",
                                    "pyPropertyMode": "String",
                                    "pyPageClass": "",
                                    "pyMaxLength": 256,
                                    "pyStringType": "Text",
                                    "pyPropertyName": "SortCode"
                                }
                            ],
                            "pyType": "Page",
                            "pyMapName": "",
                            "pyFilterString": "",
                            "pxWarningsToDisplay": []
                        },
                        "pyTreeNodes": [
                            {
                                "pyNodeCaption": "AccountNumber",
                                "pyUserData": {
                                    "pyPrecision": "",
                                    "pyPropertyMode": "String",
                                    "pyOutputFormat": "CSV",
                                    "pyPageClass": "",
                                    "pyType": "Integer"
                                },
                                "pyTreeNodes": [],
                                "pyName": "AccountNumber",
                                "pyImage": "desktopimages/ae_instance.gif"
                            },
                            {
                                "pyNodeCaption": "Name",
                                "pyUserData": {
                                    "pyPropertyMode": "String",
                                    "pyOutputFormat": "CSV",
                                    "pyPageClass": "",
                                    "pyType": "Text"
                                },
                                "pyTreeNodes": [],
                                "pyName": "Name",
                                "pyImage": "desktopimages/ae_instance.gif"
                            },
                            {
                                "pyNodeCaption": "SortCode",
                                "pyUserData": {
                                    "pyPropertyMode": "String",
                                    "pyOutputFormat": "CSV",
                                    "pyPageClass": "",
                                    "pyType": "Text"
                                },
                                "pyTreeNodes": [],
                                "pyName": "SortCode",
                                "pyImage": "desktopimages/ae_instance.gif"
                            }
                        ],
                        "pyName": "BankDetails",
                        "pyImage": "images/page.gif",
                        "pxWarningsToDisplay": []
                    },
                    {
                        "pyNodeCaption": "FirstName",
                        "pyUserData": {
                            "pyPropertyMode": "String",
                            "pyOutputFormat": "CSV",
                            "pyPageClass": "",
                            "pyType": "Text",
                            "pyMapName": ""
                        },
                        "pyTreeNodes": [],
                        "pyName": "FirstName",
                        "pyImage": "desktopimages/ae_instance.gif"
                    },
                    {
                        "pyNodeCaption": "MiddleName",
                        "pyUserData": {
                            "pyPropertyMode": "String",
                            "pyOutputFormat": "CSV",
                            "pyPageClass": "",
                            "pyType": "Text",
                            "pyMapName": ""
                        },
                        "pyTreeNodes": [],
                        "pyName": "MiddleName",
                        "pyImage": "desktopimages/ae_instance.gif"
                    }
                ],
                "pyName": "BIG-ClientOnBoard-Work-ClientOnboard",
                "pyPropRef": "",
                "pyImage": "images/page.gif",
                "pxWarningsToDisplay": []
            }
        ]
    }
  },
  exportDetailsDataPage: {
    data: {
      data: [
        {
            "pxSaveDateTime": null,
            "pxUpdateSystemID": "pega24crochetech",
            "pxUpdateDateTime": "2025-10-17T11:23:22.016Z",
            "pxUpdateOpName": "twinkle chawla",
            "pxUpdateOperator": "twinkle.chawla@bitsinglass.com",
            "pxObjClass": "BIG-ClientOnBoard-Data-ExportDetails",
            "pyID": "E-1",
            "pxCreateOperator": "twinkle.chawla@bitsinglass.com",
            "pyValueLabel": null,
            "pxCreateDateTime": "2025-10-17T11:23:03.990Z",
            "pyNote": null,
            "ExportName": "Amazon S3 Bucket",
            "pxCreateSystemID": "pega24crochetech",
            "pxCommitDateTime": null,
            "pyGUID": null,
            "pyLabel": "E-1",
            "pxCreateOpName": "twinkle chawla",
            "pySelected": false
        },
        {
            "pxSaveDateTime": null,
            "pxUpdateSystemID": "pega24crochetech",
            "pxUpdateDateTime": "2025-10-17T11:23:28.599Z",
            "pxUpdateOpName": "twinkle chawla",
            "pxUpdateOperator": "twinkle.chawla@bitsinglass.com",
            "pxObjClass": "BIG-ClientOnBoard-Data-ExportDetails",
            "pyID": "E-2",
            "pxCreateOperator": "twinkle.chawla@bitsinglass.com",
            "pyValueLabel": null,
            "pxCreateDateTime": "2025-10-17T11:23:22.319Z",
            "pyNote": null,
            "ExportName": "Kafka",
            "pxCreateSystemID": "pega24crochetech",
            "pxCommitDateTime": null,
            "pyGUID": null,
            "pyLabel": "E-2",
            "pxCreateOpName": "twinkle chawla",
            "pySelected": false
        }
    ]
    }
  },
  targetSystemDataPage: {
    data: {
      data: [{
            "pxSaveDateTime": null,
            "pxUpdateSystemID": "pega24crochetech",
            "pxUpdateDateTime": "2025-10-17T11:26:42.530Z",
            "pxUpdateOpName": "twinkle chawla",
            "pxUpdateOperator": "twinkle.chawla@bitsinglass.com",
            "pxObjClass": "BIG-ClientOnBoard-Data-TargetSystem",
            "pyID": null,
            "pxCreateOperator": "twinkle.chawla@bitsinglass.com",
            "pyValueLabel": null,
            "pxCreateDateTime": "2025-10-17T11:26:33.536Z",
            "pyNote": null,
            "TargetSystem": "Databricks",
            "pxCreateSystemID": "pega24crochetech",
            "pyGUID": "T-1",
            "pxCommitDateTime": null,
            "pyLabel": "T-1",
            "pxCreateOpName": "twinkle chawla",
            "pySelected": false
        },
        {
            "pxSaveDateTime": null,
            "pxUpdateSystemID": "pega24crochetech",
            "pxUpdateDateTime": "2025-10-17T11:26:48.915Z",
            "pxUpdateOpName": "twinkle chawla",
            "pxUpdateOperator": "twinkle.chawla@bitsinglass.com",
            "pxObjClass": "BIG-ClientOnBoard-Data-TargetSystem",
            "pyID": null,
            "pxCreateOperator": "twinkle.chawla@bitsinglass.com",
            "pyValueLabel": null,
            "pxCreateDateTime": "2025-10-17T11:26:42.712Z",
            "pyNote": null,
            "TargetSystem": "Snowflake",
            "pxCreateSystemID": "pega24crochetech",
            "pyGUID": "T-2",
            "pxCommitDateTime": null,
            "pyLabel": "T-2",
            "pxCreateOpName": "twinkle chawla",
            "pySelected": false
        },
        {
            "pxSaveDateTime": null,
            "pxUpdateSystemID": "pega24crochetech",
            "pxUpdateDateTime": "2025-10-17T11:26:48.915Z",
            "pxUpdateOpName": "twinkle chawla",
            "pxUpdateOperator": "twinkle.chawla@bitsinglass.com",
            "pxObjClass": "BIG-ClientOnBoard-Data-TargetSystem",
            "pyID": null,
            "pxCreateOperator": "twinkle.chawla@bitsinglass.com",
            "pyValueLabel": null,
            "pxCreateDateTime": "2025-10-17T11:26:42.712Z",
            "pyNote": null,
            "TargetSystem": "Other",
            "pxCreateSystemID": "pega24crochetech",
            "pyGUID": "Other",
            "pxCommitDateTime": null,
            "pyLabel": "T-2",
            "pxCreateOpName": "twinkle chawla",
            "pySelected": false
        }
      ]
    }
  },
  extractRuleDataPage: {
    data: {
      data: [{
            "pxSaveDateTime": null,
            "pxUpdateSystemID": "pega24crochetech",
            "pxUpdateDateTime": "2025-10-17T11:29:38.120Z",
            "pxUpdateOpName": "twinkle chawla",
            "pxUpdateOperator": "twinkle.chawla@bitsinglass.com",
            "pxObjClass": "BIG-ClientOnBoard-Data-ExtractRule",
            "pyID": null,
            "pxCreateOperator": "twinkle.chawla@bitsinglass.com",
            "pyValueLabel": null,
            "pxCreateDateTime": "2025-10-17T11:29:13.212Z",
            "ExtractRuleName": "Extract Merchant",
            "pyNote": null,
            "pxCreateSystemID": "pega24crochetech",
            "pyGUID": "R-1",
            "pxCommitDateTime": null,
            "pyLabel": "R-1",
            "pxCreateOpName": "twinkle chawla",
            "pySelected": false
        },
        {
            "pxSaveDateTime": null,
            "pxUpdateSystemID": "pega24crochetech",
            "pxUpdateDateTime": "2025-10-17T11:29:51.284Z",
            "pxUpdateOpName": "twinkle chawla",
            "pxUpdateOperator": "twinkle.chawla@bitsinglass.com",
            "pxObjClass": "BIG-ClientOnBoard-Data-ExtractRule",
            "pyID": null,
            "pxCreateOperator": "twinkle.chawla@bitsinglass.com",
            "pyValueLabel": null,
            "pxCreateDateTime": "2025-10-17T11:29:38.301Z",
            "ExtractRuleName": "Merchant Onboard",
            "pyNote": null,
            "pxCreateSystemID": "pega24crochetech",
            "pyGUID": "R-2",
            "pxCommitDateTime": null,
            "pyLabel": "R-2",
            "pxCreateOpName": "twinkle chawla",
            "pySelected": false
        },
        {
            "pxSaveDateTime": null,
            "pxUpdateSystemID": "pega24crochetech",
            "pxUpdateDateTime": "2025-10-17T11:30:37.502Z",
            "pxUpdateOpName": "twinkle chawla",
            "pxUpdateOperator": "twinkle.chawla@bitsinglass.com",
            "pxObjClass": "BIG-ClientOnBoard-Data-ExtractRule",
            "pyID": null,
            "pxCreateOperator": "twinkle.chawla@bitsinglass.com",
            "pyValueLabel": null,
            "pxCreateDateTime": "2025-10-17T11:29:51.456Z",
            "ExtractRuleName": "Extract Client on Board",
            "pyNote": null,
            "pxCreateSystemID": "pega24crochetech",
            "pyGUID": "R-3",
            "pxCommitDateTime": null,
            "pyLabel": "R-3",
            "pxCreateOpName": "twinkle chawla",
            "pySelected": false
        },
        {
            "pxSaveDateTime": null,
            "pxUpdateSystemID": "pega24crochetech",
            "pxUpdateDateTime": "2025-10-17T11:30:33.592Z",
            "pxUpdateOpName": "twinkle chawla",
            "pxUpdateOperator": "twinkle.chawla@bitsinglass.com",
            "pxObjClass": "BIG-ClientOnBoard-Data-ExtractRule",
            "pyID": null,
            "pxCreateOperator": "twinkle.chawla@bitsinglass.com",
            "pyValueLabel": null,
            "pxCreateDateTime": "2025-10-17T11:30:20.917Z",
            "ExtractRuleName": "Client on Board",
            "pyNote": null,
            "pxCreateSystemID": "pega24crochetech",
            "pyGUID": "R-4",
            "pxCommitDateTime": null,
            "pyLabel": "R-4",
            "pxCreateOpName": "twinkle chawla",
            "pySelected": false
        }]
    }
  }
};

window.PCore.getDataPageUtils = () => {
  return {
    getPageDataAsync: (endpoint) => {
      switch (endpoint) {
        case 'caseTypesDataPage':
          return Promise.resolve(mockData.caseTypesDataPage);
        case 'treeData':
          return Promise.resolve(mockData.treeData);
        default:
          return Promise.reject(new Error('Unknown endpoint'));
      }
    }
  }
}

window.PCore.getDataApiUtils = () => {
  return {
    getData: (endpoint) => {
      switch (endpoint) {
        case 'D_LoadTableStructure':
          return Promise.resolve(mockData.D_LoadTableStructure);
        case 'autoCompleteDataPage':
          return Promise.resolve(mockData.autoCompleteDataPage);
        case 'caseTypesDataPage':
          return Promise.resolve(mockData.caseTypesDataPage);
        case 'exportDetailsDataPage':
          return Promise.resolve(mockData.exportDetailsDataPage);
        case 'targetSystemDataPage':
          return Promise.resolve(mockData.targetSystemDataPage);
        case 'extractRuleDataPage':
          return Promise.resolve(mockData.extractRuleDataPage);
        default:
          return Promise.reject(new Error('Unknown endpoint'));
      }
    }
  }
};

export const BaseExportComponent: Story = (args) => {
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
      resolveConfigProps: () => {}
    }),
  };

  return (
    <>
      <ExportComponentNew {...props} {...args} />
    </>
  );
};

BaseExportComponent.args = {
  caseTypesDataPage: configProps.caseTypesDataPage,
  exportDetailsDataPage: configProps.exportDetailsDataPage,
  targetSystemDataPage: configProps.targetSystemDataPage,
  extractRuleDataPage: configProps.extractRuleDataPage,
  autoCompleteDataPage: configProps.autoCompleteDataPage,
  treeViewDataPage: configProps.treeViewDataPage
};
