import { useRef, useCallback, useEffect } from 'react';
import { withConfiguration } from '@pega/cosmos-react-core';
import '../shared/create-nonce';

// interface for props
export type CaseLauncherProps = {
  /** Card heading */
  heading: string;
  /** Description of the case launched by the widget */
  description: string;
  /** Class name of the case; used as property when launching pyStartCase  */
  classFilter: any;
  /** Primary button label  */
  labelPrimaryButton: string;
  getPConnect: any;
};

const EMBED_SCRIPT_SRC =
  'https://pm-agenticprocessfabric.external.pegalabs.io/prweb/PRRestService/c11nsvc/v1/pega-embed.js';
const PEGA_SERVER_URL = 'https://pm-agenticprocessfabric.external.pegalabs.io/prweb/';
const CLIENT_ID = '32624243804984298857';
const APP_ALIAS = 'APF';

export const PegaExtensionsCaseLauncher = (_props: CaseLauncherProps) => {
  // Props are configured via the widget config but embed is triggered via postMessage
  void _props;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scriptLoadedRef = useRef(false);

  const launchEmbed = useCallback((caseTypeID: string) => {
    if (!containerRef.current || !caseTypeID) return;

    const renderEmbed = () => {
      if (!containerRef.current) return;
      containerRef.current.innerHTML = `
        <pega-embed
          id="theEmbed"
          action="createCase"
          caseTypeID="${caseTypeID}"
          casePage="assignment"
          appAlias="${APP_ALIAS}"
          pegaServerUrl="${PEGA_SERVER_URL}"
          autoReauth="true"
          authService="pega"
          clientId="${CLIENT_ID}"
          style="width:100%">
        </pega-embed>
      `;
    };

    if (scriptLoadedRef.current || document.querySelector(`script[src="${EMBED_SCRIPT_SRC}"]`)) {
      scriptLoadedRef.current = true;
      renderEmbed();
      return;
    }

    const script = document.createElement('script');
    script.src = EMBED_SCRIPT_SRC;
    script.async = true;
    script.onload = () => {
      scriptLoadedRef.current = true;
      renderEmbed();
    };
    script.onerror = () => {
      console.error('[CaseLauncher] failed to load pega-embed script');
    };
    document.body.appendChild(script);
  }, []);

  /** Listen for postMessage from QuickCreate widget and launch embed with received caseTypeID */
  useEffect(() => {
    const messageHandler = (evt: MessageEvent) => {
      try {
        const data = evt.data;
        if (!data) return;

        // Handle object-style: { action: 'quickLinkCreateCase', className: '...' }
        if (typeof data === 'object' && data.action === 'quickLinkCreateCase' && data.className) {
          launchEmbed(data.className);
          return;
        }

        // Handle string-style: "createCase:<className>"
        if (typeof data === 'string' && data.startsWith('createCase:')) {
          const id = data.split(':')[1];
          if (id) launchEmbed(id);
        }
      } catch {
        // ignore
      }
    };

    window.addEventListener('message', messageHandler);
    return () => window.removeEventListener('message', messageHandler);
  }, [launchEmbed]);

  return <div ref={containerRef} style={{ minHeight: '400px', width: '100%' }} />;
};

export default withConfiguration(PegaExtensionsCaseLauncher);
