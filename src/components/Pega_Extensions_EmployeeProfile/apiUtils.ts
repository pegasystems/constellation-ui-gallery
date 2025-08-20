type FetchDataPageResult = Record<string, any>;

const fetchDataPage = async(
  dataPageName: string,
  context: string,
  payload: Record<string, any> = {},
  options: Record<string, any> = {}
): Promise<FetchDataPageResult> => {
  try {
    const response = await PCore.getDataPageUtils().getPageDataAsync(dataPageName, context, payload, options);
    return response || {};
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error fetching data for ${dataPageName}:`, error);
    return {};
  }
};
export default fetchDataPage;
