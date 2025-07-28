import { colorInGradientByName } from '@pega/cosmos-react-core';
import type { Task as GTRTask, StylingOption, ViewMode as GTRViewModeType } from 'gantt-task-react';
import { ViewMode as GTRViewMode } from 'gantt-task-react';
import type { TaskType } from 'gantt-task-react/dist/types/public-types';
import type { DefaultTheme } from 'styled-components';

export type ViewModeType = 'Hourly' | 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';

export interface Task extends GTRTask {
  extendedProps: any;
}

export type CategoryType = 'PROJECT' | 'TASK' | 'MILESTONE';

export type GanttChartProps = {
  heading?: string;
  createClassname?: string;
  dataPage: string;
  categoryFieldName: string;
  parentFieldName: string;
  dependenciesFieldName: string;
  startDateFieldName: string;
  endDateFieldName: string;
  progressFieldName: string;
  showDetailsColumns: boolean;
  defaultViewMode: ViewModeType;
  detailsDataPage: string;
  detailsViewName: string;
  getPConnect: any;
};

/** Loads data for Gantt chart from a datapage */
export const loadGanttData = async (
  dataPage: string,
  categoryFieldName: string,
  parentFieldName: string,
  dependenciesFieldName: string,
  startDateFieldName: string,
  endDateFieldName: string,
  progressFieldName: string,
) => {
  const response = await (window as any).PCore.getDataApiUtils().getData(dataPage, {});
  const mappedTasks: Array<Task> = [];
  if (response.data.data !== null) {
    response.data.data.forEach((item: any) => {
      const {
        pyID: id,
        pyLabel: name,
        [categoryFieldName]: type,
        [parentFieldName]: project,
        [dependenciesFieldName]: dependencies,
        [startDateFieldName]: start,
        [endDateFieldName]: end,
        [progressFieldName]: progress,
      } = item;
      mappedTasks.push({
        id,
        name,
        start: new Date(start),
        end: end ? new Date(end) : new Date(start),
        progress,
        dependencies: dependencies?.split(',')?.map((x: string) => x.trim()),
        type: ((type as string) || '').toLocaleLowerCase() as TaskType,
        project,
        hideChildren: !!project,
        extendedProps: item,
      });
    });
  }

  // TODO: below sorting by project and tasks should be moved to Data page or RD. Otherwise this need to be repeated everytime tasks are updated in render
  const sortedData = mappedTasks.sort((a, b) => a.start.getTime() - b.start.getTime());
  const groupedByProjects: Array<Task> = [];
  sortedData
    .filter((x) => x.type === 'project')
    .forEach((proj) => {
      groupedByProjects.push(proj);
      groupedByProjects.push(...sortedData.filter((x) => x.project === proj.id));
    });
  return groupedByProjects;
};

/** Prepare custom style options for Gantt from theme and hides popover */
export const getCustomStyleOptions = (theme: DefaultTheme, TooltipContent?: any) => {
  const styleOptions: StylingOption = {
    arrowColor: theme.base.palette.dark,

    projectBackgroundColor: colorInGradientByName('pastel-orange', 1 / 6),
    projectBackgroundSelectedColor: colorInGradientByName('pastel-orange', 1 / 4),
    projectProgressColor: colorInGradientByName('pastel-orange', 1 / 2),
    projectProgressSelectedColor: colorInGradientByName('pastel-orange', 1),

    barBackgroundColor: colorInGradientByName('grayscale', 1 / 6),
    barBackgroundSelectedColor: colorInGradientByName('grayscale', 1 / 4),
    barProgressColor: colorInGradientByName('japanese-laurel', 1 / 4),
    barProgressSelectedColor: colorInGradientByName('japanese-laurel', 1 / 3),

    milestoneBackgroundColor: colorInGradientByName('faded-red', 1 / 3),
    milestoneBackgroundSelectedColor: colorInGradientByName('faded-red', 1 / 2),

    TooltipContent,
  };

  return styleOptions;
};

/** Maps ViewMode to Gantt ViewMode */
export const ViewModeMap: Record<ViewModeType, GTRViewModeType> = {
  Hourly: GTRViewMode.Hour,
  Daily: GTRViewMode.Day,
  Weekly: GTRViewMode.Week,
  Monthly: GTRViewMode.Month,
  Yearly: GTRViewMode.Year,
};

/** Adjust column width based on viewMode */
export const getColumnWidth = (viewMode: ViewModeType) => {
  let columnWidth = 65;
  if (viewMode === 'Yearly') {
    columnWidth = 350;
  } else if (viewMode === 'Monthly') {
    columnWidth = 300;
  } else if (viewMode === 'Weekly') {
    columnWidth = 250;
  }
  return columnWidth;
};

export const viewModeOptions = Object.keys(ViewModeMap).map((key) => ({
  id: key,
  name: key,
}));

// TODO: move this to a common util outside all components and reuse in Kanban and Gantt

/* This function calls the DX Constellation API to load a specific view for the case - The view is passed
   as parameter to this widget. You can have when and custom conditions on some of the fields that would allow you
  to customize the look and field of the cards

  the id parameter is the ID of the case (pyID)

  */
type LoadDetailsProps = {
  id: string;
  classname: string;
  detailsDataPage: string;
  detailsViewName: string;
  getPConnect: any;
};
export const loadDetails = async (props: LoadDetailsProps) => {
  const { id, classname, detailsDataPage, detailsViewName, getPConnect } = props;
  let myElem;
  await (window as any).PCore.getDataApiUtils()
    .getDataObjectView(detailsDataPage, detailsViewName, { pyID: id })
    .then(async (res: any) => {
      const { fetchViewResources, updateViewResources } = (window as any).PCore.getViewResources();
      await updateViewResources(res.data);
      const transientItemID = getPConnect()
        .getContainerManager()
        .addTransientItem({
          id: `${detailsViewName}${id}`,
          data: {},
        });
      getPConnect().getContainerManager().updateTransientData({
        transientItemID,
        data: res.data.data.dataInfo,
      });
      const messageConfig = {
        meta: fetchViewResources(detailsViewName, getPConnect(), classname),
        options: {
          contextName: transientItemID,
          context: transientItemID,
          pageReference: 'content',
        },
      };
      messageConfig.meta.config.showLabel = false;
      messageConfig.meta.config.pyID = id;
      const c11nEnv = (window as any).PCore.createPConnect(messageConfig);

      myElem = c11nEnv.getPConnect().createComponent(messageConfig.meta);
    });
  return myElem;
};

export type UpdateItemDetails = {
  item: Task;
  updatedFieldValueList: any;
  getPConnect: any;
};

/* This method will update the case groupValue automatically using the edit action
   triggered through the pyUpdateCaseDetails local action. You can run some post-processing through this local action to
   set other values in the case.
*/
export const updateItemDetails = async (props: UpdateItemDetails) => {
  const { getPConnect, item, updatedFieldValueList } = props;
  const { pzInsKey } = item.extendedProps;
  const context = getPConnect().getContextName();

  const response = await (window as any).PCore.getDataApiUtils().getCaseEditLock(pzInsKey, context);

  const payload: any = { [pzInsKey]: updatedFieldValueList };
  return await (window as any).PCore.getDataApiUtils().updateCaseEditFieldsData(
    pzInsKey,
    payload,
    response.headers.etag,
    context,
  );
};
