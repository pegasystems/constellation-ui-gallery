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
  extractProductOffer,
} from '../utils';
import { PROPERTY_NAMES, NODE_TYPES } from '../constants';

/**
 * Custom hook for managing field values for controlled inputs
 */
export const useFieldValues = (idPropertyName: string) => {
  const [fieldValues, setFieldValues] = useState<Map<string, string>>(new Map());

  /**
   * Initialize field values from loaded tree data
   */
  const initializeFieldValues = useCallback(
    (nodes: CustomTreeNode[]) => {
      const initialFieldValues = new Map<string, string>();

      const processNodes = (nodeList: CustomTreeNode[]) => {
        nodeList.forEach((node) => {
          if (node.itemData && node.itemData[PROPERTY_NAMES.TYPE] === NODE_TYPES.PRODUCT) {
            const productId = extractProductId(node.itemData, idPropertyName, node.id);
            // Extract ProductOffer from various structures (direct ProductOffer or Tree.ChildSpecification)
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
      setFieldValues(initialFieldValues);
    },
    [idPropertyName],
  );

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
