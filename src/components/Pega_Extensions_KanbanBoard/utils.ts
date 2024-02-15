/* This function calls the DX Constellation API to load a specific view for the case - The view is passed
   as parameter to this widget. You can have when and custom conditions on some of the fields that would allow you
  to customize the look and field of the cards

  the id parameter is the ID of the case (pyID)

  */
interface loadDetailsProps {
  id: string;
  classname: string;
  detailsDataPage: string;
  detailsViewName: string;
  getPConnect: () => typeof PConnect;
}

export const loadDetails = async (props: loadDetailsProps) => {
  const { id, classname, detailsDataPage, detailsViewName, getPConnect } = props;
  let myElem;
  await PCore.getDataApiUtils()
    .getDataObjectView(detailsDataPage, detailsViewName, { pyID: id })
    .then(async (res: any) => {
      const { fetchViewResources, updateViewResources } = PCore.getViewResources();
      await updateViewResources(res.data);
      const transientItemID = getPConnect()
        .getContainerManager()
        .addTransientItem({
          id: `${detailsViewName}${id}`,
          data: {}
        });
      getPConnect().getContainerManager().updateTransientData({
        transientItemID,
        data: res.data.data.dataInfo
      });
      const messageConfig = {
        meta: fetchViewResources(detailsViewName, getPConnect(), classname),
        options: {
          contextName: transientItemID,
          context: transientItemID,
          pageReference: 'content'
        }
      };
      messageConfig.meta.config.showLabel = false;
      messageConfig.meta.config.pyID = id;
      const c11nEnv = PCore.createPConnect(messageConfig);

      myElem = c11nEnv.getPConnect().createComponent(messageConfig.meta);
    });
  return myElem;
};

interface updateGroupValueProps {
  groupValue: string;
  groupProperty: string;
  columns: any;
  setColumns: any;
  task: any;
  getPConnect: () => typeof PConnect;
}
/* This method will update the case groupValue automatically using the edit action
   triggered through the pyUpdateCaseDetails local action. You can run some post-processing through this local action to
   set other values in the case.

  if the groupProperty is pyWorkStatus, then once the case becomes 'Resolved' (e.g. starts with Resolved-) then it is not possible
  to change the status through the edit local action. This is the reason why the Task will becomes read-only if the GroupValue starts by 'Resolved-'
*/
export const updateGroupValue = (props: updateGroupValueProps) => {
  const { groupValue, groupProperty, columns, setColumns, task, getPConnect } = props;

  const context = getPConnect().getContextName();
  PCore.getDataApiUtils()
    .getCaseEditLock(task.insKey, context)
    .then((response: any) => {
      const payload: any = {};
      const content: any = {};
      content[groupProperty] = groupValue;
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
              taskList: newSourceTaskList
            }
          };
          setColumns(newtmpColumns);
        });
    });
};
