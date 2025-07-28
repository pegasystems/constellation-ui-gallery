import { useState, useEffect } from 'react';
import {
  withConfiguration,
  FieldGroup,
  FieldValueList,
  RadioButtonGroup,
  Progress,
  RadioButton,
  Text,
  createUID,
  Icon,
  registerIcon,
  useTheme,
  Checkbox,
} from '@pega/cosmos-react-core';
import StyledPegaExtensionsCompareTableLayoutWrapper, { SelectedBgCell, SelectedBgTh, SelectedCell } from './styles';
import '../create-nonce';

// includes in bundle
import getAllFields from './utils';

import * as checkIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/check.icon';
import * as timesIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/times.icon';
import '../create-nonce';

registerIcon(checkIcon, timesIcon);

export type TableLayoutProps = {
  heading: string;
  displayFormat: 'spreadsheet' | 'financialreport' | 'radio-button-card';
  selectionProperty?: string;
  currencyFormat: 'standard' | 'compact' | 'parentheses';
  getPConnect?: any;
};

type FieldObj = {
  type: string;
  config: {
    text: string;
    value: string;
    label: string;
    displayMode: string;
    displayAs?: string;
    negative?: string;
    notation?: string;
  };
};

export const PegaExtensionsCompareTableLayout = (props: TableLayoutProps) => {
  const { displayFormat, heading, selectionProperty, currencyFormat, getPConnect } = props;
  const [numCols, setNumCols] = useState<number>(0);
  const [numFields, setNumFields] = useState<number>(0);
  const [fields, setFields] = useState<Array<any>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selection, setSelection] = useState<Array<boolean>>([]);

  const metadata = getPConnect().getRawMetadata();
  const theme = useTheme();

  const selectObject = (ID: any, index: number) => {
    if (metadata.config.selectionProperty) {
      const prop = metadata.config.selectionProperty.replace('@P ', '');
      getPConnect().getActionsApi().updateFieldValue(prop, ID);
      getPConnect().getActionsApi().triggerFieldChange(prop, ID);
    }
    const sel: Array<boolean> = [];
    for (let i = 0; i < numCols; i += 1) {
      sel.push(i === index);
    }
    setSelection(sel);
  };

  const genField = (componentType: string, val: any) => {
    const field: FieldObj = {
      type: componentType,
      config: {
        text: `${val}`,
        value: `${val}`,
        label: '',
        displayMode: 'DISPLAY_ONLY',
      },
    };
    if (componentType === 'Checkbox') {
      if (val === 'true' || val) {
        return <Icon name='check' style={{ color: 'green' }} />;
      }
      return <Icon name='times' style={{ color: 'red' }} />;
    }
    if (componentType === 'URL') {
      field.config.displayAs = 'Image';
    }
    if (componentType === 'Currency') {
      if (currencyFormat === 'parentheses') {
        field.config.negative = 'parentheses';
      } else {
        field.config.notation = currencyFormat;
      }
    }
    return getPConnect().createComponent(field);
  };

  useEffect(() => {
    const tmpFields = getAllFields(getPConnect);
    if (tmpFields && tmpFields[0] && tmpFields[0].value) {
      setNumCols(tmpFields[0].value.length);
      tmpFields.forEach((child: any) => {
        if (
          child.componentType &&
          !(window as any).PCore.getComponentsRegistry().getLazyComponent(child.componentType)
        ) {
          (window as any).PCore.getAssetLoader()
            .getLoader('component-loader')([child.componentType])
            .then(() => {
              setNumFields((prevCount) => prevCount + 1);
            });
        } else {
          setNumFields((prevCount) => prevCount + 1);
        }
        if (typeof selectionProperty !== 'undefined' && child.label === 'ID') {
          child.value.forEach((val: any, index: number) => {
            if (val === selectionProperty) {
              const sel: Array<boolean> = [];
              for (let i = 0; i < child.value.length; i += 1) {
                sel.push(i === index);
              }
              setSelection(sel);
            }
          });
        }
      });
      setFields(tmpFields);
    }
  }, [displayFormat, currencyFormat, selectionProperty, getPConnect]);

  useEffect(() => {
    if (fields && fields.length > 0 && numFields === fields.length) {
      setLoading(false);
    }
  }, [numFields, fields]);

  if (loading) {
    return (
      <Progress
        placement='local'
        message={(window as any).PCore.getLocaleUtils().getLocaleValue(
          'Loading content...',
          'Generic',
          '@BASECLASS!GENERIC!PYGENERICFIELDS',
        )}
      />
    );
  }

  if (displayFormat === 'radio-button-card') {
    return (
      <StyledPegaExtensionsCompareTableLayoutWrapper displayFormat={displayFormat}>
        <RadioButtonGroup variant='card' label={heading} inline>
          {fields[0].value.map((val: any, i: number) => {
            const fvl: Array<{ id: string; name: string; value: JSX.Element | string }> = [];
            let objectId = '';
            fields.forEach((child: any, j: number) => {
              if (j > 0) {
                if (child.label === 'ID') {
                  objectId = child.value[i];
                } else {
                  fvl.push({
                    id: child.label,
                    name: child.label,
                    value: child.value && child.value.length >= i ? genField(child.componentType, child.value[i]) : '',
                  });
                }
              }
            });
            return (
              <RadioButton
                label={
                  <FieldGroup name={val} headingTag='h3'>
                    <FieldValueList fields={fvl} />
                  </FieldGroup>
                }
                key={`rb-${i}`}
                id={val}
                onChange={() => selectObject(objectId, i)}
                checked={selection.length >= i ? selection[i] : false}
              />
            );
          })}
        </RadioButtonGroup>
      </StyledPegaExtensionsCompareTableLayoutWrapper>
    );
  }

  const tableId = createUID();
  return (
    <StyledPegaExtensionsCompareTableLayoutWrapper displayFormat={displayFormat}>
      <table>
        <caption>
          <Text variant='h3'>{heading}</Text>
        </caption>
        <thead>
          <tr>
            <th>{getPConnect().getLocalizedValue('Name')}</th>
            {fields[0].value.map((val: string, idx: number) => {
              const isSelected = selection.length >= idx ? selection[idx] : false;
              const field = {
                type: 'Text',
                config: {
                  text: val,
                  displayMode: 'DISPLAY_ONLY',
                },
              };
              return (
                <SelectedBgTh
                  scope='col'
                  key={`${tableId}-col-${idx}`}
                  id={`${tableId}-col-${idx}`}
                  theme={theme}
                  isSelected={isSelected}
                >
                  {getPConnect().createComponent(field)}
                </SelectedBgTh>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {fields.map((child: any, i: number) => {
            if (i > 0) {
              if (child.heading) {
                return (
                  <tr key={`total-cat-${i}`} className={`total cat-${child.category}`}>
                    <th>{child.heading}</th>
                    {fields[0].value.map((val: string, idx: number) => {
                      const isSelected = selection.length >= idx ? selection[idx] : false;
                      return <SelectedBgCell key={idx} theme={theme} isSelected={isSelected} />;
                    })}
                  </tr>
                );
              }
              /* Show a selection with radioButton if the label is called ID and the selectionProperty is provided */
              if (child.label === 'ID' && typeof selectionProperty !== 'undefined' && metadata.config.selectionProperty)
                return (
                  <tr key={`reg-row-${i}`}>
                    <th>{getPConnect().getLocalizedValue('Selection')}</th>
                    {child.value &&
                      child.value.map((val: any, j: number) => {
                        const isSelected = selection.length >= j ? selection[j] : false;
                        return (
                          <SelectedCell
                            key={`${tableId}-cell-${i}-${j}`}
                            isSelected={isSelected}
                            theme={theme}
                            className='selection'
                          >
                            <Checkbox
                              id={`${tableId}-radio-${j}`}
                              aria-labelledby={`${tableId}-radio-${j} ${tableId}-col-${j}`}
                              variant='card'
                              label={getPConnect().getLocalizedValue('Select')}
                              checked={isSelected}
                              onChange={() => selectObject(val, j)}
                            />
                          </SelectedCell>
                        );
                      })}
                  </tr>
                );
              return (
                <tr key={`reg-row-${i}`}>
                  <th scope='row'>{child.label}</th>
                  {child.value &&
                    child.value.map((val: any, j: number) => {
                      const isSelected = selection.length >= j ? selection[j] : false;
                      return (
                        <SelectedBgCell theme={theme} isSelected={isSelected} key={`${tableId}-row-${i}-${j}`}>
                          {genField(child.componentType, val)}
                        </SelectedBgCell>
                      );
                    })}
                </tr>
              );
            }
            return null;
          })}
        </tbody>
      </table>
    </StyledPegaExtensionsCompareTableLayoutWrapper>
  );
};

export default withConfiguration(PegaExtensionsCompareTableLayout);
