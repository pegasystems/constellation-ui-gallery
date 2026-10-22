import { withConfiguration, FieldGroup, Grid } from '@pega/cosmos-react-core';
import '../shared/create-nonce';

type FormFullWidthProps = {
  heading: string;
  NumCols: string;
  gridTemplateColumns?: string;
  children: any;
};

export const PegaExtensionsFormFullWidth = (props: FormFullWidthProps) => {
  const { heading, NumCols, children } = props;
  let { gridTemplateColumns } = props;

  // For backward compatibility, default to 1 column if NumCols is not provided or invalid - This was the behavior in 24.1
  // Note that even NumbCols = "0" will result in 1 column due to the fallback in parseInt(NumCols, 10) || 1
  const nCols = parseInt(NumCols, 10) || 1;
  if (!gridTemplateColumns) {
    gridTemplateColumns = `repeat(${nCols}, minmax(0, 1fr))`;
  }
  return (
    <FieldGroup name={heading}>
      <Grid
        container={{
          cols: gridTemplateColumns,
          gap: 2,
        }}
      >
        {children}
      </Grid>
    </FieldGroup>
  );
};
export default withConfiguration(PegaExtensionsFormFullWidth);
