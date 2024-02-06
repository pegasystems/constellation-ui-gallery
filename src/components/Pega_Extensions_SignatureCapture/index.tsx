import { useEffect, useState, useRef } from 'react';
import {
  FieldValueList,
  Text,
  Image,
  Button,
  Flex,
  FormField,
  FormControl,
  Configuration,
  useTheme
} from '@pega/cosmos-react-core';
import SignaturePad from 'signature_pad';
import Signature from './Signature';
import { StyledSignatureContent, StyledSignatureReadOnlyContent } from './styles';

type SignatureCaptureProps = {
  getPConnect: any;
  label: string;
  value: string;
  helperText?: string;
  validatemessage?: string;
  hideLabel: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  testId?: string;
  displayMode?: string;
  variant?: any;
};

const PegaExtensionsSignatureCapture = (props: SignatureCaptureProps) => {
  const {
    value,
    getPConnect,
    validatemessage,
    label,
    hideLabel = false,
    helperText,
    testId,
    displayMode,
    variant
  } = props;

  const ref = useRef<SignaturePad>();
  const theme = useTheme();
  const pConn = getPConnect();
  const actions = pConn.getActionsApi();
  const propName = pConn.getStateProps().value;
  const [hasValueChanged, setHasValueChanged] = useState<boolean>(false);
  const [info, setInfo] = useState(validatemessage || helperText);

  let { readOnly, required, disabled } = props;
  [readOnly, required, disabled] = [readOnly, required, disabled].map(
    prop => prop === true || (typeof prop === 'string' && prop === 'true')
  );

  const [inputValue, setInputValue] = useState(value);
  const [status, setStatus] = useState<'success' | 'warning' | 'error' | 'pending' | undefined>(
    undefined
  );
  useEffect(() => setInputValue(value), [value]);

  useEffect(() => {
    if (validatemessage !== '') {
      setStatus('error');
    }
    if (status !== 'success') {
      setStatus(validatemessage !== '' ? 'error' : undefined);
    }
  }, [validatemessage]);

  const displayComp = value ? (
    <StyledSignatureReadOnlyContent theme={theme}>
      <Image alt={label} src={value} />
    </StyledSignatureReadOnlyContent>
  ) : null;
  if (displayMode === 'DISPLAY_ONLY') {
    return <Configuration>{displayComp}</Configuration>;
  } else if (displayMode === 'LABELS_LEFT') {
    return (
      <Configuration>
        <FieldValueList
          variant={hideLabel ? 'stacked' : variant}
          data-testid={testId}
          fields={[{ id: '1', name: hideLabel ? '' : label, value: displayComp }]}
        />
      </Configuration>
    );
  } else if (displayMode === 'STACKED_LARGE_VAL') {
    return (
      <Configuration>
        <Text variant='h1' as='span'>
          {displayComp}
        </Text>
      </Configuration>
    );
  }

  const onEndStroke = () => {
    setHasValueChanged(true);
    setStatus(undefined);
    setInfo(validatemessage || helperText);
  };
  const handleCLear = () => {
    ref.current?.clear();
    setHasValueChanged(false);
    setStatus(undefined);
    setInfo(validatemessage || helperText);
  };
  const handleAccept = () => {
    const newValue = ref.current?.toDataURL('image/svg+xml');
    if (newValue) {
      setInputValue(newValue);
      actions.updateFieldValue(propName, newValue);
      setHasValueChanged(false);
      setStatus('success');
      setInfo('Signature captured');
    }
  };

  return (
    <Configuration>
      <StyledSignatureContent>
        <Flex container={{ direction: 'column' }}>
          <FormField
            label={label}
            labelHidden={hideLabel}
            info={info}
            status={status}
            required={required}
            disabled={disabled}
            readOnly={readOnly}
            testId={testId}
          >
            <FormControl
              ariaLabel={label}
              required={required}
              disabled={disabled}
              readOnly={readOnly}
            >
              {readOnly || disabled ? (
                <img src={inputValue} />
              ) : (
                <>
                  <Signature
                    signaturePadRef={ref}
                    canvasProps={{
                      style: {
                        width: '100%',
                        height: 200
                      }
                    }}
                    onEndStroke={onEndStroke}
                  />
                  <Flex container={{ direction: 'row', justify: 'between' }}>
                    <Button className='accept' onClick={handleAccept} disabled={!hasValueChanged}>
                      Accept
                    </Button>
                    <Button className='clear' onClick={handleCLear}>
                      Clear
                    </Button>
                  </Flex>
                </>
              )}
            </FormControl>
          </FormField>
        </Flex>
      </StyledSignatureContent>
    </Configuration>
  );
};

export default PegaExtensionsSignatureCapture;
