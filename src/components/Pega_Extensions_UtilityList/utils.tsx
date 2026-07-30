import { type MouseEvent } from 'react';
import { Link, DateTimeDisplay } from '@pega/cosmos-react-core';
import { getMappedKey } from '../shared/utils';

export type ObjectProps = {
  propName: string;
  type: string;
  getPConnect: any;
  item: any;
};

export const renderObjectField = ({ propName, type, item, getPConnect }: ObjectProps) => {
  const mappedPropName = getMappedKey(propName);
  const value = item[mappedPropName];
  if (!value) return undefined;
  if (
    mappedPropName === getMappedKey('pyID') &&
    item[getMappedKey('pyID')] &&
    item[getMappedKey('pyLabel')] &&
    item[getMappedKey('pxObjClass')] &&
    item[getMappedKey('pzInsKey')]
  ) {
    const linkURL = (window as any).PCore.getSemanticUrlUtils().getResolvedSemanticURL(
      (window as any).PCore.getSemanticUrlUtils().getActions().ACTION_OPENWORKBYHANDLE,
      { caseClassName: item[getMappedKey('pxObjClass')] },
      { workID: item[getMappedKey('pyID')] },
    );
    return linkURL ? (
      <Link
        href={linkURL}
        previewable
        onPreview={() => {
          getPConnect()
            .getActionsApi()
            .showCasePreview(encodeURI(item[getMappedKey('pzInsKey')]), {
              caseClassName: item[getMappedKey('pxObjClass')],
            });
        }}
        onClick={(e: MouseEvent<HTMLButtonElement>) => {
          /* for links - need to set onClick for spa to avoid full reload - (cmd | ctrl) + click for opening in new tab */
          if (!e.metaKey && !e.ctrlKey) {
            e.preventDefault();
            getPConnect()
              .getActionsApi()
              .openWorkByHandle(item[getMappedKey('pzInsKey')], item[getMappedKey('pxObjClass')]);
          }
        }}
      >
        {value}
      </Link>
    ) : (
      value
    );
  }
  if (type === 'date') {
    return <DateTimeDisplay value={new Date(value)} variant='relative' />;
  }
  return value;
};
