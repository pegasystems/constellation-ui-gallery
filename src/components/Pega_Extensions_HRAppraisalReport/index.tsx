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
  const [overdueCsvData, setOverdueCsvData] = useState<any[][]>([]);
  const [days, setDays] = useState(90);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
          padding: 7,
          usePointStyle: false
        }
      },
      title: {
        display: false
      }
    }
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false
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

  const handleLoad = async () => {
    setIsLoading(true);
    try {
      const payload = {
        FromDate: kraFrom,
        ToDate: kraTo
      };

      const response = await fetchDataPage(kraRejectionDataPage, context, payload);
      setKraRejections((response.data || []).map(item => ({
        ...item,
        EmployeeID: item.SearchByEmployee,
        RejectionDateTime: item.RejectionDateTime,
        PLName: item.EmployeeDetails.PLName,
        EmployeeName: item.EmployeeDetails.EmployeeName
      })));
      setIsLoading(false);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error loading KRA rejection data:', error);
    }
  };

  const handleChange = (e:any) => {
    setDays(e.target.value);
  };


  useEffect(() => {
    async function loadUpcoming() {
      const u = await fetchDataPage(upcomingAppraisalsDataPage, context, { NoOfDays: days });
      setUpcoming(u.data || []);
    }
    loadUpcoming();
  }, [upcomingAppraisalsDataPage, context, days]);


  useEffect(() => {
    async function load() {
      try {
        const [ip, dp, r, k, o, s] = await Promise.all([
          fetchDataPage(inProgressAppraisalsDataPage, context, {}),
          fetchDataPage(departmentalWorkloadChartDataPage, context, {}),
          fetchDataPage(recentAppraisalsDataPage, context, {}),
          fetchDataPage(kraRejectionDataPage, context, {}),
          fetchDataPage(overdueProposalsDataPage, context, {}),
          fetchDataPage(stageDistributionDataPage, context, {})
        ]);
        // eslint-disable-next-line no-console
        console.log(ip);
        // eslint-disable-next-line no-console
        console.log(k);

        setRecent(
          (r.data || []).map(item => ({
            ...item,
            daysOverdue: Array.isArray(item.pyIntegerValue)
              ? item.pyIntegerValue[0]
              : item.pyIntegerValue
          }))
        );
        setKraRejections((k.data || []).map( item => ({
          ...item,
          EmployeeID : item.SearchByEmployee,
          RejectionDateTime : item.RejectionDateTime,
          PLName : item.EmployeeDetails.PLName,
          EmployeeName : item.EmployeeDetails.EmployeeName
        }))
        );
        setOverdueProposals(o.data || []);
        setappraisalsInProgress(ip.data?.[0]?.pySummaryCount?.[0] || 0);

        const csvData = [
          ['EmployeeDetails', 'pyStatusWork'], // header row
          ...(o.data || []).map((item: any) => [
            item.EmployeeDetails?.EmployeeName ?? '', // or full EmployeeDetails object stringified if you need more
            item.pyStatusWork ?? ''
          ])
        ];
        setOverdueCsvData(csvData);

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
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [
    departmentalWorkloadChartDataPage,
    inProgressAppraisalsDataPage,
    upcomingAppraisalsDataPage,
    recentAppraisalsDataPage,
    kraRejectionDataPage,
    overdueProposalsDataPage,
    stageDistributionDataPage,
    context
  ]);

  const openProfile = () => {
    // Placeholder for profile navigation logic
  };

  // const overdueCsvData = [
  //   ['firstname', 'lastname', 'email'],
  //   ['Ahmed', 'Tomi', 'ah@smthing.co.com'],
  //   ['Raed', 'Labes', 'rl@smthing.co.com'],
  //   ['Yezzi', 'Min l3b', 'ymin@cocococo.com']
  // ];


  return (
    <DashboardWrapper>
      <GlobalStyle />
      <div className="wrap">
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
                <option value="90">Upcoming: 90 days</option>
              </select>
            </div>
          </div>
        </header>

        <main className="main card">
          <div className="kpi-row">
            <div className="kpi card"><div className="value">{appraisalsInProgress || 0}</div><div className="label">Appraisals In Progress</div><div className="small">Updated today</div></div>
            <div className="kpi card"><div className="value">{upcoming?.length || 0}</div><div className="label">Upcoming</div><div className="small">Next { days } days</div></div>
            <div className="kpi card"><div className="value">{overdueProposals?.length || 0}</div><div className="label">Overdue</div><div className="small">High priority</div></div>
          </div>

          <div className="charts">
            <section className="donut-wrap card">
              <h3>Stage Distribution</h3>
              <div style={{ width: '100%', height: '330px' }}>
                <Doughnut data={donutData} options={options} height={250} />
              </div>
            </section>
            <section className="bar-wrap card">
              <h3>Departmental Workload</h3>
              <div style={{ width: '100%', height: '330px' }}>
                <Bar options={barOptions} data={barData} />
              </div>
            </section>
          </div>

          <div className="overdue card">
            <div className="count">{overdueProposals?.length || 0}</div>
            <div>
              <Button onClick={() => setIsOpen(true)}>View Overdue Details</Button> &nbsp;
              <CSVLink data={overdueCsvData} filename='overdueProposals.csv'>Export CSV</CSVLink>
            </div>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '10px'}}>Recent Appraisals</h3>
            <Table
              columns={[
                { key: 'EmployeeName', label: 'Employee Name' },
                { key: 'pyOrg', label: 'Department' },
                { key: 'pxCurrentStageLabel', label: 'Stage' },
                { key: 'AppraisalTargetDate', label: 'Target Completion' },
                { key: 'daysOverdue', label: 'Days Overdue' }
              ]}
              data={recent}
              loading={false}
              loadingMessage={PConnect.getLocalizedValue(loadingMessage, '', '')}
            />
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '10px'}}>HR KRA Rejection Analysis</h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <label className="sub" htmlFor="startDate">
                Date Range
                <input
                  id="startDate"
                  type="date"
                  value={kraFrom}
                  onChange={(e) => setKraFrom(e.target.value)}
                  style={{
                    border: '1px solid #ccc',
                    height: 35,
                    borderRadius: 5,
                    padding: '0px 5px'
                  }}
                />
              </label>

              <input
                id="endDate"
                type="date"
                value={kraTo}
                onChange={(e) => setKraTo(e.target.value)}
                style={{
                  border: '1px solid #ccc',
                  height: 35,
                  borderRadius: 5,
                  padding: '0px 5px'
                }}
              />

              <button
                type="button"
                className="btn"
                onClick={handleLoad}
                disabled={!kraFrom || !kraTo}
                style={{
                  opacity: !kraFrom || !kraTo ? 0.5 : 1,
                  cursor: !kraFrom || !kraTo ? 'not-allowed' : 'pointer'
                }}
              >
                Apply
              </button>
            </div>

            <Table
              columns={[
                { key: 'EmployeeName', label: 'Employee' },
                { key: 'PLName', label: 'Practice Lead' },
                { key: 'RejectionDateTime', label: 'Timestamp', date : true },
                { key: 'PLInitialComments', label: 'Comments' }
              ]}
              data={kraRejections}
              loading={isLoading}
              loadingMessage={PConnect.getLocalizedValue(loadingMessage, '', '')}
            />
          </div>
        </main>

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
                  <div style={{ display: 'none', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
                    <button type="button" className="small-btn" onClick={() => openProfile()}>View</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {isOpen && (
          <div className="modal-backdrop">
            <div className="modal-box">
              <div className="modal-header">
                <h2>Overdue Appraisals</h2>
                <button type="button" className="modal-close" onClick={() => setIsOpen(false)}>✕</button>
              </div>
              <div className="modal-content">
                <Table
                  columns={[
                    { key: 'EmployeeName', label: 'Employee' },
                    { key: 'pyStatusWork', label: 'Status' }
                  ]}
                  data={overdueProposals}
                  loading={false}
                  loadingMessage={PConnect.getLocalizedValue(loadingMessage, '', '')}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {isLoading && (
        <div className="loader-container">
          <div className="loader" />
          <div className="loader-text">Loading...</div>
        </div>
      )}

    </DashboardWrapper>
  );
}

export default withConfiguration(HRAppraisalMonitoringDashboard);
