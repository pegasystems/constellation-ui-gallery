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
      content[groupProperty] = groupValue;
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
