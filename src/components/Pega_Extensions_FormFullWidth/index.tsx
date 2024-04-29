import { withConfiguration, FieldGroup, Grid } from '@pega/cosmos-react-core';

type FormFullWidthProps = {
  heading: string;
  NumCols: string;
  children: any;
};

export const PegaExtensionsFormFullWidth = (props: FormFullWidthProps) => {
  const { heading, NumCols, children } = props;

  const nCols = parseInt(NumCols, 10);

  return (
    <FieldGroup name={heading}>
      <Grid
        container={{
          cols: `repeat(${nCols}, minmax(0, 1fr))`,
          gap: 2
        }}
      >
        {children}
      </Grid>
    </FieldGroup>
  );
};
export default withConfiguration(PegaExtensionsFormFullWidth);
