import styled, { css } from 'styled-components';
import { Card, Flex, Icon } from '@pega/cosmos-react-core';
import { STYLE_CONSTANTS, TREE_CONSTANTS } from './constants';

// ============================================
// Shared Styles & Mixins
// ============================================

const rowBaseStyles = css<{ $paddingLeft?: string; $isDisabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: ${({ $paddingLeft }) => $paddingLeft || '0'};
  padding-right: 1rem;
  padding-top: ${STYLE_CONSTANTS.PADDING_VERTICAL};
  padding-bottom: ${STYLE_CONSTANTS.PADDING_VERTICAL};
  border-bottom: 0.0625rem solid ${STYLE_CONSTANTS.BORDER_COLOR_LIGHT};
  opacity: ${({ $isDisabled }) => ($isDisabled ? 0.5 : 1)};
`;

const expandIconStyles = css<{ $isExpanded?: boolean; $isDisabled?: boolean }>`
  cursor: ${({ $isDisabled }) => ($isDisabled ? 'not-allowed' : 'pointer')};
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
  flex-shrink: 0;
  transform: ${({ $isExpanded }) => ($isExpanded ? 'rotate(90deg)' : 'rotate(0deg)')};
  transition: transform 0.2s ease;
  opacity: ${({ $isDisabled }) => ($isDisabled ? 0.5 : 1)};
`;

const labelTextStyles = css`
  flex: 1 1 auto;
  font-weight: 500;
  min-width: 0;
  overflow: visible;
  white-space: nowrap;
`;

const fieldContainerStyles = css`
  flex: 0 0 auto;
  margin-left: 1rem;
  max-width: ${TREE_CONSTANTS.FIELD_MAX_WIDTH};
`;

// ============================================
// Index/Main Component Styles
// ============================================
 export const StyledCard = styled(Card)`
  padding: 1rem;
  overflow-x: auto;
  min-width: 0;
  max-width: 75rem;
`;

// ============================================
// ProductRow Styles
// ============================================

export const ProductContainer = styled.div`
  border-bottom: 0.0625rem solid ${STYLE_CONSTANTS.BORDER_COLOR_MEDIUM};
`;

export const ProductHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem 0;
  padding-left: 0;
`;

export const ProductExpandIcon = styled(Icon)<{ $isExpanded?: boolean }>`
  cursor: pointer;
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
  flex-shrink: 0;
  transform: ${({ $isExpanded }) => ($isExpanded ? 'rotate(90deg)' : 'rotate(0deg)')};
  transition: transform 0.2s ease;
`;

export const ProductInfoContainer = styled(Flex)`
  flex: 1;
`;

export const ConfigSectionHeader = styled.div<{
  $paddingLeft?: string;
  $showBorder?: boolean;
}>`
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  padding-left: ${({ $paddingLeft }) => $paddingLeft || '0'};
  border-bottom: ${({ $showBorder }) =>
    $showBorder ? `0.0625rem solid ${STYLE_CONSTANTS.BORDER_COLOR_MEDIUM}` : 'none'};
`;

export const ConfigExpandIcon = styled(Icon)<{ $isExpanded?: boolean }>`
  cursor: pointer;
  width: 1rem;
  height: 1rem;
  transform: ${({ $isExpanded }) => ($isExpanded ? 'rotate(90deg)' : 'rotate(0deg)')};
  transition: transform 0.2s ease;
`;

export const MainSpecRow = styled.div<{ $paddingLeft?: string }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: ${({ $paddingLeft }) => $paddingLeft || '0'};
  padding-right: 1rem;
  padding-top: ${STYLE_CONSTANTS.PADDING_VERTICAL};
  padding-bottom: ${STYLE_CONSTANTS.PADDING_VERTICAL};
  border-bottom: 0.0625rem solid ${STYLE_CONSTANTS.BORDER_COLOR_LIGHT};
`;

export const SpecNameLabel = styled.div`
  ${labelTextStyles}
`;

export const FieldContainer = styled.div`
  ${fieldContainerStyles}
`;

// ============================================
// ChildSpecRow Styles
// ============================================

export const ChildSpecRowContainer = styled.div<{ $paddingLeft?: string; $isDisabled?: boolean }>`
  ${rowBaseStyles}
`;

export const ChildSpecContent = styled.div`
  display: flex;
  align-items: center;
  flex: 1 1 auto;
  min-width: 0;
`;

export const ChildSpecExpandIcon = styled(Icon)<{ $isExpanded?: boolean; $isDisabled?: boolean }>`
  ${expandIconStyles}
`;

export const IconSpacer = styled.div`
  width: 1.5rem;
`;

export const ChildSpecLabel = styled.div<{ $isClickable?: boolean }>`
  ${labelTextStyles}
  cursor: ${({ $isClickable }) => ($isClickable ? 'pointer' : 'default')};
  ${({ $isClickable }) =>
    $isClickable &&
    `
    &:hover {
      text-decoration: underline;
    }
  `}
`;

// ============================================
// ConfigFieldRow Styles
// ============================================

export const ConfigFieldRowContainer = styled.div<{ $paddingLeft?: string; $isDisabled?: boolean }>`
  ${rowBaseStyles}
`;

export const ConfigFieldLabelContainer = styled(Flex)`
  flex: 1 1 auto;
  font-weight: 500;
  min-width: 0;
  overflow: visible;
  white-space: nowrap;
`;

export const RequiredIndicator = styled.span`
  color: var(--app-color-error, #d32f2f);
`;

export const ConfigSectionTitle = styled.span`
  font-weight: 500;
`;

// ============================================
// FieldComponent Styles
// ============================================

export const FieldWrapper = styled(Flex)`
  width: 100%;
`;

export const StyledInput = styled.div`
  flex: 1;

  & > * {
    flex: 1;
  }
`;

export const InfoIcon = styled(Icon)`
  cursor: help;
  flex-shrink: 0;
`;

export const PopoverCard = styled(Card)`
  min-width: 20rem;
  max-width: 30rem;
`;

export const StyledTextArea = styled.div`
  width: 100%;

  & > * {
    width: 100%;
  }
`;

export const StyledSelect = styled.select<{ $isDisabled?: boolean }>`
  width: 100%;
  padding: 0.5rem;
  border: 0.0625rem solid #cccccc;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  background-color: ${({ $isDisabled }) =>
    $isDisabled ? 'var(--app-bg-disabled, #f5f5f5)' : 'var(--app-bg-surface, #fff)'};
  cursor: ${({ $isDisabled }) => ($isDisabled ? 'not-allowed' : 'pointer')};
`;

// ============================================
// Master/Details Layout Styles
// ============================================

export const MasterDetailsLayout = styled(Flex)`
  gap: 2rem;
  min-width: min-content;
`;

export const ProductsListContainer = styled.div`
  flex: 1;
  min-width: 0;
`;

export const DetailsPanelContainer = styled.div<{ $isVisible?: boolean }>`
  flex: 0 0 31.25rem;
  min-width: 31.25rem;
  border-left: 0.0625rem solid #cccccc;
  padding-left: 1rem;
  position: relative;
  visibility: ${({ $isVisible }) => ($isVisible ? 'visible' : 'hidden')};
`;

export const DetailsCloseButtonContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`;
