import { FieldGroup, Flex, Configuration } from '@pega/cosmos-react-core';
import StyledPegaExtensionsFieldGroupAsRowWrapper from './styles';

type FieldGroupAsRowProps = {
  heading: string;
  children: any;
};

export default function PegaExtensionsFieldGroupAsRow(props: FieldGroupAsRowProps) {
  const { heading, children } = props;

  return (
    <Configuration>
      <FieldGroup name={heading}>
        <StyledPegaExtensionsFieldGroupAsRowWrapper>
          {children.map((child: any, i: number) => (
            <Flex container={{ direction: 'column' }} key={`r-${i + 1}`}>
              {child}
            </Flex>
          ))}
        </StyledPegaExtensionsFieldGroupAsRowWrapper>
      </FieldGroup>
    </Configuration>
  );
}
