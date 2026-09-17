import { useEffect, useMemo, useRef, useState } from 'react';
import type { ChangeEvent, KeyboardEvent, UIEvent } from 'react';
import { FieldValueList, Icon, registerIcon, Text, TextArea, withConfiguration } from '@pega/cosmos-react-core';
import * as alignLeftIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/align-left.icon';
import * as checkIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/check.icon';
import * as clipboardCheckIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/clipboard-check.icon';
import * as codeIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/code.icon';
import * as copyIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/copy.icon';
import * as informationIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/information.icon';
import * as trashIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/trash.icon';

import '../shared/create-nonce';

import StyledJsonEditorWrapper, {
  StyledJsonEditorCopyError,
  StyledJsonEditorCode,
  StyledJsonEditorButton,
  StyledJsonEditorError,
  StyledJsonEditorFooter,
  StyledJsonEditorHighlight,
  StyledJsonEditorLineNumbers,
  StyledJsonEditorMeta,
  StyledJsonEditorSurface,
  StyledJsonEditorStatus,
  StyledJsonEditorToolbar,
} from './styles';
import {
  copyText,
  getLineCount,
  getValidationLabel,
  getValidationStatus,
  highlightJson,
  type CopyState,
  validateJson,
} from './utils';

registerIcon(alignLeftIcon, checkIcon, clipboardCheckIcon, codeIcon, copyIcon, informationIcon, trashIcon);

export interface PegaExtensionsJsonEditorProps {
  getPConnect: () => typeof PConnect;
  label: string;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  displayMode?: '' | 'DISPLAY_ONLY' | 'LABELS_LEFT';
  readOnly?: boolean;
  required?: boolean;
  hideLabel?: boolean;
  testId?: string;
  helperText?: string;
  validatemessage?: string;
  status?: 'error' | 'success' | 'warning' | 'pending';
  indent?: number | string;
  showValidate?: boolean;
  showFormat?: boolean;
  showMinify?: boolean;
  showCopy?: boolean;
  showClear?: boolean;
  showCharacterCount?: boolean;
  showLineCount?: boolean;
}

interface StateProps {
  value: string;
}

export function PegaExtensionsJsonEditor(props: PegaExtensionsJsonEditorProps) {
  const {
    getPConnect,
    value = '',
    placeholder,
    disabled: disabledProp = false,
    displayMode,
    readOnly: readOnlyProp = false,
    required: requiredProp = false,
    label,
    hideLabel = false,
    testId,
    helperText,
    validatemessage,
    status,
    indent = 2,
    showValidate = true,
    showFormat = true,
    showMinify = true,
    showCopy = true,
    showClear = true,
    showCharacterCount = true,
    showLineCount = true,
  } = props;

  const pConn = getPConnect();
  const localize = (text: string) => pConn.getLocalizedValue?.(text) || text;
  const actions = pConn.getActionsApi();
  const stateProps = pConn.getStateProps() as StateProps;
  const propName = stateProps.value;
  let readOnly = readOnlyProp;
  let required = requiredProp;
  let disabled = disabledProp;
  [readOnly, required, disabled] = [readOnly, required, disabled].map(
    (prop) => prop === true || (typeof prop === 'string' && prop === 'true'),
  );
  const [draft, setDraft] = useState(value);
  const [validation, setValidation] = useState(() => validateJson(value, indent, required));
  const [copyState, setCopyState] = useState<CopyState>('idle');
  const [scrollOffset, setScrollOffset] = useState({ top: 0, left: 0 });
  const copyStateTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const lineCount = useMemo(() => getLineCount(draft), [draft]);
  const highlightedDraft = useMemo(() => highlightJson(draft), [draft]);
  const lineNumbers = useMemo(
    () => Array.from({ length: Math.max(1, lineCount) }, (_, index) => index + 1),
    [lineCount],
  );

  const updateValue = (nextValue: string) => {
    setDraft(nextValue);
    setValidation(validateJson(nextValue, indent, required));
    setCopyState('idle');
    actions.updateFieldValue(propName, nextValue);
  };

  useEffect(() => {
    setDraft(value);
    setValidation(validateJson(value, indent, required));
    setCopyState('idle');
  }, [indent, required, value]);

  useEffect(() => {
    return () => {
      if (copyStateTimeoutRef.current) {
        clearTimeout(copyStateTimeoutRef.current);
      }
    };
  }, []);

  const handleOnChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    updateValue(event.target.value);
  };

  const handleFormat = () => {
    if (validation.isValid && !validation.isEmpty) {
      updateValue(validation.formattedValue);
    }
  };

  const handleValidate = () => {
    setValidation(validateJson(draft, indent, required));
  };

  const handleMinify = () => {
    if (validation.isValid && !validation.isEmpty) {
      updateValue(validation.minifiedValue);
    }
  };

  const handleCopy = async () => {
    try {
      await copyText(draft);
      setCopyState('copied');
      if (copyStateTimeoutRef.current) {
        clearTimeout(copyStateTimeoutRef.current);
      }
      copyStateTimeoutRef.current = setTimeout(() => setCopyState('idle'), 2000);
    } catch {
      setCopyState('failed');
    }
  };

  const handleClear = () => {
    updateValue('');
  };

  const handleEditorKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault();
      handleValidate();
    }
  };

  const handleEditorScroll = (event: UIEvent<HTMLTextAreaElement>) => {
    setScrollOffset({
      top: event.currentTarget.scrollTop,
      left: event.currentTarget.scrollLeft,
    });
  };

  const errorMessage = validation.message ? localize(validation.message) : validatemessage;
  const errorLocation =
    validation.errorLine && validation.errorColumn
      ? `${localize('Line')} ${validation.errorLine}, ${localize('column')} ${validation.errorColumn}`
      : undefined;
  const fieldStatus = !validation.isValid ? 'error' : status;
  const editorTestId = testId ? `${testId}:editor` : undefined;
  const statusTestId = testId ? `${testId}:status` : undefined;
  const highlightTestId = testId ? `${testId}:highlight` : undefined;
  const lineNumbersTestId = testId ? `${testId}:line-numbers` : undefined;
  const actionTestId = (action: string) => (testId ? `${testId}:action:${action}` : undefined);
  const hasToolbarActions = showValidate || showFormat || showMinify || showCopy || showClear;

  if (displayMode === 'LABELS_LEFT' || displayMode === 'DISPLAY_ONLY') {
    let displayValue = draft || <span aria-hidden='true'>&ndash;&ndash;</span>;
    if (validation.isValid && !validation.isEmpty) {
      displayValue = validation.formattedValue;
    }

    return displayMode === 'DISPLAY_ONLY' ? (
      <StyledJsonEditorWrapper>
        <Text as='pre'>{displayValue}</Text>
      </StyledJsonEditorWrapper>
    ) : (
      <StyledJsonEditorWrapper>
        <FieldValueList
          variant={hideLabel ? 'stacked' : 'inline'}
          data-testid={testId}
          fields={[{ id: '1', name: hideLabel ? '' : label, value: displayValue }]}
        />
      </StyledJsonEditorWrapper>
    );
  }

  return (
    <StyledJsonEditorWrapper>
      {hasToolbarActions && (
        <StyledJsonEditorToolbar role='toolbar' aria-label={localize('JSON editor actions')}>
          {showValidate && (
            <StyledJsonEditorButton
              type='button'
              title={localize('Validate JSON')}
              aria-label={localize('Validate JSON')}
              data-testid={actionTestId('validate')}
              onClick={handleValidate}
              disabled={disabled || readOnly || validation.isEmpty}
            >
              <Icon name='check' />
            </StyledJsonEditorButton>
          )}
          {showFormat && (
            <StyledJsonEditorButton
              type='button'
              title={localize('Format JSON')}
              aria-label={localize('Format JSON')}
              data-testid={actionTestId('format')}
              onClick={handleFormat}
              disabled={disabled || readOnly || !validation.isValid || validation.isEmpty}
            >
              <Icon name='align-left' />
            </StyledJsonEditorButton>
          )}
          {showMinify && (
            <StyledJsonEditorButton
              type='button'
              title={localize('Minify JSON')}
              aria-label={localize('Minify JSON')}
              data-testid={actionTestId('minify')}
              onClick={handleMinify}
              disabled={disabled || readOnly || !validation.isValid || validation.isEmpty}
            >
              <Icon name='code' />
            </StyledJsonEditorButton>
          )}
          {showCopy && (
            <StyledJsonEditorButton
              type='button'
              title={localize(copyState === 'copied' ? 'Copied' : 'Copy JSON')}
              aria-label={localize(copyState === 'copied' ? 'Copied' : 'Copy JSON')}
              data-testid={actionTestId('copy')}
              onClick={handleCopy}
              disabled={disabled || !draft}
            >
              <Icon name={copyState === 'copied' ? 'clipboard-check' : 'copy'} />
            </StyledJsonEditorButton>
          )}
          {showClear && (
            <StyledJsonEditorButton
              type='button'
              title={localize('Clear JSON')}
              aria-label={localize('Clear JSON')}
              data-testid={actionTestId('clear')}
              onClick={handleClear}
              disabled={disabled || readOnly || !draft}
            >
              <Icon name='trash' />
            </StyledJsonEditorButton>
          )}
        </StyledJsonEditorToolbar>
      )}
      <StyledJsonEditorSurface>
        <StyledJsonEditorHighlight $labelHidden={hideLabel} aria-hidden='true' data-testid={highlightTestId}>
          <StyledJsonEditorLineNumbers $scrollTop={scrollOffset.top} data-testid={lineNumbersTestId}>
            {lineNumbers.map((lineNumber) => (
              <span key={lineNumber}>{lineNumber}</span>
            ))}
          </StyledJsonEditorLineNumbers>
          <StyledJsonEditorCode $scrollTop={scrollOffset.top} $scrollLeft={scrollOffset.left}>
            {highlightedDraft.map(({ className, key, text }) =>
              className ? (
                <span className={className} key={key}>
                  {text}
                </span>
              ) : (
                text
              ),
            )}
          </StyledJsonEditorCode>
        </StyledJsonEditorHighlight>
        <TextArea
          value={draft}
          label={label}
          labelHidden={hideLabel}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          status={fieldStatus}
          info={errorMessage || helperText}
          onChange={handleOnChange}
          onKeyDown={handleEditorKeyDown}
          onScroll={handleEditorScroll}
          testId={editorTestId}
        />
      </StyledJsonEditorSurface>
      <StyledJsonEditorFooter>
        {(!validation.isEmpty || !validation.isValid) && (
          <StyledJsonEditorStatus
            data-testid={statusTestId}
            data-status={getValidationStatus(validation)}
            role='status'
            aria-live='polite'
          >
            <Icon name={validation.isValid ? 'check' : 'information'} />
            {localize(getValidationLabel(validation))}
          </StyledJsonEditorStatus>
        )}
        <StyledJsonEditorMeta>
          {showCharacterCount && `${draft.length} characters`}
          {showCharacterCount && showLineCount && ' · '}
          {showLineCount && `${lineCount} lines`}
        </StyledJsonEditorMeta>
        {!validation.isValid && errorLocation && (
          <StyledJsonEditorError data-testid={testId ? `${testId}:error` : undefined} aria-live='polite'>
            {errorLocation}
          </StyledJsonEditorError>
        )}
        {copyState === 'failed' && <StyledJsonEditorCopyError>{localize('Copy failed.')}</StyledJsonEditorCopyError>}
      </StyledJsonEditorFooter>
    </StyledJsonEditorWrapper>
  );
}

export default withConfiguration(PegaExtensionsJsonEditor);
