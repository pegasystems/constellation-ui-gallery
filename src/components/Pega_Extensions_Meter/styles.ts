import { defaultThemeProp, themeDefinition } from '@pega/cosmos-react-core';
import styled, { css } from 'styled-components';

export const StyleGroupMeterWrapper = styled.div(({ theme }: { theme: typeof themeDefinition }) => {
  const {
    base: { spacing, colors, 'border-radius': borderRadius },
  } = theme;
  return css`
    display: flex;
    flex-flow: column nowrap;
    min-height: calc(${spacing}*2);
    justify-content: center;
    width: 100%;
    & > div {
      display: flex;
      flex-flow: row;
      min-height: ${spacing};
      border-radius: ${borderRadius};
      width: 100%;
      background-color: ${colors.gray.light};

      & > div:first-child {
        border-start-start-radius: ${borderRadius};
        border-end-start-radius: ${borderRadius};
      }
      & > div:last-child {
        border-start-end-radius: ${borderRadius};
        border-end-end-radius: ${borderRadius};
      }
    }
    ol {
      display: flex;
      flex-wrap: wrap;
      margin: 0;
      padding: 0;
      list-style-type: none;
      gap: calc(${spacing}*2);
      height: calc(${spacing}*4);
    }
  `;
});
StyleGroupMeterWrapper.defaultProps = defaultThemeProp;

export const StyledFieldGroupElementMeter = styled.div(({ theme }: { theme: typeof themeDefinition }) => {
  const {
    base: { spacing },
  } = theme;
  return css`
    & > div > div {
      min-height: calc(${spacing}*2);
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
    }
  `;
});

StyledFieldGroupElementMeter.defaultProps = defaultThemeProp;
