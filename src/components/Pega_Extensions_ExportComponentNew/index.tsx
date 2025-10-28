import { useEffect, useState } from 'react';
import { withConfiguration } from '@pega/cosmos-react-core';
import type { PConnFieldProps } from './PConnProps';
import GlobalStyle from './styles';
import { fetchDataPage, fetchPageDataPage } from './apiUtils';
import styled from 'styled-components';
import { Tree } from 'primereact/tree';

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
  targetSystemDataPage: string;
  extractRuleDataPage: string;
  treeViewDataPage: string;
}

function ExportComponentNew(props: DashboardProps) {
  const {
    getPConnect,
    caseTypesDataPage,
    exportDetailsDataPage,
    targetSystemDataPage,
    extractRuleDataPage,
    treeViewDataPage
  } = props;

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

  // Selected values
  const [selectedCaseType, setSelectedCaseType] = useState('');
  const [selectedMode, setSelectedMode] = useState('');
  const [selectedTarget, setSelectedTarget] = useState('');
  const [selectedExtract, setSelectedExtract] = useState('');
  const [treeData, setTreeData] = useState<any>(null);
  // const [nodes, setNodes] = useState<TreeNode[]>([]);

  const configFields = [
    { label: 'Bucket Name', prop: 'pyBucketName', required: true },
    { label: 'Root path', prop: 'pyRootpath', required: true },
    { label: 'Access key id', prop: 'pyAccessKeyId', required: true },
    { label: 'Secret access key', prop: 'pySecretAccessKey', required: true }
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
        const [caseTypeRes, exportDetailsRes, targetRes] =
          await Promise.all([
            fetchPageDataPage(caseTypesDataPage, context, {}),
            fetchDataPage(exportDetailsDataPage, context, {}),
            fetchDataPage(targetSystemDataPage, context, {}),
          ]);
        setCaseTypes(caseTypeRes?.pxResults || []);
        setExportModes(exportDetailsRes?.data || []);
        setTargetSystems(targetRes?.data || []);
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
    context,
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
  }, [selectedCaseType, extractRuleDataPage, context]);

  async function submit() {
    try {
      const parameters = {
        ...otherConfig,
        CaseTypeName: selectedCaseType,
        ExportMode: selectedMode,
        TargetSystem: selectedTarget,
        ExtractRuleName: selectedExtract
      };

      const res = await fetchPageDataPage('D_SaveDataExportDetails', context, parameters, {});
      // setTreeData(res?.pyTree || {});
      /* eslint-disable no-console */
      console.log('Export Preview Data:', res);
    } catch (err) {
      /* eslint-disable no-console */
      console.error('Error loading export preview data:', err);
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
  }, [selectedExtract, selectedCaseType, treeViewDataPage, context]);

  if (isLoading) return <div style={{ padding: 16 }}>Loading data...</div>;

  const isSubmitDisabled = !(
    selectedCaseType &&
    selectedMode &&
    selectedTarget &&
    selectedExtract
  );

  return (
    <DashboardWrapper>
      <GlobalStyle />
      <h3>Data Export Accelerator</h3>

      <div style={{ width: '500px', marginTop: '16px' }} className='wrap'>
        <FieldRow>
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label htmlFor='caseType'>
            Select Case Type: <span>*</span>
          </label>
          <select
            id='caseType'
            value={selectedCaseType}
            onChange={(e) => setSelectedCaseType(e.target.value)}
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
                onChange={(e) => setSelectedMode(e.target.value)}
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
                onChange={(e) => setSelectedTarget(e.target.value)}
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

        {(selectedTarget === 'other' || selectedTarget === 'Other') && (
          <>
            <SectionHeading>Configuration</SectionHeading>
            { configFields.map(({ label, prop, required }) => (
              <FieldRow key={prop}>
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label>
                  {label}: {required && <span>*</span>}
                </label>
                <input
                  type="text"
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

        {
          selectedTarget && (
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
          )
        }

        {
          treeData && (
            <div style={{
              marginTop: '24px',
              padding: '16px',
              background: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '13px',
              whiteSpace: 'pre-wrap',
              overflowX: 'auto'
            }}>
              <Tree value={treeData} className="w-full md:w-30rem" />
            </div>
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

export default withConfiguration(ExportComponentNew);
