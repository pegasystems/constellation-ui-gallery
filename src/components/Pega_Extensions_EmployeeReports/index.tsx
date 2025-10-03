import { useEffect, useState } from 'react';
import { withConfiguration } from '@pega/cosmos-react-core';
import type { PConnFieldProps } from './PConnProps';
import styled from 'styled-components';
import fetchDataPage from './apiUtils';
import Table from './Table';
import GlobalStyle from './styles';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Legend,
} from 'chart.js';
import type { ChartData } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  ArcElement,
  LinearScale,
  BarElement,
  Title,
  Legend
);

const DashboardWrapper = styled.div`
  background: #ffffff;
  min-height: 100%;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
  font-size: 14px;
  color: #111827;
`;

interface DashboardProps extends PConnFieldProps {
  loadingMessage: string;
  currentAppraisalsDataPage: string;
  employeeAllAppraisalsDataPage: string;
}

function EmployeeMonitoringDashboard(props: DashboardProps) {
  const {
    getPConnect,
    loadingMessage,
    currentAppraisalsDataPage,
    employeeAllAppraisalsDataPage
  } = props;

  const PConnect = getPConnect();
  const context = PConnect.getContextName();

  const [currentAppraisal, setCurrentAppraisal] = useState<any>({});
  const [allAppraisals, setAllAppraisals] = useState<any[]>([]);

  const [barData, setBarData] = useState<ChartData<'bar'>>({
    labels: [],
    datasets: []
  });

  const barOptions = {
    responsive: true,
    plugins: { legend: { display: false } }
  };

  useEffect(() => {
    async function loadData() {
      try {
        const ca = await fetchDataPage(currentAppraisalsDataPage, context, {});
        setCurrentAppraisal(ca?.data?.[0] || {});

        const allApr = await fetchDataPage(employeeAllAppraisalsDataPage, context, {});
        const allAprModified = (allApr.data || []).map((item: any, index: number) => ({
          ...item,
          unique: `${item.pzInsKey || 'row'}-${index}`
        }));
        setAllAppraisals(allAprModified);

        // Example dummy bar chart data (replace with real processing)
        const statusCountsArray = [
          { status: 'Completed', count: 5 },
          { status: 'Pending', count: 3 }
        ];

        setBarData({
          labels: statusCountsArray.map(item => item.status),
          datasets: [
            {
              label: 'Summary Count',
              data: statusCountsArray.map(item => Number(item.count) ?? 0),
              backgroundColor: ['rgba(37, 99, 235, 0.6)', 'rgba(255, 159, 64, 0.6)'],
              borderColor: ['rgba(37, 99, 235, 1)', 'rgba(255, 159, 64, 1)'],
              borderWidth: 1,
            }
          ]
        });
      } finally {
        // cleanup or setLoading(false) if needed
      }
    }
    loadData();
  }, [context, currentAppraisalsDataPage, employeeAllAppraisalsDataPage]);

  return (
    <DashboardWrapper>
      <GlobalStyle />

      <div className="dashboard">
        <div className="section">
          <h2>Current Appraisal: { currentAppraisal?.pyDateValue?.[0] }</h2>

          <div className="info-row">
            <div className="info-card">
              <p>
                <span>Next Appraisal Due Date:</span><br />
                { currentAppraisal?.pyDateValue?.[0] }
              </p>
            </div>
            <div className="info-card">
              <p>
                <span>Status:</span><br />
                { currentAppraisal?.pyStatusWork } due by { currentAppraisal?.AppraisalTargetDate }
              </p>
            </div>
          </div>
        </div>

        <div className="section">
          <h2>Final Appraisal Report</h2>
          <div className="header">
            <p><strong>Review Period:</strong> { currentAppraisal?.pyDateValue?.[0] } </p>
          </div>

          <h3>Final Score & Rating</h3>
          <p><strong>Final Score:</strong> { currentAppraisal?.FinalRatingOfEmployee } / 5</p>
          <p><strong>Rating Band:</strong> Exceeds Expectations</p>

          <h3>Performance KRA(s)</h3>
          <div style={{ width: '50%' }}>
            <Table
              columns={[
                { key: 'PerformanceName', label: 'Performance Name' },
                { key: 'FinalReviewer', label: 'Reviewer' },
                { key: 'HRFinalRatingValue', label: 'Rating' }
              ]}
              data={ currentAppraisal?.PerformanceKRAs || [] }
              loading={false}
              loadingMessage={PConnect.getLocalizedValue(loadingMessage, '', '')}
            />
          </div>

          <h3>Competency KRAs</h3>
          <div style={{ width: '50%' }}>
            <Table
              columns={[
                { key: 'CompetencyName', label: 'Competency Name' },
                { key: 'Reviewer', label: 'Reviewer' },
                { key: 'HRCompFinalRatingValue', label: 'Rating' }
              ]}
              data={ currentAppraisal?.KRACompRO || [] }
              loading={false}
              loadingMessage={PConnect.getLocalizedValue(loadingMessage, '', '')}
            />
          </div>
        </div>

        <div className="section">
          <h2>Past Appraisals (Last 5 Years)</h2>
          { allAppraisals.map((apr) => (
            <details key={apr.unique}>
              <summary>Appraisal Year: { apr.AppraisalTargetDate } </summary>
              <p><strong>Score:</strong> { apr.FinalRatingOfEmployee }</p>
              <p><strong>Rating:</strong> Exceeds Expectations</p>
            </details>
          ))}
        </div>

        <div className="section">
          <h2>Performance Trend (Last 5 Years)</h2>
          <Bar data={barData} options={barOptions} />
        </div>

        <button
          type="button"
          className="print-btn"
          onClick={() => window.print()}
        >
          Print to PDF
        </button>
      </div>
    </DashboardWrapper>
  );
}

export default withConfiguration(EmployeeMonitoringDashboard);
