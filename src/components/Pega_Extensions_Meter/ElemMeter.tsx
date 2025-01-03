import { Tooltip, useElement } from '@pega/cosmos-react-core';
import { type Event } from './index';
import styled, { css } from 'styled-components';

type ElemMeterProps = {
  id?: string;
  event: Event;
  totalValue?: number;
};

export const StyledElementMeter = styled.div(({ event }: { event: Event }) => {
  return css`
    background-color: ${event.color};
    width: ${event.value}%;
  `;
});

const ElemMeter = (props: ElemMeterProps) => {
  const { event, totalValue } = props;
  const [el, setEl] = useElement();
  const labelMsg =
    totalValue && totalValue !== 100
      ? `${Math.floor((event.value * totalValue) / 100.0)} of ${totalValue}`
      : `${Math.floor(event.value)}%`;
  return (
    <>
      <StyledElementMeter
        id={props.id}
        event={event}
        ref={setEl}
        role='meter'
        aria-label={event.label}
        aria-valuenow={event.value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuetext={labelMsg}
      />
      {el && <Tooltip target={el}>{`${event.label} (${labelMsg})`}</Tooltip>}
    </>
  );
};
export default ElemMeter;
