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

export const getFilters = (filters: any) => {
  const tmpFilters = Object.entries(filters).map((i: any) => {
    return { ...i[1].condition, ignoreCase: true };
  });
  if (tmpFilters.length === 0) return null;
  let logic = '';
  const filterConditions: any = {};
  for (let i = 0; i < tmpFilters.length; i += 1) {
    logic = `${logic + (i > 0 ? ' AND ' : '')}T${i + 1}`;
    filterConditions[`T${i + 1}`] = tmpFilters[i];
  }
  return {
    logic,
    filterConditions,
  };
};
