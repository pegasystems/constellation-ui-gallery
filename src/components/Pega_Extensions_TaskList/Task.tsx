import { useRef, useState } from 'react';
import { TaskCard } from './styles';
import { Button, Checkbox, Icon, Input } from '@pega/cosmos-react-core';
import type { Task } from './index';

interface TaskElementProps {
  task: Task;
  deleteTask: (id: string) => void;
  getPConnect: () => any;
}
const TaskElement = (props: TaskElementProps) => {
  const { task, deleteTask, getPConnect } = props;
  const [status, setStatus] = useState(task.IsCompleted);

  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef(task.Label);

  const submitTask = () => {
    setIsEditing(false);
    titleRef.current = inputRef.current?.value || '';
  };

  const editTask = () => {
    setIsEditing((prevValue) => {
      inputRef.current?.focus();
      if (inputRef.current) {
        inputRef.current.value = titleRef.current;
      }
      return !prevValue;
    });
  };

  const toggleStatus = () => {
    setStatus((prevStatus) => {
      // API call to update the backend
      (window as any).PCore.getRestClient()
        .invokeRestApi('updateDataObject', {
          queryPayload: {
            data_view_ID: 'D_TaskListSavable',
          },
          body: {
            data: {
              Id: task.Id, // Send the task Id as pyGUID
              IsCompleted: !prevStatus, // Send the updated Status
            },
          },
        })
        .catch(() => {});
      return !prevStatus;
    });
  };

  return (
    <TaskCard key={task.Id}>
      {isEditing ? (
        <>
          <Input label={getPConnect().getLocalizedValue('Task name')} labelHidden ref={inputRef} />
          <Button variant='text' label={getPConnect().getLocalizedValue('Submit task')} onClick={submitTask}>
            <Icon name='check' />
          </Button>
        </>
      ) : (
        <>
          <Checkbox
            checked={status} // Use the boolean Status directly for the checkbox
            onChange={toggleStatus} // Pass the Id and current Status to toggle
            label={titleRef.current}
          />
          <Button variant='text' label={getPConnect().getLocalizedValue('Edit task')} onClick={editTask}>
            <Icon name='pencil' />
          </Button>
          <Button
            variant='text'
            label={getPConnect().getLocalizedValue('Delete task')}
            onClick={() => deleteTask(task.Id)}
          >
            <Icon name='trash' />
          </Button>
        </>
      )}
    </TaskCard>
  );
};

export default TaskElement;
