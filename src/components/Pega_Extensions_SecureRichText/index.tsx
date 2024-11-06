import { useRef, useMemo, useEffect } from 'react';
import { Editor, RichTextViewer, type EditorProps, type EditorState } from '@pega/cosmos-react-rte';
import { Details } from '@pega/cosmos-react-work';
import { FieldValueItem, NoValue, useToaster, withConfiguration } from '@pega/cosmos-react-core';

import { formatExists, textFormatter } from './utils';
import { handleEvent } from './utils';

import { updateContentWithAbsoluteURLsOfImgSrcs } from './utils';
import type { Features } from '@pega/pcore-pconnect-typedefs/environment-info/types.js';
import '../create-nonce';

const toolbar = ['inline-styling', 'headers', 'lists', 'cut-copy-paste', 'indentation'];

export interface RichTextProps {
  value: string;
  placeholder?: string;
  required?: boolean;
  label: string;
  hideLabel?: boolean;
  getPConnect: () => typeof PConnect;
  validatemessage?: string;
  helperText?: string;
  disabled?: boolean;
  readOnly?: boolean;
  testId?: string;
  displayMode?: string;
  additionalProps?: object;
  formatter?: string;
  isTableFormatter?: boolean;
  fieldMetadata?: {
    additionalInformation: string;
  };
}

interface EditorExtensionState extends EditorState {
  appendImage: (
    imageData: {
      src: string | ArrayBuffer;
      alt: string;
      attachmentId?: string;
    },
    id: string
  ) => void;
}

const PegaExtensionsSecureRichText = (props: RichTextProps) => {
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
  const editorRef = useRef<EditorExtensionState>(null);
  const fieldAdditionalInfo = fieldMetadata?.additionalInformation;
  const additionalInfo = fieldAdditionalInfo
    ? {
        content: fieldAdditionalInfo
      }
    : undefined;
  const toasterContext = useToaster();
  const actionSequencer = useMemo(() => PCore.getActionsSequencer(), []);
  const form: Features['form'] & { enableRTEImageAttachments?: boolean } =
    PCore.getEnvironmentInfo().environmentInfoObject?.features?.form || {
      attachmentPageInstructionEnabled: false
    };
  const { enableRTEImageAttachments = false } = form;

  let { readOnly, required, disabled } = props;
  [readOnly, required, disabled] = [readOnly, required, disabled].map(
    prop => prop === true || (typeof prop === 'string' && prop === 'true')
  );

  useEffect(() => {
    editorRef.current?.insertHtml(value, true);
  }, [value]);

  const updatedRteContent = useMemo(() => {
    return updateContentWithAbsoluteURLsOfImgSrcs(value, pConn);
  }, [value, pConn]);

  const displayComponent = updatedRteContent ? (
    <RichTextViewer content={updatedRteContent} type='html' />
  ) : (
    <NoValue />
  );

  if (displayMode === 'DISPLAY_ONLY' && formatter) {
    if (isTableFormatter && formatExists(formatter)) {
      return textFormatter(formatter, value);
    }

    return displayComponent;
  }

  let richTextComponent;

  if (readOnly) {
    // Rich Text read-only component
    richTextComponent = hideLabel ? (
      displayComponent
    ) : (
      <Details>
        <FieldValueItem name={label} value={displayComponent} variant='stacked' />
      </Details>
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
        const editorValue = editorRef.current.getHtml();
        const property = pConn.getStateProps().value;
        if (!editorValue) {
          pConn.getValidationApi().validate(editorValue);
        }
        if (value !== editorValue) {
          handleEvent(actionsApi, 'changeNblur', property, editorValue);
        }
      }
    };

    const onImageAdded: EditorProps['onImageAdded'] = (image, id) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (enableRTEImageAttachments) {
          actionSequencer.registerBlockingAction(pConn.getContextName()).then(() => {
            PCore.getAttachmentUtils()
              .uploadAttachment(
                image,
                () => {},
                () => {},
                pConn.getContextName()
              )
              .then((response: { ID?: string }) => {
                const relativePath = PCore.getAttachmentUtils().getAttachmentURL(response.ID || '');
                editorRef.current?.appendImage(
                  { src: relativePath || '', alt: image.name, attachmentId: response.ID },
                  id
                );
                const editorValue = editorRef.current?.getHtml();
                const property = pConn.getStateProps().value;
                handleEvent(actionsApi, 'change', property, editorValue || '');
                actionSequencer.deRegisterBlockingAction(pConn.getContextName()).catch(() => {});
              })
              .catch(() => {
                editorRef.current?.appendImage({ src: '', alt: '' }, id);
                const uploadFailMsg = pConn.getLocalizedValue('Upload failed');
                toasterContext.push({
                  content: uploadFailMsg
                });
                actionSequencer.cancelDeferredActionsOnError(pConn.getContextName());
              });
          });
        } else {
          editorRef.current?.appendImage({ src: reader.result || '', alt: image.name }, id);
        }
      };
      reader.readAsDataURL(image);
    };

    richTextComponent = (
      <Editor
        {...additionalProps}
        toolbar={toolbar}
        onImageAdded={onImageAdded}
        label={label}
        labelHidden={hideLabel}
        info={validatemessage || helperText}
        defaultValue={updatedRteContent}
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
      />
    );
  }

  return richTextComponent;
};

export default withConfiguration(PegaExtensionsSecureRichText);
