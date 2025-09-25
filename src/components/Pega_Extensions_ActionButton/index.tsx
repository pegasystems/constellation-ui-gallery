import { useState } from 'react';
import { withConfiguration, Flex, Button } from '@pega/cosmos-react-core';

type ActionableButtonProps = {
  label: string;
  dataPageName: string;
};

type FetchDataPageResult = {
  [key: string]: any;
};

const fetchDataPage = async (
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

export const PegaExtensionsActionButton = (props: ActionableButtonProps) => {
  const { label = 'Button', dataPageName } = props;
  const [data, setData] = useState<FetchDataPageResult | null>(null);

  const context = 'app/primary_1';

  const handleClick = async () => {
    const result = await fetchDataPage(dataPageName, context, {}, {});
    setData(result); // store fetched data in state
  };

  return (
    <Flex container={{ direction: 'column', gap: 10 }}>
      <Button onClick={handleClick} style={{ width: '150px' }}>{label}</Button>
      {data && (
        <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px', overflowX: 'auto' }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </Flex>
  );
};

export default withConfiguration(PegaExtensionsActionButton);
