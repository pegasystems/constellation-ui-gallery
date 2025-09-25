import { type themeDefinition } from '@pega/cosmos-react-core';
import styled, { css } from 'styled-components';

export default styled.div(({ height, theme }: { height: string; theme: typeof themeDefinition }) => {
  const {
    components: {
      button: { 'focus-shadow': focusShadow },
    },
  } = theme;

  return css`
    height: ${height};
    width: 100%;

    .react-flow__container {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
    }
    .react-flow__pane {
      z-index: 1;
      cursor: grab;
    }
    .react-flow__pane.selection {
      cursor: pointer;
    }
    .react-flow__pane.dragging {
      cursor: grabbing;
    }
    .react-flow__viewport {
      transform-origin: 0 0;
      z-index: 2;
      pointer-events: none;
    }
    .react-flow__renderer {
      z-index: 4;
    }
    .react-flow__selection {
      z-index: 6;
    }
    .react-flow__nodesselection-rect:focus,
    .react-flow__nodesselection-rect:focus-visible {
      outline: none;
    }
    .react-flow .react-flow__edges {
      pointer-events: none;
      overflow: visible;
    }
    .react-flow__edge-path,
    .react-flow__connection-path {
      stroke: #000000;
      stroke-width: 1;
      fill: none;
    }
    .react-flow__edge:focus > .react-flow__edge-path,
    .react-flow__edge:hover > .react-flow__edge-path,
    .react-flow__edge:active > .react-flow__edge-path,
    .react-flow__edge:focus > .react-flow__connection-path,
    .react-flow__edge:hover > .react-flow__connection-path,
    .react-flow__edge:active > .react-flow__connection-path {
      stroke: ${theme.base.palette.interactive} !important;
    }
    .react-flow__node-custom {
      border: 0.125rem solid transparent;
    }
    .react-flow__node-custom:hover {
      border: 0.125rem solid ${theme.base.palette.interactive};
    }
    .react-flow__node-custom:focus,
    .react-flow__node-custom:active {
      box-shadow: ${focusShadow};
    }
    div.react-flow__handle.connectionindicator {
      visibility: hidden;
    }

    .react-flow__edge {
      pointer-events: visibleStroke;
      cursor: pointer;
    }
    .react-flow__edge.animated path {
      stroke-dasharray: 5;
      animation: dashdraw 0.5s linear infinite;
    }
    .react-flow__edge.animated path.react-flow__edge-interaction {
      stroke-dasharray: none;
      animation: none;
    }
    .react-flow__edge.inactive {
      pointer-events: none;
    }
    .react-flow__edge.selected,
    .react-flow__edge:focus,
    .react-flow__edge:focus-visible {
      outline: none;
    }
    .react-flow__edge.selected .react-flow__edge-path,
    .react-flow__edge:focus .react-flow__edge-path,
    .react-flow__edge:focus-visible .react-flow__edge-path {
      stroke: #555555;
    }
    .react-flow__edge-textwrapper {
      pointer-events: all;
    }
    .react-flow__edge-textbg {
      fill: white;
    }
    .react-flow__edge .react-flow__edge-text {
      pointer-events: none;
      user-select: none;
    }
    .react-flow__connection {
      pointer-events: none;
    }
    .react-flow__connection .animated {
      stroke-dasharray: 5;
      animation: dashdraw 0.5s linear infinite;
    }
    .react-flow__connectionline {
      z-index: 1001;
    }
    .react-flow__nodes {
      pointer-events: none;
      transform-origin: 0 0;
    }
    .react-flow__node {
      position: absolute;
      user-select: none;
      pointer-events: all;
      transform-origin: 0 0;
      box-sizing: border-box;
      cursor: grab;
    }
    .react-flow__node.dragging {
      cursor: grabbing;
    }
    .react-flow__nodesselection {
      z-index: 3;
      transform-origin: left top;
      pointer-events: none;
    }
    .react-flow__nodesselection-rect {
      position: absolute;
      pointer-events: all;
      cursor: grab;
    }
    .react-flow__handle {
      position: absolute;
      pointer-events: none;
      min-width: 0.3rem;
      min-height: 0.3rem;
      width: 0.3rem;
      height: 0.3rem;
      background: #1a192b;
      border: 0.125rem solid white;
      border-radius: 100%;
    }
    .react-flow__handle.connectionindicator {
      pointer-events: all;
      cursor: crosshair;
    }
    .react-flow__handle-bottom {
      top: auto;
      left: 50%;
      bottom: -0.25rem;
      transform: translate(-50%, 0);
    }
    .react-flow__handle-top {
      left: 50%;
      top: -0.25rem;
      transform: translate(-50%, 0);
    }
    .react-flow__handle-left {
      top: 50%;
      left: -0.25rem;
      transform: translate(0, -50%);
    }
    .react-flow__handle-right {
      right: -0.25rem;
      top: 50%;
      transform: translate(0, -50%);
    }
    .react-flow__edgeupdater {
      cursor: move;
      pointer-events: all;
    }
    .react-flow__panel {
      position: absolute;
      z-index: 5;
      margin: 1rem;
    }
    .react-flow__panel.top {
      top: 0;
    }
    .react-flow__panel.bottom {
      bottom: 0;
    }
    .react-flow__panel.left {
      left: 0;
    }
    .react-flow__panel.right {
      right: 0;
    }
    .react-flow__panel.center {
      left: 50%;
      transform: translateX(-50%);
    }
    .react-flow__attribution {
      font-size: 0.7rem;
      background: rgba(255, 255, 255, 0.5);
      padding: 0.25rem 0.3rem;
      margin: 0;
    }
    .react-flow__attribution a {
      text-decoration: none;
      color: #999999;
    }
    @-webkit-keyframes dashdraw {
      from {
        stroke-dashoffset: 10;
      }
    }
    @keyframes dashdraw {
      from {
        stroke-dashoffset: 10;
      }
    }
    .react-flow__edgelabel-renderer {
      position: absolute;
      width: 100%;
      height: 100%;
      pointer-events: none;
      -webkit-user-select: none;
      -moz-user-select: none;
      user-select: none;
    }
    .react-flow__edge.updating .react-flow__edge-path {
      stroke: #777777;
    }
    .react-flow__edge-text {
      font-size: 0.7rem;
    }
    .react-flow__node.selectable:focus,
    .react-flow__node.selectable:focus-visible {
      outline: none;
    }
    .react-flow__node-default,
    .react-flow__node-input,
    .react-flow__node-output,
    .react-flow__node-group {
      padding: 0.7rem;
      border-radius: 0.25rem;
      width: 10rem;
      font-size: 0.6rem;
      color: #222222;
      text-align: center;
      border-width: 0.125rem;
      border-style: solid;
      border-color: #1a192b;
      background-color: white;
    }
    .react-flow__node-default.selectable:hover,
    .react-flow__node-input.selectable:hover,
    .react-flow__node-output.selectable:hover,
    .react-flow__node-group.selectable:hover {
      box-shadow: 0 0.125rem 0.25rem 0.125rem rgba(0, 0, 0, 0.08);
    }
    .react-flow__node-default.selectable.selected,
    .react-flow__node-default.selectable:focus,
    .react-flow__node-default.selectable:focus-visible,
    .react-flow__node-input.selectable.selected,
    .react-flow__node-input.selectable:focus,
    .react-flow__node-input.selectable:focus-visible,
    .react-flow__node-output.selectable.selected,
    .react-flow__node-output.selectable:focus,
    .react-flow__node-output.selectable:focus-visible,
    .react-flow__node-group.selectable.selected,
    .react-flow__node-group.selectable:focus,
    .react-flow__node-group.selectable:focus-visible {
      box-shadow: 0 0 0 0.125rem #1a192b;
    }
    .react-flow__node-group {
      background-color: rgba(240, 240, 240, 0.25);
    }
    .react-flow__nodesselection-rect,
    .react-flow__selection {
      background: rgba(0, 89, 220, 0.08);
      border: 0.125rem dotted rgba(0, 89, 220, 0.8);
    }
    .react-flow__nodesselection-rect:focus,
    .react-flow__nodesselection-rect:focus-visible,
    .react-flow__selection:focus,
    .react-flow__selection:focus-visible {
      outline: none;
    }
    .react-flow__controls {
      box-shadow: 0 0 0.25rem 0.125rem rgba(0, 0, 0, 0.08);
    }
    .react-flow__controls-button {
      border: none;
      background: #fefefe;
      border-bottom: 0.125rem solid #eeeeee;
      box-sizing: content-box;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 1rem;
      height: 1rem;
      cursor: pointer;
      user-select: none;
      padding: 0.3rem;
    }
    .react-flow__controls-button:hover {
      background: #f4f4f4;
    }
    .react-flow__controls-button svg {
      width: 100%;
      max-width: 0.7rem;
      max-height: 0.7rem;
    }
    .react-flow__controls-button:disabled {
      pointer-events: none;
    }
    .react-flow__controls-button:disabled svg {
      fill-opacity: 0.4;
    }
    .react-flow__minimap {
      background-color: #ffffff;
    }
    .react-flow__resize-control {
      position: absolute;
    }
    .react-flow__resize-control.left,
    .react-flow__resize-control.right {
      cursor: ew-resize;
    }
    .react-flow__resize-control.top,
    .react-flow__resize-control.bottom {
      cursor: ns-resize;
    }
    .react-flow__resize-control.top.left,
    .react-flow__resize-control.bottom.right {
      cursor: nwse-resize;
    }
    .react-flow__resize-control.bottom.left,
    .react-flow__resize-control.top.right {
      cursor: nesw-resize;
    }
    .react-flow__resize-control.handle {
      width: 0.25rem;
      height: 0.25rem;
      border: 0.125rem solid #ffffff;
      border-radius: 0.125rem;
      background-color: #3367d9;
      transform: translate(-50%, -50%);
    }
    .react-flow__resize-control.handle.left {
      left: 0;
      top: 50%;
    }
    .react-flow__resize-control.handle.right {
      left: 100%;
      top: 50%;
    }
    .react-flow__resize-control.handle.top {
      left: 50%;
      top: 0;
    }
    .react-flow__resize-control.handle.bottom {
      left: 50%;
      top: 100%;
    }
    .react-flow__resize-control.handle.top.left {
      left: 0;
    }
    .react-flow__resize-control.handle.bottom.left {
      left: 0;
    }
    .react-flow__resize-control.handle.top.right {
      left: 100%;
    }
    .react-flow__resize-control.handle.bottom.right {
      left: 100%;
    }
    .react-flow__resize-control.line {
      border-color: #3367d9;
      border-width: 0;
      border-style: solid;
    }
    .react-flow__resize-control.line.left,
    .react-flow__resize-control.line.right {
      width: 0.125rem;
      transform: translate(-50%, 0);
      top: 0;
      height: 100%;
    }
    .react-flow__resize-control.line.left {
      left: 0;
      border-left-width: 0.125rem;
    }
    .react-flow__resize-control.line.right {
      left: 100%;
      border-right-width: 0.125rem;
    }
    .react-flow__resize-control.line.top,
    .react-flow__resize-control.line.bottom {
      height: 0.125rem;
      transform: translate(0, -50%);
      left: 0;
      width: 100%;
    }
    .react-flow__resize-control.line.top {
      top: 0;
      border-top-width: 0.125rem;
    }
    .react-flow__resize-control.line.bottom {
      border-bottom-width: 0.125rem;
      top: 100%;
    }
    .custom-edge {
      position: absolute;
      padding: 0.3rem;
      border-radius: 0.3rem;
      font-size: 0.6rem;
    }
    .division {
      background: #ffcc00;
      color: #000000;
    }
    .subsidiary {
      background: #59dbd9;
      color: #000000;
    }
    .ownership {
      background: #ffc3a4;
      color: #000000;
    }
  `;
});
