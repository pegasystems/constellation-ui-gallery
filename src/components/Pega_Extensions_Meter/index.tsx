import { withConfiguration, useTheme, FieldGroup, Flex, FormField, createUID } from '@pega/cosmos-react-core';
import '../shared/create-nonce';
import { StyledFieldGroupElementMeter, StyleGroupMeterWrapper } from './styles';

import { useEffect, useState } from 'react';

import ElemMeter from './ElemMeter';
import ElemDisplay from './ElemDisplay';

export type MeterProps = {
  /** field label */
  label: string;
  /** hide label from the screen
   *  @default false
   */
  hideLabel?: boolean;
  /** name of the DP used for multiple values. if empty, will query the DP for the value otherwise will load the DP
   */
  dataPage?: string;

  /** additional info */
  additionalInfo?: string;

  /** Color to use for the value indicator - either pass a hex color code or a JSON string.
   * When using a JSON string, the color will be determined based on the value passed - the color with the closest lowest value.
   * Here is an example: [{"value":20,"color":"#34d399"},{"value":80,"color":"#fbbf24"},{"value":100,"color":"#ff0000"}]
   */
  color?: string;

  /** Percentage value to be passed to the component between 0 and 1.0 */
  value?: number;

  /** Show the meta data on the screen
   *  @default false
   */
  showMetaData?: boolean;
  /** Total of number of tasks displayed as meta info -
   * If set, meta info will show the current number of tasks completed out of total tasks
   * If not set, or set to 0 or 100, meta info will show a percentage value
   */
  totalTasks?: number;

  /** display mode */
  displayMode?: 'DISPLAY_ONLY' | '';

  getPConnect?: any;
};

export type Event = {
  value: number;
  color: string;
  label: string;
};

// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
export const PegaExtensionsMeter = (props: MeterProps) => {
  const {
    label,
    dataPage = '',
    color,
    value = 0,
    hideLabel = false,
    showMetaData = false,
    totalTasks = 0,
    additionalInfo = '',
    displayMode,

    getPConnect,
  } = props;

  const [id] = useState(createUID());
  const [events, setEvents] = useState<Array<Event>>([]);
  const [totalValue, setTotalValue] = useState(totalTasks);
  const theme = useTheme();
  useEffect(() => {
    if (dataPage) {
      const pConn = getPConnect();
      const CaseInstanceKey = pConn.getValue((window as any).PCore.getConstants().CASE_INFO.CASE_INFO_ID);
      const payload = {
        dataViewParameters: [{ pyID: CaseInstanceKey }],
      };
      (window as any).PCore.getDataApiUtils()
        .getData(dataPage, payload, pConn.getContextName())
        .then((response: any) => {
          if (response.data.data !== null) {
            let tmpTotalValue = totalTasks;
            if (!totalTasks) {
              /* Calculate total value from all the rows */
              response.data.data.forEach((item: any) => {
                tmpTotalValue += item.value || 0;
              });
            }
            const tmpevents: Array<Event> = [];
            response.data.data.forEach((item: any) => {
              item.value = item.value || 0;
              item.label = item.label || '';
              if (!totalTasks && tmpTotalValue) {
                item.value = (item.value * 100) / tmpTotalValue;
              }
              tmpevents.push(item);
            });
            setEvents(tmpevents);
            setTotalValue(tmpTotalValue);
          }
        })
        .catch(() => {});
    }
  }, [dataPage]);

  if (dataPage) {
    if (events.length === 0) {
      return null;
    }
    const displayGroupComp = (
      <StyleGroupMeterWrapper>
        <div>
          {events.map((event: Event) => {
            return <ElemMeter key={`Meter-${event.label}`} event={event} totalValue={totalValue} />;
          })}
        </div>
        {showMetaData && (
          <ol>
            {events.map((event: Event) => {
              return (
                <ElemDisplay key={`MeterDisplay-${event.label}`} type='li' event={event} totalValue={totalValue} />
              );
            })}
          </ol>
        )}
      </StyleGroupMeterWrapper>
    );

    if (displayMode === 'DISPLAY_ONLY') {
      return displayGroupComp;
    }

    return (
      <FieldGroup
        name={hideLabel ? '' : label}
        {...(additionalInfo ? { additionalInfo: { heading: label, content: additionalInfo } } : undefined)}
      >
        {displayGroupComp}
      </FieldGroup>
    );
  }

  /* If grouping is not used - render single meter */
  let colorValue = color || theme.base.palette.interactive;

  /* If color is a JSON string, determine the color based on the value */
  if (color?.includes('[')) {
    try {
      const colorArray = JSON.parse(color);
      const colorValueArray = colorArray.map((item: { value: number; color: string }) => {
        return item.value;
      });
      const colorArraySorted = colorValueArray.sort((a: number, b: number) => a - b);
      const colorValueArrayIndex = colorArraySorted.findIndex((item: number) => item >= value);
      colorValue = colorArray[colorValueArrayIndex].color;
    } catch {
      /* nothing */
    }
  }

  const displayComp = (
    <Flex container={{ direction: 'column', gap: 0, alignItems: 'center' }} style={{ width: '100%' }}>
      <StyleGroupMeterWrapper>
        <div>
          <ElemMeter id={id} event={{ color: colorValue, label, value }} totalValue={totalValue} />
        </div>
      </StyleGroupMeterWrapper>
      {showMetaData && <ElemDisplay event={{ color: colorValue, label, value }} totalValue={totalValue} />}
    </Flex>
  );

  if (displayMode === 'DISPLAY_ONLY') {
    return displayComp;
  }
  return (
    <FormField
      id={id}
      as={StyledFieldGroupElementMeter}
      label={label}
      labelHidden={hideLabel}
      {...(additionalInfo ? { additionalInfo: { heading: label, content: additionalInfo } } : undefined)}
    >
      {displayComp}
    </FormField>
  );
};
export default withConfiguration(PegaExtensionsMeter);
