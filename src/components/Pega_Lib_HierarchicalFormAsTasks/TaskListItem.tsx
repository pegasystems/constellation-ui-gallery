import { Button } from '@pega/cosmos-react-core';
import type { Task } from './types';

type TaskListItemProps = {
  task: Task;
  onOpen: (task: Task) => void;
};

/**
 * Component that renders a single task item in the task list
 */
export const TaskListItem = ({ task, onOpen }: TaskListItemProps) => {
  return (
    <li className='task'>
      <div className='name'>
        <Button variant='link' onClick={() => onOpen(task)}>
          {task.title}
        </Button>
      </div>
      <div className='status'>
        <span>{task.status}</span>
      </div>
    </li>
  );
};

export default TaskListItem;
