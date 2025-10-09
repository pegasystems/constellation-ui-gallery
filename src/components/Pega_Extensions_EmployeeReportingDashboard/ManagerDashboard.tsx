import { useEffect, useState } from 'react';
import { withConfiguration } from '@pega/cosmos-react-core';
import styled from 'styled-components';
import { fetchListDataPage } from './apiUtils';
import Table from './Table';
import GlobalStyle from './styles';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Legend } from 'chart.js';
import type { ChartData } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, ArcElement, LinearScale, BarElement, Title, Legend);

const DashboardWrapper = styled.div`
background: #ffffff;
min-height: 100%;
font-family: Inter, ui-sans-serif, system-ui, -apple-system,
             "Segoe UI", Roboto, "Helvetica Neue", Arial;
font-size: 14px;
color: #111827;
`;

interface DashboardProps {
  getPConnect: any;
  loadingMessage: string;
  workBasketDataPage: string;
  upcomingAppraisalsDataPage: string;
}

function ManagerDashboard(props: DashboardProps) {
  const { getPConnect, loadingMessage, workBasketDataPage, upcomingAppraisalsDataPage } = props;
  const PConnect = getPConnect();
  const context = PConnect.getContextName();

  const [workBasket, setworkBasket] = useState<any[]>([]);
  const [appraisals, setAppraisals] = useState<any[]>([]);

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: 0,
    radius: '80%',
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
        align: 'start' as const,
        labels: {
          padding: 5,
          usePointStyle: false,
        },
      },
      title: {
        display: false,
      },
    },
  };

  const [donutData, setDonutData] = useState<ChartData<'pie'>>({
    labels: [],
    datasets: [],
  });

  const [barData, setBarData] = useState<ChartData<'bar'>>({
    labels: [],
    datasets: [],
  });

  // const [loading, setLoading] = useState(true);

  // Chart Options
  // const donutOptions = {
  //   responsive: true,
  //   maintainAspectRatio: false,
  //   cutout: '70%',
  //   plugins: {
  //     legend: {
  //       display: true,
  //       position: 'bottom' as const,
  //       align: 'start' as const,
  //       labels: {
  //         padding: 5
  //       }
  //     },
  //     title: { display: false }
  //   }
  // };

  const barOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
  };

  // === API Calls ===
  useEffect(() => {
    async function loadData() {
      // setLoading(true);
      try {
        const work = await fetchListDataPage(workBasketDataPage, context, {});

        const mappedData = (work.data || []).map((item: any, index: number) => ({
          ...item,
          unique: `${item.pzInsKey || 'row'}-${index}`,
          EmployeeName: item.pyInstructions ?? '',
          EmployeeID: item.pyLabel ?? '',
        }));
        setworkBasket(mappedData);

        const apr = await fetchListDataPage(upcomingAppraisalsDataPage, context, {});
        const appraisalsWithUnique = (apr.data || []).map((item: any, index: number) => ({
          ...item,
          unique: `${item.pzInsKey || 'row'}-${index}`,
        }));
        setAppraisals(appraisalsWithUnique);

        const statusCountsMap = appraisalsWithUnique.reduce(
          (acc, curr) => {
            const status = curr.pyNote || 'Unknown';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>,
        );

        const statusCountsArray = Object.entries(statusCountsMap).map(([status, count]) => ({
          status,
          count,
        }));

        const barChartData: ChartData<'bar'> = {
          labels: statusCountsArray.map((item) => item?.status) ?? [],
          datasets: [
            {
              label: 'Summary Count',
              data: statusCountsArray.map((item) => Number(item.count) ?? 0),
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
            },
          ],
        };

        setBarData(barChartData);

        const chartData1 = mappedData.reduce(
          (acc, curr) => {
            const status = curr.pyAssignmentStatus || '';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>,
        );

        const chartData2 = Object.entries(chartData1).map(([status, count]) => ({
          status,
          count,
        }));

        const chartData: ChartData<'pie'> = {
          labels: chartData2?.map((item: any) => item?.status) ?? [],
          datasets: [
            {
              label: '# of Proposals',
              data: chartData2?.map((item: any) => item.count ?? 0) ?? [],
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
            },
          ],
        };

        setDonutData(chartData);
      } finally {
        // setLoading(false);
      }
    }
    loadData();
  }, [context, upcomingAppraisalsDataPage, workBasketDataPage]);

  // Example CSV export for overdue proposals (if required)
  // const overdueCsvData = [
  //   ['Employee', 'Proposal Date', 'Status'],
  //   ['Ahmed Tomi', '2025-09-01', 'Pending'],
  //   ['Raed Labes', '2025-09-05', 'Overdue']
  // ];

  return (
    <DashboardWrapper>
      <GlobalStyle />
      <div className='section'>
        <div className='widget'>
          <strong>Action Items / My Queue:</strong> {workBasket.length} appraisals awaiting your action.
          <a href='#myReviewQueue' className='link'>
            Go to Work Queue
          </a>
        </div>

        <div className='chart-container' style={{ display: 'flex', gap: '40px', marginTop: '20px' }}>
          <div style={{ width: '45%', height: '350px' }}>
            <h2 style={{ marginBottom: '15px' }}>Appraisal Status Distribution</h2>
            <Bar data={barData} options={barOptions} height={200} />
          </div>
          <div style={{ width: '45%', height: '350px' }}>
            <h2 style={{ marginBottom: '15px' }}>Pending Actions by Type</h2>
            <Pie data={donutData} options={donutOptions} width={100} />
          </div>
        </div>

        <h2 className='TeamAppraisalStatus'>Team Appraisal Status</h2>
        <Table
          columns={[
            { key: 'EmployeeName', label: 'Employee Name' },
            { key: 'NextApparaisalDate', label: 'Next Appraisal Due Date', date: true },
            { key: 'pyNote', label: 'Status' },
          ]}
          data={appraisals}
          loading={false}
          loadingMessage={PConnect.getLocalizedValue(loadingMessage, '', '')}
        />
      </div>

      <div className='section' id='myReviewQueue'>
        <h1 style={{ marginBottom: '15px' }}>My Review Queue</h1>
        <h2>Pending Appraisals</h2>
        <Table
          columns={[
            { key: 'EmployeeName', label: 'Employee' },
            { key: 'pxCreateDateTime', label: 'Submission Date', date: true },
            { key: 'pyAssignmentStatus', label: 'Action Required' },
          ]}
          data={workBasket}
          loading={false}
          loadingMessage={PConnect.getLocalizedValue(loadingMessage, '', '')}
        />
      </div>
    </DashboardWrapper>
  );
}

export default withConfiguration(ManagerDashboard);
