import { useTheme } from '@pega/cosmos-react-core';
import { Droppable } from '@hello-pangea/dnd';
import { Task } from './Task';
import { StyledColumn } from './styles';

export type ColumnProps = {
  title: string;
  id: string;
  tasks: any;
  getPConnect: () => any;
};

export const Column = (props: ColumnProps) => {
  const { title, id, tasks, getPConnect } = props;
  const theme = useTheme();
  return (
    <StyledColumn theme={theme}>
      <h2>{title}</h2>
      <Droppable droppableId={id}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {tasks?.map((task: any, index: number) => (
              <Task key={task.id} index={index} {...task} getPConnect={getPConnect} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </StyledColumn>
  );
};
