import styled, { css } from 'styled-components';
import { defaultThemeProp } from '@pega/cosmos-react-core';

const StyledJsonEditorWrapper = styled.div(() => {
  return css`
    width: 100%;

    textarea {
      min-height: 15rem;
      resize: vertical;
      white-space: pre;
    }
  `;
});

export const StyledJsonEditorSurface = styled.div(({ theme }) => {
  return css`
    position: relative;
    width: 100%;

    textarea {
      position: relative;
      z-index: 2;
      color: transparent;
      background-color: transparent;
      caret-color: ${theme.base.palette.interactive};
      font-family: monospace;
      line-height: 1.5;
      padding-inline-start: calc(${theme.base.spacing} * 4);

      &::placeholder {
        color: ${theme.base.palette['foreground-color']};
        opacity: ${theme.base.transparency['transparent-3']};
      }
    }
  `;
});

StyledJsonEditorSurface.defaultProps = defaultThemeProp;

export const StyledJsonEditorHighlight = styled.div<{ $labelHidden: boolean }>(({ theme, $labelHidden }) => {
  return css`
    position: absolute;
    z-index: 1;
    inset-inline: 0;
    inset-block-end: 0;
    inset-block-start: ${$labelHidden ? '0' : `calc(${theme.base.spacing} * 3)`};
    overflow: hidden;
    pointer-events: none;
    color: ${theme.base.palette['foreground-color']};
    font-family: monospace;
    line-height: 1.5;
    white-space: pre;

    .json-string {
      color: ${theme.base.palette.pending};
    }

    .json-number {
      color: ${theme.base.palette.success};
    }

    .json-literal {
      color: ${theme.base.palette.warn};
    }

    .json-punctuation {
      color: ${theme.base.palette.info};
    }
  `;
});

StyledJsonEditorHighlight.defaultProps = defaultThemeProp;

export const StyledJsonEditorLineNumbers = styled.div<{ $scrollTop: number }>(({ theme, $scrollTop }) => {
  return css`
    position: absolute;
    inset-block-start: 0;
    inset-inline-start: 0;
    width: calc(${theme.base.spacing} * 3.5);
    padding: ${theme.components['text-area'].padding};
    box-sizing: border-box;
    border-inline-end: 0.0625rem solid ${theme.base.palette['border-line']};
    color: ${theme.base.palette['foreground-color']};
    opacity: ${theme.base.transparency['transparent-2']};
    text-align: end;
    transform: translateY(-${$scrollTop}px);

    span {
      display: block;
      line-height: 1.5;
    }
  `;
});

StyledJsonEditorLineNumbers.defaultProps = defaultThemeProp;

export const StyledJsonEditorCode = styled.code<{
  $scrollTop: number;
  $scrollLeft: number;
}>(({ theme, $scrollTop, $scrollLeft }) => {
  return css`
    position: absolute;
    inset-block-start: 0;
    inset-inline-start: 0;
    min-width: 100%;
    padding: ${theme.components['text-area'].padding};
    padding-inline-start: calc(${theme.base.spacing} * 4);
    box-sizing: border-box;
    transform: translate(-${$scrollLeft}px, -${$scrollTop}px);
  `;
});

StyledJsonEditorCode.defaultProps = defaultThemeProp;

export const StyledJsonEditorToolbar = styled.div(({ theme }) => {
  return css`
    display: flex;
    align-items: center;
    gap: ${theme.base.spacing};
    margin-block-end: ${theme.base.spacing};
  `;
});

StyledJsonEditorToolbar.defaultProps = defaultThemeProp;

export const StyledJsonEditorButton = styled.button(({ theme }) => {
  return css`
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: calc(${theme.base.spacing} * 3);
    min-height: calc(${theme.base.spacing} * 3);
    padding: 0;
    border: 0;
    border-radius: ${theme.base['border-radius']};
    color: ${theme.components.button.color};
    background: transparent;
    cursor: pointer;

    &::before {
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: currentColor;
      content: '';
      opacity: 0;
      pointer-events: none;
    }

    &:hover::before {
      opacity: 0.1;
    }

    &:active::before {
      opacity: 0.2;
    }

    &:focus-visible {
      outline: none;
      box-shadow: ${theme.components.button['focus-shadow']};
    }

    &:disabled {
      cursor: not-allowed;
      opacity: ${theme.base['disabled-opacity']};
      pointer-events: none;
    }

    > svg {
      display: block;
    }
  `;
});

StyledJsonEditorButton.defaultProps = defaultThemeProp;

export const StyledJsonEditorFooter = styled.div(({ theme }) => {
  return css`
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: ${theme.base.spacing};
    margin-block-start: ${theme.base.spacing};
    min-height: 1.5rem;
  `;
});

StyledJsonEditorFooter.defaultProps = defaultThemeProp;

export const StyledJsonEditorStatus = styled.span(({ theme }) => {
  return css`
    display: inline-flex;
    align-items: center;
    gap: calc(${theme.base.spacing} / 2);
    color: ${theme.base.palette['foreground-color']};
    font-size: ${theme.base['font-size']};

    &[data-status='invalid'] {
      color: ${theme.components['form-field'].error['status-color']};
    }

    svg {
      width: 1em;
      height: 1em;
    }
  `;
});

StyledJsonEditorStatus.defaultProps = defaultThemeProp;

export const StyledJsonEditorMeta = styled.span(({ theme }) => {
  return css`
    color: ${theme.base.palette['foreground-color']};
    opacity: ${theme.base.transparency['transparent-2']};
    font-size: ${theme.base['font-size']};
  `;
});

StyledJsonEditorMeta.defaultProps = defaultThemeProp;

const StyledJsonEditorInlineError = styled.span(({ theme }) => {
  return css`
    color: ${theme.components['form-field'].error['status-color']};
    font-size: ${theme.base['font-size']};
  `;
});

StyledJsonEditorInlineError.defaultProps = defaultThemeProp;

export const StyledJsonEditorCopyError = StyledJsonEditorInlineError;
export const StyledJsonEditorError = StyledJsonEditorInlineError;

export default StyledJsonEditorWrapper;
