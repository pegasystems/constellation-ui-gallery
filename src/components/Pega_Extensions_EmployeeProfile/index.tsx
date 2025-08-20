import { useEffect, useState } from 'react';
import { withConfiguration } from '@pega/cosmos-react-core';
import type { PConnFieldProps } from './PConnProps';
import fetchDataPage from './apiUtils';

import StyledPegaExtensionsEmployeeProfileWrapper from './styles';

interface EmployeeData {
  EmployeeName?: string;
  [key: string]: any;
}

// interface for props
interface PegaExtensionsEmployeeProfileProps extends PConnFieldProps {
    dataPageName: string;
}

// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
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
        const payload = {
          pyGUID : '1a5b9422-ffaf-4f94-b89b-eed62bce4f6f'
        };

        const options = {
          invalidateCache: true,
        };

        const res = await fetchDataPage(dataPageName, context, payload, options);
        const employeeData = res ?? null;
        setEmployee(employeeData);
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
    <StyledPegaExtensionsEmployeeProfileWrapper>
      <p>Profile</p>

      {!isLoading && employee?.EmployeeName ? (
        <div className="profile-container">
          <div className="profile-header">
            <img
              src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg"
              alt="Employee Profile Pic"
              className="profile-pic"
            />
            <div>
              <h2>{ employee.EmployeeName }</h2>
              <p>{ employee.JobTitle } | { employee.Department }</p>
              <p>
                <a
                  href="mailto:sonysuvarchala.masani@bitsinglass.com"
                  className="email-link"
                >
                { employee.EmailAddress }
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
              <p>{ employee.EmployeeName }</p>
            </div>
            <div className="detail-card">
              <h4>Practice</h4>
              <p>{ employee.Department }</p>
            </div>
          </div>
        </div>
      ) : (
        !isLoading && <p>No employee data available.</p>
      )}
    </StyledPegaExtensionsEmployeeProfileWrapper>
  );

}

export default withConfiguration(PegaExtensionsEmployeeProfile);
