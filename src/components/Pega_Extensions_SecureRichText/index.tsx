import { useRef, useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import type { Editor as TinymceEditor } from 'tinymce/tinymce';
import { Editor, RichTextViewer, type EditorState } from '@pega/cosmos-react-rte';
import { Details, DetailsList } from '@pega/cosmos-react-work';
import { NoValue, withConfiguration } from '@pega/cosmos-react-core';

import { formatExists, textFormatter } from './utils';
import '../create-nonce';

const toolbar = ['inline-styling', 'headers', 'lists', 'cut-copy-paste', 'indentation'];

export interface RichTextProps {
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
  displayMode?: string;
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

const sanitizeConfig = {
  FORBID_TAGS: [
    'img', // Image tag
    'picture', // Picture container for responsive images
    'source', // Source tag for picture/video
    'link', // Link tag, often used for favicon
    'meta', // Meta tags like og:image or twitter:image
    'svg', // SVG, as it can contain embedded images
    'image', // <image> tag within SVG
    'video', // Video tag with poster attribute
    'iframe', // Iframe, which could load external content
    'embed', // Embed, often used for SVG or images
    'object', // Object, used to embed images or SVG
    'a' // Anchor tag for links
  ],
  FORBID_ATTR: [
    'src', // Commonly used for image URLs
    'srcset', // Used in responsive images
    'data', // Used in object/embed elements
    'href', // Attribute for links and favicon
    'poster', // Poster image in video tag
    'style', // Inline styles, might contain background images
    'xlink:href' // Used for linking in SVG
  ],
  ALLOWED_URI_REGEXP: /^$/, // Disallow all URIs in any tags
  FORCE_BODY: true // Ensure entire body is sanitized
};

export const PegaExtensionsSecureRichText = (props: RichTextProps) => {
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
    isTableFormatter = false,
    fieldMetadata
  } = props;

  const { formatter } = props;
  const pConn = getPConnect();
  const editorRef = useRef<EditorState>(null);
  const [sanitizedValue, setSanitizedValue] = useState(value);
  const fieldAdditionalInfo = fieldMetadata?.additionalInformation;
  const additionalInfo = fieldAdditionalInfo
    ? {
        content: fieldAdditionalInfo
      }
    : undefined;

  let { readOnly, required, disabled } = props;
  [readOnly, required, disabled] = [readOnly, required, disabled].map(
    prop => prop === true || (typeof prop === 'string' && prop === 'true')
  );

  const sanitizeContent = (editorContent: string) => {
    const sanitized = DOMPurify.sanitize(editorContent, sanitizeConfig);
    setSanitizedValue(sanitized);
    editorRef.current?.insertHtml(sanitized, true);
  };

  useEffect(() => {
    sanitizeContent(value);
  }, [value]);

  const onInit = (editor: TinymceEditor) => {
    editor.on('paste', () => {
      sanitizeContent(editorRef.current?.getHtml() || '');
    });
  };

  const displayComponent = sanitizedValue ? (
    <RichTextViewer content={sanitizedValue} type='html' />
  ) : (
    <NoValue />
  );

  if (displayMode === 'DISPLAY_ONLY' && formatter) {
    if (isTableFormatter && formatExists(formatter)) {
      return textFormatter(formatter, sanitizedValue);
    }

    return displayComponent;
  }

  let richTextComponent;

  if (readOnly) {
    // Rich Text read-only component
    richTextComponent = hideLabel ? (
      displayComponent
    ) : (
      <Details
        name='Details'
        columns={{
          a: (
            <DetailsList
              items={[
                {
                  id: label,
                  name: label,
                  value: displayComponent
                }
              ]}
            />
          )
        }}
      />
    );
  } else {
    // Rich Text editable component
    const actions = pConn.getActions();
    const actionsApi = pConn.getActionsApi();
    let status = '';
    if (validatemessage !== '') {
      status = 'error';
    }
    const handleChange = () => {
      if (status === 'error') {
        const property = pConn.getStateProps().value;
        pConn.clearErrorMessages({
          property
        });
      }
    };

    const handleBlur = () => {
      if (editorRef.current) {
        const property = pConn.getStateProps().value;
        if (!sanitizedValue) {
          pConn.getValidationApi().validate(sanitizedValue);
        }
        if (value !== sanitizedValue) {
          actionsApi.updateFieldValue(property, sanitizedValue);
          actionsApi.triggerFieldChange(property, sanitizedValue);
        }
      }
    };

    richTextComponent = (
      <Editor
        {...additionalProps}
        toolbar={toolbar}
        label={label}
        labelHidden={hideLabel}
        info={validatemessage || helperText}
        defaultValue={value}
        status={status}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        data-testid={testId}
        ref={editorRef}
        additionalInfo={additionalInfo}
        {...actions}
        onChange={handleChange}
        onBlur={handleBlur}
        onInit={onInit}
      />
    );
  }

  return richTextComponent;
};

export default withConfiguration(PegaExtensionsSecureRichText);
