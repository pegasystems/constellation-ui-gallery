import React, { useState } from 'react';
import {
  Container,
  TaskCard,
  TaskHeader,
  Checkbox,
  StatusText,
} from './styles';

// Task type definition
interface Task {
  Id: number; // Use Id from your data
  Label: string;
  Status: boolean; // Use Status as boolean
}

interface TaskListProps {
  data: Task[];
}

const TaskList: React.FC<TaskListProps> = ({ data }) => {
  const [tasks, setTasks] = useState<Task[]>(data);

  const toggleStatus = (taskId: number, currentStatus: boolean) => {
    const updatedStatus = !currentStatus; // Toggle the status

    // API call to update the backend
    PCore.getRestClient()
      .invokeRestApi('updateDataObject', {
        queryPayload: {
          data_view_ID: 'D_TaskListSavable',
        },
        body: {
          data: {
            Id: taskId, // Send the task Id as pyGUID
            Status: updatedStatus, // Send the updated Status
          },
        },
      })
      .then((response) => {
        if (response.status === 200) {
          // Update the UI state only after a successful API call
          const updatedTasks = tasks.map((task) =>
            task.Id === taskId ? { ...task, Status: updatedStatus } : task
          );
          setTasks(updatedTasks);
        } else {
          // eslint-disable-next-line no-console
          console.error('Failed to update task status:', response);
        }
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error('Error updating task status:', error);
      });
  };

  return (
    <Container>
      <h2 style={{ textAlign: 'center', margin: '0 0 15px' }}>Task List</h2>
      {tasks.map((task) => (
        <TaskCard key={task.Id}> {/* Use Id as the key */}
          <TaskHeader>
            <Checkbox
              type="checkbox"
              checked={task.Status} // Use the boolean Status directly for the checkbox
              onChange={() => toggleStatus(task.Id, task.Status)} // Pass the Id and current Status to toggle
            />
            <h3
              style={{
                margin: '0',
                textDecoration: task.Status ? 'line-through' : 'none', // Add line-through for completed tasks
              }}
            >
              {task.Label}
            </h3>
            <StatusText status={task.Status ? 'completed' : 'pending'}>
              {task.Status ? 'Completed' : 'Pending'} {/* Show 'Completed' or 'Pending' */}
            </StatusText>
          </TaskHeader>
        </TaskCard>
      ))}
    </Container>
  );
};

export default TaskList;
