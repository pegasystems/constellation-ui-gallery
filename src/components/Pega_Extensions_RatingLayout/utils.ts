/**
 * Given the PConnect object of a Template component, retrieve the children
 * metadata of all regions.
 * @param {Function} pConnect PConnect of a Template component.
 */
export default function getAllFields(pConnect: any) {
  const metadata = pConnect().getRawMetadata();
  if (!metadata.children) {
    return [];
  }

  let allFields = [];

  const makeField = (f: any) => {
    let category = 0;
    if (f.type === 'Group') {
      category = f.children && f.children.length > 0 ? 2 : 1;
    }
    return {
      ...pConnect().resolveConfigProps(f.config),
      type: f.type,
      path: f.config.value,
      category,
    };
  };

  const hasRegions = !!metadata.children[0]?.children;
  if (hasRegions) {
    metadata.children.forEach((region: any) =>
      region.children.forEach((field: any) => {
        allFields.push(makeField(field));
        if (field.type === 'Group' && field.children) {
          field.children.forEach((gf: any) => allFields.push(makeField(gf)));
        }
      }),
    );
  } else {
    allFields = metadata.children.map(makeField);
  }
  return allFields;
}
