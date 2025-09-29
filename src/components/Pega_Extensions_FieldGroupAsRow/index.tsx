import { withConfiguration, FieldGroup, Flex, useTheme } from '@pega/cosmos-react-core';
import StyledPegaExtensionsFieldGroupAsRowWrapper from './styles';
import '../shared/create-nonce';

type FieldGroupAsRowProps = {
  heading: string;
  children: any;
};

export const PegaExtensionsFieldGroupAsRow = (props: FieldGroupAsRowProps) => {
  const { heading, children } = props;
  const theme = useTheme();
  return (
    <FieldGroup name={heading}>
      <StyledPegaExtensionsFieldGroupAsRowWrapper theme={theme}>
        {children.map((child: any, i: number) => (
          <Flex container={{ direction: 'column' }} key={`r-${i + 1}`}>
            {child}
          </Flex>
        ))}
      </StyledPegaExtensionsFieldGroupAsRowWrapper>
    </FieldGroup>
  );
};
export default withConfiguration(PegaExtensionsFieldGroupAsRow);
