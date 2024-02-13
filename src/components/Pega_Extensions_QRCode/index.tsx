import { useEffect, useState, type SyntheticEvent } from 'react';
import { Configuration, Flex, FormControl, FormField, QRCode } from '@pega/cosmos-react-core';
import StyledWrapper from './styles';

type QRCodeCompProps = {
  label: string;
  inputProperty: string;
  outputProperty?: string;
  helperText?: string;
  validatemessage?: string;
  hideLabel: boolean;
  testId?: string;
  getPConnect: any;
};

export default function PegaExtensionsQRCode(props: QRCodeCompProps) {
  const {
    inputProperty,
    label,
    outputProperty,
    validatemessage,
    hideLabel = false,
    helperText,
    testId,
    getPConnect
  } = props;
  const pConn = getPConnect();
  const [inputValue, setInputValue] = useState(inputProperty);
  const [info, setInfo] = useState(validatemessage || helperText);
  const [status, setStatus] = useState<'success' | 'warning' | 'error' | 'pending' | undefined>(
    undefined
  );

  const actions = pConn.getActionsApi();
  const propName = pConn.getStateProps().outputProperty;

  useEffect(() => {
    setInputValue(inputProperty);
    if (validatemessage !== '') {
      setStatus('error');
    }
    if (status !== 'success') {
      setStatus(validatemessage !== '' ? 'error' : undefined);
    }
    setInfo(validatemessage || helperText);
  }, [inputProperty, validatemessage, helperText]);

  return (
    <Configuration>
      <StyledWrapper>
        <Flex container={{ direction: 'column', justify: 'center', alignItems: 'center' }}>
          <FormField
            label={label}
            labelHidden={hideLabel}
            info={info}
            status={status}
            testId={testId}
          >
            <FormControl ariaLabel={label}>
              <QRCode
                value={inputValue}
                label={label}
                onLoad={(event: SyntheticEvent<HTMLImageElement, Event>) => {
                  const blob = (event.currentTarget as HTMLImageElement)?.src;
                  if (blob && propName && outputProperty !== blob) {
                    // update outputProperty with new base64 content
                    actions.updateFieldValue(propName, blob);
                  }
                }}
              />
            </FormControl>
          </FormField>
        </Flex>
      </StyledWrapper>
    </Configuration>
  );
}
