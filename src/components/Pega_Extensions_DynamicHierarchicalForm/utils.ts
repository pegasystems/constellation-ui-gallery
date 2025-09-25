/**
 * Given the PConnect object of a Template component, retrieve the children
 * metadata of all regions.
 * @param {Function} pConnect PConnect of a Template component.
 */
export default function getAllFields(regionID: number, pConnect: any) {
  const metadata = pConnect().getRawMetadata();
  if (!metadata.children) {
    return [];
  }
  const allFields: any = [];
  const hasRegions = !!metadata.children[regionID]?.children;
  if (hasRegions) {
    metadata.children[regionID].children.forEach((field: any) => {
      allFields.push({
        ...pConnect().resolveConfigProps(field.config),
        type: field.type,
      });
    });
  }
  return allFields;
}
