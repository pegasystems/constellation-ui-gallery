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
  getPConnect: () => typeof PConnect;
};

// Launchpad fallback when readDataObject is unavailable: use a lookup list DP
// (e.g. Primary.BusinessID equals Parameters.ID) and render a small FieldValueList.
const loadStaticDetails = async (props: LoadDetailsProps) => {
  const { id, detailsDataPage, getPConnect } = props;
  const pyID = getMappedKey('pyID');
  const pyStatusWork = getMappedKey('pyStatusWork');
  const pxUpdateDateTime = getMappedKey('pxUpdateDateTime');
  const localize = (label: string) => getPConnect?.()?.getLocalizedValue?.(label) || label;

  try {
    const response = await PCore.getDataApiUtils().getData(getMappedKey(detailsDataPage), {
      dataViewParameters: {
        [pyID]: id,
      },
    });

    if (response?.data?.data && response.data.data.length > 0) {
      const itemData = response.data.data.find((item: any) => item[pyID] === id);

      if (!itemData) {
        console.warn('No matching record found for ID:', id);
        return null;
      }

      const React = (window as any).React;
      const { FieldValueList } = await import('@pega/cosmos-react-core');
      const fields = [
        {
          id: pyID,
          name: localize('ID'),
          value: String(itemData[pyID] || ''),
        },
        {
          id: pyStatusWork,
          name: localize('Status'),
          value: String(itemData[pyStatusWork] || ''),
        },
        {
          id: pxUpdateDateTime,
          name: localize('Update Date/Time'),
          value: String(itemData[pxUpdateDateTime] || ''),
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
  if (!PCore.getRestClient().doesRestApiExist('readDataObject')) {
    return loadStaticDetails(props);
  }

  let myElem;
  await PCore.getDataApiUtils()
    .getDataObjectView(
      getMappedKey(detailsDataPage),
      detailsViewName,
      { [getMappedKey('pyID')]: id },
      getPConnect().getContextName(),
    )
    .then(async (res: any) => {
      const { fetchViewResources, updateViewResources } = PCore.getViewResources();
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
      messageConfig.meta.config!.showLabel = false;
      messageConfig.meta.config![getMappedKey('pyID')] = id;
      const c11nEnv = PCore.createPConnect(messageConfig as any);

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
  getPConnect: () => typeof PConnect;
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
  PCore.getDataApiUtils()
    .getCaseEditLock(task.insKey, context)
    .then((response: any) => {
      const payload: any = {};
      const content: any = {};
      content[getMappedKey(groupProperty)] = groupValue;
      payload[task.insKey] = content;

      PCore.getDataApiUtils()
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
