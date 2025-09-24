import { useEffect, useState } from 'react';
import { withConfiguration, Button } from '@pega/cosmos-react-core';
import type { PConnFieldProps } from './PConnProps';
import Table from './Table';
import GlobalStyle from './styles';
import fetchDataPage from './apiUtils';
import styled from 'styled-components';
import { Chart as ChartJS, ArcElement } from 'chart.js';
import type { ChartData } from 'chart.js';

import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement);


const DashboardWrapper = styled.div`
  background: var(--bg);
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

  // Demo data
  // const demoUpcoming = [
  //   { EmployeeName: "Asha Sharma", Department: "Appian", Date: "2025-09-12" },
  //   { EmployeeName: "Rahul Verma", Department: "Quality Analyst", Date: "2025-09-18" },
  //   { EmployeeName: "Meera Nair", Department: "Pega", Date: "2025-10-05" },
  //   { EmployeeName: "Sumant Thakur", Department: "Pega", Date: "2025-10-05" },
  //   { EmployeeName: "Kiran Rao", Department: "Finance", Date: "2025-10-10" },
  //   { EmployeeName: "Vijay Kumar", Department: "Support", Date: "2025-10-10" },
  // ];
  //
  // const demoRecent = [
  //   { Employee: "Asha Sharma", Department: "Appian", Stage: "Completed", TargetCompletion: "2025-09-10", DaysOverdue: 0 },
  //   { Employee: "Rahul Verma", Department: "QA", Stage: "In Progress", TargetCompletion: "2025-09-20", DaysOverdue: 2 },
  //   { Employee: "Meera Nair", Department: "Pega", Stage: "Overdue", TargetCompletion: "2025-09-01", DaysOverdue: 5 },
  // ];
  //
  // const demoKraRejections = [
  //   { Employee: "Sumant Thakur", PracticeLead: "Anil Kumar", Timestamp: "2025-08-30", Reason: "Incomplete KRA", Comments: "Needs review" },
  //   { Employee: "Kiran Rao", PracticeLead: "Neha Singh", Timestamp: "2025-09-05", Reason: "Incorrect data", Comments: "Please correct" },
  // ];

  // Data states
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [recent, setRecent] = useState<any[]>([]);
  const [overdueProposals, setOverdueProposals] = useState<number>(0);
  const [appraisalsInProgress, setappraisalsInProgress] = useState<number>(0);
  const [kraRejections, setKraRejections] = useState<any[]>([]);
  const [donutData, setDonutData] = useState<ChartData<'doughnut'>>({
    labels: [],
    datasets: []
  });
  // const data = {
  //   labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  //   datasets: [
  //     {
  //       label: '# of Votes',
  //       data: [12, 19, 3, 5, 2, 3],
  //       backgroundColor: [
  //         'rgba(255, 99, 132, 1)',
  //         'rgba(54, 162, 235, 1)',
  //         'rgba(255, 206, 86, 1)',
  //         'rgba(75, 192, 192, 1)',
  //         'rgba(153, 102, 255, 1)',
  //         'rgba(255, 159, 64, 1)',
  //       ],
  //       borderColor: [
  //         'rgba(255, 99, 132, 1)',
  //         'rgba(54, 162, 235, 1)',
  //         'rgba(255, 206, 86, 1)',
  //         'rgba(75, 192, 192, 1)',
  //         'rgba(153, 102, 255, 1)',
  //         'rgba(255, 159, 64, 1)',
  //       ],
  //       borderWidth: 1,
  //     },
  //   ],
  // };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '67%',
    radius: '100%'
  };

  useEffect(() => {
    async function load() {
      const [ip, dp, u, r, k, o, s] = await Promise.all([
        fetchDataPage(inProgressAppraisalsDataPage, context, {}),
        fetchDataPage(departmentalWorkloadChartDataPage, context, {}),
        fetchDataPage(upcomingAppraisalsDataPage, context, {}),
        fetchDataPage(recentAppraisalsDataPage, context, {}),
        fetchDataPage(kraRejectionDataPage, context, {}),
        fetchDataPage(overdueProposalsDataPage, context, {}),
        fetchDataPage(stageDistributionDataPage, context, {}),
      ]);
      setUpcoming(u.data || []);
      // setRecent(r.data || []);
      setRecent(
        (r.data || []).map(item => ({
          ...item,
          pyIntegerValue: Array.isArray(item.pyIntegerValue)
            ? item.pyIntegerValue[0]
            : item.pyIntegerValue
        }))
      );

      setKraRejections(k.data || []);
      setOverdueProposals(o.data?.[0]?.pySummaryCount?.[0] || 0);
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

      // eslint-disable-next-line no-console
      console.log(chartData);

      // eslint-disable-next-line no-console
      console.log(ip);

      // eslint-disable-next-line no-console
      console.log(dp);

      setDonutData(chartData);
    }
    load();
  }, [departmentalWorkloadChartDataPage, inProgressAppraisalsDataPage, upcomingAppraisalsDataPage, recentAppraisalsDataPage, kraRejectionDataPage, context, overdueProposalsDataPage, stageDistributionDataPage]);

  // eslint-disable-next-line no-console
  console.log(donutData);

  const openProfile = () => {
  };

  return (
    <DashboardWrapper>
      <GlobalStyle />
      <div className="wrap">
        {/* Header */}
        <header>
          <div>
            <h1>HR Appraisal Monitoring Dashboard</h1>
            <div className="sub">Live appraisal monitoring — anniversary-based, rolling model</div>
          </div>
          <div className="controls">
            <div className="control">
              <select id="rangeSelect">
                <option value="30">Upcoming: 30 days</option>
                <option value="60">Upcoming: 60 days</option>
                <option value="90" selected>Upcoming: 90 days</option>
              </select>
            </div>
            <div className="control">
              <input id="search" placeholder="Search employee or dept" />
            </div>
            <div className="control">
              <Button compact>Refresh</Button>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="main card">
          {/* KPI Row */}
          <div className="kpi-row">
            <div className="kpi card"><div className="value">12</div><div className="label">Appraisals In Progress</div><div className="small">Updated today</div></div>
            <div className="kpi card"><div className="value">{upcoming?.length || 0}</div><div className="label">Upcoming</div><div className="small">Next 90 days</div></div>
            <div className="kpi card"><div className="value">{ overdueProposals || 0}</div><div className="label">Overdue</div><div className="small">High priority</div></div>
          </div>

          {/* Charts */}
          <div className="charts">
            <section className="donut-wrap card">
              <h3>Stage Distribution</h3>
              <div><Doughnut data={donutData} options={options} /></div>
              <div className="donut-legend">
                <div className="legend-item">
                  <div className="legend-color" style={{background: '#3B82F6' }}/>New (1)
                </div>
                <div className="legend-item">
                  <div className="legend-color" style={{background: '#F59E0B' }}/>Pending- KRA Progress (3)
                </div>
                <div className="legend-item">
                  <div className="legend-color" style={{background: '#EF4444' }}/>Pending-Final Review (2)
                </div>
                <div className="legend-item">
                  <div className="legend-color" style={{background: '#10B981' }}/>Pending-In Review (3)
                </div>
                <div className="legend-item">
                  <div className="legend-color" style={{background: '#8B5CF6' }}/>Pending-KRA Assignment (101)
                </div>
                <div className="legend-item">
                  <div className="legend-color" style={{background: '#F97316' }}/>Resolved-Completed (38)
                </div>
              </div>

            </section>
            <section className="bar-wrap card">
              <h3>Departmental Workload</h3>
              <div className="bar-chart">
                <div className="bar"><div style={{height:'80%'}}>8</div></div>
                <div className="bar"><div style={{height:'60%'}}>6</div></div>
                <div className="bar"><div style={{height:'40%'}}>4</div></div>
              </div>
              <div className="dept-labels"><span>HR</span><span>IT</span><span>Finance</span></div>
            </section>
          </div>

          {/* Overdue */}
          <div className="overdue card">
            <div className="count">2</div>
            <div><Button>View Overdue Details</Button><Button compact>Export CSV</Button></div>
          </div>

          {/* Recent Appraisals */}
          <div className="card">
            <h3>Recent Appraisals</h3>
            <Table columns={[
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
            <div className="control">
              <p>Date Range</p>
              <input type="date" id="start-date"/>
              <Button compact>Load</Button>
            </div>
            <div className="control">
              <p>Group by</p>
              <select id="group-by">
                <option value="reason">Rejection Reason</option>
                <option value="pl">Practice Lead</option>
                <option value="department">Department</option>
              </select>
            </div>
            <Table columns={[
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
                    <button type='button' className="small-btn" onClick={() => openProfile()}>View</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <h4>Quick Filters</h4>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <Button className='small-btn' compact>KRA Setting</Button>
              <Button className='small-btn' compact>Self Assessment</Button>
              <Button className='small-btn' compact>RM Review</Button>
              <Button className='small-btn' compact>PL Review</Button>
              <Button className='small-btn' compact>HR Finalization</Button>
            </div>
          </div>
        </aside>
      </div>
    </DashboardWrapper>
  );
}

export default withConfiguration(HRAppraisalMonitoringDashboard);
