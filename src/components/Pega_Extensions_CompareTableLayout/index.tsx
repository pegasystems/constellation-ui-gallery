import { useState, useEffect } from 'react';
import {
  FieldGroup,
  FieldValueList,
  type FieldValueListItem,
  RadioButtonGroup,
  Progress,
  RadioButton,
  Text,
  createUID
} from '@pega/cosmos-react-core';
import StyledPegaExtensionsCompareTableLayoutWrapper from './styles';

// includes in bundle
import getAllFields from './utils';

type TableLayoutProps = {
  displayFormat: string;
  heading: string;
  selectionProperty?: string;
  currencyFormat: string;
  getPConnect: any;
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

export default function PegaExtensionsCompareTableLayout(props: TableLayoutProps) {
  const { displayFormat, heading, selectionProperty, currencyFormat, getPConnect } = props;
  const [numCols, setNumCols] = useState<number>(0);
  const [numFields, setNumFields] = useState<number>(0);
  const [fields, setFields] = useState<Array<any>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selection, setSelection] = useState<Array<boolean>>([]);

  const metadata = getPConnect().getRawMetadata();

  const selectObject = (ID: any, index: number) => {
    if (metadata.config.selectionProperty) {
      const prop = metadata.config.selectionProperty.replace('@P ', '');
      getPConnect().setValue(prop, ID);
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
        displayMode: 'DISPLAY_ONLY'
      }
    };
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
    return <td>{getPConnect().createComponent(field)}</td>;
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
              setNumFields(prevCount => prevCount + 1);
            });
        } else {
          setNumFields(prevCount => prevCount + 1);
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
  }, [displayFormat, currencyFormat, selectionProperty]);

  useEffect(() => {
    if (fields && fields.length > 0 && numFields === fields.length) {
      setLoading(false);
    }
  }, [numFields, fields]);

  if (loading) {
    return <Progress placement='local' message='Loading content...' />;
  }

  if (displayFormat === 'radio-button-card') {
    return (
      <StyledPegaExtensionsCompareTableLayoutWrapper displayFormat={displayFormat}>
        <RadioButtonGroup variant='card' label={heading} inline>
          {fields[0].value.map((val: any, i: number) => {
            const fvl: Array<FieldValueListItem> = [];
            let objectId = '';
            fields.forEach((child: any, j: number) => {
              if (j > 0) {
                if (child.label === 'ID') {
                  objectId = child.value[i];
                } else {
                  fvl.push({
                    id: child.label,
                    name: child.label,
                    value:
                      child.value && child.value.length >= i
                        ? genField(child.componentType, child.value[i])
                        : ''
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
            <th>Name</th>
            {fields[0].value.map((val: string, idx: number) => {
              const field = {
                type: 'Text',
                config: {
                  text: val,
                  displayMode: 'DISPLAY_ONLY'
                }
              };
              return (
                <th scope='col' id={`${tableId}-col-${idx}`}>
                  {getPConnect().createComponent(field)}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {fields.map((child: any, i: number) => {
            if (i > 0) {
              if (child.heading) {
                return (
                  <tr className={`total cat-${child.category}`}>
                    <th colSpan={numCols + 1}>{child.heading}</th>
                  </tr>
                );
              }
              /* Show a selection with radioButton if the label is called ID and the selectionProperty is provided */
              if (
                child.label === 'ID' &&
                typeof selectionProperty !== 'undefined' &&
                metadata.config.selectionProperty
              )
                return (
                  <tr className='selection'>
                    <th>Selection</th>
                    {child.value &&
                      child.value.map((val: any, j: number) => {
                        return (
                          <td>
                            <RadioButton
                              id={`${tableId}-radio-${j}`}
                              aria-labelledby={`${tableId}-radio-${j} ${tableId}-col-${j}`}
                              variant='card'
                              label='Select'
                              checked={selection.length >= j ? selection[j] : false}
                              onChange={() => selectObject(val, j)}
                            />
                          </td>
                        );
                      })}
                  </tr>
                );
              return (
                <tr>
                  <th scope='row'>{child.label}</th>
                  {child.value &&
                    child.value.map((val: any) => {
                      return genField(child.componentType, val);
                    })}
                </tr>
              );
            } else {
              return null;
            }
          })}
        </tbody>
      </table>
    </StyledPegaExtensionsCompareTableLayoutWrapper>
  );
}
