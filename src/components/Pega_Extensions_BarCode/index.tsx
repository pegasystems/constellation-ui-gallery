import JsBarcode from 'jsbarcode';
import { withConfiguration, Flex, FormControl, FormField, ErrorState, Text } from '@pega/cosmos-react-core';
import { useEffect, useRef, useState } from 'react';
import StyledWrapper from './styles';
import '../shared/create-nonce';

export enum BarcodeType {
  CODE128 = 'CODE128',
  EAN8 = 'EAN8',
  EAN13 = 'EAN13',
  UPC = 'upc',
  CODE39 = 'CODE39',
  ITF14 = 'ITF14',
  MSI = 'MSI',
  PHARMACODE = 'pharmacode',
}

type BarCodeExtProps = {
  format: BarcodeType;
  label: string;
  value: string;
  inputProperty: string;
  displayValue: boolean;
  helperText?: string;
  validatemessage?: string;
  hideLabel: boolean;
  readOnly?: boolean;
  testId?: string;
  /** display mode */
  displayMode?: 'DISPLAY_ONLY' | '';

  getPConnect: any;
};

export const PegaExtensionsBarCode = (props: BarCodeExtProps) => {
  const {
    value,
    label,
    inputProperty,
    format = BarcodeType.CODE128,
    displayValue,
    validatemessage,
    hideLabel = false,
    readOnly,
    helperText,
    testId,
    displayMode,
    getPConnect,
  } = props;
  const BarcodeRef = useRef<any>(null);
  const pConn = getPConnect();
  const [outputValue, setOutputValue] = useState(value);
  const actions = pConn.getActionsApi();
  const propName = pConn.getStateProps().value;
  const [info, setInfo] = useState(validatemessage || helperText);
  const [status, setStatus] = useState<'success' | 'warning' | 'error' | 'pending' | undefined>(undefined);

  useEffect(() => {
    if (!readOnly) {
      if (validatemessage !== '') {
        setStatus('error');
      }
      if (status !== 'success') {
        setStatus(validatemessage !== '' ? 'error' : undefined);
      }
      setInfo(validatemessage || helperText);
      BarcodeRef.current.innerHTML = '';
      BarcodeRef.current.style.display = 'none';
      try {
        JsBarcode(BarcodeRef.current, inputProperty, {
          format,
          displayValue,
          width: 2,
          height: 100,
          fontOptions: '',
          font: 'monospace',
          textAlign: 'center',
          textPosition: 'bottom',
          textMargin: 2,
          fontSize: 20,
          background: '#ffffff',
          lineColor: '#000000',
          margin: 10,
        });
      } catch (msg: any) {
        setInfo(msg);
        setStatus('error');
      }
      const svg = BarcodeRef.current;
      if (svg && propName) {
        const serializer = new XMLSerializer();
        const content = btoa(serializer.serializeToString(svg));
        const blob = `data:image/svg+xml;base64,${content}`;
        actions.updateFieldValue(propName, blob);
        setOutputValue(blob);
      }
    }
  }, [inputProperty, displayValue, format, validatemessage, helperText, readOnly, status, propName, actions]);

  const displayComp = value || '';
  if (displayMode === 'DISPLAY_ONLY') {
    return <Text>{displayComp}</Text>;
  }
  return (
    <Flex container={{ direction: 'column', justify: 'center', alignItems: 'center' }}>
      <FormField label={label} labelHidden={hideLabel} info={info} status={status} testId={testId}>
        <FormControl ariaLabel={label}>
          {readOnly ? (
            <img alt='barcode' src={outputValue} />
          ) : (
            <StyledWrapper>
              {status === 'error' ? <ErrorState message='Invalid barcode' /> : null}
              <svg ref={BarcodeRef} />
            </StyledWrapper>
          )}
        </FormControl>
      </FormField>
    </Flex>
  );
};

export default withConfiguration(PegaExtensionsBarCode);
