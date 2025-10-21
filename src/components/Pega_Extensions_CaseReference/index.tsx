import { type MouseEvent } from 'react';
import { withConfiguration, Link } from '@pega/cosmos-react-core';
import '../shared/create-nonce';

type ActionableButtonProps = {
  value: string;
  refCaseInsKey: string;
  getPConnect: any;
  refCaseClassName: string;
  allowPreview: boolean;
};

export const PegaExtensionsCaseReference = (props: ActionableButtonProps) => {
  const { getPConnect, refCaseInsKey, value, refCaseClassName, allowPreview } = props;

  if (value && typeof refCaseInsKey === 'string' && refCaseInsKey.includes(' ')) {
    const caseID = refCaseInsKey.split(' ')[1];
    const linkURL = (window as any).PCore.getSemanticUrlUtils().getResolvedSemanticURL(
      (window as any).PCore.getSemanticUrlUtils().getActions().ACTION_OPENWORKBYHANDLE,
      { caseClassName: refCaseClassName },
      { workID: caseID },
      { page: 'pyDetails' },
      { caseID: refCaseInsKey },
    );

    return (
      <Link
        href={linkURL}
        previewable={allowPreview}
        onPreview={() => {
          getPConnect().getActionsApi().showCasePreview(encodeURI(refCaseInsKey), {
            caseClassName: refCaseClassName,
          });
        }}
        onClick={(e: MouseEvent<HTMLButtonElement>) => {
          /* for links - need to set onClick for spa to avoid full reload - (cmd | ctrl) + click for opening in new tab */
          if (!e.metaKey && !e.ctrlKey) {
            e.preventDefault();
            getPConnect().getActionsApi().openWorkByHandle(refCaseInsKey, refCaseClassName);
          }
        }}
      >
        {value}
      </Link>
    );
  }
  return null;
};

export default withConfiguration(PegaExtensionsCaseReference);
