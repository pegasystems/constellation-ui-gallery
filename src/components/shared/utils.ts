/**
 * Fetches the corresponding Launchpad identifier for the specified constellation identifier
 * @param key - identifier for which we obtain corresponding Launchpad identifier
 * @returns Launchpad identifier if available else it will return the same key passed
 */
export function getMappedKey(key: string): string {
  const namespacedKey = PCore.getNameSpaceUtils().getDefaultQualifiedName(key);
  const mappedKey = PCore.getEnvironmentInfo().getKeyMapping(namespacedKey);
  return mappedKey || namespacedKey;
}
