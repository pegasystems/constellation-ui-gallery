type PConn = typeof PConnect;

export type Criteria = Record<string, string>;

export const MAX_CRITERIA = 5;

const readPropertyValue = (pConn: PConn, property: string) => {
  const value = PCore.getStoreValue(property, pConn.getPageReference(), pConn.getContextName());
  return value === undefined || value === null ? '' : String(value).trim();
};

// Same criteria as Pega's own subscriptions: case widgets use { ID }, notifications use { userId }.
const readCriterion = (pConn: PConn, type: unknown, name: unknown, property: unknown): Criteria | undefined => {
  if (type === 'case') {
    const caseKey = pConn.getValue(PCore.getConstants().CASE_INFO.CASE_INFO_ID);
    return caseKey ? { ID: caseKey } : undefined;
  }
  if (type === 'operator') {
    const operator = PCore.getEnvironmentInfo().getOperatorIdentifier()?.toLowerCase();
    return operator ? { userId: operator } : undefined;
  }
  const key = String(name ?? '').trim();
  const path = String(property ?? '').trim();
  const value = key && path ? readPropertyValue(pConn, path) : '';
  return value ? { [key]: value } : undefined;
};

/** The criteria set in the widget's settings, without incomplete or duplicate ones. */
export const readCriteriaList = (
  pConn: PConn,
  criteriaCount: unknown,
  settings: Record<string, unknown>,
): Criteria[] => {
  const count = Math.min(Math.max(Math.floor(Number(criteriaCount)) || 1, 1), MAX_CRITERIA);
  const seen = new Set<string>();
  return Array.from({ length: count }, (_, i) =>
    readCriterion(
      pConn,
      settings[`criterion${i + 1}Type`] ?? (i === 0 ? 'case' : 'property'),
      settings[`criterion${i + 1}Name`],
      settings[`criterion${i + 1}Property`],
    ),
  ).filter((criteria): criteria is Criteria => {
    const key = JSON.stringify(criteria);
    if (!criteria || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};
