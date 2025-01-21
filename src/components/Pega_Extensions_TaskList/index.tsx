import { useEffect, useState, useCallback } from 'react';
import { withConfiguration } from '@pega/cosmos-react-core';
import type { PConnFieldProps } from './PConnProps';
import StyledPegaExtensionsTaskListWrapper from './styles';
import TaskList from './TaskList';

// Interface for props
interface PegaExtensionsTaskListProps extends PConnFieldProps {}

function PegaExtensionsTaskList(props: PegaExtensionsTaskListProps) {
  const { getPConnect } = props;
  const [taskListData, setTaskListData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const PConnect = getPConnect();
  const context = PConnect.getContextName();

  // Function to fetch data
  const fetchData = useCallback(() => {
    setIsLoading(true);
    try {
      PCore.getDataApiUtils()
        .getData('D_TaskListList', {}, context)
        .then((response: any) => {
            // eslint-disable-next-line no-console
          console.log(response, 'i came from database')
          setIsLoading(false);
          if (response.data.data) {
              // eslint-disable-next-line no-console
            console.log(response, 'i came from database')
            setTaskListData(response.data.data);
          } else {
            setTaskListData([]);
          }
        })
        .catch((err: any) => {
          setIsLoading(false);
          setError(err?.response?.data?.localizedValue || 'An unexpected error occurred.');
        });
    } catch (e) {
      setIsLoading(false);
      setError('Failed to fetch data.');
    }
  }, [context]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <StyledPegaExtensionsTaskListWrapper>
      {isLoading && <p>Loading...</p>}
      {!isLoading && error && (
        <div className="error-container">
          <h3>Error</h3>
          <p>{error}</p>
        </div>
      )}
      {!isLoading && !error && taskListData.length > 0 && (
        <TaskList data={taskListData} />
      )}
      {!isLoading && !error && taskListData.length === 0 && (
        <div className="no-data-container">No tasks available</div>
      )}
    </StyledPegaExtensionsTaskListWrapper>
  );
}

export default withConfiguration(PegaExtensionsTaskList);
