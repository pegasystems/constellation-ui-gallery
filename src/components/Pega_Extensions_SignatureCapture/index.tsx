import { useEffect, useState, useRef } from 'react';
import { Button, Flex, FormField, FormControl } from '@pega/cosmos-react-core';
import SignaturePad from 'signature_pad';
import Signature from './Signature';
import StyledPegaExtensionsSignatureCaptureWrapper from './styles';

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
};

const PegaExtensionsSignatureCapture = (props: SignatureCaptureProps) => {
  const { value, getPConnect, validatemessage, label, hideLabel, helperText, testId, displayMode } =
    props;

  const ref = useRef<SignaturePad>();

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

  const displayComp = value ? '***********' : '';
  if (
    displayMode === 'DISPLAY_ONLY' ||
    displayMode === 'LABELS_LEFT' ||
    displayMode === 'STACKED_LARGE_VAL'
  ) {
    return <img src={displayComp} />;
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
    <StyledPegaExtensionsSignatureCaptureWrapper>
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
                <Flex container={{ direction: 'row' }}>
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
    </StyledPegaExtensionsSignatureCaptureWrapper>
  );
};

export default PegaExtensionsSignatureCapture;
