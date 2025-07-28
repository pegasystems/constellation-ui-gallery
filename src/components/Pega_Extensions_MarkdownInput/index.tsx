import { useRef, useState } from 'react';
import { RichTextEditor, RichTextViewer, type EditorState } from '@pega/cosmos-react-rte';
import { createUID, FormField, NoValue, withConfiguration } from '@pega/cosmos-react-core';

import '../create-nonce';

export interface MarkdownInputProps {
  /** field label */
  label: string;
  /** Value to be passed to the component */
  value: string;
  /** Helper text */
  helperText?: string;
  /** testId */
  testId?: string;
  /** Placeholder string */
  placeholder?: string;
  /** Validation message */
  validatemessage?: string;
  /** is  field disabled */
  disabled?: boolean;
  /** is  field readOnly */
  readOnly?: boolean;
  /** is Required field */
  required?: boolean;
  /** hide label from the screen */
  hideLabel?: boolean;
  /** display mode */
  displayMode?: 'DISPLAY_ONLY' | '';
  /** additional props */
  additionalProps?: object;
  /** formatter */
  formatter?: string;
  /** is Table Formatter */
  isTableFormatter?: boolean;
  /** fieldMetadata */
  fieldMetadata?: {
    additionalInformation: string;
  };
  getPConnect: any;
}

export const PegaExtensionsMarkdownInput = (props: MarkdownInputProps) => {
  const {
    getPConnect,
    value = '',
    placeholder = '',
    validatemessage = '',
    label,
    hideLabel = false,
    helperText = '',
    testId,
    displayMode,
    additionalProps = {},
    fieldMetadata,
  } = props;

  const [id] = useState(createUID());
  const pConn = getPConnect();
  const editorRef = useRef<EditorState>(null);
  const [newValue, setValue] = useState(value);

  const fieldAdditionalInfo = fieldMetadata?.additionalInformation;
  const additionalInfo = fieldAdditionalInfo
    ? {
        content: fieldAdditionalInfo,
      }
    : undefined;

  let { readOnly, required, disabled } = props;
  [readOnly, required, disabled] = [readOnly, required, disabled].map(
    (prop) => prop === true || (typeof prop === 'string' && prop === 'true'),
  );

  const displayComponent = newValue ? <RichTextViewer id={id} content={newValue} type='markdown' /> : <NoValue />;

  if (displayMode === 'DISPLAY_ONLY') {
    return displayComponent;
  }

  if (readOnly) {
    return (
      <FormField id={id} label={label} labelHidden={hideLabel} additionalInfo={additionalInfo}>
        {displayComponent}
      </FormField>
    );
  }
  // Rich Text editable component
  const actionsApi = pConn.getActionsApi();
  const handleBlur = () => {
    if (editorRef.current) {
      const content = editorRef.current?.getPlainText() || '';
      const property = pConn.getStateProps().value;
      if (!content) {
        pConn.getValidationApi().validate(content);
      }
      if (newValue !== content) {
        setValue(content);
        actionsApi.updateFieldValue(property, content);
        actionsApi.triggerFieldChange(property, content);
      }
    }
  };

  return (
    <RichTextEditor
      type='markdown'
      markdownOnly
      label={label}
      labelHidden={hideLabel}
      {...additionalProps}
      info={validatemessage || helperText}
      defaultValue={value}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      data-testid={testId}
      ref={editorRef}
      additionalInfo={additionalInfo}
      onBlur={handleBlur}
    />
  );
};

export default withConfiguration(PegaExtensionsMarkdownInput);
