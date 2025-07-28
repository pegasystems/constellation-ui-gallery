import { useRef, useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import type { Editor as TinymceEditor } from 'tinymce/tinymce';
import { Editor, RichTextViewer, type EditorState } from '@pega/cosmos-react-rte';
import { Details, DetailsList } from '@pega/cosmos-react-work';
import { NoValue, registerIcon, useLiveLog, withConfiguration } from '@pega/cosmos-react-core';

import * as listIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/list.icon';
import * as listNumberIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/list-number.icon';

import '../create-nonce';

registerIcon(listIcon, listNumberIcon);

export interface RichTextProps {
  /** field label */
  label: string;
  /** Value to be passed to the component */
  value: string;
  /** Mode for the toolbar */
  toolbarMode: 'basic' | 'normal';
  /** Max number of words */
  maxWords?: number;
  /** Show word counter */
  showWordCounter?: boolean;
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

interface WordCountAnnouncement {
  message: string;
  isAlert: boolean;
}

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
    fieldMetadata,
    toolbarMode = 'normal',
    maxWords = 100,
    showWordCounter = true,
  } = props;

  const pConn = getPConnect();
  const editorRef = useRef<EditorState>(null);
  const sanitizedValue = useRef(value);
  const [wordCount, setWordCount] = useState(0);
  /* current timestamp to track last update */
  const [lastUpdated, setLastUpdate] = useState(Date.now());
  const [announcement, setAnnouncement] = useState<WordCountAnnouncement>({
    message: '',
    isAlert: false,
  });
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
  const toolbar =
    toolbarMode === 'normal'
      ? ['inline-styling', 'headers', 'lists', 'cut-copy-paste', 'indentation']
      : ['lists', 'links'];
  const { announceAssertive } = useLiveLog();

  // Function to generate word count announcements
  const getWordCountAnnouncement = (count: number): WordCountAnnouncement => {
    if (count > maxWords) {
      return {
        message: `You are ${count - maxWords} words over the ${maxWords} word limit`,
        isAlert: true,
      };
    }
    if (count <= 20) {
      return {
        message: `${maxWords - count} words remaining`,
        isAlert: false,
      };
    }
    return { message: '', isAlert: false };
  };

  const purify = (html: string) => {
    const sanitizeConfig: {
      FORBID_TAGS: string[];
      FORBID_ATTR: string[];
      FORCE_BODY: boolean;
      ALLOWED_URI_REGEXP?: RegExp;
    } = {
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
      ],
      FORBID_ATTR: [
        'src', // Commonly used for image URLs
        'srcset', // Used in responsive images
        'data', // Used in object/embed elements
        'poster', // Poster image in video tag
        'style', // Inline styles, might contain background images
        'xlink:href', // Used for linking in SVG
      ],
      FORCE_BODY: true, // Ensure entire body is sanitized
    };
    if (toolbarMode === 'normal') {
      // add anchor tag and href attribute to sanitizedConfig
      sanitizeConfig.FORBID_TAGS.push('a');
      sanitizeConfig.FORBID_ATTR.push('href');
      sanitizeConfig.ALLOWED_URI_REGEXP = /^$/; // Disallow all URIs in any tags
    }
    return DOMPurify.sanitize(html, sanitizeConfig);
  };

  const sanitizeContent = (editorContent: string) => {
    sanitizedValue.current = purify(editorContent);
    editorRef.current?.insertHtml(sanitizedValue.current, true);
  };

  const updateWordCount = () => {
    if (showWordCounter && editorRef.current) {
      const content = editorRef.current.getPlainText().trim();
      if (!content) {
        setWordCount(0);
        setAnnouncement({
          message: `Maximum ${maxWords} words allowed`,
          isAlert: false,
        });
        return;
      }
      const newWordCount = content.split(/\s+/).length;
      setWordCount(newWordCount);

      // Update announcement based on new word count
      const msg = getWordCountAnnouncement(newWordCount);
      setLastUpdate((prev) => {
        if (Date.now() - prev > 5000) {
          announceAssertive({ message: msg.message });
          return Date.now();
        }
        return prev;
      });
      setAnnouncement(msg);
    }
  };

  // Handle focus to announce max word count
  const handleFocus = () => {
    const msg = {
      message: `Maximum ${maxWords} words allowed`,
      isAlert: false,
    };
    setAnnouncement(msg);
  };

  useEffect(() => {
    sanitizeContent(value);
    setTimeout(() => {
      updateWordCount();
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onInit = (editor: TinymceEditor) => {
    editor.on('paste', () => {
      sanitizeContent(editorRef.current?.getHtml() || '');
    });
  };

  const displayComponent = sanitizedValue ? (
    <RichTextViewer content={sanitizedValue.current} type='html' />
  ) : (
    <NoValue />
  );

  if (displayMode === 'DISPLAY_ONLY') {
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
                  value: displayComponent,
                },
              ]}
            />
          ),
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
      updateWordCount();
    };

    const handleBlur = () => {
      if (editorRef.current) {
        const sanitizedContent = purify(editorRef.current?.getHtml() || '');
        editorRef.current?.insertHtml(sanitizedContent, true);
        const property = pConn.getStateProps().value;
        if (!sanitizedContent) {
          pConn.getValidationApi().validate(sanitizedContent);
        }
        if (value !== sanitizedContent) {
          actionsApi.updateFieldValue(property, sanitizedContent);
          actionsApi.triggerFieldChange(property, sanitizedContent);
        }
      }
    };

    richTextComponent = (
      <>
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
          onFocus={handleFocus}
          onInit={onInit}
          initOptions={{ pasteDataImages: false }}
        />
        {showWordCounter && (
          <div
            aria-live='polite'
            style={{
              fontSize: '12px',
              color: wordCount > maxWords ? 'red' : 'gray',
              marginTop: '5px',
            }}
            role={announcement.isAlert ? 'alert' : 'status'}
            data-updated={lastUpdated}
          >
            {announcement.message ||
              (wordCount > maxWords
                ? `${wordCount - maxWords} words over limit`
                : `${Math.max(0, maxWords - wordCount)} words remaining`)}
          </div>
        )}
      </>
    );
  }

  return richTextComponent;
};

export default withConfiguration(PegaExtensionsSecureRichText);
