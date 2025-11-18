import { useState, useCallback } from 'react';
import { toggleSetValue } from '../utils';

/**
 * Custom hook for managing expanded state of config sections, products, and child specs
 */
export const useExpandedState = () => {
  const [expandedConfigSections, setExpandedConfigSections] = useState<Set<string>>(new Set());
  const [expandedProducts, setExpandedProducts] = useState<Set<string>>(new Set());
  const [expandedChildSpecs, setExpandedChildSpecs] = useState<Set<string>>(new Set());

  const toggleConfigExpanded = useCallback((itemId: string) => {
    setExpandedConfigSections((prev) => toggleSetValue(prev, itemId));
  }, []);

  const toggleProductExpanded = useCallback((productId: string) => {
    setExpandedProducts((prev) => toggleSetValue(prev, productId));
  }, []);

  const toggleChildSpecExpanded = useCallback((childSpecId: string) => {
    setExpandedChildSpecs((prev) => toggleSetValue(prev, childSpecId));
  }, []);

  const setExpandedConfigSectionsInitial = useCallback((ids: Set<string>) => {
    setExpandedConfigSections(ids);
  }, []);

  const setExpandedProductsInitial = useCallback((ids: Set<string>) => {
    setExpandedProducts(ids);
  }, []);

  return {
    expandedConfigSections,
    expandedProducts,
    expandedChildSpecs,
    toggleConfigExpanded,
    toggleProductExpanded,
    toggleChildSpecExpanded,
    setExpandedConfigSectionsInitial,
    setExpandedProductsInitial,
  };
};
