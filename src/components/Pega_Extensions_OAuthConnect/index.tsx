import { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Card,
  DateTimeDisplay,
  Flex,
  Icon,
  registerIcon,
  Text,
  withConfiguration,
} from '@pega/cosmos-react-core';
import { StyledSummaryListHeader, StyledSummaryListContent } from './styles';
import '../create-nonce';

import * as NodeIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/node.icon';
import * as ChainIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/chain.icon';

registerIcon(NodeIcon, ChainIcon);

export type OAuthConnectProps = {
  heading?: string;
  getPConnect: any;
  profileName: string;
  connectLabel: string;
  showDisconnect: boolean;
  disconnectLabel: string;
};

export const PegaExtensionsOAuthConnect = (props: OAuthConnectProps) => {
  const {
    heading = 'Application',
    getPConnect,
    profileName,
    connectLabel = 'Connect',
    showDisconnect = true,
    disconnectLabel = 'Disconnect',
  } = props;
  const [loginStatus, setLoginStatus] = useState(false);
  const [expDate, setExpDate] = useState<any>();

  const getMashupDetails = useCallback(
    async (authProfileName: any, Event: any) => {
      const gadgetId =
        getPConnect().getCaseInfo().getKey() + (window as any).PCore.getEnvironmentInfo().getOperatorIdentifier();
      const mashupDetails = new Promise((resolve) => {
        const parameters = {
          Event,
          ProfileName: authProfileName,
          gadgetId,
        };
        const context = getPConnect().getContextName();
        (window as any).PCore.getDataPageUtils()
          .getPageDataAsync('D_OAuthConnect', context, parameters, {
            invalidateCache: true,
          })
          .then((response: any) => {
            resolve(response);
          })
          .catch(() => {
            resolve(false);
          });
      });

      const mashup: any = await mashupDetails;
      if (mashup.pyTaskStatus) {
        switch (mashup.pyServiceType) {
          case 'AUTHENTICATE':
            setLoginStatus(mashup.pyIsAuthenticated);
            if (mashup.pyIsAuthenticated && mashup.pyExpiresAt) {
              const v = mashup.pyExpiresAt;
              const expirationDate = new Date(
                `${v.substring(0, 4)}-${v.substring(4, 6)}-${v.substring(6, 8)}T${v.substring(9, 11)}:${v.substring(11, 13)}:${v.substring(13, 19)}Z`,
              );
              const info = (
                <Text>
                  Successfully connected to {mashup.pyLabel}. Access token will expire on{' '}
                  <DateTimeDisplay value={expirationDate} variant='datetime' format='short' />.
                </Text>
              );
              setExpDate(info);
            }
            break;
          case 'AUTHORIZE':
            if (mashup.pyOauthURLRedirect) {
              window.open(mashup.pyOauthURLRedirect, 'Sign In', 'width=800,height=800');
            }
            break;
          case 'REVOKE':
            setExpDate(null);
            setLoginStatus(false);
            break;
          default:
            break;
        }
      }
    },
    [getPConnect],
  );

  useEffect(() => {
    const loadMashup = () => {
      getMashupDetails(profileName, 'AUTHENTICATE');
    };

    const mashupSubfilter = {
      matcher: 'OAUTH2',
      criteria: {
        ID: getPConnect().getCaseInfo().getKey() + (window as any).PCore.getEnvironmentInfo().getOperatorIdentifier(),
      },
    };
    const mashupSubId = (window as any).PCore.getMessagingServiceManager().subscribe(
      mashupSubfilter,
      loadMashup,
      getPConnect().getContextName(),
    );

    loadMashup();

    return () => {
      (window as any).PCore.getMessagingServiceManager().unsubscribe(mashupSubId);
    };
  }, [getMashupDetails, getPConnect, profileName]);

  const mashupSignIn = () => {
    getMashupDetails(profileName, 'AUTHORIZE');
  };

  const mashupRevoke = () => {
    getMashupDetails(profileName, 'REVOKE');
  };

  return (
    <Card>
      <StyledSummaryListHeader>
        <Flex container={{ alignItems: 'center', gap: 1 }}>
          <Icon name='node' />
          <Text variant='h3'>{heading}</Text>
        </Flex>
      </StyledSummaryListHeader>
      <StyledSummaryListContent>
        <Flex container={{ direction: 'column', justify: 'center', alignItems: 'center', gap: 2 }}>
          {loginStatus && expDate}
          {loginStatus && showDisconnect && (
            <Button variant='secondary' label={disconnectLabel} onClick={mashupRevoke}>
              {disconnectLabel}
            </Button>
          )}
          {!loginStatus && (
            <Button variant='secondary' label={connectLabel} onClick={mashupSignIn}>
              {connectLabel}
            </Button>
          )}
        </Flex>
      </StyledSummaryListContent>
    </Card>
  );
};
export default withConfiguration(PegaExtensionsOAuthConnect);
