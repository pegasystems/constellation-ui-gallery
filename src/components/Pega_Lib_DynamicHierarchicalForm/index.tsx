import { useState, useEffect, useRef, useMemo } from 'react';
import {
  withConfiguration,
  Button,
  EmptyState,
  FieldGroup,
  Flex,
  Progress,
  TabPanel,
  Tabs,
  ComboBox,
  menuHelpers,
  type MenuItemProps,
  type ComboBoxProps,
} from '@pega/cosmos-react-core';
import getAllFields from './utils';
import { MainContent, FixPopover } from './styles';
import '../create-nonce';

export interface DynamicHierarchicalFormProps {
  /** Heading for this view */
  label?: string;
  /** Show the heading of the view
   *  @default true
   */
  showLabel?: boolean;
  /** Label of the refresh action button
   * @default Refresh details
   */
  refreshActionLabel?: string;
  /** Show the refresh action button
   * @default true
   */
  showRefreshAction: boolean;
  /** Show the multi-select combo-box
   * @default true
   */
  enableItemSelection: boolean;
  getPConnect?: any;
}

const getFilterRegex = (inputValue: string) => {
  return new RegExp(`^${inputValue.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&')}`, 'i');
};

export const PegaExtensionsDynamicHierarchicalForm = (props: DynamicHierarchicalFormProps) => {
  const {
    getPConnect,
    refreshActionLabel = 'Refresh details',
    showRefreshAction = true,
    enableItemSelection = true,
    label = '',
    showLabel = true,
  } = props;
  const [tabs, setTabs] = useState<Array<any>>([]);
  const products = useRef<Array<any>>([]);
  const [panelShown, changePanel] = useState<string>('');
  const [hasSelectedProduct, setHasSelectedProduct] = useState<boolean>(false);
  const productRef = useRef('');
  const productLabelRef = useRef('');
  const productSelectionRequiredRef = useRef(false);
  const [validatemessage, setValidateMessage] = useState<string>('');
  const [status, setStatus] = useState<ComboBoxProps['status']>(undefined);
  const [items, setItems] = useState<Array<any>>([]);
  const [filterValue, setFilterValue] = useState('');
  const selected = useMemo(() => {
    return menuHelpers.getSelected(items).map((item) => ({ text: item.primary, id: item.id }));
  }, [items]);

  const filterRegex = useMemo(() => getFilterRegex(filterValue), [filterValue]);

  const itemsToRender = useMemo(() => {
    const newItems = filterValue
      ? menuHelpers.flatten(items).filter(({ primary }) => {
          return filterRegex.test(primary);
        })
      : items;
    return menuHelpers.mapTree(newItems, (item) => ({
      ...item,
      selected: item.items ? undefined : !!item.selected,
    }));
  }, [filterRegex, filterValue, items]);

  // Get the inherited props from the parent to determine label settings
  const propsToUse = { label, showLabel, ...getPConnect().getInheritedProps() };

  const handleTabChange = (id: string) => {
    changePanel(id);
  };

  const refreshForm = () => {
    const caseKey = getPConnect().getCaseInfo().getKey();
    const refreshOptions = { autoDetectRefresh: true, propertyName: '' };
    const viewName = getPConnect().getCaseInfo().getCurrentAssignmentViewName();
    getPConnect().getActionsApi().refreshCaseView(caseKey, viewName, '', refreshOptions);
  };

  const updateProducts = (index: number, IsSelected: boolean) => {
    const messageConfig = {
      meta: props,
      options: {
        context: getPConnect().getContextName(),
        pageReference: `caseInfo.content.${productRef.current}[${index}]`,
        target: getPConnect().getTarget(),
      },
    };
    const c11nEnv = (window as any).PCore.createPConnect(messageConfig);
    const actionsApi = c11nEnv.getPConnect().getActionsApi();
    actionsApi?.updateFieldValue('.IsSelected', IsSelected);
    const tmpProducts = products.current.map((product, i) => {
      if (i === index) return { ...product, IsSelected };
      return product;
    });
    products.current = tmpProducts;

    let tmpHasSelectedProduct = false;
    for (const product of tmpProducts) {
      if (product.IsSelected) {
        tmpHasSelectedProduct = true;
        break;
      }
    }
    setHasSelectedProduct(tmpHasSelectedProduct);

    changePanel((prevId: string) => {
      if (!IsSelected) {
        /* When unchecking - need to make sure the currentTab is not the one that will be hidden */
        if (products.current[index].pyGUID === prevId) {
          let newId = '';
          for (const [i, product] of products.current.entries()) {
            if (product.IsSelected && index !== i) {
              newId = product.pyGUID;
              break;
            }
          }
          return newId;
        }
        return prevId;
      }
      /* When checking a new product, always focus the tab */
      return products.current[index].pyGUID;
    });

    setTabs((prevTabs) => {
      return prevTabs.map((tab: any, j: number) => {
        if (index === j) {
          return { ...tab, visible: IsSelected };
        }
        return tab;
      });
    });
  };

  const toggleItem = (id: string) => {
    setItems((cur: any) => {
      for (let j = 0; j < cur.length; j += 1) {
        if (cur[j].id === id) {
          updateProducts(j, !cur[j].selected);
        }
      }
      return menuHelpers.toggleSelected(cur, id, 'multi-select');
    });
  };

  useEffect(() => {
    if (validatemessage !== '') {
      setStatus('error');
    }
    if (status !== 'success') {
      setStatus(validatemessage !== '' ? 'error' : undefined);
    }
  }, [validatemessage, status]);

  useEffect(() => {
    /* In 24.2, we need to initialize the context tree manager */
    (window as any).PCore.getContextTreeManager().addPageListNode(
      getPConnect().getContextName(),
      'caseInfo.content',
      getPConnect().meta.name,
      productRef.current,
    );

    const SelectedProducts: any = getAllFields(0, getPConnect);
    const tmpFields: any = getAllFields(1, getPConnect);
    if (SelectedProducts.length !== 1 || !SelectedProducts[0]?.authorContext || tmpFields.length === 0) {
      return;
    }

    const tmpTabs: Array<any> = [];
    const tmpItems: Array<MenuItemProps> = [];
    const context = getPConnect().getContextName();
    const content: any = (window as any).PCore.getStore().getState().data?.[context]?.caseInfo?.content;
    productRef.current = SelectedProducts[0].authorContext.substring(1);
    productSelectionRequiredRef.current = false;
    if (SelectedProducts[0]?.inheritedProps?.length > 0) {
      for (const val of SelectedProducts[0].inheritedProps) {
        if (val.prop === 'label') {
          productLabelRef.current = val.value;
        } else if (val.prop === 'required') {
          productSelectionRequiredRef.current = true;
        }
      }
    }
    const Products = content[productRef.current];
    for (let i = 0; i < Products.length; i += 1) {
      const pyLabel = Products[i].pyLabel;
      const classID = Products[i].RuleClass;
      const id = Products[i].pyGUID;
      tmpItems.push({ id, primary: pyLabel, selected: Products[i].IsSelected });
      let fieldId = 0;
      for (fieldId = 0; fieldId < tmpFields.length; fieldId += 1) {
        if (classID === tmpFields[fieldId].ruleClass) {
          break;
        }
      }
      if (fieldId < tmpFields.length) {
        /* Match was made */
        const metadata = (window as any).PCore.getViewResources().fetchViewResources(
          tmpFields[fieldId].name,
          getPConnect(),
          tmpFields[fieldId].ruleClass,
        );
        const messageConfig = {
          meta: metadata,
          options: {
            contextName: getPConnect().getContextName(),
            context: getPConnect().getContextName(),
            pageReference: `caseInfo.content${tmpFields[fieldId].context}`,
            target: getPConnect().getTarget(),
          },
        };
        const c11nEnv = (window as any).PCore.createPConnect(messageConfig);
        const myElem = c11nEnv.getPConnect().createComponent(messageConfig.meta);
        tmpTabs.push({
          name: pyLabel,
          id,
          visible: Products[i].IsSelected,
          content: myElem,
        });
      }
    }
    setItems(tmpItems);
    setTabs(tmpTabs);
    products.current = Products;
    let tmpHasSelectedProduct = -1;
    for (const [i, product] of Products.entries()) {
      if (product.IsSelected) {
        tmpHasSelectedProduct = i;
        break;
      }
    }
    setHasSelectedProduct(tmpHasSelectedProduct !== -1);
    if (tmpTabs.length > 0 && tmpHasSelectedProduct !== -1) {
      changePanel(tmpTabs[tmpHasSelectedProduct].id);
    }
  }, [getPConnect]);

  if (products.current.length === 0) {
    return (
      <Flex container={{ pad: 2 }} height={10}>
        <Flex item={{ grow: 1, alignSelf: 'auto' }}>
          <Progress
            placement='block'
            message={(window as any).PCore.getLocaleUtils().getLocaleValue(
              'Loading content...',
              'Generic',
              '@BASECLASS!GENERIC!PYGENERICFIELDS',
            )}
          />
        </Flex>
      </Flex>
    );
  }

  return (
    <>
      <FixPopover />
      <FieldGroup name={propsToUse.showLabel ? propsToUse?.label : null}>
        {enableItemSelection ? (
          <ComboBox
            mode='multi-select'
            label={productLabelRef.current}
            required={productSelectionRequiredRef.current}
            selected={{
              items: selected,
              onRemove: toggleItem,
            }}
            info={validatemessage}
            status={status}
            onChange={(e) => {
              setFilterValue(e.target.value);
            }}
            onBlur={(val: any) => {
              if (val.length === 0 && productSelectionRequiredRef?.current) {
                setValidateMessage('Cannot be blank');
              } else {
                setValidateMessage('');
              }
              setFilterValue('');
            }}
            menu={{
              items: itemsToRender,
              onItemClick: toggleItem,
              accent: filterRegex,
              scrollAt: 6,
            }}
          />
        ) : null}
        {hasSelectedProduct ? (
          <MainContent>
            {showRefreshAction ? <Button onClick={refreshForm}>{refreshActionLabel}</Button> : null}
            <Flex container={{ direction: 'column', gap: 1 }}>
              <Flex item={{ grow: 1 }}>
                <Tabs
                  tabs={tabs.filter((tab: any) => tab.visible)}
                  onTabClick={handleTabChange}
                  currentTabId={panelShown}
                />
              </Flex>
              <Flex container={{ pad: 1 }} item={{ grow: 1 }}>
                {tabs.map((tab) =>
                  tab.visible ? (
                    <TabPanel tabId={tab.id} currentTabId={panelShown} key={tab.id} style={{ width: '100%' }}>
                      {tab.content}
                    </TabPanel>
                  ) : null,
                )}
              </Flex>
            </Flex>
          </MainContent>
        ) : (
          <Flex container={{ pad: 2 }} style={{ height: '10rem' }}>
            <Flex item={{ grow: 1, alignSelf: 'auto' }}>
              <EmptyState />
            </Flex>
          </Flex>
        )}
      </FieldGroup>
    </>
  );
};
export default withConfiguration(PegaExtensionsDynamicHierarchicalForm);
