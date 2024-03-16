import { Flex, defaultThemeProp } from '@pega/cosmos-react-core';
import styled, { css } from 'styled-components';

export const StyledSignatureContent = styled.div``;
export const StyledButtonsWrapper = styled(Flex)(({ theme }) => {
  return css`
    padding: ${theme.base.spacing};
    border-top: 0.0625rem dashed ${theme.base.palette['border-line']};
  `;
});
StyledButtonsWrapper.defaultProps = defaultThemeProp;

export const StyledSignatureReadOnlyContent = styled.div(({ theme }) => {
  return css`
    max-width: 40ch;
    border: 0.0625rem solid ${theme.base.palette['border-line']};
  `;
});
StyledSignatureReadOnlyContent.defaultProps = defaultThemeProp;
