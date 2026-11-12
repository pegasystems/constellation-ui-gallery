import type { useToaster } from '@pega/cosmos-react-core';

export type ToastMessage = Parameters<ReturnType<typeof useToaster>['push']>[0];

/** A toast with the given text, or undefined when the text is empty. */
export function textToToast(content: unknown): ToastMessage | undefined {
  if (typeof content !== 'string' || !content.trim()) return undefined;

  return { content };
}

/** Turns a messaging service payload ({ filter, message }) into a toast, or undefined when it has no text. */
export function toToast(payload: unknown, contentField: string): ToastMessage | undefined {
  const message = (payload as { message?: unknown } | null)?.message;
  const fields = typeof message === 'object' && message !== null ? (message as Record<string, unknown>) : {};
  return textToToast(typeof message === 'string' ? message : fields[contentField]);
}

/** Turns the current value of a property into a toast, or undefined when the property is empty. */
export function propertyToToast(pConn: typeof PConnect, property: string): ToastMessage | undefined {
  const path = property.trim();
  if (!path) return undefined;
  const value = PCore.getStoreValue(path, pConn.getPageReference(), pConn.getContextName());
  return textToToast(value === undefined || value === null ? '' : String(value));
}
