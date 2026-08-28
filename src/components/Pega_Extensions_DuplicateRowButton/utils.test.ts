import {
  cloneRowContent,
  duplicateEmbeddedRow,
  getNestedStoreValue,
  normalizePageReference,
  parseEmbeddedRowContext,
} from './utils';

describe('DuplicateRowButton path utilities', () => {
  test('normalizePageReference handles relative and content aliases', () => {
    expect(normalizePageReference('content')).toBe('caseInfo.content');
    expect(normalizePageReference('.Orders[0].LineItems[1]')).toBe('caseInfo.content.Orders[0].LineItems[1]');
    expect(normalizePageReference('caseInfo.content.Orders[0]')).toBe('caseInfo.content.Orders[0]');
  });

  test('parseEmbeddedRowContext supports top-level and nested lists', () => {
    expect(parseEmbeddedRowContext('caseInfo.content.computers[2]')).toEqual({
      rowPageRef: 'caseInfo.content.computers[2]',
      parentPageRef: 'caseInfo.content',
      listProperty: 'computers',
      rowIndex: 2,
      referenceList: '.computers',
    });

    expect(parseEmbeddedRowContext('caseInfo.content.Orders[1].LineItems[0]')).toEqual({
      rowPageRef: 'caseInfo.content.Orders[1].LineItems[0]',
      parentPageRef: 'caseInfo.content.Orders[1]',
      listProperty: 'LineItems',
      rowIndex: 0,
      referenceList: '.LineItems',
    });
  });

  test('parseEmbeddedRowContext returns null for non-row references', () => {
    expect(parseEmbeddedRowContext('caseInfo.content')).toBeNull();
    expect(parseEmbeddedRowContext('')).toBeNull();
  });

  test('getNestedStoreValue reads deeply nested row data', () => {
    const storeData = {
      caseInfo: {
        content: {
          Orders: [{ LineItems: [{ pxObjClass: 'Data-LineItem', ProductName: 'Keyboard' }] }],
        },
      },
    };
    expect(getNestedStoreValue(storeData, 'caseInfo.content.Orders[0].LineItems[0]')).toEqual({
      pxObjClass: 'Data-LineItem',
      ProductName: 'Keyboard',
    });
  });
});

describe('cloneRowContent', () => {
  test('strips instance keys and deep-clones nested page lists', () => {
    const source = {
      classID: 'Data-LineItem',
      ProductName: 'Keyboard',
      pzInsKey: 'LINE-1',
      pyID: 'L-1',
      pxUpdateDateTime: '2026-01-01',
      Components: [
        { classID: 'Data-Component', Name: 'Switch', pzInsKey: 'COMP-1' },
        { classID: 'Data-Component', Name: 'Case', pzInsKey: 'COMP-2' },
      ],
    };

    const cloned = cloneRowContent(source);

    expect(cloned).toEqual({
      classID: 'Data-LineItem',
      ProductName: 'Keyboard',
      Components: [
        { classID: 'Data-Component', Name: 'Switch' },
        { classID: 'Data-Component', Name: 'Case' },
      ],
    });
    expect(cloned).not.toBe(source);
    expect((cloned.Components as unknown[])[0]).not.toBe(source.Components[0]);
  });
});

describe('duplicateEmbeddedRow', () => {
  const storeData = {
    caseInfo: {
      content: {
        Orders: [
          {
            LineItems: [
              {
                classID: 'Data-LineItem',
                ProductName: 'Keyboard',
                Quantity: 2,
                pzInsKey: 'LINE-1',
                Components: [{ classID: 'Data-Component', Name: 'Switch', pzInsKey: 'COMP-1' }],
              },
              {
                classID: 'Data-LineItem',
                ProductName: 'Monitor',
                Quantity: 1,
                pzInsKey: 'LINE-2',
              },
            ],
          },
        ],
      },
    },
  };

  test('inserts cloned row at the bottom of the parent page list', () => {
    const insertSpy = jest.fn();
    (window as any).PCore = {
      getStore: () => ({
        getState: () => ({
          data: {
            workarea: storeData,
          },
        }),
      }),
      createPConnect: () => ({
        getPConnect: () => ({
          getListActions: () => ({
            insert: insertSpy,
          }),
        }),
      }),
    };

    const getPConnect = () => ({
      getContextName: () => 'workarea',
      getPageReference: () => 'caseInfo.content.Orders[0].LineItems[0]',
      getTarget: () => 'workarea',
      options: {
        pageReference: 'caseInfo.content.Orders[0].LineItems[0]',
        viewName: 'LineItemRow',
      },
    });

    const result = duplicateEmbeddedRow(getPConnect, { label: 'Duplicate row' });

    expect(result).toBe(true);
    expect(insertSpy).toHaveBeenCalledWith(
      {
        classID: 'Data-LineItem',
        ProductName: 'Keyboard',
        Quantity: 2,
        Components: [{ classID: 'Data-Component', Name: 'Switch' }],
      },
      2,
    );
  });

  test('returns false when pageReference is not a row context', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const getPConnect = () => ({
      getContextName: () => 'workarea',
      getPageReference: () => 'caseInfo.content',
      options: {},
    });

    expect(duplicateEmbeddedRow(getPConnect, {})).toBe(false);
    warnSpy.mockRestore();
  });
});
