import { useEffect, useState } from 'react';
import {
  registerIcon,
  Text,
  Card,
  CardHeader,
  Progress,
  Button,
  Icon,
  Configuration
} from '@pega/cosmos-react-core';
import { Task } from './Task';
import { loadDetails } from './utils';
import { MainCard } from './styles';
import * as plusIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/plus.icon';
import * as pencilIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/pencil.icon';

registerIcon(plusIcon, pencilIcon);
type CardGalleryProps = {
  heading: string;
  dataPage: string;
  numCards?: number;
  createClassname?: string;
  rendering: 'vertical' | 'horizontal';
  minWidth?: string;
  detailsDataPage: string;
  detailsViewName: string;
  getPConnect: any;
};

export default function PegaExtensionsCardGallery(props: CardGalleryProps) {
  const {
    heading = '',
    dataPage = '',
    numCards,
    createClassname = '',
    minWidth = '400px',
    rendering = 'vertical',
    detailsDataPage = '',
    detailsViewName = '',
    getPConnect
  } = props;
  const [tasks, setTasks] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);

  const editTask = (id: string) => {
    getPConnect().getActionsApi().openLocalAction('pyUpdateCaseDetails', {
      caseID: id,
      containerName: 'modal',
      actionTitle: 'Edit task',
      type: 'express'
    });
  };

  const addNewEvent = () => {
    if (createClassname) {
      getPConnect().getActionsApi().createWork(createClassname, {
        openCaseViewAfterCreate: false
      });
    }
  };

  const getDetails = (id: string, classname: string) => {
    return loadDetails({
      id,
      classname,
      detailsDataPage,
      detailsViewName,
      getPConnect
    });
  };

  const loadTasks = () => {
    setLoading(true);
    (window as any).PCore.getDataApiUtils()
      .getData(dataPage, {})
      .then(async (response: any) => {
        if (response.data.data !== null) {
          const tmpTasks: any = [];
          response.data.data.forEach((item: any) => {
            tmpTasks.push({
              id: item.pyID,
              title: item.pyLabel,
              status: item.pyStatusWork,
              classname: item.pxObjClass,
              insKey: item.pzInsKey,
              getDetails,
              editTask
            });
          });
          let numTasks = tmpTasks.length;
          if (numTasks > 0) {
            tmpTasks.forEach(async (tmpTask: any) => {
              const details = await getDetails(tmpTask.id, tmpTask.classname);
              tmpTask.details = details;
              numTasks -= 1;
              if (numTasks === 0) {
                setTasks(tmpTasks);
                setLoading(false);
              }
            });
          } else {
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
      'ASSIGNMENT_SUBMISSION'
    );
    return () => {
      (window as any).PCore.getPubSubUtils().unsubscribe(
        (window as any).PCore.getEvents().getCaseEvent().ASSIGNMENT_SUBMISSION,
        'ASSIGNMENT_SUBMISSION'
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numCards]);

  return (
    <Configuration>
      <Card>
        <CardHeader
          actions={
            createClassname ? (
              <Button variant='simple' label='Create new task' icon compact onClick={addNewEvent}>
                <Icon name='plus' />
              </Button>
            ) : undefined
          }
        >
          <Text variant='h2'>{heading}</Text>
        </CardHeader>
        <MainCard rendering={rendering} minWidth={minWidth}>
          {loading ? (
            <Progress placement='local' message='Loading content...' />
          ) : (
            tasks.map((task: any) => <Task key={task.id} {...task}></Task>)
          )}
        </MainCard>
      </Card>
    </Configuration>
  );
}
