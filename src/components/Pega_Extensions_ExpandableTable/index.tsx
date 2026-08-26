import { Fragment, useState, useEffect, useCallback, useMemo, type ChangeEvent, type KeyboardEvent } from 'react';
import {
  withConfiguration,
  Progress,
  Text,
  Link,
  createUID,
  Button,
  Icon,
  registerIcon,
  CardContent,
  Card,
  Checkbox,
  Tabs,
  TabPanel,
  Flex,
  AdditionalInfo,
  FieldGroup,
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
  isBooleanField,
  applyBooleanSelectAll,
  syncBooleanFieldValuesFromStore,
  buildDisplayColumns,
  groupRowsByCategory,
  getRowTitle,
  getRowHelpText,
  isCategoryField,
  type DisplayColumn,
  type ExpandableTableVariant,
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

type BooleanSelectAllCellProps = {
  field: any;
  rowIndex: number;
  basePageRef: string;
  embedDataRef: string;
  getPConnect: any;
};

const toChecked = (value: any): boolean => value === true || value === 'true';

const BooleanSelectAllCell = ({
  field,
  rowIndex,
  basePageRef,
  embedDataRef,
  getPConnect,
}: BooleanSelectAllCellProps) => {
  const value = field?.value?.[rowIndex];
  const [checked, setChecked] = useState(toChecked(value));

  useEffect(() => {
    setChecked(toChecked(value));
  }, [value]);

  const handleChange = (nextChecked: boolean) => {
    setChecked(nextChecked);
    const pConn = getPConnect();
    const contextName = pConn.getContextName();
    const storeData = (window as any).PCore.getStore()?.getState()?.data?.[contextName];
    applyBooleanSelectAll({
      rowPageRef: buildRowPageReference(basePageRef, embedDataRef, rowIndex),
      field,
      checked: nextChecked,
      contextName,
      target: pConn.getTarget?.(),
      storeData,
    });
  };

  return (
    <Checkbox
      label={<span className='checkbox-col-caption'>{field.label || 'Select'}</span>}
      checked={checked}
      onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e.currentTarget.checked)}
    />
  );
};

type ExpandableListItemProps = {
  rowIndex: number;
  title: string;
  helpText?: string;
  expanded: boolean;
  onToggle: () => void;
  detailViewName: string;
  embedDataRef: string;
  embedClass: string;
  getPConnect: any;
};

const ExpandableListItem = ({
  rowIndex,
  title,
  helpText,
  expanded,
  onToggle,
  detailViewName,
  embedDataRef,
  embedClass,
  getPConnect,
}: ExpandableListItemProps) => {
  const panelId = `expandable-list-panel-${rowIndex}`;
  const headerId = `expandable-list-header-${rowIndex}`;

  const onHeaderKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onToggle();
    }
  };

  return (
    <div className='expandable-list-item'>
      <div className='expandable-list-item__toolbar'>
        <button
          type='button'
          id={headerId}
          className='expandable-list-item__header'
          aria-expanded={expanded}
          aria-controls={panelId}
          onClick={onToggle}
          onKeyDown={onHeaderKeyDown}
        >
          <Icon name={expanded ? 'caret-down' : 'caret-right'} />
          <span className='expandable-list-item__title'>{title}</span>
        </button>
        {helpText ? (
          <span className='expandable-list-item__help'>
            <AdditionalInfo heading={getPConnect().getLocalizedValue('Additional information')} contextualLabel={title}>
              {helpText}
            </AdditionalInfo>
          </span>
        ) : null}
      </div>
      {expanded ? (
        <div className='expandable-list-item__body' id={panelId} role='region' aria-labelledby={headerId}>
          <RowDetailPanel
            rowIndex={rowIndex}
            detailViewName={detailViewName}
            embedDataRef={embedDataRef}
            embedClass={embedClass}
            getPConnect={getPConnect}
          />
        </div>
      ) : null}
    </div>
  );
};

export type ExpandableTableProps = {
  /** Visual layout: table (default), accordion list, or category tabs */
  variant?: ExpandableTableVariant;
  detailViewName?: string;
  getPConnect?: any;
};

const normalizeVariant = (variant?: string): ExpandableTableVariant => {
  if (variant === 'list' || variant === 'tabs') {
    return variant;
  }
  return 'table';
};

export const PegaExtensionsExpandableTable = (props: ExpandableTableProps) => {
  const { detailViewName, getPConnect, variant: variantProp } = props;
  const variant = normalizeVariant(variantProp);
  const [numFields, setNumFields] = useState<number>(0);
  const [numRows, setNumRows] = useState<number>(0);
  const [fields, setFields] = useState<Array<any>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [embedDataRef, setEmbedDataRef] = useState<string>('');
  const [tableId, setTableId] = useState<string>('');
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [embedClass, setEmbedClass] = useState<string>('');
  const [basePageRef, setBasePageRef] = useState<string>('caseInfo.content');
  const [currentTabId, setCurrentTabId] = useState<string>('');

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

  const genFieldCell = (field: any, rowIndex: number, key: string) => {
    if (isBooleanField(field, rowIndex)) {
      return (
        <td key={key} className='checkbox-col'>
          <BooleanSelectAllCell
            field={field}
            rowIndex={rowIndex}
            basePageRef={basePageRef}
            embedDataRef={embedDataRef}
            getPConnect={getPConnect}
          />
        </td>
      );
    }
    const fieldInput: any = {
      type: field.componentType,
      config: {
        value: field?.value?.[rowIndex] ?? field.propref,
        label: field.label,
        formatter: field.formatter,
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

  const genIdUrlLinkCell = (idField: any, urlField: any, rowIndex: number, key: string) => {
    const idValue = idField?.value?.[rowIndex];
    const urlValue = urlField?.value?.[rowIndex];
    const label = idValue !== null && idValue !== undefined && idValue !== '' ? `${idValue}` : '';
    if (!label) {
      return (
        <td key={key}>
          <span className='visually-hidden'>{'\u00A0'}</span>
        </td>
      );
    }
    if (!urlValue) {
      return (
        <td key={key}>
          <Text>{label}</Text>
        </td>
      );
    }
    return (
      <td key={key}>
        <Link href={`${urlValue}`} target='_blank' rel='noopener noreferrer' aria-label={label}>
          {label}
        </Link>
      </td>
    );
  };

  const genCell = (column: DisplayColumn, rowIndex: number) => {
    if (column.kind === 'idUrlLink') {
      return genIdUrlLinkCell(
        column.idField,
        column.urlField,
        rowIndex,
        `${tableId}-row-${rowIndex}-${column.idIndex}`,
      );
    }
    return genFieldCell(column.field, rowIndex, `${tableId}-row-${rowIndex}-${column.index}`);
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

  useEffect(() => {
    if (!embedDataRef) {
      return undefined;
    }
    const store = (window as any).PCore.getStore?.();
    if (typeof store?.subscribe !== 'function') {
      return undefined;
    }

    const contextName = getPConnect().getContextName();
    const syncFromStore = () => {
      const storeData = store.getState()?.data?.[contextName];
      setFields((prevFields) => {
        const { fields: nextFields, changed } = syncBooleanFieldValuesFromStore({
          fields: prevFields,
          storeData,
          basePageRef,
          embedDataRef,
        });
        return changed ? nextFields : prevFields;
      });
    };

    syncFromStore();
    return store.subscribe(syncFromStore);
  }, [getPConnect, basePageRef, embedDataRef]);

  const categoryGroups = useMemo(() => groupRowsByCategory(fields, numRows), [fields, numRows]);
  const hasCategoryColumn = useMemo(() => fields.some((field) => isCategoryField(field)), [fields]);

  useEffect(() => {
    if (variant !== 'tabs' || categoryGroups.length === 0) {
      return;
    }
    setCurrentTabId((prev) => {
      if (prev && categoryGroups.some((group) => group.id === prev)) {
        return prev;
      }
      return categoryGroups[0].id;
    });
  }, [variant, categoryGroups]);

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

  const displayColumns = buildDisplayColumns(fields);
  const colSpan = displayColumns.length + 1;
  const hasVisibleHeaders = displayColumns.some((column) => {
    if (column.kind === 'field' && isBooleanField(column.field)) {
      return false;
    }
    const label = column.kind === 'idUrlLink' ? column.idField.label : column.field.label;
    return typeof label === 'string' && label.trim().length > 0;
  });

  const renderListItems = (rowIndexes: number[]) => (
    <div className='expandable-list' role='list'>
      {rowIndexes.map((rowIndex) => (
        <div key={`list-item-${rowIndex}`} role='listitem'>
          <ExpandableListItem
            rowIndex={rowIndex}
            title={getRowTitle(fields, rowIndex)}
            helpText={getRowHelpText(fields, rowIndex)}
            expanded={expandedRows.has(rowIndex)}
            onToggle={() => toggleRow(rowIndex)}
            detailViewName={detailViewName || ''}
            embedDataRef={embedDataRef}
            embedClass={embedClass}
            getPConnect={getPConnect}
          />
        </div>
      ))}
    </div>
  );

  if (variant === 'list') {
    return (
      <FieldGroup name={inheritedProps.label}>
        <StyledPegaExtensionsExpandableTableWrapper className='variant-list'>
          {renderListItems(Array.from({ length: numRows }, (_, i) => i))}
        </StyledPegaExtensionsExpandableTableWrapper>
      </FieldGroup>
    );
  }

  if (variant === 'tabs') {
    const tabs = categoryGroups.map((group) => ({
      name: group.name,
      id: group.id,
    }));
    const activeTabId = currentTabId || tabs[0]?.id || '';

    return (
      <FieldGroup name={inheritedProps.label}>
        <StyledPegaExtensionsExpandableTableWrapper className='variant-tabs'>
          <Flex container={{ direction: 'column' }}>
            <Tabs tabs={tabs} currentTabId={activeTabId} onTabClick={(id: string) => setCurrentTabId(id)} />
            <div className='tabs-panel-container'>
              {categoryGroups.map((group) => (
                <TabPanel tabId={group.id} currentTabId={activeTabId} key={group.id}>
                  {hasCategoryColumn || group.rowIndexes.length > 1 ? (
                    renderListItems(group.rowIndexes)
                  ) : (
                    <RowDetailPanel
                      rowIndex={group.rowIndexes[0]}
                      detailViewName={detailViewName || ''}
                      embedDataRef={embedDataRef}
                      embedClass={embedClass}
                      getPConnect={getPConnect}
                    />
                  )}
                </TabPanel>
              ))}
            </div>
          </Flex>
        </StyledPegaExtensionsExpandableTableWrapper>
      </FieldGroup>
    );
  }

  return (
    <Card>
      <CardContent>
        <StyledPegaExtensionsExpandableTableWrapper className='variant-table'>
          <table>
            <caption>
              <Text variant='h3'>{inheritedProps.label}</Text>
            </caption>
            <colgroup>
              <col className='expand-col' />
              {displayColumns.map((column, idx) => {
                const isCheckbox = column.kind === 'field' && isBooleanField(column.field);
                return <col key={`${tableId}-col-${idx}`} className={isCheckbox ? 'checkbox-col' : undefined} />;
              })}
            </colgroup>
            {hasVisibleHeaders && (
              <thead>
                <tr>
                  <th scope='col'>
                    <span className='visually-hidden'>{getPConnect().getLocalizedValue('Row details')}</span>
                  </th>
                  {displayColumns.map((column, idx) => {
                    if (column.kind === 'field' && isBooleanField(column.field)) {
                      return (
                        <th
                          scope='col'
                          key={`${tableId}-head-${idx}`}
                          id={`${tableId}-head-${idx}`}
                          className='checkbox-col'
                        >
                          <span className='visually-hidden'>{column.field.label}</span>
                        </th>
                      );
                    }
                    const label = column.kind === 'idUrlLink' ? column.idField.label : column.field.label;
                    return (
                      <th scope='col' key={`${tableId}-head-${idx}`} id={`${tableId}-head-${idx}`}>
                        {label}
                      </th>
                    );
                  })}
                </tr>
              </thead>
            )}
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
                    {displayColumns.map((column) => genCell(column, rowIndex))}
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
