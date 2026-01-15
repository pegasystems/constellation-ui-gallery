import { getMappedKey } from '../shared/utils';
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

//For LP you will need to create a new lookup data page query to "Primary . Business ID is equal to Parameters . ID"
//and use that as the lookup for the kanban board.
const loadStaticDetails = async (props: LoadDetailsProps) => {
  const { id, detailsDataPage } = props;

  try {
    const response = await (window as any).PCore.getDataApiUtils().getData(
      (window as any).PCore.getNameSpaceUtils().getDefaultQualifiedName(detailsDataPage),
      {
        dataViewParameters: {
          ID: id,
        },
      },
    );

    if (response?.data?.data && response.data.data.length > 0) {
      // Filter to find the specific record by ID
      const itemData = response.data.data.find(
        (item: any) => item[getMappedKey('pyID')] === id || item.BusinessID === id,
      );

      if (!itemData) {
        console.warn('No matching record found for ID:', id);
        return null;
      }

      // Only render BusinessID, Status, and UpdateDateTime
      const React = (window as any).React;
      const { FieldValueList } = await import('@pega/cosmos-react-core');
      const fields = [
        {
          id: 'BusinessID',
          name: 'Business ID',
          value: String(itemData.BusinessID || ''),
        },
        {
          id: 'Status',
          name: 'Status',
          value: String(itemData.Status || ''),
        },
        {
          id: 'UpdateDateTime',
          name: 'Update Date/Time',
          value: String(itemData.UpdateDateTime || ''),
        },
      ];
      return React.createElement(FieldValueList, {
        variant: 'stacked',
        fields,
      });
    }
  } catch (error) {
    console.error('Error loading static details:', error);
  }
  return null;
};

export const loadDetails = async (props: LoadDetailsProps) => {
  const { id, classname, detailsDataPage, detailsViewName, getPConnect } = props;

  /* Use case for Launchpad where readDataObject is not implemented */
  if (!(window as any).PCore.getRestClient().doesRestApiExist('readDataObject')) {
    return loadStaticDetails(props);
  }

  let myElem;
  await (window as any).PCore.getDataApiUtils()
    .getDataObjectView(getMappedKey(detailsDataPage), detailsViewName, { [getMappedKey('pyID')]: id })
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
      messageConfig.meta.config[getMappedKey('pyID')] = id;
      const c11nEnv = (window as any).PCore.createPConnect(messageConfig);

      myElem = c11nEnv.getPConnect().createComponent(messageConfig.meta);
    });
  return myElem;
};

type UpdateGroupValueProps = {
  groupValue: string;
  groupProperty: string;
  columns: any;
  setColumns: any;
  task: any;
  getPConnect: any;
};
/* This method will update the case groupValue automatically using the edit action
   triggered through the pyUpdateCaseDetails local action. You can run some post-processing through this local action to
   set other values in the case.

  if the groupProperty is pyWorkStatus, then once the case becomes 'Resolved' (e.g. starts with Resolved-) then it is not possible
  to change the status through the edit local action. This is the reason why the Task will becomes read-only if the GroupValue starts by 'Resolved-'
*/
export const updateGroupValue = (props: UpdateGroupValueProps) => {
  const { groupValue, groupProperty, columns, setColumns, task, getPConnect } = props;
  const context = getPConnect().getContextName();
  (window as any).PCore.getDataApiUtils()
    .getCaseEditLock(task.insKey, context)
    .then((response: any) => {
      const payload: any = {};
      const content: any = {};
      content[getMappedKey(groupProperty)] = groupValue;
      payload[task.insKey] = content;

      (window as any).PCore.getDataApiUtils()
        .updateCaseEditFieldsData(task.insKey, payload, response.headers.etag, context)
        .then(() => {
          task.groupValue = groupValue;
          const newSourceTaskList = Array.from(columns[groupValue].taskList);
          const newtmpColumns = {
            ...columns,
            [groupValue]: {
              ...columns[groupValue],
              taskList: newSourceTaskList,
            },
          };
          setColumns(newtmpColumns);
        });
    });
};
