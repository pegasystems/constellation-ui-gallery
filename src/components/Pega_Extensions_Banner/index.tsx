import { withConfiguration, Banner } from '@pega/cosmos-react-core';
import { useCallback, useEffect, useState } from 'react';
import MainContent from './styles';
import '../create-nonce';

type BannerProps = {
  /** Display type of rendering
   * @default success
   */
  variant: 'success' | 'info' | 'warning' | 'urgent';
  /** Name of the data page to get the messages */
  dataPage?: string;
  /** Set this boolean to true if the banner can be dismissed
   * @default false
   */
  dismissible?: boolean;
  /** If dismissible is true, the component can call a case wide actions where you can perform some post-processing.
   */
  dismissAction?: string;
  getPConnect: any;
};

export const PegaExtensionsBanner = (props: BannerProps) => {
  const { variant = 'success', dataPage = '', dismissible = false, dismissAction = '', getPConnect } = props;
  const [messages, setMessages] = useState<Array<string>>([]);
  const [isDismissed, setIsDismissed] = useState(false);

  const updateItemDetails = () => {
    const caseInstanceKey = getPConnect().getValue((window as any).PCore.getConstants().CASE_INFO.CASE_INFO_ID);
    const context = getPConnect().getContextName();

    (window as any).PCore.getDataApiUtils()
      .getCaseEditLock(caseInstanceKey, context)
      .then((response: any) => {
        /* Upon successful, update the latest etag. */
        const updatedEtag = response.headers.etag;
        (window as any).PCore.getContainerUtils().updateCaseContextEtag(getPConnect().getContextName(), updatedEtag);
      });
  };

  const refreshForm = useCallback(() => {
    const caseInstanceKey = getPConnect().getValue((window as any).PCore.getConstants().CASE_INFO.CASE_INFO_ID);

    const className = getPConnect().getValue((window as any).PCore.getConstants().CASE_INFO.CASE_INFO_CLASSID);
    (window as any).PCore.getRestClient()
      .invokeRestApi('loadView', {
        queryPayload: {
          caseClassName: className,
          caseID: caseInstanceKey,
          viewID: 'pyCaseSummary',
        },
      })
      .then((response: any) => {
        getPConnect().updateState({ caseInfo: response.data.data.caseInfo });
      });
  }, [getPConnect]);

  const dismissCaseWideAction = () => {
    const dataObj = getPConnect().getDataObject(getPConnect().getContextName());

    const caseInstanceKey = getPConnect().getValue((window as any).PCore.getConstants().CASE_INFO.CASE_INFO_ID);

    getPConnect()
      .getContainerManager()
      .addContainerItem({
        semanticURL: '',
        key: caseInstanceKey,
        data: {
          ...dataObj,
          caseInfo: {
            ...dataObj.caseInfo,
            activeActionID: dismissAction,
            isModalAction: false,
            viewType: 'form',
          },
        },
      });

    const items = Object.keys((window as any).PCore.getContainerUtils().getContainerItems('app/primary'));
    const tmpContainerName = items[items.length - 1];

    const messageConfig = {
      meta: {
        config: {
          context: 'caseInfo.content',
          name: dismissAction,
        },
      },
      options: {
        contextName: tmpContainerName,
        context: tmpContainerName,
        pageReference: 'caseInfo.content',
      },
    };

    const c11nEnv = (window as any).PCore.createPConnect(messageConfig);

    try {
      c11nEnv
        .getPConnect()
        .getActionsApi()
        .finishAssignment(c11nEnv.getPConnect().getContextName(), {
          outcomeID: '',
          jsActionQueryParams: {},
        })
        .then(() => {
          getPConnect()
            .getContainerManager()
            .removeContainerItem({ target: 'app/primary', containerItemID: tmpContainerName });

          updateItemDetails();

          refreshForm();
        });
    } catch {
      /* Handle error */
    }
  };

  const loadMessages = useCallback(
    (dismissed?: boolean) => {
      if (dataPage) {
        const pConn = getPConnect();
        const CaseInstanceKey = pConn.getValue((window as any).PCore.getConstants().CASE_INFO.CASE_INFO_ID);
        const payload = {
          dataViewParameters: [{ pyID: CaseInstanceKey, ...(dismissed ? { dismissed: true } : null) }],
        };
        (window as any).PCore.getDataApiUtils()
          .getData(dataPage, payload, pConn.getContextName())
          .then((response: any) => {
            if (response.data.data !== null) {
              setMessages(response.data.data.map((message: any) => message.pyDescription));
              if (dismissed) {
                refreshForm();
              }
            }
          })
          .catch(() => {});
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  /* Initial Load of the content - Subscribe to changes to the assignment case */
  useEffect(() => {
    const caseID = getPConnect().getValue((window as any).PCore.getConstants().CASE_INFO.CASE_INFO_ID);
    const filter = {
      matcher: 'TASKLIST',
      criteria: {
        ID: caseID,
      },
    };
    const attachSubId = (window as any).PCore.getMessagingServiceManager().subscribe(
      filter,
      () => {
        loadMessages();
      },
      getPConnect().getContextName(),
    );
    loadMessages();
    return () => {
      (window as any).PCore.getMessagingServiceManager().unsubscribe(attachSubId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDismiss = () => {
    setIsDismissed(true);

    if (dismissAction) {
      dismissCaseWideAction();
    } else {
      loadMessages(true);
    }
  };

  if (messages?.length === 0 || isDismissed) return null;
  return (
    <MainContent>
      <Banner variant={variant} messages={messages} onDismiss={dismissible ? onDismiss : undefined} />
    </MainContent>
  );
};

export default withConfiguration(PegaExtensionsBanner);
