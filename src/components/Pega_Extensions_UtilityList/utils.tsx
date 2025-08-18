import { type MouseEvent } from 'react';
import { Link, DateTimeDisplay } from '@pega/cosmos-react-core';

export type ObjectProps = {
  propName: string;
  type: string;
  getPConnect: any;
  item: any;
};

export const renderObjectField = ({ propName, type, item, getPConnect }: ObjectProps) => {
  const value = item[propName];
  if (!value) return undefined;
  if (propName === 'pyID' && item.pyID && item.pyLabel && item.pxObjClass && item.pzInsKey) {
    const linkURL = (window as any).PCore.getSemanticUrlUtils().getResolvedSemanticURL(
      (window as any).PCore.getSemanticUrlUtils().getActions().ACTION_OPENWORKBYHANDLE,
      { caseClassName: item.pxObjClass },
      { workID: item.pyID },
    );
    return linkURL ? (
      <Link
        href={linkURL}
        previewable
        onPreview={() => {
          getPConnect().getActionsApi().showCasePreview(encodeURI(item.pzInsKey), {
            caseClassName: item.pxObjClass,
          });
        }}
        onClick={(e: MouseEvent<HTMLButtonElement>) => {
          /* for links - need to set onClick for spa to avoid full reload - (cmd | ctrl) + click for opening in new tab */
          if (!e.metaKey && !e.ctrlKey) {
            e.preventDefault();
            getPConnect().getActionsApi().openWorkByHandle(item.pzInsKey, item.pxObjClass);
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
