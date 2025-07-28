import { useEffect, useState } from 'react';
import {
  withConfiguration,
  registerIcon,
  Text,
  Card,
  CardHeader,
  Progress,
  Button,
  Icon,
} from '@pega/cosmos-react-core';
import { DragDropContext, type DropResult } from '@hello-pangea/dnd';
import { loadDetails, updateGroupValue } from './utils';
import { Column } from './Column';
import { MainCard } from './styles';
import * as plusIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/plus.icon';
import * as pencilIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/pencil.icon';
import '../create-nonce';

registerIcon(plusIcon, pencilIcon);
type KanbanBoardProps = {
  heading: string;
  dataPage: string;
  contextProperty: any;
  createClassname?: string;
  height?: string;
  groups: string;
  groupProperty: string;
  detailsDataPage: string;
  detailsViewName: string;
  getPConnect: any;
};

export const PegaExtensionsKanbanBoard = (props: KanbanBoardProps) => {
  const {
    heading = '',
    dataPage = '',
    contextProperty,
    createClassname = '',
    height = '30rem',
    groups = '',
    groupProperty = '',
    detailsDataPage = '',
    detailsViewName = '',
    getPConnect,
  } = props;
  const [columns, setColumns] = useState<any>({});
  const [tasks, setTasks] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);

  const groupList = groups.split(',');

  const editTask = (id: string) => {
    getPConnect().getActionsApi().openLocalAction('pyUpdateCaseDetails', {
      caseID: id,
      containerName: 'modal',
      actionTitle: 'Edit task',
      type: 'express',
    });
  };

  const addNewEvent = () => {
    if (createClassname) {
      getPConnect().getActionsApi().createWork(createClassname, {
        openCaseViewAfterCreate: false,
      });
    }
  };

  const getDetails = (id: string, classname: string) => {
    return loadDetails({
      id,
      classname,
      detailsDataPage,
      detailsViewName,
      getPConnect,
    });
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) {
      return;
    }
    if (destination.droppableId === source.droppableId) {
      if (destination.index === source.index) return;

      const newSourceTaskList = Array.from(columns[source.droppableId].taskList);
      newSourceTaskList.splice(source.index, 1);
      newSourceTaskList.splice(destination.index, 0, tasks[draggableId]);

      const tmpColumns = {
        ...columns,
        [source.droppableId]: {
          ...columns[source.droppableId],
          taskList: newSourceTaskList,
        },
      };
      setColumns(tmpColumns);
    } else {
      const newSourceTaskList = Array.from(columns[source.droppableId].taskList);
      const newDestinationTaskList = Array.from(columns[destination.droppableId].taskList);
      newSourceTaskList.splice(source.index, 1);
      newDestinationTaskList.splice(destination.index, 0, tasks[draggableId]);

      const tmpColumns = {
        ...columns,
        [source.droppableId]: {
          ...columns[source.droppableId],
          taskList: newSourceTaskList,
        },
        [destination.droppableId]: {
          ...columns[destination.droppableId],
          taskList: newDestinationTaskList,
        },
      };
      updateGroupValue({
        groupValue: destination.droppableId,
        groupProperty,
        columns: tmpColumns,
        setColumns,
        task: tasks[draggableId],
        getPConnect,
      });
      setColumns(tmpColumns);
    }
  };

  const loadTasks = () => {
    setLoading(true);
    const metadata = getPConnect().getRawMetadata();
    let parameters = {};
    if (typeof contextProperty !== 'undefined' && metadata?.config?.contextProperty) {
      parameters = { dataViewParameters: { key: contextProperty } };
    }
    (window as any).PCore.getDataApiUtils()
      .getData(dataPage, parameters)
      .then(async (response: any) => {
        if (response.data.data !== null) {
          const tmpColumns: any = {};
          const tmpTasks: any = {};
          groupList.forEach((group: string) => {
            const taskList: Array<any> = [];
            tmpColumns[group] = { id: group, taskList };
          });
          setColumns(tmpColumns);
          response.data.data.forEach((item: any) => {
            const myColumn = tmpColumns[item[groupProperty]];
            if (myColumn?.taskList) {
              tmpTasks[item.pyID] = {
                id: item.pyID,
                title: item.pyLabel,
                classname: item.pxObjClass,
                insKey: item.pzInsKey,
                groupValue: item[groupProperty],
                getDetails,
                editTask,
              };
              myColumn.taskList.push(tmpTasks[item.pyID]);
            }
          });

          let numTasks = Object.entries(tmpTasks).length;
          if (numTasks > 0) {
            Object.entries(tmpTasks).forEach(async ([key]) => {
              const tmpTask = tmpTasks[key];
              const details = await getDetails(key, tmpTask.classname);
              tmpTask.details = details;
              numTasks -= 1;
              if (numTasks === 0) {
                setColumns(tmpColumns);
                setTasks(tmpTasks);
                setLoading(false);
              }
            });
          } else {
            setColumns(tmpColumns);
            setTasks(tmpTasks);
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      });
  };

  /* Subscribe to changes to the assignment case */
  useEffect(() => {
    (window as any).PCore.getPubSubUtils().subscribe(
      (window as any).PCore.getEvents().getCaseEvent().ASSIGNMENT_SUBMISSION,
      () => {
        /* If an assignment is updated - force a reload of the events */
        loadTasks();
      },
      'ASSIGNMENT_SUBMISSION',
    );
    return () => {
      (window as any).PCore.getPubSubUtils().unsubscribe(
        (window as any).PCore.getEvents().getCaseEvent().ASSIGNMENT_SUBMISSION,
        'ASSIGNMENT_SUBMISSION',
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groups, groupProperty]);

  if (!groups || !groupProperty) return null;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Card>
        <CardHeader
          actions={
            createClassname ? (
              <Button
                variant='simple'
                label={getPConnect().getLocalizedValue('Create new task')}
                icon
                compact
                onClick={addNewEvent}
              >
                <Icon name='plus' />
              </Button>
            ) : undefined
          }
        >
          <Text variant='h2'>{heading}</Text>
        </CardHeader>
        <MainCard height={height}>
          {loading ? (
            <Progress
              placement='local'
              message={(window as any).PCore.getLocaleUtils().getLocaleValue(
                'Loading content...',
                'Generic',
                '@BASECLASS!GENERIC!PYGENERICFIELDS',
              )}
            />
          ) : (
            groupList.map((group: string) => (
              <Column key={group} id={group} title={group} tasks={columns[group]?.taskList} getPConnect={getPConnect} />
            ))
          )}
        </MainCard>
      </Card>
    </DragDropContext>
  );
};
export default withConfiguration(PegaExtensionsKanbanBoard);
