import styled, { css, useTheme } from 'styled-components';
import { type Event } from './index';
import { readableColor, themeDefinition } from '@pega/cosmos-react-core';
import { rgba } from 'polished';

type ElemDisplayProps = {
  type?: string;
  event: Event;
  totalValue?: number;
};

export const StyledElementDisplay = styled.div(
  ({ textColor, valueColor, theme }: { textColor: string; valueColor: string; theme: typeof themeDefinition }) => {
    const {
      base: { spacing },
    } = theme;
    return css`
      display: inline-flex;
      align-items: center;
      gap: ${spacing};
      & > i {
        background-color: ${valueColor};
        width: ${spacing};
        height: ${spacing};
        border-radius: 50%;
      }
      & > span {
        color: ${textColor};
        font-size: 0.75rem;
      }
    `;
  },
);

const ElemDisplay = (props: ElemDisplayProps) => {
  const { type, event, totalValue } = props;
  const theme = useTheme();
  const Element = type === 'li' ? 'li' : 'div';

  const textColor = rgba(
    readableColor(theme.base.palette['primary-background']),
    theme.base.transparency['transparent-3'],
  );

  const labelMsg = `${event.label} (${
    totalValue && totalValue !== 100
      ? `${Math.floor((event.value * totalValue) / 100.0)} of ${totalValue}`
      : `${Math.floor(event.value)}%`
  })`;

  return (
    <StyledElementDisplay as={Element} textColor={textColor} valueColor={event.color} aria-hidden>
      <i />
      <span>{labelMsg}</span>
    </StyledElementDisplay>
  );
};
export default ElemDisplay;
