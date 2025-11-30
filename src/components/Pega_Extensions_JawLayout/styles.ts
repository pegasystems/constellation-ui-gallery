import styled from 'styled-components';
import { Button } from '@pega/cosmos-react-core';

export const DentalChartContainer = styled.div`
  padding: 1rem;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ChartHeader = styled.h3`
  text-align: center;
  margin-top: 0;
  margin-bottom: 1.5rem;
  line-height: 1.2;
`;

export const ViewToggleContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`;
export const JawContainer = styled.div`
  position: relative;
  width: 28.125rem;
  height: 15.625rem;
  margin-bottom: 1.5rem;
`;

export const ToothContainer = styled.div.attrs<{ top: number; left: number }>(({ top, left }) => ({
  style: {
    top: `calc(100% - ${top}rem)`,
    left: `calc(50% + ${left}rem)`,
  },
}))<{ top: number; left: number }>`
  position: absolute;
  transform: translate(-50%, -50%);
`;

export const ToothButton = styled(Button)<{ status: string; exists: boolean; readOnly?: boolean }>`
  &.tooth-button {
    width: 2.1875rem;
    height: 2.5125rem;
    font-size: 0.6875rem;
    font-weight: bold;
    border: 0.125rem solid ${({ theme }) => theme.base.palette['border-line']};
    border-radius: 40% 40% 50% 50% / 50% 50% 50% 50%;

    background-color: ${({ status, exists, theme }) => {
      if (!exists) return theme.base.palette['secondary-background'];
      switch (status) {
        case 'M':
          return theme.base.palette.urgent;
        case 'E':
          return theme.base.palette['brand-primary'];
        default:
          return theme.base.palette['primary-background'];
      }
    }};

    color: ${({ status, exists, theme }) => {
      if (!exists) return theme.base.palette['brand-primary'];
      if (status === 'M' || status === 'E') return theme.base.palette.light;
      return theme.base.palette['brand-primary'];
    }};
  }
`;

export const LegendContainer = styled.div({
  marginTop: '1rem',
  display: 'flex',
  justifyContent: 'center',
  gap: '1rem',
  flexWrap: 'wrap',
});

export const LegendItem = styled.div(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.25rem',
}));

export const LegendColorSwatch = styled.div<{ status: 'healthy' | 'missing' | 'extracted' }>`
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  border: 0.0625rem solid ${({ theme }) => theme.base.palette['border-line']}; // 1px

  background-color: ${({ status, theme }) => {
    switch (status) {
      case 'missing':
        return theme.base.palette.urgent;
      case 'extracted':
        return theme.base.palette['brand-primary'];
      default:
        return theme.base.palette['primary-background'];
    }
  }};
`;
