import { Flex, Button } from '@pega/cosmos-react-core';
import type { Task } from './types';

type TaskDetailProps = {
  task: Task;
  onSubmit: (task: Task) => void;
  onClose: (task: Task) => void;
};

/**
 * Component that renders the detailed view of a task
 */
export const TaskDetail = ({ task, onSubmit, onClose }: TaskDetailProps) => {
  return (
    <Flex container={{ direction: 'column', gap: 1 }}>
      {task.content}
      <Flex container={{ direction: 'row', justify: 'between' }}>
        <Button onClick={() => onClose(task)} variant='secondary'>
          {'< Back'}
        </Button>
        <Button onClick={() => onSubmit(task)} variant='primary'>
          Continue
        </Button>
      </Flex>
    </Flex>
  );
};

export default TaskDetail;
