import { Grid, Flex, FieldGroup, withConfiguration } from '@pega/cosmos-react-core';

import type { PegaExtensionsFormWithVerticalStepperProps } from './types';
import '../shared/create-nonce';

import VerticalNavbar from './VerticalNavbar';
import ActionButtons from './ActionButtons';
import StyledPegaExtensionsFormWithVerticalStepperWrapper, { Container } from './styles';

// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
export const PegaExtensionsFormWithVerticalStepper = (props: PegaExtensionsFormWithVerticalStepperProps) => {
  const { children = [], NumCols = '1', label, showLabel, getPConnect, stepperPosition = 'left' } = props;
  const propsToUse = { label, showLabel, ...getPConnect().getInheritedProps() };
  const nCols = parseInt(NumCols, 10);

  return (
    <StyledPegaExtensionsFormWithVerticalStepperWrapper>
      <Flex container={{ direction: stepperPosition === 'left' ? 'row' : 'row-reverse', gap: 3 }}>
        <VerticalNavbar getPConnect={getPConnect} />

        <Container>
          <FieldGroup name={propsToUse.showLabel ? propsToUse.label : ''} style={{ flexGrow: 1 }}>
            <Grid
              container={{
                cols: `repeat(${nCols}, minmax(0, 1fr))`,
                gap: 2,
              }}
            >
              {children}
            </Grid>
          </FieldGroup>

          <ActionButtons getPConnect={getPConnect} />
        </Container>
      </Flex>
    </StyledPegaExtensionsFormWithVerticalStepperWrapper>
  );
};

export default withConfiguration(PegaExtensionsFormWithVerticalStepper);
