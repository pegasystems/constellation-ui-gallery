import { FieldGroup, Flex } from '@pega/cosmos-react-core';
import StyledPegaExtensionsFieldGroupAsRowWrapper from './styles';
import PropTypes from 'prop-types';

export default function PegaExtensionsFieldGroupAsRow(props) {
  const { heading, children } = props;

  return (
    <FieldGroup name={heading}>
      <StyledPegaExtensionsFieldGroupAsRowWrapper>
        {children.map((child, i) => (
          <Flex container={{ direction: 'column' }} key={`r-${i + 1}`}>
            {child}
          </Flex>
        ))}
      </StyledPegaExtensionsFieldGroupAsRowWrapper>
    </FieldGroup>
  );
}

PegaExtensionsFieldGroupAsRow.defaultProps = {
  heading: ''
};

PegaExtensionsFieldGroupAsRow.propTypes = {
  heading: PropTypes.string
};
