import { useState, useEffect, useRef, useCallback } from 'react';
import type { CustomTreeNode } from '../CustomTree.types';
import {
  findRootTree,
  findSiteNode,
  clearRegisteredPageListPaths,
  extractProductId,
  extractQuantity,
  extractConfiguredFieldValue,
  generateConfigNodeId,
  generateConfigFieldId,
  generateChildSpecId,
  getMainChildSpec,
  extractProductOffer,
} from '../utils';
import { PROPERTY_NAMES, NODE_TYPES } from '../constants';

/**
 * Configuration for data initialization
 */
interface DataInitConfig {
  idPropertyName: string;
  initializeFieldValues: (nodes: CustomTreeNode[]) => void;
  setExpandedConfigSectionsInitial: (ids: Set<string>) => void;
  setExpandedProductsInitial: (ids: Set<string>) => void;
}

/**
 * Custom hook for loading and managing CPQ tree data
 *
 * @param dataPage - The data page to load
 * @param getPConnect - PConnect getter function
 * @param loadTree - Function to build tree nodes from data
 * @param childrenPropertyName - Property name for children
 * @param initConfig - Configuration for data initialization (optional)
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
    parentPath?: string,
    treeIndex?: number,
  ) => void,
  childrenPropertyName: string | RegExp,
  initConfig?: DataInitConfig,
) => {
  const [objects, setObjects] = useState<CustomTreeNode[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const lastDataPageRef = useRef<string>('');
  const dataInitializedRef = useRef(false);
  const loadTreeRef = useRef(loadTree);
  const childrenPropertyNameRef = useRef(childrenPropertyName);
  const getPConnectRef = useRef(getPConnect);
  const abortControllerRef = useRef<AbortController | null>(null);
  const loadingDataPageRef = useRef<string | null>(null);
  const requestIdRef = useRef<number>(0);

  // Keep refs up to date
  useEffect(() => {
    loadTreeRef.current = loadTree;
    childrenPropertyNameRef.current = childrenPropertyName;
    getPConnectRef.current = getPConnect;
  }, [loadTree, childrenPropertyName, getPConnect]);

  /**
   * Initialize field values and expanded states from loaded nodes
   */
  const initializeFromNodes = useCallback(
    (nodes: CustomTreeNode[]) => {
      if (!initConfig || dataInitializedRef.current) return;

      dataInitializedRef.current = true;

      const { idPropertyName, initializeFieldValues, setExpandedConfigSectionsInitial, setExpandedProductsInitial } =
        initConfig;

      // Initialize field values
      initializeFieldValues(nodes);

      // Expand all configuration sections and products by default
      const configSectionIds = new Set<string>();
      const productIds = new Set<string>();

      nodes.forEach((node) => {
        if (node.itemData && node.itemData[PROPERTY_NAMES.TYPE] === NODE_TYPES.PRODUCT) {
          const productId = extractProductId(node.itemData, idPropertyName, node.id);
          if (productId) {
            configSectionIds.add(generateConfigNodeId(productId));
            productIds.add(productId);
          }
        }
      });

      setExpandedConfigSectionsInitial(configSectionIds);
      setExpandedProductsInitial(productIds);
    },
    [initConfig],
  );

  // Reset initialization when dataPage changes
  useEffect(() => {
    if (lastDataPageRef.current !== dataPage && lastDataPageRef.current !== '') {
      dataInitializedRef.current = false;
      if (initConfig) {
        initConfig.setExpandedConfigSectionsInitial(new Set());
        initConfig.setExpandedProductsInitial(new Set());
        initConfig.initializeFieldValues([]);
      }
    }
  }, [dataPage, initConfig]);

  useEffect(() => {
    // Only load data if dataPage has actually changed and we're not already loading it
    if (lastDataPageRef.current === dataPage || loadingDataPageRef.current === dataPage) {
      return;
    }

    // Cancel any in-flight request for a different dataPage
    if (abortControllerRef.current && loadingDataPageRef.current !== dataPage) {
      abortControllerRef.current.abort();
    }

    // Generate unique request ID for this request
    const currentRequestId = ++requestIdRef.current;

    // Reset loading state when dataPage changes
    setLoading(true);
    setObjects([]);
    // Track that we're loading this dataPage
    loadingDataPageRef.current = dataPage;
    // Clear registered page list paths when dataPage changes to allow re-registration
    clearRegisteredPageListPaths();

    const caseInstanceKey = getPConnect().getValue((window as any).PCore.getConstants().CASE_INFO.CASE_INFO_ID);

    const loadObjects = (response: any) => {
      // Check if this is still the current request
      if (currentRequestId !== requestIdRef.current || loadingDataPageRef.current !== dataPage) {
        return;
      }

      const cases: Array<CustomTreeNode> = [];
      const currentLoadTree = loadTreeRef.current;
      const currentChildrenPropertyName = childrenPropertyNameRef.current;

      // Find root tree using utility function
      const rootTree = findRootTree(response, currentChildrenPropertyName);
      if (rootTree && Array.isArray(rootTree)) {
        // Find the site node (e.g., "Site independent products")
        const siteNode = findSiteNode(rootTree);
        if (siteNode && siteNode[PROPERTY_NAMES.TREE] && Array.isArray(siteNode[PROPERTY_NAMES.TREE])) {
          // Find the index of the site node in the rootTree array
          const siteNodeIndex = rootTree.findIndex((node: any) => node === siteNode);
          // Build the parent path for products in the site node's Tree.
          // For plain Tree responses this is "Tree[index]".
          // For TreeGroup responses this is "TreeGroup[siteIndex]".
          const siteNodePath =
            siteNodeIndex >= 0
              ? response?.TreeGroup
                ? `TreeGroup[${siteNodeIndex}]`
                : `Tree[${siteNodeIndex}]`
              : response?.TreeGroup
                ? 'TreeGroup[0]'
                : 'Tree[0]';

          // Process products from site node's Tree
          // Pagelists will be registered automatically when addViewNodeForPropertyPath is called
          // for editable properties during tree building
          siteNode[PROPERTY_NAMES.TREE].forEach((item: any, index: number) => {
            if (item[PROPERTY_NAMES.TYPE] === NODE_TYPES.PRODUCT) {
              const treeIndex = item[PROPERTY_NAMES.INDEX] ? parseInt(item[PROPERTY_NAMES.INDEX], 10) - 1 : index;
              // Register Tree pagelists as we traverse - the loadTree function will build paths
              // and we'll register them as they're used
              currentLoadTree(item, cases, caseInstanceKey, new WeakSet(), 0, siteNodePath, treeIndex);
            }
          });
        } else {
          // Fallback: process all items in rootTree
          // Pagelists will be registered automatically when addViewNodeForPropertyPath is called
          rootTree.forEach((item: any, index: number) => {
            const treeIndex = item[PROPERTY_NAMES.INDEX] ? parseInt(item[PROPERTY_NAMES.INDEX], 10) - 1 : index;
            currentLoadTree(item, cases, caseInstanceKey, new WeakSet(), 0, '', treeIndex);
          });
        }
      } else {
        // Response is a single root node
        currentLoadTree(response, cases, caseInstanceKey, new WeakSet(), 0, '', 0);
      }

      setObjects(cases);

      // Initialize data from loaded nodes (only on initial load, not on reload)
      if (!dataInitializedRef.current) {
        initializeFromNodes(cases);
      }

      // Mark this dataPage as successfully loaded
      lastDataPageRef.current = dataPage;
      loadingDataPageRef.current = null;

      // Set loading to false after data is loaded
      setLoading(false);
    };

    // Create new AbortController for this request
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    console.log('loadObjects', dataPage);
    (window as any).PCore.getDataApiUtils()
      .getData(dataPage, { dataViewParameters: { caseInstanceKey } })
      .then((response: any) => {
        // Check if this is still the current request
        if (
          abortController.signal.aborted ||
          currentRequestId !== requestIdRef.current ||
          loadingDataPageRef.current !== dataPage
        ) {
          return;
        }
        if (response !== null) {
          loadObjects(response.data.data[0]);
        } else {
          lastDataPageRef.current = dataPage;
          loadingDataPageRef.current = null;
          setLoading(false);
        }
      })
      .catch(() => {
        // Don't update state if request was aborted or this is no longer the current request
        if (
          abortController.signal.aborted ||
          currentRequestId !== requestIdRef.current ||
          loadingDataPageRef.current !== dataPage
        ) {
          return;
        }
        lastDataPageRef.current = dataPage;
        loadingDataPageRef.current = null;
        setLoading(false);
      });

    // Cleanup function to abort request if effect re-runs with different dataPage or component unmounts
    return () => {
      // Only abort if a new request has started (requestId increased) or if this is no longer the current request
      // This prevents aborting when React StrictMode re-runs the effect with the same dataPage
      if (currentRequestId !== requestIdRef.current) {
        // A new request has started, so abort this one
        abortController.abort();
        if (loadingDataPageRef.current === dataPage) {
          loadingDataPageRef.current = null;
        }
        if (abortControllerRef.current === abortController) {
          abortControllerRef.current = null;
        }
      }
    };
  }, [dataPage, getPConnect, loadTree, childrenPropertyName, initializeFromNodes]);

  /**
   * Reload tree with updated data from save operation
   * If updatedData is provided, uses it directly; otherwise fetches from data page
   * This is the least intrusive way to reload the tree after business rules apply
   */
  const reloadTree = useCallback(
    async (updatedData?: any) => {
      if (updatedData !== null && updatedData !== undefined) {
        // Use the provided updated data directly
        const caseInstanceKey = getPConnectRef
          .current()
          .getValue((window as any).PCore.getConstants().CASE_INFO.CASE_INFO_ID);
        const cases: Array<CustomTreeNode> = [];
        const currentLoadTree = loadTreeRef.current;
        const currentChildrenPropertyName = childrenPropertyNameRef.current;

        // Find root tree using utility function
        const rootTree = findRootTree(updatedData, currentChildrenPropertyName);
        if (rootTree && Array.isArray(rootTree)) {
          const siteNode = findSiteNode(rootTree);
          if (siteNode && siteNode[PROPERTY_NAMES.TREE] && Array.isArray(siteNode[PROPERTY_NAMES.TREE])) {
            const siteNodeIndex = rootTree.findIndex((node: any) => node === siteNode);
            const siteNodePath =
              siteNodeIndex >= 0
                ? updatedData?.TreeGroup
                  ? `TreeGroup[${siteNodeIndex}]`
                  : `Tree[${siteNodeIndex}]`
                : updatedData?.TreeGroup
                  ? 'TreeGroup[0]'
                  : 'Tree[0]';

            // Pagelists will be registered automatically when addViewNodeForPropertyPath is called
            siteNode[PROPERTY_NAMES.TREE].forEach((item: any, index: number) => {
              if (item[PROPERTY_NAMES.TYPE] === NODE_TYPES.PRODUCT) {
                const treeIndex = item[PROPERTY_NAMES.INDEX] ? parseInt(item[PROPERTY_NAMES.INDEX], 10) - 1 : index;
                currentLoadTree(item, cases, caseInstanceKey, new WeakSet(), 0, siteNodePath, treeIndex);
              }
            });
          } else {
            // Pagelists will be registered automatically when addViewNodeForPropertyPath is called
            rootTree.forEach((item: any, index: number) => {
              const treeIndex = item[PROPERTY_NAMES.INDEX] ? parseInt(item[PROPERTY_NAMES.INDEX], 10) - 1 : index;
              currentLoadTree(item, cases, caseInstanceKey, new WeakSet(), 0, '', treeIndex);
            });
          }
        } else {
          currentLoadTree(updatedData, cases, caseInstanceKey, new WeakSet(), 0, '', 0);
        }

        setObjects(cases);
      } else {
        console.log('reloadTree', dataPage);
        // Fallback: reload from data page if no data provided
        const caseInstanceKey = getPConnectRef
          .current()
          .getValue((window as any).PCore.getConstants().CASE_INFO.CASE_INFO_ID);
        try {
          const response = await (window as any).PCore.getDataApiUtils().getData(dataPage, {
            dataViewParameters: { caseInstanceKey },
          });
          if (response.data.data[0] !== null) {
            const cases: Array<CustomTreeNode> = [];
            const currentLoadTree = loadTreeRef.current;
            const currentChildrenPropertyName = childrenPropertyNameRef.current;

            const rootData = response.data.data[0];

            const rootTree = findRootTree(rootData, currentChildrenPropertyName);
            if (rootTree && Array.isArray(rootTree)) {
              const siteNode = findSiteNode(rootTree);
              if (siteNode && siteNode[PROPERTY_NAMES.TREE] && Array.isArray(siteNode[PROPERTY_NAMES.TREE])) {
                const siteNodeIndex = rootTree.findIndex((node: any) => node === siteNode);
                const siteNodePath =
                  siteNodeIndex >= 0
                    ? rootData?.TreeGroup
                      ? `TreeGroup[${siteNodeIndex}]`
                      : `Tree[${siteNodeIndex}]`
                    : rootData?.TreeGroup
                      ? 'TreeGroup[0]'
                      : 'Tree[0]';

                // Pagelists will be registered automatically when addViewNodeForPropertyPath is called
                siteNode[PROPERTY_NAMES.TREE].forEach((item: any, index: number) => {
                  if (item[PROPERTY_NAMES.TYPE] === NODE_TYPES.PRODUCT) {
                    const treeIndex = item[PROPERTY_NAMES.INDEX] ? parseInt(item[PROPERTY_NAMES.INDEX], 10) - 1 : index;
                    currentLoadTree(item, cases, caseInstanceKey, new WeakSet(), 0, siteNodePath, treeIndex);
                  }
                });
              } else {
                // Pagelists will be registered automatically when addViewNodeForPropertyPath is called
                rootTree.forEach((item: any, index: number) => {
                  const treeIndex = item[PROPERTY_NAMES.INDEX] ? parseInt(item[PROPERTY_NAMES.INDEX], 10) - 1 : index;
                  currentLoadTree(item, cases, caseInstanceKey, new WeakSet(), 0, '', treeIndex);
                });
              }
            } else {
              currentLoadTree(rootData, cases, caseInstanceKey, new WeakSet(), 0, '', 0);
            }

            setObjects(cases);
          }
        } catch (error) {
          console.warn('Failed to reload tree data:', error);
        }
      }
    },
    [dataPage],
  );

  return {
    objects,
    loading,
    reloadTree,
  };
};

/**
 * Helper function to initialize field values from tree nodes
 * Can be used with useFieldValues hook
 */
export const initializeFieldValuesFromNodes = (
  nodes: CustomTreeNode[],
  idPropertyName: string,
): Map<string, string> => {
  const initialFieldValues = new Map<string, string>();

  const processNodes = (nodeList: CustomTreeNode[]) => {
    nodeList.forEach((node) => {
      if (node.itemData && node.itemData[PROPERTY_NAMES.TYPE] === NODE_TYPES.PRODUCT) {
        const productId = extractProductId(node.itemData, idPropertyName, node.id);
        // Extract ProductOffer from various structures
        const extractedProductOffer = extractProductOffer(node.itemData);
        const productOffer = extractedProductOffer || node.itemData[PROPERTY_NAMES.PRODUCT_OFFER] || {};
        const mainChildSpec = getMainChildSpec(productOffer);
        const configSectionId = generateConfigNodeId(productId);

        if (mainChildSpec) {
          // Initialize main spec quantity
          const mainSpecQuantity = extractQuantity(mainChildSpec);
          const mainSpecId = `${configSectionId}-main-spec`;
          initialFieldValues.set(mainSpecId, mainSpecQuantity);

          // Initialize configuration field values
          const configuration = mainChildSpec[PROPERTY_NAMES.CONFIGURATION] || [];
          configuration.forEach((configItem: any, index: number) => {
            const fieldId = generateConfigFieldId(configSectionId, index);
            const configuredValue = extractConfiguredFieldValue(configItem);
            initialFieldValues.set(fieldId, configuredValue);
          });

          // Initialize child spec quantities
          const childSpecifications = mainChildSpec[PROPERTY_NAMES.CHILD_SPECIFICATIONS_LIST] || [];
          childSpecifications.forEach((childSpec: any, index: number) => {
            const specId = generateChildSpecId(configSectionId, index);
            const quantity = extractQuantity(childSpec);
            initialFieldValues.set(specId, quantity);

            // Initialize nested configuration fields in child specs
            const childSpecConfig = childSpec[PROPERTY_NAMES.CONFIGURATION] || [];
            childSpecConfig.forEach((configItem: any, configIndex: number) => {
              const nestedFieldId = `${specId}-field-${configIndex}`;
              const configuredValue = extractConfiguredFieldValue(configItem);
              initialFieldValues.set(nestedFieldId, configuredValue);
            });
          });
        }
      }
      if (node.nodes) {
        processNodes(node.nodes);
      }
    });
  };

  processNodes(nodes);
  return initialFieldValues;
};
