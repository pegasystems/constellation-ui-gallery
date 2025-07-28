import { useEffect, useRef, useState } from 'react';
import {
  Banner,
  Button,
  Card,
  CardContent,
  CardHeader,
  createUID,
  Input,
  Progress,
  withConfiguration,
} from '@pega/cosmos-react-core';
import { Container, StyledAddTask } from './styles';
import TaskElement from './Task';

// Interface for props
export type PegaExtensionsTaskListProps = {
  heading: string;
  dataPage: string;
  getPConnect: () => any;
};
// Task type definition
export interface Task {
  Id: string; // Use Id from your data
  Label: string;
  IsCompleted: boolean; // Use Status as boolean
}

export const PegaExtensionsTaskList = (props: PegaExtensionsTaskListProps) => {
  const { heading, dataPage, getPConnect } = props;
  const [taskListData, setTaskListData] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const addTask = () => {
    const newTask = inputRef.current?.value;
    if (newTask) {
      const newTaskData = {
        Id: createUID(),
        Label: newTask,
        IsCompleted: false,
      };
      setTaskListData([...taskListData, newTaskData]);
      if (inputRef.current) {
        inputRef.current.value = '';
        inputRef.current.focus();
      }
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  const deleteTask = (id: string) => {
    setTaskListData((prevData) => {
      return prevData.filter((task) => task.Id !== id);
    });
  };

  useEffect(() => {
    setIsLoading(true);
    try {
      const pConn = getPConnect();
      const CaseInstanceKey = pConn.getValue((window as any).PCore.getConstants().CASE_INFO.CASE_INFO_ID);
      const payload = {
        dataViewParameters: [{ pyID: CaseInstanceKey }],
      };
      (window as any).PCore.getDataApiUtils()
        .getData(dataPage, payload, pConn.getContextName())
        .then((response: any) => {
          if (response.data.data !== null) {
            setIsLoading(false);
            if (response.data.data) {
              setTaskListData(response.data.data);
            } else {
              setTaskListData([]);
            }
          }
        })
        .catch(() => {});
    } catch {
      setIsLoading(false);
      setError('Failed to fetch data.');
    }
  }, [dataPage, getPConnect]);

  if (error) {
    return <Banner variant='urgent' messages={[error]} />;
  }
  if (isLoading) {
    return (
      <Progress
        placement='local'
        message={(window as any).PCore.getLocaleUtils().getLocaleValue(
          'Loading content...',
          'Generic',
          '@BASECLASS!GENERIC!PYGENERICFIELDS',
        )}
      />
    );
  }
  return (
    <Card>
      <CardHeader>
        <h2>{heading}</h2>
      </CardHeader>
      <CardContent>
        <StyledAddTask>
          <Input
            label={getPConnect().getLocalizedValue('Task name')}
            labelHidden
            placeholder={getPConnect().getLocalizedValue('Add task')}
            ref={inputRef}
            onKeyDown={onKeyDown}
          />
          <Button variant='primary' onClick={addTask}>
            {getPConnect().getLocalizedValue('Add task')}
          </Button>
        </StyledAddTask>
        <Container>
          {taskListData.map((task) => (
            <TaskElement key={task.Id} task={task} deleteTask={deleteTask} getPConnect={getPConnect} />
          ))}
        </Container>
      </CardContent>
    </Card>
  );
};

export default withConfiguration(PegaExtensionsTaskList);
