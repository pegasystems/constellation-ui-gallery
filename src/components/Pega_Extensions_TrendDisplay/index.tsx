import {
  withConfiguration,
  FormField,
  createUID,
  CurrencyDisplay,
  NoValue,
  Icon,
  Text,
  registerIcon,
} from '@pega/cosmos-react-core';
import '../create-nonce';
import TrendDisplayWrapper from './styles';

import { useState } from 'react';
import TrendGraph from './TrendGraph';
import { useTheme } from 'styled-components';

import * as arrowUpIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/arrow-up.icon';
import * as arrowDownIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/arrow-down.icon';

registerIcon(arrowUpIcon, arrowDownIcon);

export type TrendDisplayProps = {
  /** field label */
  label: string;

  /** hide label from the screen
   *  @default false
   */
  hideLabel?: boolean;

  /** Currency value */
  value?: number;

  /** Currency ISO code
   * @default USD
   */
  currencyISOCode?: string;

  /** Currency display
   * @default symbol
   */
  currencyDisplay?: 'symbol' | 'code' | 'name';

  /**
   * Negative value display
   * @default minus-sign
   */
  negative?: 'minus-sign' | 'parentheses';
  /**
   * Notation type for currency
   * @default standard
   */
  notation?: 'standard' | 'compact';

  /** Decimal places shown - set to a number to override the default number of decimal places shown
   * @default auto
   */
  currencyDecimalPrecision?: string;

  /**
   * rendering mode:
   * @default normal
   */
  renderingMode?: 'normal' | 'badge';

  /** Color used to render the value - 'auto' will use the default theme color - 'trend' will use the color based on the trend value. otherwise will use
   * the color provided as a string
   * @default auto
   */
  colorMode?: string;

  /** comma-separated string representing the values to trend - if you want to display a percentage instead of a currency as a single value,
   * pass the value to trendData as a number - the number will be displayed as a percentage
   */
  trendData?: string | number;

  fieldMetadata?: any;
  /** display mode */
  displayMode?: 'DISPLAY_ONLY' | '';
};

export type Event = {
  value: number;
  color: string;
  label: string;
};

const formatValue = (value: number) => {
  if (!value && value !== 0) return '';
  const [integer, decimal = ''] = value.toString().split('.');
  return `${integer}.${decimal.padEnd(3, '0')}`;
};

// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
export const PegaExtensionsTrendDisplay = (props: TrendDisplayProps) => {
  const {
    value = 0,
    label,
    hideLabel,
    currencyISOCode = 'USD',
    negative = 'minus-sign',
    notation = 'standard',
    colorMode = 'auto',
    renderingMode = 'normal',
    trendData = '',
    currencyDecimalPrecision = 'auto',
    currencyDisplay = 'symbol',
    displayMode,
    fieldMetadata,
  } = props;

  const fieldAdditionalInfo = fieldMetadata?.additionalInformation;
  const additionalInfo = fieldAdditionalInfo
    ? {
        content: fieldAdditionalInfo,
      }
    : undefined;
  const [id] = useState(createUID());
  const theme = useTheme();

  const noOfFractionDigits = currencyDecimalPrecision === 'auto' ? undefined : parseInt(currencyDecimalPrecision, 10);

  const currencyValue = formatValue(value);
  const displayValue = !value && value !== 0 ? undefined : Number(currencyValue);
  let displayComp = <NoValue />;
  if (trendData) {
    /* parse data to an array of number */
    let tmpData = trendData;

    /* if this is a number, it will be a percentage value */
    if (typeof tmpData !== 'string') {
      tmpData = `${tmpData * 100.0}%`;
    }

    const trendDataArray = tmpData.split(',').map((point: string) => {
      return parseFloat(point.trim().replace('%', ''));
    });

    if (trendDataArray.length > 1) {
      displayComp = (
        <TrendGraph
          data={trendDataArray}
          colorValue={colorMode === 'auto' || colorMode === 'trend' ? theme.base.palette.interactive : colorMode}
          width={120}
          height={30}
        />
      );
    } else if (trendDataArray[0] === 0) {
      /* If only one value is present, display it as a text */
      displayComp = (
        <TrendDisplayWrapper colorValue={colorMode} renderingMode={renderingMode}>
          <Text id={id}>{tmpData}</Text>
        </TrendDisplayWrapper>
      );
    } else {
      displayComp =
        trendDataArray[0] > 0 ? (
          <TrendDisplayWrapper
            colorValue={colorMode === 'trend' ? theme.base.palette.success : colorMode}
            renderingMode={renderingMode}
          >
            <Icon name='arrow-up' size='s' />
            <Text id={id}>{tmpData}</Text>
          </TrendDisplayWrapper>
        ) : (
          <TrendDisplayWrapper
            colorValue={colorMode === 'trend' ? theme.base.palette.urgent : colorMode}
            renderingMode={renderingMode}
          >
            <Icon name='arrow-down' size='s' />
            <Text id={id}>{tmpData}</Text>
          </TrendDisplayWrapper>
        );
    }
  } else {
    let colorValue = colorMode;
    if (value !== 0 && colorMode === 'trend') {
      if (value > 0) {
        colorValue = theme.base.palette.success;
      } else {
        colorValue = theme.base.palette.urgent;
      }
    }
    displayComp = (
      <TrendDisplayWrapper colorValue={colorValue} renderingMode={renderingMode}>
        <CurrencyDisplay
          id={id}
          value={displayValue}
          currencyISOCode={currencyISOCode}
          formattingOptions={{
            groupSeparators: true,
            fractionDigits: noOfFractionDigits,
            currency: currencyDisplay,
            negative,
            notation: negative === 'parentheses' ? 'standard' : notation,
          }}
        />
      </TrendDisplayWrapper>
    );
  }

  if (displayMode === 'DISPLAY_ONLY') {
    return displayComp;
  }
  return (
    <FormField id={id} label={label} labelHidden={hideLabel} additionalInfo={additionalInfo}>
      {displayComp}
    </FormField>
  );
};
export default withConfiguration(PegaExtensionsTrendDisplay);
