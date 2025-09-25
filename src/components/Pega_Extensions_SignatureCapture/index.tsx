import { useEffect, useState, useRef } from 'react';
import { withConfiguration, Image, Button, Flex, FormField, FormControl } from '@pega/cosmos-react-core';
import SignaturePad from 'signature_pad';
import Signature from './Signature';
import { StyledButtonsWrapper, StyledSignatureContent, StyledSignatureReadOnlyContent } from './styles';
import '../create-nonce';

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
  /** display mode */
  displayMode?: 'DISPLAY_ONLY' | '';
};

export const PegaExtensionsSignatureCapture = (props: SignatureCaptureProps) => {
  const { value, getPConnect, validatemessage, label, hideLabel = false, helperText, testId, displayMode } = props;

  const ref = useRef<SignaturePad>();
  const pConn = getPConnect();
  const actions = pConn.getActionsApi();
  const propName = pConn.getStateProps().value;
  const [hasValueChanged, setHasValueChanged] = useState<boolean>(false);
  const [info, setInfo] = useState(validatemessage || helperText);

  let { readOnly, required, disabled } = props;
  [readOnly, required, disabled] = [readOnly, required, disabled].map(
    (prop) => prop === true || (typeof prop === 'string' && prop === 'true'),
  );

  const [inputValue, setInputValue] = useState(value);
  const [status, setStatus] = useState<'success' | 'warning' | 'error' | 'pending' | undefined>(undefined);
  useEffect(() => setInputValue(value), [value]);

  /* On load of the component - use the value if set to prefill the signature */
  useEffect(() => {
    if (value) {
      ref.current?.fromDataURL(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (validatemessage !== '') {
      setStatus('error');
    }
    if (status !== 'success') {
      setStatus(validatemessage !== '' ? 'error' : undefined);
    }
  }, [status, validatemessage]);

  const displayComp = value ? (
    <StyledSignatureReadOnlyContent>
      <Image alt={label} src={value} />
    </StyledSignatureReadOnlyContent>
  ) : null;
  if (displayMode === 'DISPLAY_ONLY') {
    return displayComp;
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
      setInfo(getPConnect().getLocalizedValue('Signature captured'));
    }
  };

  return (
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
          <FormControl ariaLabel={label} required={required} disabled={disabled} readOnly={readOnly}>
            {readOnly || disabled ? (
              <img alt='Signature' src={inputValue} />
            ) : (
              <>
                <Signature
                  signaturePadRef={ref}
                  canvasProps={{
                    style: {
                      width: '100%',
                      height: 200,
                    },
                  }}
                  onEndStroke={onEndStroke}
                />
                <Flex as={StyledButtonsWrapper} container={{ direction: 'row', justify: 'between', pad: [1] }}>
                  <Button compact className='clear' onClick={handleCLear}>
                    {getPConnect().getLocalizedValue('Clear')}
                  </Button>
                  <Button
                    compact
                    variant='primary'
                    className='accept'
                    onClick={handleAccept}
                    disabled={!hasValueChanged}
                  >
                    {getPConnect().getLocalizedValue('Accept')}
                  </Button>
                </Flex>
              </>
            )}
          </FormControl>
        </FormField>
      </Flex>
    </StyledSignatureContent>
  );
};

export default withConfiguration(PegaExtensionsSignatureCapture);
