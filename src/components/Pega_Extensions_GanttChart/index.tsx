import { useEffect, useState, useMemo, type MouseEventHandler, type FC, useCallback } from 'react';
import { type Task as GTRTask } from 'gantt-task-react';
import { Gantt } from 'gantt-task-react';

import {
  withConfiguration,
  registerIcon,
  Icon,
  Text,
  Card,
  CardHeader,
  CardContent,
  Button,
  Progress as ProgressComponent,
  Flex,
  Switch,
  RadioButtonGroup,
  RadioButton,
  useTheme,
  useElement,
  Popover,
  EmptyState,
  useOuterEvent,
  FieldValueList,
  DateTimeDisplay,
} from '@pega/cosmos-react-core';
import * as plusIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/plus.icon';
import * as pencilIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/pencil.icon';
import * as timesIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/times.icon';

import StyledGanttChartWrapper, { StyledHoverTooltipCard } from './styles';
import '../shared/create-nonce';
import {
  viewModeOptions,
  type GanttChartProps,
  type Task,
  type ViewModeType,
  ViewModeMap,
  getCustomStyleOptions,
  getColumnWidth,
  loadGanttData,
  loadDetails,
  updateItemDetails,
} from './utils';

registerIcon(plusIcon, pencilIcon, timesIcon);

type HoverTooltipProps = { task: GTRTask; fontSize: string; fontFamily: string; showBanner: boolean } | undefined;

const HoverTooltip: FC<HoverTooltipProps> = (props) => {
  if (!props) return null;
  const { task, showBanner = true } = props;
  const fields = [
    { name: 'Progress', value: <Text variant='h4'>{`${task.progress}%`}</Text> },
    { name: 'Start', value: <DateTimeDisplay variant='datetime' value={task.start} /> },
    {
      name: 'End',
      value: <DateTimeDisplay variant='datetime' value={task.end} />,
    },
  ];

  return (
    <StyledHoverTooltipCard>
      <CardHeader>
        <Text variant='h3'>{task.type.toLocaleUpperCase()}</Text>
      </CardHeader>
      <CardContent>
        <FieldValueList variant='inline' fields={fields} />
      </CardContent>
      {showBanner && (
        <Flex container={{ direction: 'column' }}>
          <Text variant='secondary' as='em'>
            <strong>Click</strong> on the item to see item additional detail.
          </Text>
          {task.type !== 'project' && (
            <Text variant='secondary' as='em'>
              <strong>Double click</strong> to enable dragging.
            </Text>
          )}
        </Flex>
      )}
    </StyledHoverTooltipCard>
  );
};

/*
  Demo of the Gantt Chart component using gantt-chart-react component - this 3rd party lib is open source with MIT license
  Notes on the implementation:
    - 5 types of views are supported by default: Hourly, Daily, Weekly, Monthly and Yearly
    - Ability to toggle task list using 'showDetailsColumns' prop. This toggles the first 3 columns showing task name, start and end date.
*/
export const PegaExtensionsGanttChart = (props: GanttChartProps) => {
  const {
    heading,
    createClassname,
    dataPage,
    categoryFieldName,
    parentFieldName,
    dependenciesFieldName,
    startDateFieldName,
    endDateFieldName,
    progressFieldName,
    showDetailsColumns,
    defaultViewMode,
    detailsDataPage,
    detailsViewName,
    getPConnect,
  } = props;
  const [tasks, setTasks] = useState<Array<Task>>([]);
  const [activeViewMode, changeViewMode] = useState(defaultViewMode);
  const [showDetailsColumnsOn, setShowDetailsColumnsOn] = useState(showDetailsColumns);
  const [selectedTask, setSelectedTask] = useState<GTRTask>();
  const [details, setDetails] = useState<any>();
  const [loaderTasks, setLoaderTasks] = useState<boolean>(false);
  const [loaderDetails, setLoaderDetails] = useState<boolean>(false);
  const [dragMode, setDragMode] = useState<boolean>(false);
  const [popoverTarget, setPopoverTarget] = useElement<HTMLElement>(null);
  const [popoverEl, setPopoverRef] = useElement<HTMLElement>();
  const theme = useTheme();

  const closePopover = () => {
    setPopoverTarget(null);
  };

  const handleViewModeChange = (id: string) => {
    changeViewMode(id as ViewModeType);
  };

  const addNewTask = async () => {
    if (createClassname) {
      setLoaderTasks(true);
      await getPConnect().getActionsApi().createWork(createClassname, {
        openCaseViewAfterCreate: false,
      });
      setLoaderTasks(false);
    }
  };

  const initializeGanttData = useCallback(async () => {
    setLoaderTasks(true);
    const data = await loadGanttData(
      dataPage,
      categoryFieldName,
      parentFieldName,
      dependenciesFieldName,
      startDateFieldName,
      endDateFieldName,
      progressFieldName,
    );
    setTasks(data);
    setLoaderTasks(false);
    return data;
  }, [
    dataPage,
    categoryFieldName,
    parentFieldName,
    dependenciesFieldName,
    startDateFieldName,
    endDateFieldName,
    progressFieldName,
  ]);

  const refreshDetailsCard = useCallback(
    async (task?: GTRTask) => {
      if (task) {
        setLoaderDetails(true);
        const extendedTaskProps = tasks.find((t) => t.id === task.id)?.extendedProps;
        const newDetails = await loadDetails({
          id: task.id,
          classname: extendedTaskProps.pxObjClass,
          detailsDataPage,
          detailsViewName,
          getPConnect,
        });

        setDetails(newDetails);
        setLoaderDetails(false);
      } else setDetails(undefined);
    },
    [detailsDataPage, detailsViewName, getPConnect, tasks],
  );

  const handleTaskSelect = async (task: GTRTask, isSelected: boolean) => {
    setSelectedTask((prev) => {
      if (isSelected && prev?.id !== task.id) {
        return task;
      }
      return undefined;
    });
  };

  const handleDragEvent = async (gtrTask: GTRTask, eventType: 'progressChange' | 'dateChange') => {
    if (dragMode) {
      const task = tasks.find((t) => t.id === gtrTask.id);
      if (task) {
        closePopover();
        setTasks(tasks.map((t) => (t.id === gtrTask.id ? { ...t, ...gtrTask } : t)));
        await updateItemDetails({
          getPConnect,
          item: task,
          updatedFieldValueList: {
            [progressFieldName]: gtrTask.progress,
            [startDateFieldName]: gtrTask.start,
            [endDateFieldName]: gtrTask.end,
          },
        });
        if (eventType === 'dateChange') {
          await initializeGanttData();
          setDragMode(false);
        } else {
          await refreshDetailsCard(task);
        }
      }
    }
  };

  const handleDoubleClick = () => {
    setDragMode(true);
    closePopover();
  };

  const handleExpandChange = async (gtrTask: GTRTask) => {
    setTasks(tasks.map((t) => (t.id === gtrTask.id ? { ...t, ...gtrTask } : t)));
  };

  const handleGanttClick: MouseEventHandler<HTMLDivElement> = (event) => {
    // HACK: fetching all the interactive bars (svg <g> tags with tabindex attribute);
    if ((event.target as HTMLElement).closest('g[tabindex]')) {
      const newTarget: HTMLElement = (event.target as HTMLElement).closest('g[tabindex]')!;
      setPopoverTarget(newTarget);
    }
  };

  const onEditItemFromDetails = async (id: string) => {
    const task = tasks.find((x) => x.id === id);
    if (task) {
      setLoaderTasks(true);

      await getPConnect()
        .getActionsApi()
        .openLocalAction('pyUpdateCaseDetails', {
          caseID: task.extendedProps.pzInsKey,
          containerName: 'modal',
          actionTitle: `Edit ${task.type}`,
          type: 'express',
        });
      setLoaderTasks(false);
      closePopover();
    }
  };

  const gtrTasks: Array<GTRTask> = useMemo(() => {
    return tasks.map((event) => {
      const { ...taskProps } = event;
      return taskProps;
    });
  }, [tasks]);

  useEffect(() => {
    initializeGanttData();
  }, [initializeGanttData]);

  useOuterEvent('mousedown', [popoverEl, popoverTarget], () => {
    // closePopover();
    setDragMode(false);
  });

  useEffect(() => {
    setShowDetailsColumnsOn(showDetailsColumns);
  }, [showDetailsColumns]);

  useEffect(() => {
    changeViewMode(defaultViewMode);
  }, [defaultViewMode]);

  /* Subscribe to changes to the assignment case */
  useEffect(() => {
    (window as any).PCore.getPubSubUtils().subscribe(
      (window as any).PCore.getEvents().getCaseEvent().ASSIGNMENT_SUBMISSION,
      async () => {
        /* If an assignment is updated - force a reload of the events */
        setLoaderTasks(true);
        setTasks(await initializeGanttData());
        setLoaderTasks(false);
      },
      'ASSIGNMENT_SUBMISSION',
    );
    return () => {
      (window as any).PCore.getPubSubUtils().unsubscribe(
        (window as any).PCore.getEvents().getCaseEvent().ASSIGNMENT_SUBMISSION,
        'ASSIGNMENT_SUBMISSION',
      );
    };
  }, [initializeGanttData]);

  useEffect(() => {
    if (popoverTarget) refreshDetailsCard(selectedTask);
    else refreshDetailsCard();
  }, [selectedTask, popoverTarget, refreshDetailsCard]);

  return (
    <Card>
      <CardHeader
        actions={
          createClassname ? (
            <Button
              variant='simple'
              label={getPConnect().getLocalizedValue('Create new task')}
              icon
              compact
              onClick={addNewTask}
            >
              <Icon name='plus' />
            </Button>
          ) : undefined
        }
      >
        <Text variant='h2'>{heading}</Text>
      </CardHeader>
      <CardContent>
        <ProgressComponent
          visible={loaderTasks}
          placement='local'
          message={(window as any).PCore.getLocaleUtils().getLocaleValue(
            'Loading content...',
            'Generic',
            '@BASECLASS!GENERIC!PYGENERICFIELDS',
          )}
        />
        {!loaderTasks && tasks?.length === 0 && <EmptyState />}
        {tasks?.length > 0 && (
          <StyledGanttChartWrapper onMouseUp={handleGanttClick}>
            <Flex container={{ gap: 1, pad: [0.5, 1], justify: 'between' }}>
              <Switch
                id='switch'
                on={showDetailsColumnsOn}
                onChange={() => setShowDetailsColumnsOn((curr) => !curr)}
                label={getPConnect().getLocalizedValue('Show task list')}
              />
              <RadioButtonGroup inline>
                {viewModeOptions.map((tab) => (
                  <RadioButton
                    key={tab.id}
                    label={tab.name}
                    id={tab.id}
                    checked={tab.id === activeViewMode}
                    onChange={() => handleViewModeChange(tab.id as ViewModeType)}
                  />
                ))}
              </RadioButtonGroup>
            </Flex>
            {/* Gantt component starts here */}
            <Gantt
              timeStep={1000}
              tasks={gtrTasks}
              viewMode={ViewModeMap[activeViewMode]}
              onDoubleClick={handleDoubleClick}
              onDateChange={dragMode ? (task) => handleDragEvent(task, 'dateChange') : undefined}
              onProgressChange={dragMode ? (task) => handleDragEvent(task, 'progressChange') : undefined}
              onSelect={handleTaskSelect}
              onExpanderClick={handleExpandChange}
              {...getCustomStyleOptions(theme, !popoverTarget ? HoverTooltip : () => null)}
              listCellWidth={showDetailsColumnsOn ? undefined : ''}
              columnWidth={getColumnWidth(activeViewMode)}
            />
            {/* Gantt component ends here */}
            {popoverTarget && selectedTask && (
              <Popover arrow target={popoverTarget} show={!!popoverTarget} ref={setPopoverRef}>
                <Card style={{ minWidth: '20rem' }}>
                  <CardHeader
                    actions={
                      <>
                        {details && !loaderDetails && (
                          <Button
                            variant='simple'
                            label={`Edit ${selectedTask.type}`}
                            icon
                            compact
                            onClick={() => onEditItemFromDetails(selectedTask.id)}
                          >
                            <Icon name='pencil' />
                          </Button>
                        )}
                        <Button
                          variant='simple'
                          label={getPConnect().getLocalizedValue('Close')}
                          icon
                          compact
                          onClick={() => closePopover()}
                        >
                          <Icon name='times' />
                        </Button>
                      </>
                    }
                  >
                    <Text variant='h3'>{selectedTask.name}</Text>
                  </CardHeader>
                  <CardContent>
                    <ProgressComponent
                      visible={loaderDetails}
                      placement='local'
                      message={(window as any).PCore.getLocaleUtils().getLocaleValue(
                        'Loading content...',
                        'Generic',
                        '@BASECLASS!GENERIC!PYGENERICFIELDS',
                      )}
                    />
                    {!details && <EmptyState />}
                    {details}
                  </CardContent>
                </Card>
              </Popover>
            )}
          </StyledGanttChartWrapper>
        )}
      </CardContent>
    </Card>
  );
};
export default withConfiguration(PegaExtensionsGanttChart);
