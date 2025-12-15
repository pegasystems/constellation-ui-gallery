import { useState } from 'react';
import {
  Input,
  TextArea,
  Button,
  Tooltip,
  Popover,
  CardHeader,
  CardContent,
  useElement,
} from '@pega/cosmos-react-core';
import { FieldWrapper, InfoIcon, PopoverCard, StyledSelect } from '../styles';

type FieldComponentProps = {
  field: {
    type?: string;
    label?: string;
    value?: string;
    options?: Array<{ label: string; value: string }>;
    displayMode?: string;
    onChange?: (value: string) => void;
    key?: string;
    required?: boolean;
    disabled?: boolean;
    isParagraph?: boolean;
    tooltipText?: string;
    ariaLabel?: string;
    ariaLabelledById?: string;
  };
  index?: number;
};

/**
 * Component for rendering form fields (Dropdown, Input, or Paragraph with Popover)
 */
export const FieldComponent = ({ field, index = 0 }: FieldComponentProps) => {
  const {
    type,
    label,
    value,
    options,
    displayMode,
    onChange,
    key,
    required,
    disabled,
    isParagraph,
    tooltipText,
    ariaLabel,
    ariaLabelledById,
  } = field || {};
  const componentKey = key || label || `field-${index}`;
  const [popoverTarget, setPopoverTarget] = useState<HTMLElement | null>(null);
  const [paragraphValue, setParagraphValue] = useState(value || '');
  const [infoIconRef, setInfoIconRef] = useElement();

  const isDisabled = disabled || displayMode === 'DISPLAY_ONLY';

  // Handle paragraph field with popover
  if (isParagraph) {
    const handleParagraphClick = (e: React.MouseEvent<HTMLElement>) => {
      if (!isDisabled) {
        setPopoverTarget(e.currentTarget as HTMLElement);
        setParagraphValue(value || '');
      }
    };

    const handlePopoverClose = () => {
      setPopoverTarget(null);
    };

    const handlePopoverApply = () => {
      if (typeof onChange === 'function') {
        onChange(paragraphValue);
      }
      setPopoverTarget(null);
    };

    return (
      <FieldWrapper container={{ gap: 0.5, alignItems: 'center' }}>
        <Input key={componentKey} labelHidden value={value || ''} disabled={isDisabled} required={required} readOnly />
        {tooltipText && (
          <>
            <InfoIcon ref={setInfoIconRef} name='information' aria-label='Field information' />
            {infoIconRef && <Tooltip target={infoIconRef}>{tooltipText}</Tooltip>}
          </>
        )}
        <Button
          variant='simple'
          icon
          compact
          disabled={isDisabled}
          onClick={handleParagraphClick}
          aria-label='Open paragraph editor'
        >
          <InfoIcon name='list' />
        </Button>
        {popoverTarget && (
          <Popover arrow target={popoverTarget} show={!!popoverTarget} onClose={handlePopoverClose}>
            <PopoverCard>
              <CardHeader
                actions={
                  <FieldWrapper container={{ gap: 0.5 }}>
                    <Button variant='simple' label='Apply' onClick={handlePopoverApply}>
                      Apply
                    </Button>
                    <Button variant='simple' label='Close' icon compact onClick={handlePopoverClose}>
                      <InfoIcon name='times' />
                    </Button>
                  </FieldWrapper>
                }
              >
                <span>{label || 'Edit Text'}</span>
              </CardHeader>
              <CardContent>
                <TextArea
                  value={paragraphValue}
                  onChange={(e) => setParagraphValue(e.currentTarget.value)}
                  placeholder='Enter text...'
                  rows={6}
                />
              </CardContent>
            </PopoverCard>
          </Popover>
        )}
      </FieldWrapper>
    );
  }

  // Handle dropdown field
  if (type === 'Dropdown' && Array.isArray(options) && options.length > 0) {
    const selectId = `${componentKey}-select`;
    const ariaProps: { 'aria-label'?: string; 'aria-labelledby'?: string } = {};

    // If we don't have a dedicated label to render, fall back to ARIA-based naming
    if (!label) {
      if (ariaLabel) {
        ariaProps['aria-label'] = ariaLabel;
      } else if (ariaLabelledById) {
        ariaProps['aria-labelledby'] = ariaLabelledById;
      }
    }

    return (
      <FieldWrapper container={{ gap: 0.5, alignItems: 'center' }}>
        {label && <label htmlFor={selectId}>{label}</label>}
        <StyledSelect
          id={selectId}
          key={componentKey}
          value={value || ''}
          disabled={isDisabled}
          required={required}
          $isDisabled={isDisabled}
          {...ariaProps}
          onChange={(e) => {
            if (typeof onChange === 'function' && !isDisabled) {
              onChange(e.target.value);
            }
          }}
        >
          {options.map((option: any, optIndex: number) => (
            <option key={`${componentKey}-option-${optIndex}`} value={option.value || option.label}>
              {option.label || option.value}
            </option>
          ))}
        </StyledSelect>
      </FieldWrapper>
    );
  }

  // Handle regular input field
  return (
    <FieldWrapper container={{ gap: 0.5, alignItems: 'center' }}>
      <Input
        key={componentKey}
        label={label}
        value={value || ''}
        disabled={isDisabled}
        required={required}
        onChange={(e) => {
          if (typeof onChange === 'function' && !isDisabled) {
            onChange(e.currentTarget.value);
          }
        }}
      />
      {tooltipText && (
        <>
          <InfoIcon ref={setInfoIconRef} name='information' aria-label='Field information' />
          {infoIconRef && <Tooltip target={infoIconRef}>{tooltipText}</Tooltip>}
        </>
      )}
    </FieldWrapper>
  );
};
