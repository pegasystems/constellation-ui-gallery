import { useEffect, useState } from 'react';
import { withConfiguration } from '@pega/cosmos-react-core';
import type { PConnFieldProps } from './PConnProps';
import GlobalStyle from './styles';
import { fetchDataPage, fetchPageDataPage } from './apiUtils';
import styled from 'styled-components';

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

interface DashboardProps extends PConnFieldProps {
  caseTypesDataPage: string;
  exportDetailsDataPage: string;
  targetSystemDataPage: string;
  extractRuleDataPage: string;
  treeViewDataPage: string;
}

function ExportComponent(props: DashboardProps) {
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

  useEffect(() => {
    async function loadTreeview() {
      if (!selectedCaseType || !selectedExtract) return;

      try {
        const parameters = {
          pyClassName: selectedCaseType,
          pyPurpose: selectedExtract,
        };
        const res = await fetchPageDataPage(treeViewDataPage, context, parameters, {});
        setTreeData(res?.pyTree || {});
        console.log('Export Preview Data:', res?.pyTree);
      } catch (err) {
        console.error('Error loading export preview data:', err);
      }
    }

    loadTreeview();
  }, [selectedExtract, selectedCaseType, treeViewDataPage, context]);

  if (isLoading) return <div style={{ padding: 16 }}>Loading data...</div>;

  return (
    <DashboardWrapper>
      <GlobalStyle />
      <h3>Data Export Accelerator</h3>

      <div style={{ width: '500px', marginTop: '16px' }}>
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
                  <option key={index} value={item.pyID}>
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
                  <option key={index} value={item.pyGUID}>
                    {item.TargetSystem}
                  </option>
                ))}
              </select>
            </FieldRow>
          )
        }

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
              <h4 style={{ marginBottom: '8px', fontFamily: 'Inter', fontSize: '15px' }}>Tree Data</h4>
              <pre style={{ margin: 0 }}>
                {JSON.stringify(treeData, null, 2)}
              </pre>
            </div>
          )
        }


      </div>
    </DashboardWrapper>
  );
}

export default withConfiguration(ExportComponent);
