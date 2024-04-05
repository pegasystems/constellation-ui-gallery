// utilizing theming, comment out, if want individual style
import styled, { css } from 'styled-components';
import { Configuration, defaultThemeProp } from '@pega/cosmos-react-core';

export default styled(Configuration)``;

// individual style, comment out above, and uncomment here and add styles
// import styled, { css } from 'styled-components';
//
// export default styled.div(() => {
//  return css`
//    margin: 0px 0;
//  `;
// });
export const StyledCard = styled.article(({ theme }) => {
  return css`
    background-color: ${theme.base.colors.white};
    border-radius: 0.25rem;
    width: 100%;
  `;
});
StyledCard.defaultProps = defaultThemeProp;
