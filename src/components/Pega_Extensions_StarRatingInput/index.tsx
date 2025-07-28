import { useEffect, useState, useRef, type MouseEvent, useCallback } from 'react';
import {
  withConfiguration,
  Rating,
  Flex,
  Icon,
  cap,
  useDirection,
  FormField,
  FormControl,
} from '@pega/cosmos-react-core';
import '../create-nonce';
import { StyledFlexWrapper, StyledStarRatingMetaInfo, StyledStarWrapper } from './styles';

type StarRatingInputProps = {
  /** field label */
  label: string;
  /** Maximum number of stars that the rating input should present
   * @default 4
   */
  maxRating: '3' | '4' | '5';
  /** Value to be passed to the component */
  value: number;
  /** Validation message */
  validatemessage?: string;
  /** helper text */
  helperText?: string;
  /** hide label from the screen
   *  @default false
   */
  hideLabel?: boolean;
  /** is  field disabled
   * @default false
   */
  disabled?: boolean;
  /** is  field readOnly
   * @default false
   */
  readOnly?: boolean;
  /** is Required field
   * @default false
   */
  required?: boolean;
  /** testId */
  testId?: string;
  /** display mode */
  displayMode?: 'DISPLAY_ONLY' | '';

  getPConnect?: any;
};

// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
export const PegaExtensionsStarRatingInput = (props: StarRatingInputProps) => {
  const {
    validatemessage = '',
    helperText = '',
    label,
    maxRating = '4',
    hideLabel = false,
    testId,
    displayMode,

    getPConnect,
  } = props;
  const pConn = getPConnect();
  const actions = pConn.getActionsApi();
  const propName = pConn.getStateProps().value;
  const maxRatingValue = parseInt(maxRating, 10);

  let { readOnly = false, required = false, disabled = false } = props;
  const { value } = props;
  [readOnly, required, disabled] = [readOnly, required, disabled].map(
    (prop) => prop === true || (typeof prop === 'string' && prop === 'true'),
  );
  const StarRatingRef = useRef<any>(null);
  const [currentValueDesc, setCurrentValueDesc] = useState('');
  const [info, setInfo] = useState(validatemessage || helperText);
  const [status, setStatus] = useState<'success' | 'warning' | 'error' | 'pending' | undefined>(undefined);

  useEffect(() => {
    if (!readOnly) {
      if (validatemessage !== '') {
        setStatus('error');
      }
      if (status !== 'success') {
        setStatus(validatemessage !== '' ? 'error' : undefined);
      }
      setInfo(validatemessage || helperText);
    }
  }, [validatemessage, status, readOnly, helperText]);

  const [inHover, setInHover] = useState(false);
  const [currentHoverValue, setCurrentHoverValue] = useState<number>(value);
  const [currentValue, setCurrentValue] = useState<number>(value);
  const [metaInfoUpdated, setMetaInfoUpdated] = useState('');

  const setValue = useCallback(
    (newValue: number) => {
      if (disabled || readOnly) return;
      const normalizedValue = Math.min(Math.max(newValue, 0), maxRatingValue);

      setCurrentHoverValue(normalizedValue);
      setCurrentValue(normalizedValue);
      actions.updateFieldValue(propName, normalizedValue);
      setCurrentValueDesc(`${normalizedValue} star${normalizedValue > 1 ? 's' : ''}`);
      setMetaInfoUpdated(`${normalizedValue} of ${maxRatingValue}`);
    },
    [actions, disabled, maxRatingValue, propName, readOnly],
  );

  const { start, end, rtl } = useDirection();

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (readOnly || disabled) return;
      if (['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'PageUp', 'PageDown', 'Home', 'End'].includes(e.key))
        e.preventDefault();

      switch (e.key) {
        case 'ArrowDown':
        case `Arrow${cap(start)}`:
          setValue(currentValue - 1);
          break;
        case 'ArrowUp':
        case `Arrow${cap(end)}`:
          setValue(currentValue + 1);
          break;
        case 'PageUp':
          setValue(currentValue + 1);
          break;
        case 'PageDown':
          setValue(currentValue - 1);
          break;
        default:
      }
    },
    [currentValue, disabled, end, readOnly, setValue, start],
  );

  useEffect(() => {
    setValue(value);
  }, [setValue, value]);

  const roundToPrecision = (numberToRound: number, precision = 1): number => {
    const multiplier = 1 / precision;
    return Math.ceil(numberToRound * multiplier) / multiplier;
  };

  const getValueFromXCoordinate = (coordinate: number): number => {
    const { left, right, width } = StarRatingRef.current?.getBoundingClientRect() as DOMRect;
    const valueFromX = rtl
      ? roundToPrecision(((right - coordinate) / width) * maxRatingValue)
      : roundToPrecision(((coordinate - left) / width) * maxRatingValue);

    return Math.max(Math.min(valueFromX, maxRatingValue), 0);
  };

  const getValueFromEventPosition = (event: MouseEvent | TouchEvent): number => {
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    return getValueFromXCoordinate(clientX);
  };

  const onClick = (e: MouseEvent) => {
    if (readOnly || disabled) return;

    const newValue = getValueFromEventPosition(e);

    if (newValue === currentValue) {
      setValue(0);
      setInHover(false);
      return;
    }
    setValue(newValue);
  };

  const onMouseEnter = (e: MouseEvent) => {
    if (readOnly || disabled) return;

    setInHover(true);
    setCurrentHoverValue(getValueFromEventPosition(e));
  };

  const onMouseMove = (e: MouseEvent) => {
    if (readOnly || disabled) return;

    if (inHover) setCurrentHoverValue(getValueFromEventPosition(e));
  };

  const onMouseLeave = () => {
    if (readOnly || disabled) return;

    setInHover(false);
    setCurrentHoverValue(currentValue);
  };

  const onTouchStart = (e: TouchEvent) => {
    if (readOnly || disabled) return;

    setInHover(true);
    setCurrentHoverValue(getValueFromEventPosition(e));

    // Prevent scrolling when touch is initiated
    e.preventDefault();
  };

  const onTouchMove = (e: TouchEvent) => {
    if (readOnly || disabled) return;

    setCurrentHoverValue(getValueFromEventPosition(e));
  };

  const onTouchEnd = () => {
    if (readOnly || disabled) return;

    setInHover(false);
  };

  const readonlyComp = (
    <Rating maxRating={maxRatingValue} aria-label={label} metaInfo={metaInfoUpdated} value={value} />
  );

  if (displayMode === 'DISPLAY_ONLY') {
    return readonlyComp;
  }

  return (
    <Flex container={{ direction: 'row' }} as={StyledFlexWrapper}>
      <FormField
        label={label}
        labelHidden={hideLabel}
        info={info}
        status={status}
        testId={testId}
        disabled={disabled}
        readOnly={readOnly}
        ariaLabel={label}
        required={required}
      >
        <FormControl>
          <Flex
            ref={StarRatingRef}
            as={StyledStarWrapper}
            container={{ direction: 'row', alignItems: 'start' }}
            role='slider'
            aria-label={`${label}. Choose a rating from 0 to ${maxRatingValue} where ${maxRatingValue} is extremely satisfied`}
            aria-disabled={disabled ? 'true' : 'false'}
            aria-readonly={readOnly ? 'true' : 'false'}
            aria-valuemin={0}
            aria-valuemax={maxRatingValue}
            aria-valuetext={currentValueDesc}
            tabIndex={disabled ? '-1' : '0'}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseMove={onMouseMove}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onKeyDown={onKeyDown}
            onMouseLeave={onMouseLeave}
          >
            {Array.from({ length: maxRatingValue }, (_, i) => {
              const rating = i + 1;
              const isSolid = rating <= currentHoverValue;
              return (
                <Icon
                  className={`star ${disabled ? 'disabled' : ''} ${readOnly ? 'readonly' : ''}`}
                  key={`Icon-${i}`}
                  name={isSolid ? 'star-solid' : 'star'}
                />
              );
            })}
          </Flex>
          {metaInfoUpdated && (
            <Flex item={{ shrink: 0 }}>
              <StyledStarRatingMetaInfo>({metaInfoUpdated})</StyledStarRatingMetaInfo>
            </Flex>
          )}
        </FormControl>
      </FormField>
    </Flex>
  );
};
export default withConfiguration(PegaExtensionsStarRatingInput);
