import {
  buildReferenceList,
  buildRowPageReference,
  extractPageRefFromConfig,
  getNestedStoreValue,
  getPageListRegistration,
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
