// EmployeeMonitoringDashboard.tsx
import { useEffect, useState } from 'react';
import { withConfiguration } from '@pega/cosmos-react-core';
import type { PConnFieldProps } from './PConnProps';
import { fetchListDataPage } from './apiUtils';

import EmployeeDashboard from './EmployeeDashboard';
import ManagerDashboard from './ManagerDashboard';

interface DashboardProps extends PConnFieldProps {
  loadingMessage: string;
  workBasketDataPage: string;
  upcomingAppraisalsDataPage: string;
  currentAppraisalsDataPage: string;
  employeeAllAppraisalsDataPage: string;
}

function EmployeeMonitoringDashboard(props: DashboardProps) {
  const { getPConnect } = props;

  const PConnect = getPConnect();
  const context = PConnect.getContextName();

  const [userType, setUserType] = useState<string | null | undefined>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserType() {
      setLoading(true);
      const res = await fetchListDataPage('D_GetCurrentOperatorIDDetails', context, {});
      // eslint-disable-next-line no-console
      console.log(res);

      const user = await PCore.getUserApi().getOperatorDetails('rakesh.burbure@bitsinglass.com');
      // eslint-disable-next-line no-console
      console.log(user);

      const user2 = await PCore.getUserApi().getOperatorDetails('gurbinder.singh@bitsinglass.com');
      // eslint-disable-next-line no-console
      console.log(user2);

      const accessGroup = PCore.getEnvironmentInfo().getAccessGroup();
      // eslint-disable-next-line no-console
      console.log(accessGroup);

      // const type = res?.data?.[0]?.UserType || 'employee';
      // setUserType(type.toLowerCase());
      setUserType(accessGroup);
      setLoading(false);
    }
    loadUserType();
  }, [context]);

  if (loading) return (
    <>
    <div className="loader-container">
      <div className="loader"></div>
      <div className="loader-text">Loading...</div>
    </div>
    </>
  )

  return (
    <>
      {(userType === 'PAR:ReportingManager1' || userType === 'PAR:ReportingManager') ? (
        <ManagerDashboard {...props} />
      ) : (
        <EmployeeDashboard {...props} />
      )}
    </>
  );
}

export default withConfiguration(EmployeeMonitoringDashboard);
