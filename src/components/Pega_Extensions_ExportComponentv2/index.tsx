import { useEffect, useState, useRef } from 'react';
import { withConfiguration } from '@pega/cosmos-react-core';
import type { PConnFieldProps } from './PConnProps';
import GlobalStyle from './styles';
import { fetchDataPage, fetchPageDataPage } from './apiUtils';
import styled from 'styled-components';
import { Tree } from 'primereact/tree';
import { Toast } from 'primereact/toast';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import Autocomplete from './Autocomplete';

const DashboardWrapper = styled.div`
  background: #ffffff;
  min-height: 100%;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system,
    "Segoe UI", Roboto, "Helvetica Neue", Arial;
  font-size: 14px;
  color: #111827;
  padding: 16px;
`;

const FieldRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  gap: 12px;

  label {
    flex: 0 0 40%;
    font-weight: 600;
  }

  select {
    flex: 1;
    padding: 4px;
  }

  span {
    color: red;
  }
`;

const SectionHeading = styled.h4`
  margin-top: 24px;
  margin-bottom: 12px;
  color: #111827;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 4px;
`;

interface DashboardProps extends PConnFieldProps {
  caseTypesDataPage: string;
  exportDetailsDataPage: string;
  autoCompleteDataPage: string;
  targetSystemDataPage: string;
  extractRuleDataPage: string;
  treeViewDataPage: string;
  loadTableStructureDataPage: string;
  kafkaDataBricksSaveDataPage: string;
  kafkaJsonSaveDataPage: string;
}

function ExportComponentV2(props: DashboardProps) {
  const {
    getPConnect,
    caseTypesDataPage,
    loadTableStructureDataPage,
    autoCompleteDataPage,
    exportDetailsDataPage,
    targetSystemDataPage,
    extractRuleDataPage,
    treeViewDataPage,
    kafkaDataBricksSaveDataPage,
    kafkaJsonSaveDataPage
  } = props;

  const toast = useRef<any>(null);
  const PConnect = getPConnect();
  const context = PConnect.getContextName();
  /* eslint-disable no-console */
  console.log(context);

  const [isLoading, setIsLoading] = useState(true);

  // Dropdown data states
  const [caseTypes, setCaseTypes] = useState<any[]>([]);
  const [exportModes, setExportModes] = useState<any[]>([]);
  const [targetSystems, setTargetSystems] = useState<any[]>([]);
  const [extractRules, setExtractRules] = useState<any[]>([]);
  const [autoCompleteFields, setautoCompleteFields] = useState<any[]>([]);

  // Selected values
  const [selectedCaseType, setSelectedCaseType] = useState('');
  const [selectedMode, setSelectedMode] = useState('');
  const [selectedTarget, setSelectedTarget] = useState('');
  const [selectedExtract, setSelectedExtract] = useState('');
  const [treeData, setTreeData] = useState<any>(null);
  // const [nodes, setNodes] = useState<TreeNode[]>([]);
  const [dataBricksForm, setDataBricksForm] = useState<any>(null);

  const [fileContent, setFileContent] = useState<any>(null);
  const [uploadedTable, setUploadedTable] = useState<any>(null);
  const [uploadedTableValues, setUploadedTableValues] = useState<Record<string, any>>({});
  const [dataBricksValues, setDataBricksValues] = useState<Record<string, Record<string, string>>>({});

  const handleUploadedTableChange = (columnName: string, value: any) => {
    console.log('Selected:', columnName, value);
    setUploadedTableValues(prev => ({
      ...prev,
      [columnName]: value
    }));
    console.log(uploadedTableValues);
  };

  const handleDataBricksChange = (tableName: string, columnName: string, value: string) => {
    setDataBricksValues(prev => ({
      ...prev,
      [tableName]: {
        ...(prev[tableName] || {}),
        [columnName]: value
      }
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);

        const isValidStructure =
          typeof json.physicalTableName === 'string' &&
          Array.isArray(json.columns) &&
          json.columns.length > 0 &&
          json.columns.every(
            (col: any) =>
              typeof col.name === 'string' &&
              typeof col.type === 'string'
          );

        if (!isValidStructure) {
          toast.current?.show({
            severity: 'error',
            summary: 'Invalid File Format',
            detail:
              'The uploaded JSON does not match the required table structure format. Please check the expected keys (tableName, columns, etc.).',
            life: 1000
          });
          setFileContent(null);
          return;
        }

        setFileContent(json);
        // toast.current?.show({
        //   severity: 'success',
        //   summary: 'File Uploaded',
        //   detail: `Successfully loaded table: ${json.tableName}`,
        //   life: 3000
        // });

      } catch (error) {
        toast.current?.show({
          severity: 'error',
          summary: 'Invalid File Format',
          detail:
            'The uploaded JSON does not match the required table structure format. Please check the expected keys (tableName, columns, etc.).',
          life: 1000
        });
        setFileContent(null);
      }
    };
    reader.readAsText(file);
  };

  // Generate table structure
  const generateTableStructure = () => {
    if (!fileContent) {
      /* eslint-disable no-console */
      console.log('Please upload a valid JSON file first.');
      toast.current?.show({
        severity: 'error',
        summary: 'Invalid File Format',
        detail:
          'The uploaded JSON does not match the required table structure format. Please check the expected keys (tableName, columns, etc.).',
        life: 1000
      });
      return;
    }
    setUploadedTable(fileContent);
  };


  const configFields = [
    { label: 'Bucket Name', prop: 'pyBucketName', required: true },
    { label: 'Root path', prop: 'pyRootpath', required: true },
    { label: 'Access key id', prop: 'pyAccessKeyId', required: true },
    { label: 'Secret access key', prop: 'pySecretAccessKey', required: true, secure: true }
  ];

  const advancedSettingsFields = [
      { label: 'Connection max idle time', prop: 'pyConnectionMaxIdle' },
      { label: 'Max connection pool size', prop: 'pyConnectionPoolMax' },
      { label: 'New connection timeout', prop: 'pyConnectionTimeout' },
      { label: 'Expiration time for connections in the pool', prop: 'pyConnectionTTL' },
      { label: 'Request timeout', prop: 'pyRequestTimeout' }
  ];

  const [otherConfig, setOtherConfig] = useState<Record<string, string | boolean>>({
    pyBucketName: '',
    pyRootpath: '',
    pyAccessKeyId: '',
    pySecretAccessKey: '',
    pyConnectionMaxIdle: '60000',
    pyConnectionPoolMax: '50',
    pyConnectionTimeout: '10000',
    pyConnectionTTL: '-1',
    pyRequestTimeout: '0',
    pyEnableMetricCollection: false,
    pyEnablePathStyleAccess: false,
    TargetPath: '/Bix/ClientData'
  });

  const handleConfigChange = (property: string, value: any) => {
    setOtherConfig(prev => ({
      ...prev,
      [property]: value
    }));
  };

  // Load data pages
  useEffect(() => {
    async function loadData() {
      try {
        const [caseTypeRes, exportDetailsRes, targetRes, autoCompleteFieldsRes] =
          await Promise.all([
            fetchPageDataPage(caseTypesDataPage, context, {}),
            fetchDataPage(exportDetailsDataPage, context, {}),
            fetchDataPage(targetSystemDataPage, context, {}),
            fetchDataPage(autoCompleteDataPage, context, {})
          ]);
        setCaseTypes(caseTypeRes?.pxResults || []);
        setExportModes(exportDetailsRes?.data || []);
        setTargetSystems(targetRes?.data || []);
        setautoCompleteFields((autoCompleteFieldsRes?.data || []).map(item => item.pyPropertyName));
      } catch (err) {
        /* eslint-disable no-console */
        console.error('Error loading data pages:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [
    caseTypesDataPage,
    exportDetailsDataPage,
    targetSystemDataPage,
    autoCompleteDataPage,
    context
  ]);

  useEffect(() => {
    async function loadExtractRules() {
      if (!selectedCaseType) return;
      try {
        const payload = {
          dataViewParameters: {
            'CaseTypeClass': selectedCaseType
          }
        };

        // { CaseTypeClass: selectedCaseType }
        const extractRes = await fetchDataPage(
          extractRuleDataPage,
          context,
          payload
        );
        setExtractRules(extractRes?.data || []);
      } catch (err) {
        console.error('Error loading extract rules:', err);
      }
    }
    loadExtractRules();
  }, [selectedCaseType, selectedTarget, extractRuleDataPage, context]);

  async function submit() {
    try {
      let parameters: Record<string, any> = {
        CaseTypeName: selectedCaseType,
        TargetSystem: selectedTarget
      };

      let dataPageName = '';
      if (
        selectedMode.toLowerCase() === 'amazon s3 bucket' &&
        ['other', 'snowflake', 'databricks'].includes(selectedTarget.toLowerCase())
      ) {
        dataPageName = 'D_SaveDataExportDetails';
        parameters = { ...parameters, ...otherConfig, ExtractRuleName: selectedExtract, ExportMode: selectedMode };
      }

      if (selectedMode.toLowerCase() === 'kafka' && selectedTarget.toLowerCase() === 'other') {
        dataPageName = kafkaJsonSaveDataPage;

        const result = Object.entries(uploadedTableValues).map(([key, value]) => ({
          [key]: { selectedvalue: value }
        }));
        parameters = { ...parameters, data: result };
      }

      if (selectedMode.toLowerCase() === 'kafka' && selectedTarget.toLowerCase() === 'databricks') {
        dataPageName = kafkaDataBricksSaveDataPage;
        parameters = { ...parameters, DataBricksConfig: dataBricksValues };

        // const transformedConfig = Object.values(dataBricksValues)
        //   .flatMap((columns: Record<string, string>) =>
        //     Object.entries(columns).map(([field, value]) => ({
        //       [field]: { selectedvalue: value }
        //     }))
        //   );

        // console.log(dataBricksValues);
        // console.log(transformedConfig);

        parameters = {
          ...parameters,
          data: dataBricksValues
        };
      }

      const res = await fetchPageDataPage(dataPageName, context, parameters, {});
      console.log('Export Preview Data:', res);

      let successMessage = 'Export configuration saved successfully.';
      if (res?.pzLoadTime) {
        successMessage = `Export saved successfully at ${res.pzLoadTime || 'server time'}.`;
      }

      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: successMessage,
        life: 1000
      });
    } catch (err) {
      let errorMessage = 'Something went wrong while saving export details.';
      if (err && typeof err === 'object') {
        const e = err as { response?: { data?: { message?: string } }; message?: string };
        errorMessage = e.response?.data?.message || e.message || errorMessage;
      }
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: errorMessage,
        life: 1000
      });
    }
  }

  useEffect(() => {
    function convertPegaTreeToPrime(nodes : any, parentKey = '0') {
      return nodes.map((node : any, index : any) => {
        const key = parentKey ? `${parentKey}-${index}` : `${index}`;
        const label = node.pyNodeCaption;
        const icon = node.pyImage || (node.pyUserData?.pyIcon ?? '');
        const data =
          node.pyUserData?.pySelectedValue ||
          node.pyUserData?.pyPageClass ||
          node.pyUserData?.pyType ||
          '';
        const children = node.pyTreeNodes?.length
          ? convertPegaTreeToPrime(node.pyTreeNodes, key)
          : [];

        return { key, label, data, icon, children };
      });
    }

    async function loadTreeview() {
      if (!selectedCaseType || !selectedExtract) return;
      if (selectedMode.toLowerCase() !== 'kafka' && !selectedExtract) return;

      try {
        const parameters = {
          pyClassName: selectedCaseType,
          pyPurpose: selectedExtract,
        };
        const res = await fetchPageDataPage(treeViewDataPage, context, parameters, {});
        const nodes = convertPegaTreeToPrime(res?.pyTree?.pyTreeNodes);
        setTreeData(nodes);
        /* eslint-disable no-console */
        console.log('Export Preview Data:', res?.pyTree);
      } catch (err) {
        /* eslint-disable no-console */
        console.error('Error loading export preview data:', err);
      }
    }
    loadTreeview();
  }, [selectedMode, selectedExtract, selectedCaseType, treeViewDataPage, context]);

  useEffect(() => {
    async function loadDataBricksForm() {
      if (selectedMode.toLowerCase() === 'kafka' && selectedTarget.toLowerCase() === 'databricks') {
        try {
          const payload = {
            dataViewParameters: {
              'CaseTypeName': selectedCaseType,
              'TargetSystem': selectedTarget
            }
          };

          const res = await fetchDataPage(loadTableStructureDataPage, context, payload);
          setDataBricksForm(res?.data);
          /* eslint-disable no-console */
          console.log('Loaded DataBricks Form Config:', res?.data);
        } catch (err) {
          /* eslint-disable no-console */
          console.error('Error loading DataBricks form config:', err);
        }
      } else {
        setDataBricksForm(null);
      }
    }

    loadDataBricksForm();
  }, [selectedCaseType, selectedMode, selectedTarget, loadTableStructureDataPage, context]);

  if (isLoading) return <div style={{ padding: 16 }}>Loading data...</div>;

  const isKafkaMode = selectedMode.toLowerCase() === 'kafka';
  const isSubmitDisabled = !(
    selectedCaseType &&
    selectedMode &&
    selectedTarget &&
    (isKafkaMode || selectedExtract)
  );

  const resetStates = (level: 'caseType' | 'mode' | 'target') => {
    if (level === 'caseType') {
      setSelectedMode('');
      setSelectedTarget('');
      setSelectedExtract('');
      setTreeData(null);
      setExtractRules([]);
      setUploadedTable(null);
      setDataBricksForm(null);
    }

    if (level === 'mode') {
      setSelectedTarget('');
      setSelectedExtract('');
      setTreeData(null);
      setExtractRules([]);
      setUploadedTable(null);
      setDataBricksForm(null);
    }

    if (level === 'target') {
      setSelectedExtract('');
      setTreeData(null);
      setExtractRules([]);
      setUploadedTable(null);
      setDataBricksForm(null);
    }
  };

  return (
    <DashboardWrapper>
      <GlobalStyle />
      <Toast ref={toast} />

      <div style={{ width: '700px', marginTop: '16px' }} className='wrap'>
        <FieldRow>
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label htmlFor='caseType'>
            Select Case Type: <span>*</span>
          </label>
          <select
            id='caseType'
            value={selectedCaseType}
            onChange={(e) => {
              setSelectedCaseType(e.target.value);
              resetStates('caseType');
            }}
          >
            <option value="">Select</option>
            {caseTypes.map((item, index) => (
              <option key={index} value={item.pyClassName}>
                {item.pyLabel}
              </option>
            ))}
          </select>
        </FieldRow>

        {
          selectedCaseType && (
            <FieldRow>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor='modeExport'>
                Mode of Export: <span>*</span>
              </label>
              <select
                id='modeExport'
                value={selectedMode}
                onChange={(e) => {
                  setSelectedMode(e.target.value);
                  resetStates('mode');
                }}
              >
                <option value="">Select</option>
                {exportModes.map((item, index) => (
                  <option key={index} value={item.ExportName}>
                    {item.ExportName}
                  </option>
                ))}
              </select>
            </FieldRow>
          )
        }

        {
          selectedMode && (
            <FieldRow>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor='targetSystem'>
                Target System: <span>*</span>
              </label>
              <select
                id='targetSystem'
                value={selectedTarget}
                onChange={(e) => {
                  setSelectedTarget(e.target.value);
                  resetStates('target');
                }}
              >
                <option value="">Select</option>
                {targetSystems.map((item, index) => (
                  <option key={index} value={item.TargetSystem}>
                    {item.TargetSystem}
                  </option>
                ))}
              </select>
            </FieldRow>
          )
        }

        {( selectedMode.toLowerCase() === 'amazon s3 bucket' && selectedTarget.toLowerCase() === 'other') && (
          <>
            <SectionHeading>Configuration</SectionHeading>
            { configFields.map(({ label, prop, required, secure = false }) => (
              <FieldRow key={prop}>
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label>
                  {label}: {required && <span>*</span>}
                </label>
                <input
                  type={ secure ? 'password' : 'text' }
                  value={String(otherConfig[prop] ?? '')}
                  onChange={(e) => handleConfigChange(prop, e.target.value)}
                  required={required}
                />
              </FieldRow>
            ))}

            <SectionHeading>Advanced Settings</SectionHeading>
            {
              advancedSettingsFields.map(({ label, prop }) => (
              <FieldRow key={prop}>
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label>{label}:</label>
                <input
                  type="number"
                  value={Number(otherConfig[prop] ?? 0)}
                  onChange={(e) => handleConfigChange(prop, e.target.value)}
                />
              </FieldRow>
            ))}

            <FieldRow>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label>Enable metric collection</label>
              <input
                type="checkbox"
                checked={Boolean(otherConfig.pyEnableMetricCollection)}
                onChange={(e) =>
                  handleConfigChange('pyEnableMetricCollection', e.target.checked)
                }
              />
            </FieldRow>

            <FieldRow>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label>Enable path style access</label>
              <input
                type="checkbox"
                checked={Boolean(otherConfig.pyEnablePathStyleAccess)}
                onChange={(e) =>
                  handleConfigChange('pyEnablePathStyleAccess', e.target.checked)
                }
              />
            </FieldRow>

            <SectionHeading>Target Folder</SectionHeading>
            <FieldRow>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label>
                Target Folder Path: <span>*</span>
              </label>
              <input
                type="text"
                value={String(otherConfig.TargetPath ?? '')}
                onChange={(e) => handleConfigChange('TargetPath', e.target.value)}
                required
              />
            </FieldRow>
          </>
        )}

        {selectedMode.toLowerCase() === 'kafka' && selectedTarget.toLowerCase() === 'other' && (
          <>
            <div
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '20px',
                backgroundColor: '#ffffff',
                boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                marginBottom: '24px',
              }}
            >
              <h3
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#111827',
                  marginBottom: '16px',
                }}
              >
                Upload Table Definition (JSON)
              </h3>

              {/* File Input */}
              <input
                type="file"
                accept=".json"
                onChange={(e) => handleFileChange(e)}
                style={{
                  display: 'block',
                  marginBottom: '12px',
                  fontSize: '14px',
                }}
              />

              <button
                type="button"
                disabled={!fileContent}
                onClick={generateTableStructure}
                style={{
                  backgroundColor: '#2563eb',
                  color: '#fff',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontWeight: 500,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Generate Table Structure
              </button>
            </div>

            {/* Generated Form Section */}
            {uploadedTable && (
              <div
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '20px',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                  marginBottom: '24px'
                }}
              >
                <h3
                  style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#111827',
                    marginBottom: '16px',
                    borderBottom: '1px solid #e5e7eb',
                    paddingBottom: '4px',
                    textTransform: 'capitalize'
                  }}
                >
                  {uploadedTable.physicalTableName}
                </h3>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}
                >
                  {uploadedTable.columns?.map((col: any, colIndex: number) => (
                    <div
                      key={`${uploadedTable.tableName}-${col.name}-${colIndex}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}
                    >
                    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                      <label
                        style={{
                          flex: '0 0 35%',
                          fontWeight: 500,
                          color: '#374151'
                        }}
                      >
                        {col.name}
                      </label>
                      <div style={{ flex: 1 }}>
                        <Autocomplete
                          options={autoCompleteFields}
                          onSelect={(value) => handleUploadedTableChange(col.name, value)}
                        />
                        </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {(selectedMode.toLowerCase() === 'kafka' && selectedTarget.toLowerCase() === 'databricks') && (
          <>
            <h3 style={{ marginBottom: '15px' }}>DataBricks Table Configuration</h3>

            {!dataBricksForm || dataBricksForm.length === 0 ? (
              <div>Loading DataBricks configuration...</div>
            ) : (
              dataBricksForm.map((table: any, tableIndex: number) => (
                <div
                  key={tableIndex}
                  style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '20px',
                    marginBottom: '24px',
                    backgroundColor: '#ffffff',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#111827',
                      marginBottom: '16px',
                      borderBottom: '1px solid #e5e7eb',
                      paddingBottom: '4px',
                      textTransform: 'capitalize'
                    }}
                  >
                    {table.physicalTableName}
                  </h3>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}
                  >
                    {table.columns?.map((col: any, colIndex: number) => (
                      <div
                        key={`${table.physicalTableName}-${col.name}-${colIndex}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px'
                        }}
                      >
                      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                        <label
                          style={{
                            flex: '0 0 35%',
                            fontWeight: 500,
                            color: '#374151'
                          }}
                        >
                          {col.name}
                        </label>
                        <div style={{ flex: 1 }}>
                          <Autocomplete
                            options={autoCompleteFields}
                            onSelect={(value) => handleDataBricksChange(table.physicalTableName, col.name, value)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </>
        )}


        {
          selectedTarget && selectedMode.toLowerCase() !== 'kafka' && (
          <FieldRow>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor='extractRule'>
              Extract Rule: <span>*</span>
            </label>
            <select
              id='extractRule'
              value={selectedExtract}
              onChange={(e) => setSelectedExtract(e.target.value)}
            >
              <option value="">Select</option>
              {extractRules.map((item, index) => (
                <option key={index} value={item.pyPurpose}>
                  {item.pyLabel}
                </option>
              ))}
            </select>
          </FieldRow>
        )}


        {
          treeData && (
            <Tree value={treeData} className="w-full md:w-30rem" />
          )
        }

        <button
          type='button'
          onClick={submit}
          disabled={isSubmitDisabled}
          style={{
            marginTop: '16px',
            backgroundColor: isSubmitDisabled ? '#d1d5db' : '#2563eb',
            color: isSubmitDisabled ? '#6b7280' : '#fff',
            border: 'none',
            borderRadius: '6px',
            padding: '8px 16px',
            cursor: isSubmitDisabled ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s ease',
          }}
        >
          Submit
        </button>


      </div>
    </DashboardWrapper>
  );
}

export default withConfiguration(ExportComponentV2);
