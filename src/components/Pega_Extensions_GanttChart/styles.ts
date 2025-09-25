import { type themeDefinition, tryCatch, Card, defaultThemeProp, StyledFieldValueList } from '@pega/cosmos-react-core';
import styled, { css } from 'styled-components';
import { transparentize } from 'polished';

export const StyledHoverTooltipCard: typeof Card = styled(Card)(({ theme }) => {
  return css`
    background-color: ${theme.components.card.background};
    border-color: ${theme.components.card['border-color']};
    border-style: solid;
    border-width: 0.0625rem;
    padding: ${theme.base.spacing};
    box-shadow: ${theme.base.shadow.low};
    border-radius: ${theme.base['border-radius']};

    & h3 {
      margin-block-end: ${theme.base.spacing};
    }

    ${StyledFieldValueList} {
      margin-block-end: ${theme.base.spacing};
    }
  `;
});

StyledHoverTooltipCard.defaultProps = defaultThemeProp;

export default styled.div(({ theme }: { theme: typeof themeDefinition }) => {
  const ganttExternalCSS = `
  .today {
    rect {
      fill: ${theme.base.colors.blue.medium};
      opacity: 0.1;
    }
  }

  ._3_ygE {
    display: table;
    border: ${theme.components.table.header['border-color']} ${theme.components.table.header['border-width']} solid;
    border-inline-end: none;
    background-color: ${theme.components.table.header['background-color']};
    color: ${theme.components.table.header['foreground-color']};
    font-weight: ${theme.components.table.header['font-weight']};
  }

  ._1nBOt {
    display: table-row;
    list-style: none;
  }

  ._2eZzQ {
    // border-right: 1px solid rgb(196, 196, 196);
    // opacity: 1;
    // margin-left: -2px;
  }

  ._WuQ0f {
    display: table-cell;
    vertical-align: -webkit-baseline-middle;
    vertical-align: middle;
    padding-inline-start: ${theme.base.spacing};
    border-inline-end: ${theme.components.table.body['border-color']} ${theme.components.table.header['border-width']} solid;
  }

  ._3ZbQT {
    display: table;
    border-collapse:collapse;
    border-inline-start: ${theme.components.table.header['border-color']} ${theme.components.table.header['border-width']} solid;
    border-block-end: ${theme.components.table.header['border-color']} ${theme.components.table.header['border-width']} solid;

  }

  ._34SS0 {
    display: table-row;
    text-overflow: ellipsis;
    background-color:${theme.components.table.body['background-color']};
    border-block-end: ${tryCatch(() => transparentize(0.9, theme.base.palette.dark as unknown as string))} ${theme.components.table.header['border-width']} solid;
  }

  ._34SS0:nth-of-type(even) {
    // background-color:${theme.base.palette.skeleton};
  }

  ._3lLk3 {
    display: table-cell;
    vertical-align: middle;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-inline-start: ${theme.base.spacing};
    border-inline-end: ${theme.components.table.body['border-color']} ${theme.components.table.header['border-width']} solid;
  }

  ._nI1Xw {
    display: flex;
  }

  ._2QjE6 {
    color: ${theme.base.palette.interactive};
    font-size: 0.6rem;
    padding: 0.15rem 0.2rem 0rem 0.2rem;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    cursor: pointer;
  }
  ._2TfEi {
    font-size: 0.6rem;
    padding-left: 1rem;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  ._3T42e {
    background: #fff;
    padding: 12px;
    box-shadow:
      0 3px 6px rgba(0, 0, 0, 0.16),
      0 3px 6px rgba(0, 0, 0, 0.23);
  }

  ._29NTg {
    font-size: 12px;
    margin-bottom: 6px;
    color: #666;
  }

  ._25P-K {
    position: absolute;
    display: flex;
    flex-shrink: 0;
    pointer-events: none;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  ._3gVAq {
    visibility: hidden;
    position: absolute;
    display: flex;
    pointer-events: none;
  }

  ._1eT-t {
    overflow: hidden auto;
    width: 1rem;
    flex-shrink: 0;
    /*firefox*/
    scrollbar-width: thin;
  }
  ._1eT-t::-webkit-scrollbar {
    width: 1.1rem;
    height: 1.1rem;
  }
  ._1eT-t::-webkit-scrollbar-corner {
    background: transparent;
  }
  ._1eT-t::-webkit-scrollbar-thumb {
    border: 6px solid transparent;
    background: rgba(0, 0, 0, 0.2);
    background: var(--palette-black-alpha-20, rgba(0, 0, 0, 0.2));
    border-radius: 10px;
    background-clip: padding-box;
  }
  ._1eT-t::-webkit-scrollbar-thumb:hover {
    border: 4px solid transparent;
    background: rgba(0, 0, 0, 0.3);
    background: var(--palette-black-alpha-30, rgba(0, 0, 0, 0.3));
    background-clip: padding-box;
  }

  ._2dZTy {
    fill:${theme.components.table.body['background-color']};
  }

  ._2dZTy:nth-child(even) {
    // fill:${theme.base.palette.skeleton};
  }

  ._3rUKi {
    stroke: ${theme.base.palette.dark};
    opacity: 0.1;
  }

  ._RuwuK {
    stroke: ${theme.base.palette.dark};
    opacity: 0.1;
  }

  ._9w8d5 {
    text-anchor: middle;
    fill:${theme.components.table.header['foreground-color']};
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    pointer-events: none;
  }

  ._1rLuZ {
    stroke: ${theme.components.table.header['border-color']};
  }

  ._2q1Kt {
    text-anchor: middle;
    fill: ${theme.components.table.header['foreground-color']};
    font-weight: ${theme.components.table.header['font-weight']};
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    pointer-events: none;
  }

  ._35nLX {
    fill: ${theme.components.table.header['background-color']};
    stroke-width: 1.4;
  }

  ._KxSXS {
    cursor: pointer;
    // outline: none;
  }

  ._KxSXS:hover ._3w_5u {
    visibility: visible;
    opacity: 1;
  }

  ._3w_5u {
    fill: ${theme.base.colors.black};
    stroke:${theme.base.colors.black};
    cursor: ew-resize;
    opacity: 0;
    visibility: hidden;
  }

  polygon._3w_5u {
    transform: translate(0, -10px);
    stroke-width: 6px;
  }

  ._3w_5u:hover {
    stroke:${theme.base.colors.orange.dark};
    fill:${theme.base.colors.orange.dark};
  }

  ._31ERP {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    stroke-width: 0;
  }

  ._RRr13 {
    cursor: pointer;
    // outline: none;
  }

  ._2P2B1 {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  ._1KJ6x {
    cursor: pointer;
    // outline: none;
  }

  ._2RbVy {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    // opacity: 0.6;
  }

  ._2pZMF {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  ._3zRJQ {
    fill: #000;
    text-anchor: middle;
    font-weight: ${theme.base['font-weight']['semi-bold']};
    dominant-baseline: central;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    pointer-events: none;
  }

  ._3KcaM {
    fill: ${theme.base.palette['foreground-color']};
    font-weight: ${theme.base['font-weight']['semi-bold']};
    text-anchor: start;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    pointer-events: none;
  }

  ._CZjuD {
    overflow: hidden;
    font-size: 0;
    margin: 0;
    padding: 0;
  }

  ._CZjuD > svg:first-of-type {
    border-block: ${theme.components.table.header['border-color']} ${theme.components.table.header['border-width']} solid;
  }

  ._2B2zv {
    margin: 0;
    padding: 0;
    overflow: hidden;
    border-bottom: ${theme.components.table.body['border-color']} ${theme.components.table.body['border-width']} solid;
  }

  ._3eULf {
    display: flex;
    padding: 0;
    margin: 0;
    list-style: none;
    // outline: none;
    position: relative;
  }

  ._2k9Ys {
    overflow: auto;
    max-width: 100%;
    /*firefox*/
    scrollbar-width: thin;
    /*iPad*/
    height: 1.2rem;
  }
  ._2k9Ys::-webkit-scrollbar {
    width: 1.1rem;
    height: 1.1rem;
  }
  ._2k9Ys::-webkit-scrollbar-corner {
    background: transparent;
  }
  ._2k9Ys::-webkit-scrollbar-thumb {
    border: 6px solid transparent;
    background: rgba(0, 0, 0, 0.2);
    background: var(--palette-black-alpha-20, rgba(0, 0, 0, 0.2));
    border-radius: 10px;
    background-clip: padding-box;
  }
  ._2k9Ys::-webkit-scrollbar-thumb:hover {
    border: 4px solid transparent;
    background: rgba(0, 0, 0, 0.3);
    background: var(--palette-black-alpha-30, rgba(0, 0, 0, 0.3));
    background-clip: padding-box;
  }
  @media only screen and (max-device-width: 1024px) and (-webkit-min-device-pixel-ratio: 2) {
  }
  ._19jgW {
    height: 1px;
  }
  `;

  return css`
    ${ganttExternalCSS}
    & * {
      font-family: ${theme.base['font-family']} !important;
    }
  `;
});
