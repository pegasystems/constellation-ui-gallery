import { withConfiguration, FieldGroup, Grid } from '@pega/cosmos-react-core';
import '../create-nonce';

type FormFullWidthProps = {
  heading: string;
  NumCols: string;
  gridTemplateColumns?: string;
  children: any;
};

export const PegaExtensionsFormFullWidth = (props: FormFullWidthProps) => {
  const { heading, NumCols, children } = props;
  let { gridTemplateColumns } = props;

  const nCols = parseInt(NumCols, 10);
  if (!gridTemplateColumns) {
    gridTemplateColumns = `repeat(${nCols}, minmax(0, 1fr))`;
  }
  return (
    <FieldGroup name={heading}>
      <Grid
        container={{
          cols: gridTemplateColumns,
          gap: 2
        }}
      >
        {children}
      </Grid>
    </FieldGroup>
  );
};
export default withConfiguration(PegaExtensionsFormFullWidth);
