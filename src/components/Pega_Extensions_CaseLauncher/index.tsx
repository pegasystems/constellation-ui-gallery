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
    isContainerInitialized: (context: string, containerName: string) => boolean;
  };
  createPConnect: (config: Record<string, unknown>) => {
    getPConnect: () => Record<string, (...args: unknown[]) => unknown>;
  };
  getStore: () => {
    subscribe: (listener: () => void) => () => void;
    getState: () => Record<string, unknown>;
  };
  getComponentsRegistry: () => {
    getLazyComponent: (name: string) => React.ComponentType | null;
  };
  getAssetLoader: () => {
    getLoader: (name: string) => (components: string[]) => Promise<unknown>;
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

  useEffect(() => {
    if (!isCaseActive) {
      setCaseContent(null);
      return undefined;
    }

    let cancelled = false;
    let flowContainerLoaded = false;
    let lastViewKey = '';

    const renderContainer = async () => {
      const accessOrder = PCore.getContainerUtils().getContainerAccessOrder(containerPath);
      const items = PCore.getContainerUtils().getContainerItems(containerPath);

      if (!accessOrder || accessOrder.length === 0 || !items) return;

      const activeKey = accessOrder[accessOrder.length - 1];
      const activeItem = items[activeKey] as { view?: Record<string, unknown>; context?: string } | undefined;

      if (!activeItem?.view || !activeItem?.context) return;

      // Build a signature so we only re-create pConnect when the view actually changes
      const viewKey = `${activeItem.context}::${JSON.stringify(activeItem.view)}`;
      if (viewKey === lastViewKey) return;
      lastViewKey = viewKey;

      console.log('[CaseLauncher] rendering for context:', activeItem.context, 'view:', activeItem.view);

      // Ensure FlowContainer is loaded once
      if (!flowContainerLoaded) {
        const existing = PCore.getComponentsRegistry().getLazyComponent('FlowContainer');
        if (!existing) {
          try {
            await PCore.getAssetLoader().getLoader('component-loader')(['FlowContainer']);
          } catch (err) {
            console.error('[CaseLauncher] component-loader error:', err);
            return;
          }
        }
        flowContainerLoaded = true;
      }

      if (cancelled) return;

      const containerPConnect = PCore.createPConnect({
        meta: { type: 'FlowContainer', config: { showWithToDo: false } },
        options: {
          context: activeItem.context,
          pageReference: 'caseInfo.content',
          containerName: 'caseLauncherInline',
          hasForm: true,
          target: containerPath,
        },
      });
      const pConn2 = containerPConnect.getPConnect();

      let component: React.ReactNode;
      try {
        component = (pConn2 as { getComponent: () => React.ReactNode }).getComponent();
      } catch (err) {
        console.error('[CaseLauncher] getComponent() threw:', err);
        return;
      }

      if (!cancelled && component) {
        setCaseContent(component);
      }
    };

    // Subscribe to store — re-render whenever the container item view changes
    const unsubscribe = PCore.getStore().subscribe(() => {
      if (!cancelled) {
        renderContainer();
      }
    });
    renderContainer(); // try immediately

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [isCaseActive, containerPath]);

  /** Listen for case closure/resolution to auto-reset the widget */
  useEffect(() => {
    if (!isCaseActive) return undefined;

    const subId = `CaseLauncher_close_${contextName}`;
    const events = PCore.getEvents().getCaseEvent();
    const pubSub = PCore.getPubSubUtils();

    const handleDone = () => {
      console.log('[CaseLauncher] CASE_CLOSED fired — resetting widget');
      setIsCaseActive(false);
      setCaseContent(null);
    };

    pubSub.subscribe(events.CASE_CLOSED, handleDone, subId);
    return () => {
      pubSub.unsubscribe(events.CASE_CLOSED, subId);
    };
  }, [isCaseActive, contextName]);

  const createCase = useCallback(
    (className: string) => {
      setIsCreating(true);

      const appPConnect = PCore.createPConnect({
        options: { context: 'app' },
      }).getPConnect() as Record<string, (...args: unknown[]) => unknown>;

      const containerManager = appPConnect.getContainerManager() as {
        initializeContainers: (info: Record<string, unknown>) => Promise<unknown>;
      };
      containerManager.initializeContainers({ type: 'single', name: 'caseLauncherInline' });

      const actionsApi = appPConnect.getActionsApi() as {
        createWork: (className: string, options: Record<string, unknown>) => Promise<unknown>;
      };

      // LOG 6 — createWork
      console.log('[CaseLauncher] LOG6 createWork class:', className);

      actionsApi
        .createWork(className, {
          flowType: 'pyStartCase',
          containerName: 'caseLauncherInline',
          renderInline: true,
          openCaseViewAfterCreate: true,
        })
        .then(() => {
          console.log('[CaseLauncher] LOG6 createWork resolved');
          setIsCaseActive(true);
          setIsCreating(false);
        })
        .catch((err: unknown) => {
          console.error('[CaseLauncher] LOG6 createWork error:', err);
          setIsCreating(false);
        });
    },
    [pConn],
  );

  const closeCase = useCallback(() => {
    PCore.getContainerUtils().closeContainerItem('app/caseLauncherInline_1', { skipDirtyCheck: true });
    setIsCaseActive(false);
    setCaseContent(null);
  }, []);

  // LOG 7 — render gate
  console.log('[CaseLauncher] LOG7 render isCaseActive:', isCaseActive, 'caseContent:', caseContent);

  if (isCaseActive && caseContent) {
    return (
      <Card as={StyledCard}>
        <CardHeader>
          <Text variant='h2'>{heading}</Text>
        </CardHeader>
        <CardContent>{caseContent}</CardContent>
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
