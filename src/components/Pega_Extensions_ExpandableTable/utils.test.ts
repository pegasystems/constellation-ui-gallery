import {
  buildReferenceList,
  buildRowPageReference,
  extractPageRefFromConfig,
  getNestedStoreValue,
  getPageListRegistration,
  getRelativePropName,
  isBooleanField,
  isIdColumn,
  isUrlColumn,
  buildDisplayColumns,
  applyBooleanSelectAll,
  updateNestedBooleanFields,
  syncBooleanFieldValuesFromStore,
  groupRowsByCategory,
  getRowTitle,
  getRowHelpText,
  isCategoryField,
} from './utils';

describe('ExpandableTable path utilities', () => {
  test('extractPageRefFromConfig uses the innermost page list', () => {
    expect(extractPageRefFromConfig(' .computers[].Brand')).toBe('computers');
    expect(extractPageRefFromConfig(' .Orders[].LineItems[].ProductName')).toBe('Orders[].LineItems');
  });

  test('buildRowPageReference supports top-level lists', () => {
    expect(buildRowPageReference('caseInfo.content', 'computers', 2)).toBe('caseInfo.content.computers[2]');
  });

  test('buildRowPageReference supports nested embed context', () => {
    expect(buildRowPageReference('caseInfo.content.Orders[1]', 'LineItems', 0)).toBe(
      'caseInfo.content.Orders[1].LineItems[0]',
    );
  });

  test('buildReferenceList uses the innermost list name for multi-segment paths', () => {
    expect(buildReferenceList('LineItems')).toBe('.LineItems');
    expect(buildReferenceList('Orders[].LineItems')).toBe('.LineItems');
  });

  test('getPageListRegistration resolves nested parent paths', () => {
    expect(getPageListRegistration('caseInfo.content', 'computers')).toEqual({
      parentPath: 'caseInfo.content',
      listProperty: 'computers',
    });
    expect(getPageListRegistration('caseInfo.content.Orders[1]', 'LineItems')).toEqual({
      parentPath: 'caseInfo.content.Orders[1]',
      listProperty: 'LineItems',
    });
    expect(getPageListRegistration('caseInfo.content', 'Orders[].LineItems')).toEqual({
      parentPath: 'caseInfo.content.Orders[0]',
      listProperty: 'LineItems',
    });
  });

  test('getNestedStoreValue reads deeply nested row data', () => {
    const storeData = {
      caseInfo: {
        content: {
          Orders: [{ LineItems: [{ pxObjClass: 'Data-LineItem' }] }],
        },
      },
    };
    expect(getNestedStoreValue(storeData, 'caseInfo.content.Orders[0].LineItems[0]')).toEqual({
      pxObjClass: 'Data-LineItem',
    });
  });
});

describe('ExpandableTable tabs / list helpers', () => {
  const fields = [
    {
      label: 'Category',
      value: ['Feasibility', 'Feasibility', 'Project Management'],
      componentType: 'TextInput',
    },
    {
      label: 'Title',
      value: ['1.1.1 - NDA', '1.2.2 - IVDR', '3.1.1 - Kickoff'],
      componentType: 'TextInput',
    },
    {
      label: 'Help',
      value: ['NDA help', 'IVDR help', 'Kickoff help'],
      componentType: 'TextInput',
    },
  ];

  test('isCategoryField matches Category label case-insensitively', () => {
    expect(isCategoryField({ label: 'Category' })).toBe(true);
    expect(isCategoryField({ label: 'category' })).toBe(true);
    expect(isCategoryField({ label: 'Title' })).toBe(false);
  });

  test('getRowTitle prefers Title column', () => {
    expect(getRowTitle(fields, 0)).toBe('1.1.1 - NDA');
  });

  test('getRowHelpText reads Help column', () => {
    expect(getRowHelpText(fields, 1)).toBe('IVDR help');
  });

  test('groupRowsByCategory groups preserving order', () => {
    expect(groupRowsByCategory(fields, 3)).toEqual([
      { id: 'category-0', name: 'Feasibility', rowIndexes: [0, 1] },
      { id: 'category-1', name: 'Project Management', rowIndexes: [2] },
    ]);
  });

  test('groupRowsByCategory falls back to one tab per row without Category', () => {
    const noCategory = [
      {
        label: 'Brand',
        value: ['HP', 'Lenovo'],
        componentType: 'TextInput',
      },
    ];
    expect(groupRowsByCategory(noCategory, 2)).toEqual([
      { id: 'row-0', name: 'HP', rowIndexes: [0] },
      { id: 'row-1', name: 'Lenovo', rowIndexes: [1] },
    ]);
  });
});

describe('ExpandableTable ID + URL column merge', () => {
  test('isIdColumn matches exact ID label', () => {
    expect(isIdColumn({ label: 'ID' })).toBe(true);
    expect(isIdColumn({ label: 'Order ID' })).toBe(false);
    expect(isIdColumn({ label: 'id' })).toBe(false);
  });

  test('isUrlColumn matches URL component type', () => {
    expect(isUrlColumn({ componentType: 'URL' })).toBe(true);
    expect(isUrlColumn({ componentType: 'TextInput' })).toBe(false);
  });

  test('buildDisplayColumns merges consecutive ID + URL into one column', () => {
    const fields = [
      { label: 'Name', componentType: 'TextInput' },
      { label: 'ID', componentType: 'TextInput', value: ['A-1'] },
      { componentType: 'URL', label: 'Link', value: ['https://example.com/a'] },
      { label: 'Status', componentType: 'TextInput' },
    ];
    const columns = buildDisplayColumns(fields);
    expect(columns).toHaveLength(3);
    expect(columns[0]).toMatchObject({ kind: 'field', index: 0 });
    expect(columns[1]).toMatchObject({
      kind: 'idUrlLink',
      idIndex: 1,
      urlIndex: 2,
    });
    expect(columns[2]).toMatchObject({ kind: 'field', index: 3 });
  });

  test('buildDisplayColumns leaves non-adjacent ID and URL columns separate', () => {
    const fields = [
      { label: 'ID', componentType: 'TextInput' },
      { label: 'Name', componentType: 'TextInput' },
      { componentType: 'URL', label: 'Link' },
    ];
    const columns = buildDisplayColumns(fields);
    expect(columns).toHaveLength(3);
    expect(columns.every((col) => col.kind === 'field')).toBe(true);
  });

  test('buildDisplayColumns moves boolean columns to the front', () => {
    const fields = [
      { label: 'Name', componentType: 'TextInput', value: ['A'] },
      { label: 'Selected', componentType: 'Checkbox', value: [false], name: 'IsSelected' },
      { label: 'Status', componentType: 'TextInput', value: ['Open'] },
    ];
    const columns = buildDisplayColumns(fields);
    expect(columns).toHaveLength(3);
    expect(columns[0]).toMatchObject({
      kind: 'field',
      field: expect.objectContaining({ label: 'Selected' }),
    });
  });
});

describe('ExpandableTable boolean select-all', () => {
  test('isBooleanField detects checkbox columns and boolean values', () => {
    expect(isBooleanField({ componentType: 'Checkbox', value: [false, true] })).toBe(true);
    expect(isBooleanField({ componentType: 'TextInput', value: ['A', 'B'] })).toBe(false);
    expect(isBooleanField({ componentType: 'TextInput', value: [false, true] })).toBe(true);
    expect(isBooleanField({ componentType: 'TextInput', value: ['A', false] }, 1)).toBe(true);
    expect(isBooleanField({ componentType: 'TextInput', value: ['A', false] }, 0)).toBe(false);
  });

  test('getRelativePropName extracts a relative property from metadata', () => {
    expect(getRelativePropName({ propref: '@P .IsSelected' })).toBe('.IsSelected');
    expect(getRelativePropName({ propref: '@P .Orders[].IsSelected' })).toBe('.IsSelected');
    expect(getRelativePropName({ name: 'IsSelected' })).toBe('.IsSelected');
    expect(getRelativePropName({ value: [false] })).toBe('');
  });

  const collectUpdates = () => {
    const updates: Array<{ pageRef: string; field: string; value: boolean }> = [];
    (window as any).PCore = {
      createPConnect: (config: any) => ({
        getPConnect: () => ({
          getActionsApi: () => ({
            updateFieldValue: (field: string, value: boolean) => {
              updates.push({ pageRef: config.options.pageReference, field, value });
            },
          }),
        }),
      }),
    };
    return updates;
  };

  test('updateNestedBooleanFields updates nested page-list and page booleans only', () => {
    const updates = collectUpdates();
    const pageData = {
      IsSelected: false,
      Status: 'Open',
      LineItems: [
        { Product: 'A', IsSelected: false, IsRequired: true },
        { Product: 'B', IsSelected: false, Options: [{ Name: 'Red', IsSelected: false }] },
      ],
      Address: { City: 'NYC', IsPrimary: false },
    };

    updateNestedBooleanFields({
      pageRef: 'caseInfo.content.Orders[0]',
      pageData,
      checked: true,
      contextName: 'workarea',
      target: 'workarea',
    });

    expect(updates).toEqual([
      { pageRef: 'caseInfo.content.Orders[0].LineItems[0]', field: '.IsSelected', value: true },
      { pageRef: 'caseInfo.content.Orders[0].LineItems[0]', field: '.IsRequired', value: true },
      { pageRef: 'caseInfo.content.Orders[0].LineItems[1]', field: '.IsSelected', value: true },
      { pageRef: 'caseInfo.content.Orders[0].LineItems[1].Options[0]', field: '.IsSelected', value: true },
      { pageRef: 'caseInfo.content.Orders[0].Address', field: '.IsPrimary', value: true },
    ]);
  });

  test('applyBooleanSelectAll updates the row property and nested booleans', () => {
    const updates = collectUpdates();
    const storeData = {
      caseInfo: {
        content: {
          Orders: [
            {
              IsSelected: false,
              LineItems: [{ IsSelected: false }, { IsSelected: false }],
            },
          ],
        },
      },
    };

    applyBooleanSelectAll({
      rowPageRef: 'caseInfo.content.Orders[0]',
      field: { name: 'IsSelected' },
      checked: true,
      contextName: 'workarea',
      target: 'workarea',
      storeData,
    });

    expect(updates).toEqual([
      { pageRef: 'caseInfo.content.Orders[0]', field: '.IsSelected', value: true },
      { pageRef: 'caseInfo.content.Orders[0].LineItems[0]', field: '.IsSelected', value: true },
      { pageRef: 'caseInfo.content.Orders[0].LineItems[1]', field: '.IsSelected', value: true },
    ]);
  });

  test('applyBooleanSelectAll unselects nested booleans when unchecked', () => {
    const updates = collectUpdates();
    const storeData = {
      caseInfo: {
        content: {
          Orders: [
            {
              IsSelected: true,
              LineItems: [{ IsSelected: true }],
            },
          ],
        },
      },
    };

    applyBooleanSelectAll({
      rowPageRef: 'caseInfo.content.Orders[0]',
      field: { name: 'IsSelected' },
      checked: false,
      contextName: 'workarea',
      storeData,
    });

    expect(updates).toEqual([
      { pageRef: 'caseInfo.content.Orders[0]', field: '.IsSelected', value: false },
      { pageRef: 'caseInfo.content.Orders[0].LineItems[0]', field: '.IsSelected', value: false },
    ]);
  });

  test('syncBooleanFieldValuesFromStore updates boolean column snapshots from nested store data', () => {
    const result = syncBooleanFieldValuesFromStore({
      fields: [
        { componentType: 'TextInput', value: ['a', 'b'], name: 'Name' },
        { componentType: 'Checkbox', value: [false, false], name: 'IsSelected' },
      ],
      storeData: {
        caseInfo: {
          content: {
            Documents: [{ Files: [{ IsSelected: true }, { IsSelected: true }] }],
          },
        },
      },
      basePageRef: 'caseInfo.content.Documents[0]',
      embedDataRef: 'Files',
    });

    expect(result.changed).toBe(true);
    expect(result.fields[1].value).toEqual([true, true]);
    expect(result.fields[0].value).toEqual(['a', 'b']);
  });
});
