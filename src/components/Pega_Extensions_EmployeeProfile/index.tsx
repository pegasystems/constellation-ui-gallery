import { useEffect, useState } from 'react';
import { withConfiguration } from '@pega/cosmos-react-core';
import type { PConnFieldProps } from './PConnProps';
import fetchDataPage from './apiUtils';

import GlobalStyle from './styles';

interface EmployeeData {
  EmployeeName?: string;
  [key: string]: any;
}

interface PegaExtensionsEmployeeProfileProps extends PConnFieldProps {
    dataPageName: string;
}

function PegaExtensionsEmployeeProfile(props: PegaExtensionsEmployeeProfileProps) {

  const { dataPageName,  getPConnect } = props;
  const [isLoading, setIsLoading] = useState(true);
  const [employee, setEmployee] = useState<EmployeeData | null>(null);
  const PConnect = getPConnect();
  // const dataPageName = 'D_pyMyWorkList';
  const context = PConnect.getContextName();

  useEffect(() => {


    const fetchData = async () => {
      try {
        const res = await fetchDataPage(dataPageName, context, {});
        // eslint-disable-next-line no-console
        console.log(res);
        setEmployee(res?.data?.[0] || {});
        setIsLoading(false);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching employee data:', error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [context, dataPageName]);

  return (
    <>
      <GlobalStyle />
      {!isLoading && employee?.EmployeeName ? (
        <div className="profile-container">
          <div className="profile-header">
            <div>
              <h2>{ employee.EmployeeName }</h2>
              <p>{ employee.JobTitle } | { employee.Department }</p>
              <p>
                <a
                  href={`mailto:${employee.EmailAddress}`}
                  className="email-link"
                >
                  {employee.EmailAddress}
                </a>

              </p>
            </div>
          </div>

          <div className="profile-details">
            <div className="detail-card">
              <h4>Employee ID</h4>
              <p>{ employee.EmployeeID }</p>
            </div>
            <div className="detail-card">
              <h4>Department</h4>
              <p>{ employee.Department }</p>
            </div>
            <div className="detail-card">
              <h4>Job Title</h4>
              <p>{ employee.JobTitle }</p>
            </div>
            <div className="detail-card">
              <h4>Joining Date</h4>
              <p>{ employee.JoiningDate }</p>
            </div>
            <div className="detail-card">
              <h4>Reporting Manager</h4>
              <p>{ employee.RM }</p>
            </div>
            <div className="detail-card">
              <h4>Practice</h4>
              <p>{ employee.Practice }</p>
            </div>
          </div>
        </div>
      ) : (
        !isLoading && <p>No employee data available.</p>
      )}
    </>
  );
}

export default withConfiguration(PegaExtensionsEmployeeProfile);
