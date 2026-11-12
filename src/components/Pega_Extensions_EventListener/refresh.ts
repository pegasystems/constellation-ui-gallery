/** Refreshes the case tab view that hosts the widget. */
export const refreshTabView = (pConn: typeof PConnect) => {
  const caseKey = pConn.getCaseInfo().getKey();
  const viewName = pConn.getCurrentView();

  if (!caseKey || !viewName) {
    throw new Error('Cannot refresh without a case key and view name.');
  }

  return pConn.getActionsApi().refreshCaseView(caseKey, viewName, '');
};
