import { useEffect, useRef } from 'react';
import { useToaster, withConfiguration } from '@pega/cosmos-react-core';

import { readCriteriaList } from './criteria';
import type { Criteria } from './criteria';
import { refreshTabView } from './refresh';
import { propertyToToast, toToast } from './toast';
import '../shared/create-nonce';

type CriterionSetting = `criterion${number}${'Type' | 'Name' | 'Property'}`;

// When the case view is collapsed, the summary can mount the widget several times (and the host keeps re-creating it).
// The messaging service then calls every mounted copy once per subscription, so one published message can reach
// the same action many times. Handled messages are tracked at module level (shared by all copies) so only the
// first copy acts on a message.
const handledMessages = new Set<string>();
const MAX_HANDLED_MESSAGES = 100;

/** Returns true the first time a key is claimed, false for every later claim of the same key. */
const claimMessage = (key: string) => {
  if (handledMessages.has(key)) return false;
  handledMessages.add(key);
  // Bound the memory: message ids are unique, so only recent keys can be duplicated.
  if (handledMessages.size > MAX_HANDLED_MESSAGES) {
    handledMessages.delete(handledMessages.values().next().value as string);
  }
  return true;
};

type EventListenerProps = {
  /** What to do when a message is received
   * @default toast
   */
  action?: 'toast' | 'refresh';
  /** Identifies the messages to receive. Must match the matcher used to publish the message. */
  matcher?: string;
  /** Number of criteria (1 to 5), each one creates a separate subscription
   * @default 1
   */
  criteriaCount?: number | string;
  /** Where the toast text comes from (toast action only): a field of the received message or a property
   * @default message
   */
  messageSource?: 'message' | 'property';
  /** Field of the message displayed as the toast text (message source only)
   * @default content
   */
  contentField?: string;
  /** Property whose value is displayed as the toast text (property source only) */
  messageProperty?: string;
  /** Function to get the PConnect object for interacting with the Pega API */
  getPConnect: () => typeof PConnect;
} & { [setting in CriterionSetting]?: string };

export const PegaExtensionsEventListener = (props: EventListenerProps) => {
  const {
    getPConnect,
    matcher,
    action = 'toast',
    criteriaCount,
    messageSource = 'message',
    contentField = 'content',
    messageProperty = '',
  } = props;
  const { push } = useToaster();
  const pConn = getPConnect();
  const contextName = pConn.getContextName();

  // Read through refs so changing these does not resubscribe.
  const contentFieldRef = useRef(contentField || 'content');
  const messagePropertyRef = useRef(messageProperty);
  const messageSourceRef = useRef(messageSource);
  const pConnRef = useRef(pConn);
  useEffect(() => {
    contentFieldRef.current = contentField || 'content';
    messagePropertyRef.current = messageProperty;
    messageSourceRef.current = messageSource;
    pConnRef.current = pConn;
  });

  // Pega hands widgets a new PConnect on store changes, so subscriptions follow the values, not the objects.
  const criteriaKey = JSON.stringify(readCriteriaList(pConn, criteriaCount, { ...props }));

  useEffect(() => {
    const trimmedMatcher = matcher?.trim();
    const criteriaList: Criteria[] = JSON.parse(criteriaKey);
    // Nothing to listen to until a matcher and at least one usable criterion are set.
    if (!trimmedMatcher || criteriaList.length === 0) return undefined;
    const manager = PCore.getMessagingServiceManager();
    const onMessage = (payload: unknown) => {
      const msgId = (payload as { msgId?: unknown } | null)?.msgId;
      const textSource = messageSourceRef.current === 'property' ? messagePropertyRef.current : contentFieldRef.current;
      // The key includes what this widget does, so widgets configured differently still each act on the same message.
      // Messages without an id cannot be recognized as duplicates and are always handled.
      const key = [msgId, contextName, action, messageSourceRef.current, textSource].join('|');
      if (msgId && !claimMessage(key)) return;
      if (action === 'refresh') {
        refreshTabView(pConnRef.current);
        return;
      }
      const toast =
        messageSourceRef.current === 'property'
          ? propertyToToast(pConnRef.current, messagePropertyRef.current)
          : toToast(payload, contentFieldRef.current);
      if (toast) push(toast);
    };
    // One subscription per criterion, all sharing the same handler.
    const subscriptionIds = criteriaList.map((criteria) =>
      manager.subscribe({ matcher: trimmedMatcher, criteria }, onMessage, contextName),
    );
    return () => subscriptionIds.forEach((id) => manager.unsubscribe(id));
  }, [matcher, action, criteriaKey, contextName, push]);

  // No UI: this widget only listens.
  return null;
};

export default withConfiguration(PegaExtensionsEventListener);
