import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { withConfiguration, Flex, cap, useDirection, CurrencyDisplay, FieldGroup } from '@pega/cosmos-react-core';
import '../shared/create-nonce';
import {
  StyledMinValue,
  StyledBar,
  StyledSlider,
  StyledThumb,
  StyledMinTrack,
  StyledMaxTrack,
  StyledMaxValue,
  StyledRangeSliderWrapper,
} from './styles';

type RangeSliderProps = {
  /** Label for the range slider
   */
  label: string;
  /** show label
   * @default true
   */
  showLabel: boolean;
  /** The minimum value of the range
   * @default 0
   */
  min: number;
  /** The maximum value of the range
   * @default 100
   */
  max: number;
  /** The increment value
   * @default 1
   */
  step: number;
  /** IF the values are currencies, set the currency code - otherwise set to empty
   * @default USD
   */
  currencyCode: string;
  /** Function to get the PConnect object for interacting with the Pega API */
  getPConnect: any;
  /** The children elements to be rendered inside the range slider component */
  children: any;
  maxValueProperty: number;
  minValueProperty: number;
};

export const PegaExtensionsRangeSlider = (props: RangeSliderProps) => {
  const {
    label = '',
    showLabel = true,
    min = 0,
    max = 100,
    step = 1,
    currencyCode = 'USD',
    maxValueProperty,
    minValueProperty,
    getPConnect,
    children,
  } = props;
  const [minValue, setMinValue] = useState(minValueProperty);
  const [maxValue, setMaxValue] = useState(maxValueProperty);
  const minTrackRef = useRef<HTMLDivElement>(null);
  const maxTrackRef = useRef<HTMLDivElement>(null);
  const [inMinDrag, setInMinDrag] = useState(false);
  const [inMaxDrag, setInMaxDrag] = useState(false);
  const { start, end } = useDirection();

  // Get the inherited props from the parent to determine label settings
  const propsToUse = { label, showLabel, ...getPConnect().getInheritedProps() };
  const maxValuePropName = getPConnect().getRawMetadata().config?.maxValueProperty?.replace('@P ', '') || '';
  const minValuePropName = getPConnect().getRawMetadata().config?.minValueProperty?.replace('@P ', '') || '';

  const refreshForm = useCallback(() => {
    const caseKey = getPConnect().getCaseInfo().getKey();
    const refreshOptions = { autoDetectRefresh: true, propertyName: '' };
    const viewName = getPConnect().getCaseInfo().getCurrentAssignmentViewName();
    getPConnect().getActionsApi().refreshCaseView(caseKey, viewName, '', refreshOptions);
  }, [getPConnect]);

  const getNearestValue = (input: number, increment: number): number => {
    const output = Math.round(input / increment) * increment;

    const decimals = increment.toString().split('.')[1]?.length;
    return Number(output.toFixed(decimals || 0));
  };

  const minMoveThumb = useCallback(
    (e: MouseEvent | TouchEvent) => {
      setMinValue((prevValue) => {
        let newValue = prevValue;
        if (minTrackRef.current) {
          const track = minTrackRef.current.getBoundingClientRect();
          const { clientX } = 'touches' in e ? e.touches[0] : e;
          const newPosition = (clientX - track[start]) / (track[end] - track[start]);

          const normalizedValue = Math.min(Math.max(min + (max - min) * newPosition, min), max);
          newValue = getNearestValue(normalizedValue, step);
          if (newValue > maxValue) {
            newValue = maxValue;
          }
          if (newValue !== prevValue) {
            getPConnect().getActionsApi().updateFieldValue(minValuePropName, newValue);
            refreshForm();
          }
        }
        return newValue;
      });
    },
    [start, end, min, max, step, maxValue, getPConnect, minValuePropName, refreshForm],
  );

  const maxMoveThumb = useCallback(
    (e: MouseEvent | TouchEvent) => {
      setMaxValue((prevValue) => {
        let newValue = prevValue;
        if (maxTrackRef.current) {
          const track = maxTrackRef.current.getBoundingClientRect();
          const { clientX } = 'touches' in e ? e.touches[0] : e;
          const newPosition = (clientX - track[start]) / (track[end] - track[start]);

          const normalizedValue = Math.min(Math.max(min + (max - min) * newPosition, min), max);
          newValue = getNearestValue(normalizedValue, step);
          if (newValue < minValue) {
            newValue = minValue;
          }
          if (newValue !== prevValue) {
            getPConnect().getActionsApi().updateFieldValue(maxValuePropName, newValue);
            refreshForm();
          }
        }
        return newValue;
      });
    },
    [start, end, min, max, step, minValue, getPConnect, maxValuePropName, refreshForm],
  );

  const onMinThumbKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'PageUp', 'PageDown', 'Home', 'End'].includes(e.key)) {
        e.preventDefault();
      }
      setMinValue((prevValue) => {
        let newValue = prevValue;
        switch (e.key) {
          case 'ArrowDown':
          case `Arrow${cap(start)}`:
            newValue = minValue - step;
            break;
          case 'ArrowUp':
          case `Arrow${cap(end)}`:
            newValue = minValue + step;
            break;
          case 'PageUp':
            newValue = minValue + 10 * step;
            break;
          case 'PageDown':
            newValue = minValue - 10 * step;
            break;
          case 'Home':
            newValue = min;
            break;
          case 'End':
            newValue = max;
            break;
          default:
        }
        if (newValue > maxValue) {
          newValue = maxValue;
        }
        if (newValue !== prevValue) {
          getPConnect().getActionsApi().updateFieldValue(minValuePropName, newValue);
          refreshForm();
        }
        return newValue;
      });
    },
    [maxValue, start, minValue, step, end, min, max, getPConnect, minValuePropName, refreshForm],
  );

  const onMaxThumbKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'PageUp', 'PageDown', 'Home', 'End'].includes(e.key)) {
        e.preventDefault();
      }
      setMaxValue((prevValue) => {
        let newValue = prevValue;
        switch (e.key) {
          case 'ArrowDown':
          case `Arrow${cap(start)}`:
            newValue = prevValue - step;
            break;
          case 'ArrowUp':
          case `Arrow${cap(end)}`:
            newValue = prevValue + step;
            break;
          case 'PageUp':
            newValue = prevValue + 10 * step;
            break;
          case 'PageDown':
            newValue = prevValue - 10 * step;
            break;
          case 'Home':
            newValue = min;
            break;
          case 'End':
            newValue = max;
            break;
          default:
        }
        if (newValue < minValue) {
          newValue = minValue;
        }
        if (newValue !== prevValue) {
          getPConnect().getActionsApi().updateFieldValue(maxValuePropName, newValue);
          refreshForm();
        }
        return newValue;
      });
    },
    [minValue, start, step, end, min, max, getPConnect, maxValuePropName, refreshForm],
  );

  useEffect(() => {
    const onDragEnd = () => {
      if (inMinDrag) {
        setInMinDrag(false);
      }
      if (inMaxDrag) {
        setInMaxDrag(false);
      }
    };

    document.addEventListener('mouseup', onDragEnd);
    document.addEventListener('touchend', onDragEnd);
    document.addEventListener('touchcancel', onDragEnd);
    if (inMinDrag) {
      document.addEventListener('mousemove', minMoveThumb);
      document.addEventListener('touchmove', minMoveThumb);
    }
    if (inMaxDrag) {
      document.addEventListener('mousemove', maxMoveThumb);
      document.addEventListener('touchmove', maxMoveThumb);
    }

    return () => {
      document.removeEventListener('mouseup', onDragEnd);
      document.removeEventListener('touchend', onDragEnd);
      document.removeEventListener('touchcancel', onDragEnd);
      document.removeEventListener('mousemove', minMoveThumb);
      document.removeEventListener('touchmove', minMoveThumb);
      document.removeEventListener('mousemove', maxMoveThumb);
      document.removeEventListener('touchmove', maxMoveThumb);
    };
  }, [inMinDrag, inMaxDrag, minMoveThumb, maxMoveThumb]);

  const minPercentage = ((Number(minValue) - min) / (max - min)) * 100;
  const maxPercentage = ((Number(maxValue) - min) / (max - min)) * 100;

  return (
    <FieldGroup name={propsToUse.showLabel ? propsToUse?.label : null} as={StyledRangeSliderWrapper}>
      <Flex
        as={StyledSlider}
        container={{
          alignItems: 'start',
          direction: 'row',
        }}
        style={
          {
            '--min-slider-value': `${minPercentage}%`,
            '--max-slider-value': `${maxPercentage}%`,
          } as CSSProperties
        }
      >
        <StyledBar />
        <Flex
          as={StyledMinTrack}
          ref={minTrackRef}
          onMouseDown={minMoveThumb}
          container={{ alignItems: 'center', justify: 'center' }}
        >
          <StyledThumb
            role='slider'
            tabIndex={0}
            onKeyDown={onMinThumbKeyDown}
            onMouseDown={() => {
              setInMinDrag(true);
            }}
            onTouchStart={(e: React.TouchEvent<HTMLDivElement>) => {
              setInMinDrag(true);
              e.preventDefault(); // Prevent dispatching mouse events as some browser may do that
            }}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={minValue}
            aria-orientation='horizontal'
            aria-label={getPConnect().getLocalizedValue('Minimum value')}
          />
        </Flex>
        <Flex
          as={StyledMaxTrack}
          ref={maxTrackRef}
          onMouseDown={maxMoveThumb}
          container={{ alignItems: 'center', justify: 'center' }}
        >
          <StyledThumb
            role='slider'
            tabIndex={0}
            onKeyDown={onMaxThumbKeyDown}
            onMouseDown={() => {
              setInMaxDrag(true);
            }}
            onTouchStart={(e: React.TouchEvent<HTMLDivElement>) => {
              setInMaxDrag(true);
              e.preventDefault(); // Prevent dispatching mouse events as some browser may do that
            }}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={maxValue}
            aria-orientation='horizontal'
            aria-label={getPConnect().getLocalizedValue('Maximum value')}
          />
        </Flex>
        <StyledMinValue>
          <CurrencyDisplay value={minValue} currencyISOCode={currencyCode} formattingOptions={{ fractionDigits: 0 }} />
        </StyledMinValue>
        <StyledMaxValue>
          <CurrencyDisplay value={maxValue} currencyISOCode={currencyCode} formattingOptions={{ fractionDigits: 0 }} />
        </StyledMaxValue>
      </Flex>
      {Array.isArray(children) ? (
        children.map((child: any, i: number) => (
          <Flex container={{ direction: 'column' }} key={`r-${i + 1}`}>
            {child}
          </Flex>
        ))
      ) : (
        <Flex container={{ direction: 'column' }}>{children}</Flex>
      )}
    </FieldGroup>
  );
};
export default withConfiguration(PegaExtensionsRangeSlider);
