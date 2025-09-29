import { useState, useEffect } from 'react';
import {
  withConfiguration,
  Progress,
  Text,
  createUID,
  Button,
  Icon,
  registerIcon,
  CardContent,
  Card,
  Flex,
} from '@pega/cosmos-react-core';
import StyledPegaExtensionsEditableTableLayoutWrapper from './styles';
import * as trashIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/trash.icon';
import * as plusIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/plus.icon';
import '../shared/create-nonce';
import getAllFields from './utils';

registerIcon(plusIcon, trashIcon);

export type TableLayoutProps = {
  getPConnect?: any;
};

export const PegaExtensionsEditableTableLayout = (props: TableLayoutProps) => {
  const { getPConnect } = props;
  const [numFields, setNumFields] = useState<number>(0);
  const [numRows, setNumRows] = useState<number>(0);
  const [fields, setFields] = useState<Array<any>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [embedDataRef, setEmbedDataRef] = useState<string>('');
  const [tableId, setTableId] = useState<string>('');

  // Get the inherited props from the parent to determine label settings
  const inheritedProps = { ...getPConnect().getInheritedProps() };

  const addRow = () => {
    setNumRows((prevCount) => {
      const messageConfig = {
        meta: props,
        options: {
          context: getPConnect().getContextName(),
          pageReference: 'caseInfo.content',
          referenceList: `.${embedDataRef}`,
          viewName: getPConnect().options.viewName,
        },
      };
      const c11nEnv = (window as any).PCore.createPConnect(messageConfig);
      c11nEnv.index = prevCount;
      c11nEnv.getPConnect().getListActions().insert({}, prevCount);

      return prevCount + 1;
    });
    setFields((prevFields) => {
      return prevFields.map((field: any) => {
        const newField = { ...field };
        // Add a new empty value
        newField.value.push('');
        return newField;
      });
    });
  };

  const deleteRow = (index: number) => {
    setNumRows((prevCount) => {
      const messageConfig = {
        meta: props,
        options: {
          context: getPConnect().getContextName(),
          pageReference: 'caseInfo.content',
          referenceList: `.${embedDataRef}`,
          viewName: getPConnect().options.viewName,
        },
      };
      const c11nEnv = (window as any).PCore.createPConnect(messageConfig);

      c11nEnv.getPConnect().getListActions().deleteEntry(index);

      return prevCount - 1;
    });
    setFields((prevFields) => {
      return prevFields.map((field: any) => {
        const newField = { ...field };
        // Delete the value in index position
        newField.value.splice(index, 1);
        return newField;
      });
    });
  };

  const genField = (field: any, index: number, key: string) => {
    const fieldInput: any = {
      type: field.componentType,
      config: {
        value: field.propref,
        label: field.label,
        hideLabel: true,
        classID: field.contextClass,
        displayMode: '',
      },
    };
    const messageConfig = {
      meta: fieldInput,
      options: {
        context: getPConnect().getContextName(),
        hasForm: true,
        pageReference: `caseInfo.content.${embedDataRef}[${index}]`,
        referenceList: `.${embedDataRef}`,
        viewName: getPConnect().options.viewName,
      },
    };
    const c11nEnv = (window as any).PCore.createPConnect(messageConfig);

    return <td key={key}>{c11nEnv.getPConnect().createComponent(fieldInput)}</td>;
  };

  useEffect(() => {
    const tmpFields = getAllFields(getPConnect);
    if (tmpFields && tmpFields[0] && tmpFields[0].value) {
      setEmbedDataRef(tmpFields[0].pageref);

      /* New API added in 24.2 - not needed for 24.1 */
      (window as any).PCore.getContextTreeManager().addPageListNode(
        getPConnect().getContextName(),
        'caseInfo.content',
        getPConnect().meta.name,
        tmpFields[0].pageref,
      );

      setNumRows(tmpFields[0].value.length);
      /* This logic will load the DX Component if it is not already loaded */
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
      });
      setFields(tmpFields);
    }
  }, [getPConnect]);

  useEffect(() => {
    /* We will wait until all the components are loaded before rendering the table */
    if (fields && fields.length > 0 && numFields === fields.length) {
      setTableId(createUID());
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

  return (
    <Card>
      <CardContent>
        <Flex container={{ direction: 'column', gap: 1 }}>
          <StyledPegaExtensionsEditableTableLayoutWrapper>
            <table>
              <caption>
                <Text variant='h3'>{inheritedProps.label}</Text>
              </caption>
              <thead>
                <tr>
                  {fields.map((field: any, idx: number) => {
                    return (
                      <th scope='col' key={`${tableId}-head-${idx}`} id={`${tableId}-head-${idx}`}>
                        {field.label}
                      </th>
                    );
                  })}
                  <th style={{ width: '80px' }}>{getPConnect().getLocalizedValue('Action')}</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: numRows }, (_, i) => i).map((_, i) => {
                  return (
                    <tr key={`reg-row-${i}`}>
                      {fields.map((field: any, j: number) => {
                        return genField(field, i, `${tableId}-row-${i}-${j}`);
                      })}
                      <td>
                        <Button
                          label={getPConnect().getLocalizedValue('Delete this record')}
                          variant='simple'
                          onClick={() => deleteRow(i)}
                        >
                          <Icon name='trash' />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </StyledPegaExtensionsEditableTableLayoutWrapper>
          <Flex container={{ direction: 'row' }}>
            <Button variant='simple' onClick={addRow}>
              <Icon name='plus' />
              {getPConnect().getLocalizedValue('Add new record')}
            </Button>
          </Flex>
        </Flex>
      </CardContent>
    </Card>
  );
};

export default withConfiguration(PegaExtensionsEditableTableLayout);
