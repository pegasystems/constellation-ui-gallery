import { useRef, useState, useEffect, useCallback } from 'react';
import {
  Button,
  Card,
  CardContent,
  Flex,
  FormField,
  Input,
  Text,
  createUID,
  NoValue,
  withConfiguration,
} from '@pega/cosmos-react-core';
import StyledWrapper from './styles';
import '../shared/create-nonce';

export interface SpeechToTextProps {
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
  /** is field disabled */
  disabled?: boolean;
  /** is field readOnly */
  readOnly?: boolean;
  /** is Required field */
  required?: boolean;
  /** hide label from the screen */
  hideLabel?: boolean;
  /** display mode */
  displayMode?: 'DISPLAY_ONLY' | '';
  /** additional props */
  additionalProps?: object;
  /** fieldMetadata */
  fieldMetadata?: {
    additionalInformation: string;
  };
  /** Button text for start recording */
  startButtonText?: string;
  /** Button text for stop recording */
  stopButtonText?: string;
  /** Language for speech recognition (e.g., 'en-US') */
  language?: string;
  getPConnect: any;
}

type MessageVariant = 'success' | 'error' | 'info';

export const PegaExtensionsSpeechToText = (props: SpeechToTextProps) => {
  const {
    getPConnect,
    value = '',
    placeholder = 'Click "Start Recording" to begin...',
    validatemessage = '',
    label,
    hideLabel = false,
    helperText = '',
    testId,
    displayMode,
    additionalProps = {},
    fieldMetadata,
    startButtonText = 'Start Recording',
    stopButtonText = 'Stop Recording',
    language = 'en-US',
  } = props;

  const [id] = useState(createUID());
  const pConn = getPConnect();
  const [recordedText, setRecordedText] = useState(value);
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const recognitionRef = useRef<any>(null);
  const [messageState, setMessageState] = useState<{
    visible: boolean;
    message: string;
    variant: MessageVariant;
  }>({
    visible: false,
    message: '',
    variant: 'info',
  });

  let { readOnly, required, disabled } = props;
  [readOnly, required, disabled] = [readOnly, required, disabled].map(
    (prop) => prop === true || (typeof prop === 'string' && prop === 'true'),
  );

  const fieldAdditionalInfo = fieldMetadata?.additionalInformation;
  const additionalInfo = fieldAdditionalInfo
    ? {
        content: fieldAdditionalInfo,
      }
    : undefined;

  // Initialize Speech Recognition API
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showMessage('Speech Recognition not supported in this browser', 'error');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.language = language;

    recognition.onstart = () => {
      setIsListening(true);
      setInterimTranscript('');
      showMessage('Listening...', 'info');
    };

    recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          final += transcript + ' ';
        } else {
          interim += transcript;
        }
      }

      setInterimTranscript(interim);

      if (final) {
        const updatedText = recordedText + final;
        setRecordedText(updatedText);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      showMessage(`Error: ${event.error}`, 'error');
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript('');
      showMessage('Recording stopped', 'success');
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [language, recordedText]);

  const showMessage = (message: string, variant: MessageVariant = 'info') => {
    setMessageState({
      visible: true,
      message,
      variant,
    });

    setTimeout(() => {
      setMessageState((prev) => ({ ...prev, visible: false }));
    }, 3000);
  };

  const startRecording = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
    }
  }, [isListening]);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      // Update Pega field value
      const actionsApi = pConn.getActionsApi();
      const property = pConn.getStateProps().value;
      actionsApi.updateFieldValue(property, recordedText);
      actionsApi.triggerFieldChange(property, recordedText);
    }
  }, [isListening, recordedText, pConn]);

  const clearText = useCallback(() => {
    setRecordedText('');
    setInterimTranscript('');
    const actionsApi = pConn.getActionsApi();
    const property = pConn.getStateProps().value;
    actionsApi.updateFieldValue(property, '');
  }, [pConn]);

  const displayComponent = recordedText ? <Text>{recordedText}</Text> : <NoValue />;

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

  return (
    <StyledWrapper>
      {messageState.visible && (
        <div
          className={`custom-toast custom-toast--${messageState.variant}`}
          role="status"
          aria-live="polite"
        >
          {messageState.message}
        </div>
      )}
      <Card>
        <CardContent>
          <FormField
            id={id}
            label={label}
            labelHidden={hideLabel}
            info={validatemessage || helperText}
            required={required}
            additionalInfo={additionalInfo}
          >
            <Flex container={{ direction: 'column', gap: 2 }}>
              {/* Recording Controls */}
              <Flex container={{ gap: 2 }}>
                <Button
                  variant={isListening ? 'secondary' : 'primary'}
                  onClick={startRecording}
                  disabled={isListening || disabled}
                  data-testid={`${testId}-start-btn`}
                >
                  {startButtonText}
                </Button>
                <Button
                  variant={isListening ? 'primary' : 'secondary'}
                  onClick={stopRecording}
                  disabled={!isListening || disabled}
                  data-testid={`${testId}-stop-btn`}
                >
                  {stopButtonText}
                </Button>
                <Button
                  variant="tertiary"
                  onClick={clearText}
                  disabled={!recordedText || disabled}
                  data-testid={`${testId}-clear-btn`}
                >
                  Clear
                </Button>
              </Flex>

              {/* Status Indicator */}
              {isListening && (
                <div className="listening-indicator">
                  <span className="pulse"></span>
                  Listening...
                </div>
              )}

              {/* Interim Text Display */}
              {interimTranscript && (
                <div className="interim-text" data-testid={`${testId}-interim`}>
                  <em>{interimTranscript}</em>
                </div>
              )}

              {/* Text Display Area */}
              <div className="text-display-area">
                <Input
                  value={recordedText}
                  placeholder={placeholder}
                  disabled={disabled || isListening}
                  readOnly={readOnly}
                  onChange={(e) => setRecordedText(e.currentTarget.value)}
                  data-testid={testId}
                  style={{ minHeight: '100px' }}
                />
              </div>
            </Flex>
          </FormField>
        </CardContent>
      </Card>
    </StyledWrapper>
  );
};

export default withConfiguration(PegaExtensionsSpeechToText);
