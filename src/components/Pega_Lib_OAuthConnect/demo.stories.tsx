import type { StoryObj } from '@storybook/react-webpack5';
import { PegaExtensionsOAuthConnect, type OAuthConnectProps } from './index';

interface OAuthConnectStoryProps extends OAuthConnectProps {
  isConnected: boolean;
}

export default {
  title: 'Widgets/OAuth Connect',
  argTypes: {
    getPConnect: {
      table: {
        disable: true,
      },
    },
  },
  component: PegaExtensionsOAuthConnect,
};

const setPCore = (args: { isConnected: boolean; profileName: string }) => {
  const { isConnected, profileName } = args;
  (window as any).PCore = {
    getConstants: () => {
      return {
        CASE_INFO: {
          CASE_INFO_ID: 'ID',
        },
      };
    },
    getMessagingServiceManager: () => {
      return {
        subscribe: () => {
          /* nothing */
        },
        unsubscribe: () => {
          /* nothing */
        },
      };
    },
    getEnvironmentInfo: () => {
      return {
        getOperatorIdentifier: () => {
          return 'operator';
        },
      };
    },
    getSemanticUrlUtils: () => {
      return {
        getResolvedSemanticURL: () => {
          return '/case/case-1';
        },
        getActions: () => {
          return {
            ACTION_OPENWORKBYHANDLE: 'openWorkByHandle',
          };
        },
      };
    },
    getDataPageUtils: () => {
      return {
        getPageDataAsync: (
          data: string,
          context: string,
          parameters: { Event: string; ProfileName: string; gadgetId: string },
        ) => {
          const { Event } = parameters;
          switch (Event) {
            case 'AUTHENTICATE':
              if (isConnected) {
                return Promise.resolve({
                  pyServiceType: 'AUTHENTICATE',
                  pyTaskStatus: true,
                  pyIsAuthenticated: true,
                  pyAccessToken: 'xxxx',
                  pyLabel: profileName,
                  pyExpiresAt: '20270828T181056.516 GMT',
                });
              } else {
                return Promise.resolve({
                  pyServiceType: 'AUTHENTICATE',
                  pyTaskStatus: true,
                  pyIsAuthenticated: false,
                });
              }
            case 'AUTHORIZE':
              return Promise.resolve({
                pyServiceType: 'AUTHORIZE',
                pyOauthURLRedirect: 'login-demo.html',
                pyTaskStatus: true,
              });
            case 'REVOKE':
              return Promise.resolve({
                pyServiceType: 'REVOKE',
                pyTaskStatus: true,
              });
          }
        },
      };
    },
  };
};

type Story = StoryObj<OAuthConnectStoryProps>;
export const Default: Story = {
  render: (args: any) => {
    setPCore(args);
    const props = {
      ...args,
      getPConnect: () => {
        return {
          getCaseInfo: () => {
            return {
              getKey: () => 'A-5',
            };
          },
          getActionsApi: () => {
            return {
              openWorkByHandle: () => {
                /* nothing */
              },
              showCasePreview: () => {
                /* nothing */
              },
            };
          },
          getContextName: () => '',
          getValue: () => 'A-5',
        };
      },
    };
    return <PegaExtensionsOAuthConnect {...props} />;
  },
  args: {
    heading: 'Demo Application',
    profileName: 'Demo application',
    connectLabel: 'Connect',
    showDisconnect: true,
    isConnected: false,
    disconnectLabel: 'Disconnect',
  },
};
