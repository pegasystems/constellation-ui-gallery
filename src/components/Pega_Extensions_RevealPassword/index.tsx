import { useEffect, useState, useRef, type MouseEvent, type KeyboardEvent } from 'react';
import { withConfiguration, Input, Text } from '@pega/cosmos-react-core';
import '../shared/create-nonce';

type RevealPasswordProps = {
  getPConnect: any;
  label: string;
  value: string;
  helperText?: string;
  placeholder?: string;
  validatemessage?: string;
  hideLabel: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  testId?: string;
  fieldMetadata?: any;
  additionalProps?: any;
  /** display mode */
  displayMode?: 'DISPLAY_ONLY' | '';
  hasSuggestions?: boolean;
};

export const PegaExtensionsRevealPassword = (props: RevealPasswordProps) => {
  const {
    getPConnect,
    placeholder,
    validatemessage,
    label,
    hideLabel = false,
    helperText,
    testId,
    fieldMetadata,
    additionalProps,
    displayMode,
    hasSuggestions,
  } = props;

  const pConn = getPConnect();
  const actions = pConn.getActionsApi();
  const propName = pConn.getStateProps().value;
  const maxLength = fieldMetadata?.maxLength;
  const hasValueChange = useRef(false);

  let { readOnly, required, disabled } = props;
  const { value } = props;
  [readOnly, required, disabled] = [readOnly, required, disabled].map(
    (prop) => prop === true || (typeof prop === 'string' && prop === 'true'),
  );

  const [inputValue, setInputValue] = useState(value);
  const [status, setStatus] = useState(hasSuggestions ? 'pending' : undefined);
  const [isRevealed, setIsRevealed] = useState(false);
  const revealButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => setInputValue(value), [value]);

  useEffect(() => {
    if (validatemessage !== '') {
      setStatus('error');
    }
    if (hasSuggestions) {
      setStatus('pending');
    } else if (!hasSuggestions && status !== 'success') {
      setStatus(validatemessage !== '' ? 'error' : undefined);
    }
  }, [validatemessage, hasSuggestions, status]);

  // In display-only mode show masked representation
  const displayComp = value ? '••••••••' : '';
  if (displayMode === 'DISPLAY_ONLY') {
    return <Text>{displayComp}</Text>;
  }

  const onChange = (e: MouseEvent<HTMLInputElement>) => {
    if (hasSuggestions) {
      setStatus(undefined);
    }
    setInputValue(e.currentTarget.value);
    if (value !== e.currentTarget.value) {
      actions.updateFieldValue(propName, e.currentTarget.value);
      hasValueChange.current = true;
    }
  };

  const onBlur = (e: MouseEvent<HTMLInputElement>) => {
    if ((!value || hasValueChange.current) && !readOnly) {
      actions.triggerFieldChange(propName, e.currentTarget.value);
      if (hasSuggestions) {
        pConn.ignoreSuggestion();
      }
      hasValueChange.current = false;
    }
    // when input loses focus, ensure we are not revealing
    setIsRevealed(false);
  };

  // Reveal control handlers: handle mouse, touch and keyboard
  const startReveal = (e?: Event | MouseEvent | TouchEvent | KeyboardEvent) => {
    // Ignore if disabled or readOnly
    if (disabled || readOnly) return;
    setIsRevealed(true);
  };

  const stopReveal = (e?: Event | MouseEvent | TouchEvent | KeyboardEvent) => {
    setIsRevealed(false);
  };

  const onRevealMouseDown = (e: MouseEvent<HTMLButtonElement>) => {
    // Prevent focus from leaving input on click/press; we want press-and-hold behavior
    e.preventDefault();
    startReveal();
  };

  const onRevealMouseUp = () => {
    stopReveal();
  };

  const onRevealTouchStart = (e: any) => {
    // prevent double events and allow press-and-hold on touch
    e.preventDefault();
    startReveal();
  };

  const onRevealTouchEnd = () => {
    stopReveal();
  };

  const onRevealKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    // Space or Enter should reveal while pressed
    if (e.key === ' ' || e.key === 'Spacebar' || e.key === 'Enter') {
      e.preventDefault();
      startReveal();
    }
  };

  const onRevealKeyUp = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === ' ' || e.key === 'Spacebar' || e.key === 'Enter') {
      stopReveal();
    }
  };

  // Accessible label for the reveal control
  const revealAriaLabel = 'Press and hold to reveal password';

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
      <Input
        {...additionalProps}
        type={isRevealed ? 'text' : 'password'}
        label={label}
        labelHidden={hideLabel}
        info={validatemessage || helperText}
        data-testid={testId}
        value={inputValue}
        status={status}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        maxLength={maxLength}
        onChange={onChange}
        onBlur={onBlur}
        // ensure the input expands to take container width
        style={{ flex: 1 }}
      />
      <button
        ref={revealButtonRef}
        type="button"
        aria-label={revealAriaLabel}
        title={revealAriaLabel}
        data-testid={testId ? `${testId}-reveal` : 'reveal-button'}
        onMouseDown={onRevealMouseDown}
        onMouseUp={onRevealMouseUp}
        onMouseLeave={onRevealMouseUp}
        onTouchStart={onRevealTouchStart}
        onTouchEnd={onRevealTouchEnd}
        onKeyDown={onRevealKeyDown}
        onKeyUp={onRevealKeyUp}
        onBlur={() => stopReveal()}
        // simple inline styles so it aligns with the input; visual styling in host app
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 8px',
          border: '1px solid transparent',
          background: 'transparent',
          cursor: disabled || readOnly ? 'not-allowed' : 'pointer',
          marginTop: hideLabel ? 0 : 24, // line up with label baseline similarly to other inputs
          height: 36,
        }}
      >
        {/* Use a minimal visual indicator; host app's design system can replace with icon */}
        <span aria-hidden="true">👁️</span>
      </button>
    </div>
  );
};

export default withConfiguration(PegaExtensionsRevealPassword);
