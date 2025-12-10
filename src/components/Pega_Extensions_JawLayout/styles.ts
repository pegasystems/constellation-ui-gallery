import styled from 'styled-components';
import { Button } from '@pega/cosmos-react-core';

export const DentalChartContainer = styled.div`
  padding: 1rem;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const ChartHeader = styled.h3`
  text-align: left;
  margin-top: 0;
  margin-bottom: 0.5rem;
  line-height: 1.2;
`;

export const JawsWrapper = styled.div`
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
  width: 100%;
`;

export const JawSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 0 0 auto;
`;

export const JawTitle = styled.h4`
  margin: 0 0 0.5rem 0;
  text-align: center;
  font-size: 0.875rem;
  font-weight: 600;
`;

export const JawContainer = styled.div`
  position: relative;
  width: 25rem;
  height: 12.625rem;
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
    width: 1.75rem;
    height: 2rem;
    font-size: 0.625rem;
    font-weight: bold;
    border: 0.0625rem solid ${({ theme }) => theme.base.palette['border-line']};
    border-radius: 40% 40% 50% 50% / 50%;
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
  marginTop: '0.5rem',
  marginBottom: '1rem',
  display: 'flex',
  justifyContent: 'flex-start',
  gap: '0.75rem',
  flexWrap: 'wrap',
});

export const LegendItem = styled.div(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.15rem',
  fontSize: '0.75rem',
}));

export const LegendColorSwatch = styled.div<{ status: 'healthy' | 'missing' | 'extracted' }>`
  width: 0.85rem;
  height: 0.85rem;
  border-radius: 50%;
  border: 0.0625rem solid ${({ theme }) => theme.base.palette['border-line']};
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
