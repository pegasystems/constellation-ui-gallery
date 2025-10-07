import { useEffect, useState } from 'react';
import { fetchListDataPage } from './apiUtils';
import Table from './Table';
import styled from 'styled-components';
import GlobalStyle from './styles_em';
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
  font-family:
    Inter,
    ui-sans-serif,
    system-ui,
    -apple-system,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial;
  font-size: 14px;
  color: #111827;
`;

interface DashboardProps {
  getPConnect: any;
  loadingMessage: string;
  currentAppraisalsDataPage: string;
  employeeAllAppraisalsDataPage: string;
}

function EmployeeDashboard(props: DashboardProps) {
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        setLoading(true);
        setError(null);
        const ca = await fetchListDataPage(currentAppraisalsDataPage, context, {});
        setCurrentAppraisal(ca?.data?.[0] || {});

        const allApr = await fetchListDataPage(employeeAllAppraisalsDataPage, context, {});
        const allAprModified = (allApr.data || []).map((item: any, index: number) => ({
          ...item,
          unique: `${item.pzInsKey || 'row'}-${index}`
        }));
        setAllAppraisals(allAprModified);

        const transformedData = allAprModified.map(item => ({
          year: item.AppraisalTargetDate ? new Date(item.AppraisalTargetDate).getFullYear() : '',
          score: item.FinalRatingOfEmployee ?? 0
        }));

        const labels = transformedData.map(item => item.year);
        const scores = transformedData.map(item => item.score);

        setBarData({
          labels,
          datasets: [
            {
              label: 'Employee Score',
              data: scores,
              backgroundColor: 'rgba(37, 99, 235, 0.6)',
              borderColor: 'rgba(37, 99, 235, 1)',
              borderWidth: 1,
            }
          ]
        });
      } catch (e) {
        setError('Failed to load data');
      } finally {
        setLoading(false);
        // cleanup or setLoading(false) if needed
      }
    }
    loadData();
  }, [context, currentAppraisalsDataPage, employeeAllAppraisalsDataPage]);

  return (
    <DashboardWrapper>
      <GlobalStyle />
      <div className="dashboard">

        {/* Loading & Error UI */}
        { loading && <p style={{ textAlign: 'center', color: '#2563eb' }}>Loading data...</p> }
        { error && <p style={{ textAlign: 'center', color: 'red' }}>{error}</p> }

        {/* Only render dashboard content if not loading and no error */}
        {!loading && !error && (
          <>
            <div className="section">
              <h2>
                Current Appraisal: { currentAppraisal?.pyDateValue?.[0]
                  ? new Date(currentAppraisal.pyDateValue[0]).getFullYear()
                  : '' }
              </h2>

              <div className="info-row">
                <div className="info-card">
                  <p>
                    <span>Next Appraisal:</span><br />
                    { currentAppraisal?.pyDateValue?.[0]
                        ? new Date(currentAppraisal.pyDateValue[0]).getFullYear() + 1
                        : '' }
                  </p>
                </div>
                <div className="info-card">
                  <p>
                    <span>Status:</span><br />
                    { currentAppraisal?.pyStatusWork || '' } due by { currentAppraisal?.AppraisalTargetDate || '' }
                  </p>
                </div>
              </div>
            </div>

            <div className="section">
              <h2>Final Appraisal Report</h2>
              <div className="header">
                <p><strong>Review Period:</strong> { currentAppraisal?.pyDateValue?.[0] || '' } </p>
              </div>

              <h3>Final Score & Rating</h3>
              <p><strong>Final Score:</strong> { currentAppraisal?.FinalRatingOfEmployee ?? '' } / 5</p>

              <h3 style={{ marginTop: '25px' }}>Performance KRA(s)</h3>
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

              <h3 style={{ marginTop: '25px' }}>Competency KRAs</h3>
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
              <h2>Past Appraisals (Last { allAppraisals.length || 0 } Years)</h2>
              { allAppraisals.map((apr) => (
                <details key={apr.unique}>
                  <summary>
                    Appraisal Year: {apr.AppraisalTargetDate
                      ? new Date(apr.AppraisalTargetDate).getFullYear()
                      : ''}
                  </summary>
                  <p><strong>Score:</strong> { apr.FinalRatingOfEmployee ?? '' }</p>
                </details>
              )) }
            </div>

            <div className="section">
              <h2>Performance Trend (Last { allAppraisals.length || 0 } Years)</h2>
              <Bar data={barData} options={barOptions} />
            </div>

            <button
              type="button"
              className="print-btn"
              onClick={() => window.print()}
            >
              Print to PDF
            </button>
          </>
        )}
      </div>
    </DashboardWrapper>
  );
}

export default EmployeeDashboard;
