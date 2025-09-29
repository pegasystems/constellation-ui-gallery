import { useEffect, useState } from 'react';
import { withConfiguration } from '@pega/cosmos-react-core';
import type { PConnFieldProps } from './PConnProps';
import styled from 'styled-components';
import fetchDataPage from './apiUtils';
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
import { Doughnut, Bar } from 'react-chartjs-2';
import { CSVLink } from 'react-csv';

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
  font-family: Inter, ui-sans-serif, system-ui, -apple-system,
               "Segoe UI", Roboto, "Helvetica Neue", Arial;
  font-size: 14px;
  color: #111827;
`;

interface DashboardProps extends PConnFieldProps {
  loadingMessage: string;
  inProgressAppraisalsDataPage: string;
  departmentalWorkloadChartDataPage: string;
  upcomingAppraisalsDataPage: string;
  recentAppraisalsDataPage: string;
  kraRejectionDataPage: string;
  overdueProposalsDataPage: string;
  stageDistributionDataPage: string;
}

function ManagerMonitoringDashboard(props: DashboardProps) {
  const {
    getPConnect,
    loadingMessage,
    inProgressAppraisalsDataPage,
    departmentalWorkloadChartDataPage,
    upcomingAppraisalsDataPage,
    recentAppraisalsDataPage,
    kraRejectionDataPage,
    overdueProposalsDataPage,
    stageDistributionDataPage
  } = props;

  const PConnect = getPConnect();
  const context = PConnect.getContextName();

  // === State Hooks for API data ===
  const [teamTimeline, setTeamTimeline] = useState<any[]>([]);
  const [reviewQueue, setReviewQueue] = useState<any[]>([]);
  const [statusDistribution, setStatusDistribution] = useState<ChartData<'doughnut'>>({
    labels: [],
    datasets: []
  });
  const [pendingActionDistribution, setPendingActionDistribution] = useState<ChartData<'bar'>>({
    labels: [],
    datasets: []
  });

  const [days, setDays] = useState(90);
  const [loading, setLoading] = useState(true);

  // Chart Options
  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
        align: 'start' as const,
        labels: {
          padding: 5
        }
      },
      title: { display: false }
    }
  };

  const barOptions = {
    responsive: true,
    plugins: { legend: { display: false } }
  };

  // === API Calls ===
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        // Upcoming Appraisals → Team Timeline
        const upcomingRes = await fetchDataPage(upcomingAppraisalsDataPage, context, { NoOfDays: days });
        setTeamTimeline(upcomingRes.data || []);

        // Review Queue → Pending Actions
        const recentRes = await fetchDataPage(recentAppraisalsDataPage, context, {});
        setReviewQueue(recentRes.data || []);

        // Stage Distribution → Doughnut Chart
        const stageRes = await fetchDataPage(stageDistributionDataPage, context, {});
        setStatusDistribution({
          labels: stageRes.data?.map((d: any) => d.stageName) || [],
          datasets: [
            {
              label: 'Appraisals',
              data: stageRes.data?.map((d: any) => d.count) || [],
              backgroundColor: ['#2563eb', '#60a5fa', '#93c5fd', '#1e40af']
            }
          ]
        });

        // Departmental Workload → Bar Chart
        const deptRes = await fetchDataPage(departmentalWorkloadChartDataPage, context, {});
        setPendingActionDistribution({
          labels: deptRes.data?.map((d: any) => d.department) || [],
          datasets: [
            {
              label: 'Pending Actions',
              data: deptRes.data?.map((d: any) => d.pendingCount) || [],
              backgroundColor: '#2563eb'
            }
          ]
        });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [days, context, upcomingAppraisalsDataPage, recentAppraisalsDataPage, stageDistributionDataPage, departmentalWorkloadChartDataPage]);

  // Example CSV export for overdue proposals (if required)
  const overdueCsvData = [
    ['Employee', 'Proposal Date', 'Status'],
    ['Ahmed Tomi', '2025-09-01', 'Pending'],
    ['Raed Labes', '2025-09-05', 'Overdue']
  ];

  return (
    <DashboardWrapper>
      <GlobalStyle />

      <div className="section">
        <h1>My Team's Performance Timeline</h1>
        <p><strong>Report Name:</strong> RPT_MGR_Team_Timeline</p>
        <p><strong>Business Purpose:</strong> Forward-looking view of appraisal schedules and statuses.</p>

        <div className="widget">
          <strong>Action Items / My Queue:</strong> {reviewQueue.length} appraisals awaiting your action.
          <a href="#myReviewQueue" className="link">Go to Work Queue</a>
        </div>

        <div className="chart-container" style={{ display: 'flex', gap: '40px', marginTop: '20px' }}>
          <div style={{ width: '45%', height: '300px' }}>
            <h2>Appraisal Status Distribution</h2>
            <Doughnut data={statusDistribution} options={donutOptions} />
          </div>
          <div style={{ width: '45%', height: '300px' }}>
            <h2>Pending Actions by Type</h2>
            <Bar data={pendingActionDistribution} options={barOptions} />
          </div>
        </div>

        <h2>Team Appraisal Status</h2>
        <table>
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Next Appraisal Due Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {teamTimeline.length > 0 ? (
              teamTimeline.map((row: any, idx: number) => (
                <tr key={idx}>
                  <td>{row.employeeName}</td>
                  <td>{row.nextAppraisalDue}</td>
                  <td>{row.status}</td>
                  <td>
                    <a href="#" className="action-button">
                      {row.status === 'Not Started' ? 'Start Appraisal' : 'View Form'}
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4}>{loading ? loadingMessage : 'No Data Available'}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="section" id="myReviewQueue">
        <h1>My Review Queue</h1>
        <p><strong>Report Name:</strong> VIEW_MGR_Action_Queue</p>
        <p><strong>Business Purpose:</strong> Task-based view showing all pending actions requiring manager review.</p>

        <h2>Pending Appraisals</h2>
        <table>
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Submission Date</th>
              <th>Days Pending</th>
              <th>Action Required</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {reviewQueue.length > 0 ? (
              reviewQueue.map((item: any, idx: number) => (
                <tr key={idx}>
                  <td>{item.employeeName}</td>
                  <td>{item.submissionDate}</td>
                  <td>{item.daysPending}</td>
                  <td>{item.actionRequired}</td>
                  <td>
                    <button className="action-button">
                      {item.actionButton || 'Start Review'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>{loading ? loadingMessage : 'No Pending Reviews'}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '20px' }}>
        <CSVLink data={overdueCsvData} filename="overdue-proposals.csv">
          Download Overdue Proposals CSV
        </CSVLink>
      </div>
    </DashboardWrapper>
  );
}

export default withConfiguration(ManagerMonitoringDashboard);
