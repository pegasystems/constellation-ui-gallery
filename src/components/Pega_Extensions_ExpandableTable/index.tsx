import { Fragment, useState, useEffect, useCallback } from 'react';
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
} from '@pega/cosmos-react-core';
import StyledPegaExtensionsExpandableTableWrapper from './styles';
import * as caretDownIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/caret-down.icon';
import * as caretRightIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/caret-right.icon';
import '../shared/create-nonce';
import getAllFields, {
  loadRowDetailView,
  getBasePageReference,
  buildRowPageReference,
  buildReferenceList,
  getPageListRegistration,
} from './utils';

type RowDetailPanelProps = {
  rowIndex: number;
  detailViewName: string;
  embedDataRef: string;
  embedClass: string;
  getPConnect: any;
};

const RowDetailPanel = ({ rowIndex, detailViewName, embedDataRef, embedClass, getPConnect }: RowDetailPanelProps) => {
  const [detailContent, setDetailContent] = useState<any>(null);
  const [detailError, setDetailError] = useState<string>('');

  const loadDetail = useCallback(async () => {
    if (!detailViewName) {
      return;
    }
    setDetailError('');
    setDetailContent(null);
    try {
      const content = await loadRowDetailView({
        detailViewName,
        embedClass,
        embedDataRef,
        rowIndex,
        getPConnect,
      });
      setDetailContent(content);
    } catch {
      setDetailError(getPConnect().getLocalizedValue('Unable to load row details'));
    }
  }, [detailViewName, embedClass, embedDataRef, rowIndex, getPConnect]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  if (!detailViewName) {
    return <Text>{getPConnect().getLocalizedValue('No detail view configured')}</Text>;
  }

  if (detailError) {
    return <Text status='error'>{detailError}</Text>;
  }

  if (!detailContent) {
    return (
      <Progress
        placement='inline'
        message={(window as any).PCore.getLocaleUtils().getLocaleValue(
          'Loading content...',
          'Generic',
          '@BASECLASS!GENERIC!PYGENERICFIELDS',
        )}
      />
    );
  }

  return detailContent;
};

registerIcon(caretDownIcon, caretRightIcon);

export type ExpandableTableProps = {
  detailViewName?: string;
  getPConnect?: any;
};

export const PegaExtensionsExpandableTable = (props: ExpandableTableProps) => {
  const { detailViewName, getPConnect } = props;
  const [numFields, setNumFields] = useState<number>(0);
  const [numRows, setNumRows] = useState<number>(0);
  const [fields, setFields] = useState<Array<any>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [embedDataRef, setEmbedDataRef] = useState<string>('');
  const [tableId, setTableId] = useState<string>('');
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [embedClass, setEmbedClass] = useState<string>('');
  const [basePageRef, setBasePageRef] = useState<string>('caseInfo.content');

  const inheritedProps = { ...getPConnect().getInheritedProps() };

  const toggleRow = (index: number) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const genCell = (field: any, rowIndex: number, key: string) => {
    const fieldInput: any = {
      type: field.componentType,
      config: {
        value: field.propref,
        label: field.label,
        hideLabel: true,
        classID: field.contextClass,
        displayMode: 'DISPLAY_ONLY',
      },
    };
    const messageConfig = {
      meta: fieldInput,
      options: {
        context: getPConnect().getContextName(),
        pageReference: buildRowPageReference(basePageRef, embedDataRef, rowIndex),
        referenceList: buildReferenceList(embedDataRef),
        viewName: getPConnect().options.viewName,
      },
    };
    const c11nEnv = (window as any).PCore.createPConnect(messageConfig);
    return <td key={key}>{c11nEnv.getPConnect().createComponent(fieldInput)}</td>;
  };

  useEffect(() => {
    const tmpFields = getAllFields(getPConnect);
    const columnFields = tmpFields.filter((field: any) => field.type !== 'reference');
    if (columnFields && columnFields[0] && columnFields[0].value) {
      const currentBasePageRef = getBasePageReference(getPConnect);
      const listRef = columnFields[0].pageref;
      setBasePageRef(currentBasePageRef);
      setEmbedDataRef(listRef);
      setEmbedClass(columnFields[0].contextClass || '');

      const { parentPath, listProperty } = getPageListRegistration(currentBasePageRef, listRef);

      /* New API added in 24.2 */
      (window as any).PCore.getContextTreeManager().addPageListNode(
        getPConnect().getContextName(),
        parentPath,
        getPConnect().meta.name,
        listProperty,
      );

      setNumRows(columnFields[0].value.length);
      columnFields.forEach((child: any) => {
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
      setFields(columnFields);
    }
  }, [getPConnect]);

  useEffect(() => {
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

  const colSpan = fields.length + 1;

  return (
    <Card>
      <CardContent>
        <StyledPegaExtensionsExpandableTableWrapper>
          <table>
            <caption>
              <Text variant='h3'>{inheritedProps.label}</Text>
            </caption>
            <thead>
              <tr>
                <th scope='col' style={{ width: '3rem' }}>
                  <span className='visually-hidden'>{getPConnect().getLocalizedValue('Row details')}</span>
                </th>
                {fields.map((field: any, idx: number) => (
                  <th scope='col' key={`${tableId}-head-${idx}`} id={`${tableId}-head-${idx}`}>
                    {field.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: numRows }, (_, i) => i).map((_, rowIndex) => (
                <Fragment key={`rowgroup-${rowIndex}`}>
                  <tr>
                    <td>
                      <Button
                        label={
                          expandedRows.has(rowIndex)
                            ? getPConnect().getLocalizedValue('Collapse row')
                            : getPConnect().getLocalizedValue('Expand row')
                        }
                        variant='simple'
                        onClick={() => toggleRow(rowIndex)}
                      >
                        <Icon name={expandedRows.has(rowIndex) ? 'caret-down' : 'caret-right'} />
                      </Button>
                    </td>
                    {fields.map((field: any, j: number) => genCell(field, rowIndex, `${tableId}-row-${rowIndex}-${j}`))}
                  </tr>
                  {expandedRows.has(rowIndex) && (
                    <tr className='expandable-detail-row'>
                      <td colSpan={colSpan}>
                        <RowDetailPanel
                          rowIndex={rowIndex}
                          detailViewName={detailViewName || ''}
                          embedDataRef={embedDataRef}
                          embedClass={embedClass}
                          getPConnect={getPConnect}
                        />
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </StyledPegaExtensionsExpandableTableWrapper>
      </CardContent>
    </Card>
  );
};

export default withConfiguration(PegaExtensionsExpandableTable);
