import { useState, useMemo } from 'react';
import { Slider, type SliderProps } from '@pega/cosmos-react-core';

type RatingElemProps = {
  value: number;
  label: string;
  propIndex: number;
  path: string;
  getPConnect?: any;
};

const tickValues = ['N/A', 'Low', 'Medium', 'High', 'Severe'];
const RatingElem = (props: RatingElemProps) => {
  const { getPConnect, label, value, path, propIndex } = props;
  const [inputValue, setInputValue] = useState(value);
  const ticksObject: SliderProps['ticks'] = {};
  const numTicks = 5;
  Array(numTicks)
    .fill(0)
    .map((_, index) => index)
    .forEach((tick) => {
      ticksObject![tick + 1] = getPConnect().getLocalizedValue(tickValues[tick]);
    });

  /* When calling updateFieldValue, we need to be in the context of the object in the array
     Using useMemo to cache the actionsApi object to only create it once and not when changing tabs
     path should be set to the embedded object name like '.Ratings' */
  const actionsApi: any = useMemo(() => {
    const messageConfig = {
      meta: props,
      options: {
        context: getPConnect().getContextName(),
        pageReference: `caseInfo.content${path}[${propIndex}]`,
        target: getPConnect().getTarget(),
      },
    };
    const c11nEnv = (window as any).PCore.createPConnect(messageConfig);
    return c11nEnv.getPConnect().getActionsApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getPConnect]);

  const onChangeValue = (changeValue: number) => {
    setInputValue(changeValue);
    actionsApi?.updateFieldValue('.Value', changeValue);
  };

  return (
    <Slider
      step={1}
      min={1}
      max={5}
      ticks={ticksObject}
      showInput={false}
      label={label}
      value={inputValue}
      onChange={onChangeValue}
    />
  );
};
export default RatingElem;
