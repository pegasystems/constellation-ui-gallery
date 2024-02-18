import { FieldGroup, Grid, Configuration } from '@pega/cosmos-react-core';

type FormFullWidthProps = {
  heading: string;
  NumCols: string;
  children: any;
};

export default function PegaExtensionsFormFullWidth(props: FormFullWidthProps) {
  const { heading, NumCols, children } = props;

  const nCols = parseInt(NumCols, 10);

  return (
    <Configuration>
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
    </Configuration>
  );
}
