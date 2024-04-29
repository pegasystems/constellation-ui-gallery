import { withConfiguration, Banner } from '@pega/cosmos-react-core';
import { useCallback, useEffect, useState } from 'react';
import MainContent from './styles';

type BannerProps = {
  /** Display type of rendering
   * @default success
   */
  variant: 'success' | 'info' | 'warning' | 'urgent';
  /** Name of the data page to get the messages */
  dataPage?: string;
  getPConnect: any;
};

export const PegaExtensionsBanner = (props: BannerProps) => {
  const { variant = 'success', dataPage = '', getPConnect } = props;
  const [messages, setMessages] = useState<Array<string>>([]);

  const loadMessages = useCallback(() => {
    if (dataPage) {
      const pConn = getPConnect();
      const CaseInstanceKey = pConn.getValue(
        (window as any).PCore.getConstants().CASE_INFO.CASE_INFO_ID
      );
      const payload = {
        dataViewParameters: [{ pyID: CaseInstanceKey }]
      };
      (window as any).PCore.getDataApiUtils()
        .getData(dataPage, payload, pConn.getContextName())
        .then((response: any) => {
          if (response.data.data !== null) {
            setMessages(response.data.data.map((message: any) => message.pyDescription));
          }
        })
        .catch(() => {});
    }
  }, [dataPage, getPConnect]);

  /* Subscribe to changes to the assignment case */
  useEffect(() => {
    const caseID = getPConnect().getValue(
      (window as any).PCore.getConstants().CASE_INFO.CASE_INFO_ID
    );
    const filter = {
      matcher: 'TASKLIST',
      criteria: {
        ID: caseID
      }
    };
    const attachSubId = (window as any).PCore.getMessagingServiceManager().subscribe(
      filter,
      () => {
        loadMessages();
      },
      getPConnect().getContextName()
    );
    return () => {
      (window as any).PCore.getMessagingServiceManager().unsubscribe(attachSubId);
    };
  }, [getPConnect, loadMessages]);

  useEffect(() => {
    loadMessages();
  }, [dataPage, getPConnect, loadMessages]);

  if (messages?.length === 0) return null;
  return (
    <MainContent>
      <Banner variant={variant} messages={messages}></Banner>
    </MainContent>
  );
};

export default withConfiguration(PegaExtensionsBanner);
