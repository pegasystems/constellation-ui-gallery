import { useEffect, useRef, useCallback } from 'react';
import { withConfiguration, Card, CardContent } from '@pega/cosmos-react-core';
import StyledCard from './styles';
import '../shared/create-nonce';

// interface for props
export type CaseLauncherProps = {
  /** Card heading */
  heading: string;
  /** Description of the case launched by the widget */
  description: string;
  /** Class name of the case; used as property when launching pyStartCase  */
  classFilter: string;
  /** Primary button label  */
  labelPrimaryButton: string;
  getPConnect: any;
};

const EMBED_SCRIPT_SRC =
  'https://pm-agenticprocessfabric.external.pegalabs.io/prweb/PRRestService/c11nsvc/v1/pega-embed.js';
const PEGA_SERVER_URL = 'https://pm-agenticprocessfabric.external.pegalabs.io/prweb/';
const CLIENT_ID = '32624243804984298857';
const APP_ALIAS = 'APF';

export const PegaExtensionsCaseLauncher = (props: CaseLauncherProps) => {
  const { classFilter } = props;
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lastCreateRef = useRef<string | null>(null);
  const createTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Append a fresh pega-embed element using innerHTML (mimics static HTML which the embed runtime expects) */
  const appendEmbed = useCallback((caseTypeID: string) => {
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
  }, []);

  /** Load the embed script and create the embed element. */
  const createEmbed = useCallback(
    (caseTypeID: string) => {
      if (!caseTypeID) return;

      // Debounce: prevent double-trigger from multiple message channels firing simultaneously
      if (createTimerRef.current) {
        clearTimeout(createTimerRef.current);
      }
      // If we just created for this exact caseTypeID within 500ms, skip
      if (lastCreateRef.current === caseTypeID) return;

      createTimerRef.current = setTimeout(() => {
        lastCreateRef.current = null;
      }, 500);
      lastCreateRef.current = caseTypeID;

      const loadScriptAndEmbed = () => {
        // Script already present — just append the embed element
        if (scriptRef.current || document.querySelector(`script[src="${EMBED_SCRIPT_SRC}"]`)) {
          scriptRef.current = scriptRef.current ?? document.querySelector(`script[src="${EMBED_SCRIPT_SRC}"]`);
          appendEmbed(caseTypeID);
          return;
        }

        // First time: load script, then append embed on load
        const script = document.createElement('script');
        script.src = EMBED_SCRIPT_SRC;
        script.async = true;
        script.onload = () => {
          appendEmbed(caseTypeID);
        };
        script.onerror = () => {
          console.error('[CaseLauncher] failed to load pega-embed script');
        };
        document.body.appendChild(script);
        scriptRef.current = script;
      };

      loadScriptAndEmbed();
    },
    [appendEmbed],
  );

  useEffect(() => {
    // Do not auto-launch on mount. The embed should be created only when triggered
    // by a QuickCreate quick-link (postMessage/customEvent) or the user clicking the primary button.

    /** postMessage listener — fired by QuickCreate widget on quick-link click */
    const messageHandler = (evt: MessageEvent) => {
      try {
        const data = evt.data as Record<string, unknown> | string | null;
        if (!data) return;

        // Ignore string messages to prevent double-trigger
        if (typeof data === 'string') return;

        const action = (data.action ?? data.type) as string | undefined;
        if (action === 'quickLinkCreateCase') {
          const id = (data.className ?? data.caseTypeID ?? data.classFilter) as string | undefined;
          if (id) createEmbed('APF-Work-AIAgent');
        }
      } catch (err) {
        console.error('[CaseLauncher] messageHandler error', err);
      }
    };

    window.addEventListener('message', messageHandler);

    return () => {
      window.removeEventListener('message', messageHandler);
    };
  }, [classFilter, createEmbed]);

  return (
    <Card as={StyledCard}>
      <CardContent>
        <div id='pega-embed-container' ref={containerRef} style={{ minHeight: '400px', width: '100%' }} />
      </CardContent>
    </Card>
  );
};

export default withConfiguration(PegaExtensionsCaseLauncher);
