import { useState, useEffect, useRef } from 'react';
import type { CustomTreeNode } from '../CustomTree.types';
import {
  findRootTree,
  findSiteNode,
} from '../utils';

/**
 * Custom hook for loading and managing CPQ tree data
 */
export const useCPQTreeData = (
  dataPage: string,
  getPConnect: any,
  loadTree: (
    item: any,
    cases: Array<CustomTreeNode>,
    caseInstanceKey: string,
    visitedItems?: WeakSet<object>,
    depth?: number,
  ) => void,
  childrenPropertyName: string | RegExp,
  idPropertyName: string,
  onDataLoaded: (nodes: CustomTreeNode[]) => void,
) => {
  const [objects, setObjects] = useState<CustomTreeNode[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const onDataLoadedRef = useRef(onDataLoaded);
  const lastDataPageRef = useRef<string>('');

  // Update ref when callback changes
  useEffect(() => {
    onDataLoadedRef.current = onDataLoaded;
  }, [onDataLoaded]);

  useEffect(() => {
    // Reset loading state when dataPage changes
    if (lastDataPageRef.current !== dataPage) {
      setLoading(true);
      setObjects([]);
      lastDataPageRef.current = dataPage;
    }
    const caseInstanceKey = getPConnect().getValue(
      (window as any).PCore.getConstants().CASE_INFO.CASE_INFO_ID,
    );

    const loadObjects = (response: any) => {
      const cases: Array<CustomTreeNode> = [];

      // Find root tree using utility function
      const rootTree = findRootTree(response, childrenPropertyName);
      if (rootTree && Array.isArray(rootTree)) {
        // Find the site node (e.g., "Site independent products")
        const siteNode = findSiteNode(rootTree);
        if (siteNode && siteNode.Tree && Array.isArray(siteNode.Tree)) {
          // Process products from the site's Tree array
          siteNode.Tree.forEach((item: any) => {
            if (item.Type === 'product') {
              loadTree(item, cases, caseInstanceKey, new WeakSet(), 0);
            }
          });
        } else {
          // Fallback: process all items in rootTree
          rootTree.forEach((item: any) => {
            loadTree(item, cases, caseInstanceKey, new WeakSet(), 0);
          });
        }
      } else {
        // Response is a single root node, process it directly
        loadTree(response, cases, caseInstanceKey, new WeakSet(), 0);
      }

      setObjects(cases);

      // Call the callback with loaded data using ref to avoid dependency issues
      onDataLoadedRef.current(cases);

      // Set loading to false after data is loaded
      setLoading(false);
    };

    const context = getPConnect().getContextName();
    (window as any).PCore.getDataPageUtils()
      .getPageDataAsync(dataPage, context, { caseInstanceKey }, { invalidateCache: true })
      .then((response: any) => {
        if (response !== null) {
          loadObjects(response);
        } else {
          setLoading(false);
        }
      })
      .catch(() => {
        setLoading(false);
      });
  }, [dataPage, getPConnect, loadTree, childrenPropertyName, idPropertyName]);

  return {
    objects,
    loading,
  };
};
