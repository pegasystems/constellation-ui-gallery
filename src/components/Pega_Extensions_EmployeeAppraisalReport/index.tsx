import { useEffect, useState, useMemo, useCallback } from 'react';
import { withConfiguration, Card } from '@pega/cosmos-react-core';
import type { PConnFieldProps } from './PConnProps';
import Table from './Table';
import Search from './Search';
import Appraisals from './Appraisals';
import Pagination from './Pagination';
import GlobalStyle from './styles';
import type { Employee } from './interfaces';
import fetchDataPage from './apiUtils';
import { debounce } from 'lodash';

interface PegaExtensionsEmployeeAppraisalReportProps extends PConnFieldProps {
  dataPage: string;
  loadingMessage: string;
  detailsDataPage: string;
}

function PegaExtensionsEmployeeAppraisalReport(props: PegaExtensionsEmployeeAppraisalReportProps) {

  const { getPConnect, dataPage, loadingMessage, detailsDataPage } = props;
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchText, setSearchText] = useState('');
  const [sortByField, setSortByField] = useState('EmployeeName');
  const [sortByType, setSortByType] = useState<'ASC' | 'DESC'>('ASC');
  const [pageNumber, setpageNumber] = useState(1);
  // const [hasMoreResults, setHasMoreResults] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const PConnect = getPConnect();
  const context = PConnect.getContextName();
  const pageSize = 10;

  const [selectedEmployee, setSelectedEmployee] = useState<{ EmployeeID: string; EmployeeName: string; } | null>(null);
  const [appraisalData, setAppraisalData] = useState<any[]>([]);
  const [isAppraisalModalOpen, setIsAppraisalModalOpen] = useState(false);
  const [isAppraisalLoading, setIsAppraisalLoading] = useState(false);

  const employeeListColumnsConfig = useMemo(
    () => ([
      { key: 'EmployeeID', label: 'Employee ID' },
      { key: 'EmailAddress', label: 'Email' },
      { key: 'EmployeeName', label: 'Employee Name' },
      { key: 'JobTitle', label: 'Job Title' },
      { key: 'Department', label: 'Department' },
      { key: 'JoiningDate', label: 'Joining Date' },
      { key: 'RM', label: 'RM' },
      { key: 'Practice', label: 'Practice' },
      { key: 'Action', label: 'Action' }
    ]),
    []
  );

  // const tableColumns = useMemo(
  //   () => employeeListColumnsConfig.map(col => ({ key: col.key, label: PConnect.getLocalizedValue(col.label, '', '') })),
  //   [employeeListColumnsConfig, PConnect]
  // );
  //

  const tableColumns = useMemo(
    () =>
      employeeListColumnsConfig.map(col => ({
        key: col.key,
        label: PConnect.getLocalizedValue(col.label, '', ''),
        sortable: col.key !== 'Action',
        onSort: () => {
          if (sortByField === col.key) {
            setSortByType(prev => (prev === 'ASC' ? 'DESC' : 'ASC'));
          } else {
            setSortByField(col.key);
            setSortByType('ASC');
          }
        }
      })),
    [employeeListColumnsConfig, PConnect, sortByField]
  );

  const loadEmployees = useCallback(async () => {
    // eslint-disable-next-line no-console
    console.log('in loadEmployees');
    setIsLoading(true);

    const payload = {
      query: {
        select: [
          { field: 'EmployeeID' },
          { field: 'EmployeeName' },
          { field: 'EmailAddress' },
          { field: 'ContactNumber' },
          { field: 'JobTitle' },
          { field: 'Department' },
          { field: 'JoiningDate' },
          { field: 'FirstName' },
          { field: 'MiddleName' },
          { field: 'LastName' },
          { field: 'RM' },
          { field: 'Practice' },
          { field: 'JobLevel' },
          { field: 'LastAppraisalDate' },
          { field: 'NextApparaisalDate' },
          { field: 'ExitDate' },
          { field: 'Active' },
          { field: 'RMEmailID' },
          { field: 'PLEmpID' },
          { field: 'PLEmailID' },
          { field: 'RMEmpID' },
          { field: 'PLName' }
        ],
        ...(searchText.trim() && {
          filter: {
            filterConditions: {
              F1: {
                comparator: 'CONTAINS',
                ignoreCase: true,
                lhs: { field: 'EmployeeID' },
                rhs: { value: searchText.trim()}
              },
              F2: {
                comparator: 'CONTAINS',
                ignoreCase: true,
                lhs: { field: 'EmployeeName' },
                rhs: { value: searchText.trim()}
              }
            },
            logic: 'F1 OR F2'
          }
        }),
        sortBy: [{ field: sortByField, type: sortByType }]
      },
      paging: { pageNumber, pageSize },
      includeTotalCount: true
    };

    const keys = employeeListColumnsConfig.map(c => c.key);
    const res = await fetchDataPage(dataPage, context, payload);
    const formatted = (res.data || []).map((entry: any, index: number) => {
      const row: any = { id: index };
      keys.forEach((key) => {
        row[key] = entry?.[key] ?? '';
      });
      return row;
    });
    // setHasMoreResults(res.hasMoreResults || false);
    setTotalCount(res.totalCount || 0);
    setTotalPages(Math.ceil((res.totalCount || 0) / pageSize));
    setEmployees(formatted);
    setIsLoading(false);
  }, [searchText, employeeListColumnsConfig, dataPage, context, pageNumber, sortByField, sortByType]);

  // const debouncedSearch = useMemo(
  //   () => debounce(() => {
  //     // eslint-disable-next-line no-console
  //     console.log('in debouncedSearch');
  //     loadEmployees();
  //   }, 500),
  //   [loadEmployees]
  // );
  //
  // useEffect(() => {
  //   // eslint-disable-next-line no-console
  //   console.log('useEffect for searchText & debouncedSearch');
  //   debouncedSearch();
  //   return () => debouncedSearch.cancel();
  // }, [searchText, debouncedSearch]);
  //
  // useEffect(() => {
  //   // eslint-disable-next-line no-console
  //   console.log('in useEffect with pageNumber');
  // loadEmployees();
  // }, [pageNumber, loadEmployees]);
  //
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('in useEffect');
    const handler = debounce(() => {
      loadEmployees();
    }, 500);
    handler();
    return () => handler.cancel();
  }, [searchText, pageNumber, loadEmployees]);

  const handleSearch = (value: string) => {
    // eslint-disable-next-line no-console
    console.log('handleSearch');
    setSearchText(value);
    setpageNumber(1);
  };

  const handleViewDetails = async (EmployeeID: string, EmployeeName : string) => {
    setSelectedEmployee({ EmployeeID, EmployeeName });
    setIsAppraisalModalOpen(true);
    setIsAppraisalLoading(true);
    const payload = {
      dataViewParameters : { EmployeeID }
    };
    const res = await fetchDataPage(detailsDataPage, context, payload);
    // eslint-disable-next-line no-console
    console.log(res);
    setAppraisalData(res.data || []);
    setIsAppraisalLoading(false);
  };

  const onPageChange = (page : number) => {
    // eslint-disable-next-line no-console
    console.log(page);
    setpageNumber(page)
  }

  const closeAppraisalModal = () => {
    setIsAppraisalModalOpen(false);
    setSelectedEmployee(null);
    setAppraisalData([]);
  };

  return (
      <div className='dashboard'>
        <GlobalStyle />
        <Card className="card">
          <Search placeholder='Search by Employee ID or Name...' onChange={(value) => handleSearch(value)} />

          <Table
            columns={tableColumns}
            data={employees}
            loading={isLoading}
            loadingMessage={PConnect.getLocalizedValue(loadingMessage, '', '')}
            onClick={handleViewDetails}
            sortByField={sortByField}
            sortByType={sortByType}
          />

          { totalCount > pageSize && (
            <Pagination
              pageNumber={pageNumber}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          )}

          {isAppraisalModalOpen && (
            <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="appraisalModalTitle">
              <div className="modal-content">
                <div className="modal-header">
                  <h2 id="appraisalModalTitle">
                    Appraisals for {selectedEmployee?.EmployeeName} ({selectedEmployee?.EmployeeID})
                  </h2>
                  <button type="button" className="modal-close" aria-label="Close" onClick={closeAppraisalModal}>×</button>
                </div>
                <div className="modal-body">
                  {
                    isAppraisalLoading &&
                    <p className="notice">Loading...</p>
                  }
                  {
                    !isAppraisalLoading &&
                    <Appraisals appraisals={appraisalData} />
                  }
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
  );
}

export default withConfiguration(PegaExtensionsEmployeeAppraisalReport);
