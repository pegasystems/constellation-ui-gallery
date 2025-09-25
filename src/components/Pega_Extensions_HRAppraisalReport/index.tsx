import { useEffect, useState } from 'react';
import { withConfiguration, Button } from '@pega/cosmos-react-core';
import type { PConnFieldProps } from './PConnProps';
import Table from './Table';
import GlobalStyle from './styles';
import fetchDataPage from './apiUtils';
import styled from 'styled-components';
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

function HRAppraisalMonitoringDashboard(props: DashboardProps) {
  const {
    getPConnect,
    loadingMessage,
    inProgressAppraisalsDataPage,
    departmentalWorkloadChartDataPage,
    upcomingAppraisalsDataPage,
    recentAppraisalsDataPage,
    kraRejectionDataPage,
    overdueProposalsDataPage,
    stageDistributionDataPage,
  } = props;

  const PConnect = getPConnect();
  const context = PConnect.getContextName();
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [days, setDays] = useState(90);
  const [recent, setRecent] = useState<any[]>([]);
  const [overdueProposals, setOverdueProposals] = useState<any[]>([]);
  const [appraisalsInProgress, setappraisalsInProgress] = useState<number>(0);
  const [kraRejections, setKraRejections] = useState<any[]>([]);
  const [donutData, setDonutData] = useState<ChartData<'doughnut'>>({
    labels: [],
    datasets: []
  });
  const [barData, setBarData] = useState<ChartData<'bar'>>({
    labels: [],
    datasets: []
  });


  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    radius: '100%',
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
        align: 'start' as const,
        labels: {
          padding: 5,
          usePointStyle: false
        }
      },
      title: {
        display: false
      }
    }
  };

  const barOptions = {
    responsive: true
  };

  // const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  // const barData = {
  //   labels,
  //   datasets: [
  //     {
  //       data: [400, 250, 600, 300, 500, 700, 450],
  //       backgroundColor: 'linear-gradient(180deg,#2563eb, #000)',
  //     }
  //   ],
  // };

  const [kraFrom, setKraFrom] = useState('');
  const [kraTo, setKraTo] = useState('');
  const [groupBy, setGroupBy] = useState('--Rejection Reason--');

  const handleLoad = () => {
  };

  const handleChange = (e) => {
    setDays(e.target.value);
  };


  useEffect(() => {
    async function load() {
      const [ip, dp, u, r, k, o, s] = await Promise.all([
        fetchDataPage(inProgressAppraisalsDataPage, context, {}),
        fetchDataPage(departmentalWorkloadChartDataPage, context, {}),
        fetchDataPage(upcomingAppraisalsDataPage, context, { NoOfDays: days }),
        fetchDataPage(recentAppraisalsDataPage, context, {}),
        fetchDataPage(kraRejectionDataPage, context, {}),
        fetchDataPage(overdueProposalsDataPage, context, {}),
        fetchDataPage(stageDistributionDataPage, context, {}),
      ]);
      // eslint-disable-next-line no-console
      console.log(ip);

      setUpcoming(u.data || []);
      setRecent(
        (r.data || []).map(item => ({
          ...item,
          pyIntegerValue: Array.isArray(item.pyIntegerValue)
            ? item.pyIntegerValue[0]
            : item.pyIntegerValue
        }))
      );
      setKraRejections(k.data || []);
      setOverdueProposals(o.data || []);
      setappraisalsInProgress(ip.data?.[0]?.pySummaryCount?.[0] || 0);

      const chartData: ChartData<'doughnut'> = {
        labels: s?.data?.map((item: any) => item?.pyStatusWork) ?? [],
        datasets: [
          {
            label: '# of Proposals',
            data: s?.data?.map((item: any) => item.pySummaryCount?.[0] ?? 0) ?? [],
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)',
              'rgba(255, 159, 64, 0.6)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          }
        ]
      };
      setDonutData(chartData);

      const barChartData: ChartData<'bar'> = {
        labels: dp?.data?.map(item => item.pyOrg) ?? [],
        datasets: [
          {
            label: 'Summary Count',
            data: dp?.data?.map(item => item.pySummaryCount?.[0] ?? 0) ?? [],
            backgroundColor: [
              'rgba(37, 99, 235, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(255, 159, 64, 0.6)',
              'rgba(153, 102, 255, 0.6)',
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(201, 203, 207, 0.6)',
              'rgba(100, 149, 237, 0.6)',
            ],
            borderColor: [
              'rgba(37, 99, 235, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(255, 159, 64, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(201, 203, 207, 1)',
              'rgba(100, 149, 237, 1)',
            ],
            borderWidth: 1,
          }
        ]
      };
      // eslint-disable-next-line no-console
      console.log(dp);
      setBarData(barChartData);
    }
    load();
  }, [
    departmentalWorkloadChartDataPage,
    inProgressAppraisalsDataPage,
    upcomingAppraisalsDataPage,
    recentAppraisalsDataPage,
    kraRejectionDataPage,
    context,
    overdueProposalsDataPage,
    stageDistributionDataPage,
    days
  ]);

  const openProfile = () => {
    // Placeholder for profile navigation logic
  };

  return (
    <DashboardWrapper>
      <GlobalStyle />
      <div className="wrap">
        {/* Header */}
        <header>
          <div style={{ visibility: 'hidden'}}>
            <h1>HR Appraisal Monitoring Dashboard</h1>
            <div className="sub">Live appraisal monitoring — anniversary-based, rolling model</div>
          </div>
          <div className="controls">
            <div className="control">
              <select onChange={handleChange} value={days}>
                <option value="30">Upcoming: 30 days</option>
                <option value="60">Upcoming: 60 days</option>
                <option value="90" selected>Upcoming: 90 days</option>
              </select>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="main card">
          {/* KPI Row */}
          <div className="kpi-row">
            <div className="kpi card"><div className="value">{appraisalsInProgress || 0}</div><div className="label">Appraisals In Progress</div><div className="small">Updated today</div></div>
            <div className="kpi card"><div className="value">{upcoming?.length || 0}</div><div className="label">Upcoming</div><div className="small">Next 90 days</div></div>
            <div className="kpi card"><div className="value">{overdueProposals?.length || 0}</div><div className="label">Overdue</div><div className="small">High priority</div></div>
          </div>

          {/* Charts */}
          <div className="charts">
            <section className="donut-wrap card">
              <h3>Stage Distribution</h3>
              <div style={{ width: '100%' }}><Doughnut data={donutData} options={options} width={310} height={270} /></div>
            </section>
            <section className="bar-wrap card">
              <h3>Departmental Workload</h3>
              <div style={{ width: '100%' }}>
                <Bar options={barOptions} data={barData} width={420} height={350} />
              </div>
            </section>
          </div>

          {/* Overdue */}
          <div className="overdue card">
            <div className="count">{overdueProposals?.length || 0}</div>
            <div><Button>View Overdue Details</Button><Button compact>Export CSV</Button></div>
          </div>

          {/* Recent Appraisals */}
          <div className="card">
            <h3>Recent Appraisals</h3>
            <Table
              columns={[
                { key: 'EmployeeName', label: 'Employee Name' },
                { key: 'pyOrg', label: 'Department' },
                { key: 'pxCurrentStageLabel', label: 'Stage' },
                { key: 'AppraisalTargetDate', label: 'Target Completion' },
                { key: 'pyIntegerValue', label: 'Days Overdue' }
              ]}
              data={recent}
              loading={false}
              loadingMessage={PConnect.getLocalizedValue(loadingMessage, '', '')}
            />
          </div>

          {/* KRA Rejections */}
          <div className="card">
            <h3>HR KRA Rejection Analysis</h3>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <label className="sub" htmlFor="startDate">
                      Date Range (mandatory)
                    </label>
                    <input
                      id="startDate"
                      type="date"
                      value={kraFrom}
                      onChange={(e) => setKraFrom(e.target.value)}
                      style={{ border: '1px solid #ccc', height: 30, borderRadius: 5 }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <label className="sub" htmlFor="endDate">
                      End Date
                    </label>
                    <input
                      id="endDate"
                      type="date"
                      value={kraTo}
                      onChange={(e) => setKraTo(e.target.value)}
                      style={{ border: '1px solid #ccc', height: 30, borderRadius: 5 }}
                    />
                  </div>

                    <button type='button' className="btn" onClick={handleLoad}>
                      Load
                    </button>
                  </div>
                </div>

            <Table
              columns={[
                { key: 'Employee', label: 'Employee' },
                { key: 'PracticeLead', label: 'Practice Lead' },
                { key: 'Timestamp', label: 'Timestamp' },
                { key: 'Reason', label: 'Reason' },
                { key: 'Comments', label: 'Comments' }
              ]}
              data={kraRejections}
              loading={false}
              loadingMessage={PConnect.getLocalizedValue(loadingMessage, '', '')}
            />
          </div>
        </main>

        {/* Sidebar */}
        <aside className="side">
          <div className="card">
            <h4>Upcoming Appraisals</h4>
            <div className="list" id="upcomingList" aria-live="polite">
              {upcoming.map((u) => (
                <div key={u.EmployeeName} className="list-item">
                  <div>
                    <div style={{ fontWeight: 700 }}>{u.EmployeeName}</div>
                    <div className="meta">{u.Department} • starts {u.Date}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
                    <button type="button" className="small-btn" onClick={() => openProfile()}>View</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </DashboardWrapper>
  );
}

export default withConfiguration(HRAppraisalMonitoringDashboard);
