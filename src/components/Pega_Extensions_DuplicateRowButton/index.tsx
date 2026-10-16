import { withConfiguration, Button } from '@pega/cosmos-react-core';
import '../shared/create-nonce';
import { duplicateEmbeddedRow } from './utils';
import StyledDuplicateRowButtonWrapper from './styles';

type DuplicateRowButtonProps = {
  label: string;
  getPConnect?: any;
};

export const PegaExtensionsDuplicateRowButton = (props: DuplicateRowButtonProps) => {
  const { getPConnect, label } = props;

  if (!getPConnect) {
    return null;
  }

  const localizedLabel = getPConnect().getLocalizedValue(label);

  const handleDuplicateRow = () => {
    duplicateEmbeddedRow(getPConnect, props);
  };

  return (
    <StyledDuplicateRowButtonWrapper>
      <Button variant='secondary' onClick={handleDuplicateRow}>
        {localizedLabel}
      </Button>
    </StyledDuplicateRowButtonWrapper>
  );
};

export default withConfiguration(PegaExtensionsDuplicateRowButton);
