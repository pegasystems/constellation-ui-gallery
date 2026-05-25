import { useState, useCallback, useEffect } from 'react';
import { withConfiguration, Card, CardHeader, CardContent, CardFooter, Text, Button } from '@pega/cosmos-react-core';
import StyledCard from './styles';
import '../shared/create-nonce';

declare const PCore: {
  getPubSubUtils: () => {
    subscribe: (event: string, handler: (data: unknown) => void, id: string) => void;
    unsubscribe: (event: string, id: string) => void;
  };
  getEvents: () => {
    getCaseEvent: () => Record<string, string>;
  };
  getContainerUtils: () => {
    closeContainerItem: (context: string, options: Record<string, unknown>) => void;
    getContainerAccessOrder: (context: string) => string[] | undefined;
    getContainerItems: (context: string) => Record<string, unknown> | undefined;
  };
  createPConnect: (config: Record<string, unknown>) => { getPConnect: () => Record<string, (...args: unknown[]) => unknown> };
  getStore: () => {
    subscribe: (listener: () => void) => () => void;
    getState: () => Record<string, unknown>;
  };
};

// interface for props
export interface CaseLauncherProps {
  /** Card heading */
  heading: string;
  /** Description of the case launched by the widget */
  description: string;
  /** Class name of the case; used as property when launching pyStartCase  */
  classFilter: string;
  /** Primary button label  */
  labelPrimaryButton: string;
  getPConnect: () => Record<string, (...args: unknown[]) => unknown>;
}

export const PegaExtensionsCaseLauncher = (props: CaseLauncherProps) => {
  const { heading, description, classFilter, labelPrimaryButton, getPConnect } = props;
  const pConn = getPConnect();
  const [isCaseActive, setIsCaseActive] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [caseContent, setCaseContent] = useState<React.ReactNode>(null);

  const contextName = (pConn.getContextName as () => string)();
  const containerPath = 'app/caseLauncherInline';

  /**
   * After case is created, subscribe to store changes and render the
   * container's active item using PConnectHOC (the standard DX bridge component).
   */
  useEffect(() => {
    if (!isCaseActive) {
      setCaseContent(null);
      return undefined;
    }

    const renderContainerContent = () => {
      const accessOrder = PCore.getContainerUtils().getContainerAccessOrder(containerPath);
      const items = PCore.getContainerUtils().getContainerItems(containerPath);

      if (!accessOrder || accessOrder.length === 0 || !items) return;

      const activeKey = accessOrder[accessOrder.length - 1];
      const activeItem = items[activeKey] as { view?: Record<string, unknown>; context?: string } | undefined;

      if (!activeItem?.view || !activeItem?.context) return;

      /* Create a pConnect for the container item context and call getComponent() to get the rendered view */
      const c11nEnv = PCore.createPConnect({
        meta: activeItem.view,
        options: {
          context: activeItem.context,
          pageReference: 'caseInfo.content',
          containerName: 'caseLauncherInline',
          containerItemID: activeKey,
          hasForm: true,
          target: containerPath
        }
      });

      const component = (c11nEnv.getPConnect().getComponent as () => React.ReactNode)();
      setCaseContent(component);
    };

    /* Render immediately and subscribe to subsequent store changes */
    renderContainerContent();
    const unsubscribe = PCore.getStore().subscribe(renderContainerContent);

    return () => {
      unsubscribe();
    };
  }, [isCaseActive, containerPath, pConn]);

  /** Listen for case closure/resolution to auto-reset the widget */
  useEffect(() => {
    if (!isCaseActive) return undefined;

    const subId = `CaseLauncher_close_${contextName}`;
    const events = PCore.getEvents().getCaseEvent();
    const pubSub = PCore.getPubSubUtils();

    const handleDone = () => {
      setIsCaseActive(false);
      setCaseContent(null);
    };

    pubSub.subscribe(events.CASE_CLOSED, handleDone, subId);

    return () => {
      pubSub.unsubscribe(events.CASE_CLOSED, subId);
    };
  }, [isCaseActive, contextName]);

  /**
   * Creates a case using a dedicated widget-scoped container.
   * - `renderInline: true` prevents the create-stage modal.
   * - `containerName: 'caseLauncherInline'` scopes the case to this widget.
   * - The container is rendered via PConnectHOC in the useEffect above.
   */
  const createCase = useCallback(
    (className: string) => {
      setIsCreating(true);

      /* Initialize the container at app level to avoid parent re-render */
      const appContext = 'app';
      const appPConnect = PCore.createPConnect({
        options: { context: appContext }
      }).getPConnect() as Record<string, (...args: unknown[]) => unknown>;

      const containerManager = appPConnect.getContainerManager() as {
        initializeContainers: (info: Record<string, unknown>) => Promise<unknown>;
      };

      containerManager.initializeContainers({
        type: 'single',
        name: 'caseLauncherInline'
      });

      /* Call createWork from app-level pConnect so the action targets app/caseLauncherInline */
      const actionsApi = appPConnect.getActionsApi() as {
        createWork: (className: string, options: Record<string, unknown>) => Promise<unknown>;
      };

      actionsApi
        .createWork(className, {
          flowType: 'pyStartCase',
          containerName: 'caseLauncherInline',
          renderInline: true,
          openCaseViewAfterCreate: true
        })
        .then(() => {
          setIsCaseActive(true);
          setIsCreating(false);
        })
        .catch(() => {
          setIsCreating(false);
        });
    },
    [pConn]
  );

  /* Close the inline case and return to the launcher card */
  const closeCase = useCallback(() => {
    PCore.getContainerUtils().closeContainerItem('app/caseLauncherInline_1', {
      skipDirtyCheck: true
    });
    setIsCaseActive(false);
    setCaseContent(null);
  }, []);

  /* When the case is active, render the assignment form inline */
  if (isCaseActive && caseContent) {
    return (
      <Card as={StyledCard}>
        <CardHeader>
          <Text variant='h2'>{heading}</Text>
        </CardHeader>
        <CardContent>
          {caseContent}
        </CardContent>
        <CardFooter justify='end'>
          <Button variant='simple' onClick={closeCase}>
            Cancel
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card as={StyledCard}>
      <CardHeader>
        <Text variant='h2'>{heading}</Text>
      </CardHeader>
      <CardContent>{description}</CardContent>
      <CardFooter justify='end'>
        <Button
          variant='primary'
          disabled={isCreating}
          onClick={() => {
            createCase(classFilter);
          }}
        >
          {isCreating ? 'Creating...' : labelPrimaryButton}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default withConfiguration(PegaExtensionsCaseLauncher);
