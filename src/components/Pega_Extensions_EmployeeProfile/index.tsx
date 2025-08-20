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
          dataViewParameters : { EmployeeID : '' }
        };
        const res = await fetchDataPage(dataPageName, context, payload);
        const employeeData = res?.data ?? null;
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
        <p>{employee.EmployeeName}</p>
      ) : (
        !isLoading && <p>No employee data available.</p>
      )}

    </StyledPegaExtensionsEmployeeProfileWrapper>
  );

}

export default withConfiguration(PegaExtensionsEmployeeProfile);
