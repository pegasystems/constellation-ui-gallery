import { type MouseEvent } from 'react';
import { withConfiguration, Link } from '@pega/cosmos-react-core';
import '../shared/create-nonce';

type ActionableButtonProps = {
  value: string;
  selectionProperty: string;
  getPConnect: () => typeof PConnect;
  refCaseClassName: string;
  allowPreview: boolean;
};

export const PegaExtensionsCaseReference = (props: ActionableButtonProps) => {
  const { getPConnect, selectionProperty, value, refCaseClassName, allowPreview } = props;

  if (value && typeof selectionProperty === 'string' && selectionProperty.includes(' ')) {
    const caseID = selectionProperty.split(' ')[1];
    const key = selectionProperty;
    const linkURL = PCore.getSemanticUrlUtils().getResolvedSemanticURL(
      PCore.getSemanticUrlUtils().getActions().ACTION_OPENWORKBYHANDLE,
      { caseClassName: refCaseClassName },
      { workID: caseID, page: 'pyDetails', caseID: key },
    );

    return (
      <Link
        href={linkURL}
        previewable={allowPreview}
        onPreview={() => {
          getPConnect().getActionsApi().showCasePreview(encodeURI(key), {
            caseClassName: refCaseClassName,
          });
        }}
        onClick={(e: MouseEvent<HTMLButtonElement>) => {
          /* for links - need to set onClick for spa to avoid full reload - (cmd | ctrl) + click for opening in new tab */
          if (!e.metaKey && !e.ctrlKey) {
            e.preventDefault();
            getPConnect().getActionsApi().openWorkByHandle(key, refCaseClassName);
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
