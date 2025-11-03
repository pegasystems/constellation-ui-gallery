type FetchDataPageResult = {
  data?: any[];
  hasMoreResults?: boolean;
  [key: string]: any;
};

const fetchDataPage = async(
  dataPageName: string,
  context: string,
  payload: Record<string, any> = {}
): Promise<FetchDataPageResult> => {
  try {
    // eslint-disable-next-line no-console
    console.log(dataPageName, payload);
    const response = await PCore.getDataApiUtils().getData(dataPageName, payload, context);
    return response.data || {};
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error fetching data for ${dataPageName}:`, error);
    throw error;
  }
};


const fetchPageDataPage = async(
  dataPageName: string,
  context: string,
  payload: Record<string, any> = {},
  options: Record<string, any> = {}
): Promise<FetchDataPageResult> => {
  try {
    // eslint-disable-next-line no-console
    console.log(dataPageName, payload);
    const response = await PCore.getDataPageUtils().getPageDataAsync(dataPageName, context, payload, options);
    return response || {};
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error fetching data for ${dataPageName}:`, error);
    throw error;
  }
};

export { fetchPageDataPage, fetchDataPage };
