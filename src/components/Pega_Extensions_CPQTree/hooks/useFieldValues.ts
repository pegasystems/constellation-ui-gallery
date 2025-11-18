import { useState, useCallback } from 'react';
import type { CustomTreeNode } from '../CustomTree.types';
import {
  extractProductId,
  extractQuantity,
  extractConfiguredFieldValue,
  generateConfigNodeId,
  generateConfigFieldId,
  generateChildSpecId,
  getMainChildSpec,
} from '../utils';

/**
 * Custom hook for managing field values for controlled inputs
 */
export const useFieldValues = (idPropertyName: string) => {
  const [fieldValues, setFieldValues] = useState<Map<string, string>>(new Map());

  /**
   * Initialize field values from loaded tree data
   */
  const initializeFieldValues = useCallback((nodes: CustomTreeNode[]) => {
    const initialFieldValues = new Map<string, string>();

    const processNodes = (nodeList: CustomTreeNode[]) => {
      nodeList.forEach((node) => {
        if (node.itemData && node.itemData.Type === 'product') {
          const productId = extractProductId(node.itemData, idPropertyName, node.id);
          const productOffer = node.itemData.ProductOffer || {};
          const mainChildSpec = getMainChildSpec(productOffer);
          const configSectionId = generateConfigNodeId(productId);

          if (mainChildSpec) {
            // Initialize main spec quantity
            const mainSpecQuantity = extractQuantity(mainChildSpec);
            const mainSpecId = `${configSectionId}-main-spec`;
            initialFieldValues.set(mainSpecId, mainSpecQuantity);

            // Initialize configuration field values
            const configuration = mainChildSpec.Configuration || [];
            configuration.forEach((configItem: any, index: number) => {
              const fieldId = generateConfigFieldId(configSectionId, index);
              const configuredValue = extractConfiguredFieldValue(configItem);
              initialFieldValues.set(fieldId, configuredValue);
            });

            // Initialize child spec quantities
            const childSpecifications = mainChildSpec.ChildSpecificationsList || [];
            childSpecifications.forEach((childSpec: any, index: number) => {
              const specId = generateChildSpecId(configSectionId, index);
              const quantity = extractQuantity(childSpec);
              initialFieldValues.set(specId, quantity);

              // Initialize nested configuration fields in child specs
              const childSpecConfig = childSpec.Configuration || [];
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
    setFieldValues(initialFieldValues);
  }, [idPropertyName]);

  /**
   * Update a single field value
   */
  const updateFieldValue = useCallback((fieldId: string, newValue: string) => {
    setFieldValues((prev) => {
      const updated = new Map(prev);
      updated.set(fieldId, newValue);
      return updated;
    });
  }, []);

  return {
    fieldValues,
    initializeFieldValues,
    updateFieldValue,
  };
};
