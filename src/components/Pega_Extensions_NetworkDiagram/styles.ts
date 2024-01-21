import styled, { css } from 'styled-components';

export default styled.div(({ height }: { height: string }) => {
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
      cursor: -webkit-grab;
      cursor: grab;
    }
    .react-flow__pane.selection {
      cursor: pointer;
    }
    .react-flow__pane.dragging {
      cursor: -webkit-grabbing;
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
      stroke: #b1b1b7;
      stroke-width: 1;
      fill: none;
    }
    .react-flow__edge {
      pointer-events: visibleStroke;
      cursor: pointer;
    }
    .react-flow__edge.animated path {
      stroke-dasharray: 5;
      -webkit-animation: dashdraw 0.5s linear infinite;
      animation: dashdraw 0.5s linear infinite;
    }
    .react-flow__edge.animated path.react-flow__edge-interaction {
      stroke-dasharray: none;
      -webkit-animation: none;
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
      stroke: #555;
    }
    .react-flow__edge-textwrapper {
      pointer-events: all;
    }
    .react-flow__edge-textbg {
      fill: white;
    }
    .react-flow__edge .react-flow__edge-text {
      pointer-events: none;
      -webkit-user-select: none;
      -moz-user-select: none;
      user-select: none;
    }
    .react-flow__connection {
      pointer-events: none;
    }
    .react-flow__connection .animated {
      stroke-dasharray: 5;
      -webkit-animation: dashdraw 0.5s linear infinite;
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
      -webkit-user-select: none;
      -moz-user-select: none;
      user-select: none;
      pointer-events: all;
      transform-origin: 0 0;
      box-sizing: border-box;
      cursor: -webkit-grab;
      cursor: grab;
    }
    .react-flow__node.dragging {
      cursor: -webkit-grabbing;
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
      cursor: -webkit-grab;
      cursor: grab;
    }
    .react-flow__handle {
      position: absolute;
      pointer-events: none;
      min-width: 5px;
      min-height: 5px;
      width: 6px;
      height: 6px;
      background: #1a192b;
      border: 1px solid white;
      border-radius: 100%;
    }
    .react-flow__handle.connectionindicator {
      pointer-events: all;
      cursor: crosshair;
    }
    .react-flow__handle-bottom {
      top: auto;
      left: 50%;
      bottom: -4px;
      transform: translate(-50%, 0);
    }
    .react-flow__handle-top {
      left: 50%;
      top: -4px;
      transform: translate(-50%, 0);
    }
    .react-flow__handle-left {
      top: 50%;
      left: -4px;
      transform: translate(0, -50%);
    }
    .react-flow__handle-right {
      right: -4px;
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
      margin: 15px;
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
      font-size: 10px;
      background: rgba(255, 255, 255, 0.5);
      padding: 2px 3px;
      margin: 0;
    }
    .react-flow__attribution a {
      text-decoration: none;
      color: #999;
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
      stroke: #777;
    }
    .react-flow__edge-text {
      font-size: 10px;
    }
    .react-flow__node.selectable:focus,
    .react-flow__node.selectable:focus-visible {
      outline: none;
    }
    .react-flow__node-default,
    .react-flow__node-input,
    .react-flow__node-output,
    .react-flow__node-group {
      padding: 10px;
      border-radius: 3px;
      width: 150px;
      font-size: 12px;
      color: #222;
      text-align: center;
      border-width: 1px;
      border-style: solid;
      border-color: #1a192b;
      background-color: white;
    }
    .react-flow__node-default.selectable:hover,
    .react-flow__node-input.selectable:hover,
    .react-flow__node-output.selectable:hover,
    .react-flow__node-group.selectable:hover {
      box-shadow: 0 1px 4px 1px rgba(0, 0, 0, 0.08);
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
      box-shadow: 0 0 0 0.5px #1a192b;
    }
    .react-flow__node-group {
      background-color: rgba(240, 240, 240, 0.25);
    }
    .react-flow__nodesselection-rect,
    .react-flow__selection {
      background: rgba(0, 89, 220, 0.08);
      border: 1px dotted rgba(0, 89, 220, 0.8);
    }
    .react-flow__nodesselection-rect:focus,
    .react-flow__nodesselection-rect:focus-visible,
    .react-flow__selection:focus,
    .react-flow__selection:focus-visible {
      outline: none;
    }
    .react-flow__controls {
      box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.08);
    }
    .react-flow__controls-button {
      border: none;
      background: #fefefe;
      border-bottom: 1px solid #eee;
      box-sizing: content-box;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 16px;
      height: 16px;
      cursor: pointer;
      -webkit-user-select: none;
      -moz-user-select: none;
      user-select: none;
      padding: 5px;
    }
    .react-flow__controls-button:hover {
      background: #f4f4f4;
    }
    .react-flow__controls-button svg {
      width: 100%;
      max-width: 12px;
      max-height: 12px;
    }
    .react-flow__controls-button:disabled {
      pointer-events: none;
    }
    .react-flow__controls-button:disabled svg {
      fill-opacity: 0.4;
    }
    .react-flow__minimap {
      background-color: #fff;
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
    /* handle styles */
    .react-flow__resize-control.handle {
      width: 4px;
      height: 4px;
      border: 1px solid #fff;
      border-radius: 1px;
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
    /* line styles */
    .react-flow__resize-control.line {
      border-color: #3367d9;
      border-width: 0;
      border-style: solid;
    }
    .react-flow__resize-control.line.left,
    .react-flow__resize-control.line.right {
      width: 1px;
      transform: translate(-50%, 0);
      top: 0;
      height: 100%;
    }
    .react-flow__resize-control.line.left {
      left: 0;
      border-left-width: 1px;
    }
    .react-flow__resize-control.line.right {
      left: 100%;
      border-right-width: 1px;
    }
    .react-flow__resize-control.line.top,
    .react-flow__resize-control.line.bottom {
      height: 1px;
      transform: translate(0, -50%);
      left: 0;
      width: 100%;
    }
    .react-flow__resize-control.line.top {
      top: 0;
      border-top-width: 1px;
    }
    .react-flow__resize-control.line.bottom {
      border-bottom-width: 1px;
      top: 100%;
    }
    .custom-edge {
      position: absolute;
      padding: 5px;
      border-radius: 5px;
      font-size: 10px;
    }
    .division {
      background: #ffcc00;
      color: #fff;
    }
    .subsidiary {
      background: rgb(35, 158, 156);
      color: #fff;
    }
    .ownership {
      background: #f87330;
    }
    .corporation {
      margin: 0 auto;
      width: 50px;
      height: 50px;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' role='presentation' class='sc-jlZhew bRgksp' viewBox='0 0 25 25'%3E%3Cpath d='M18.63 21.11c0 .335-.143.526-.478.526h-2.97c-.335 0-.479-.191-.479-.527 0-.335.144-.479.479-.479h2.97c.335 0 .478.144.478.48Zm1.006-6.37v3.927a.94.94 0 0 1-.288.67c-.239.24-.478.336-.718.336h-3.928a.837.837 0 0 1-.67-.335.946.946 0 0 1-.287-.67V14.74c0-.24.096-.48.287-.67a.946.946 0 0 1 .67-.288h3.928c.239 0 .479.096.718.288a.946.946 0 0 1 .288.67Zm-1.006 3.927V14.74h-3.927v3.927h3.927Zm5.843-10.105c-.335 1.054-.957 1.82-1.915 2.25v11.303c0 .431-.144.766-.431 1.005a1.408 1.408 0 0 1-1.054.432H3.448c-.43 0-.766-.144-1.053-.432-.288-.239-.432-.575-.432-1.005V10.86C1.102 10.477.48 9.855.143 8.945A2.057 2.057 0 0 1 0 8.13c0-.382.096-.814.335-1.245l3.544-4.55c.096-.239.287-.335.575-.335h16.523c.335 0 .526.144.67.431l2.682 4.646c.144.382.191.718.191.957 0 .24 0 .383-.047.527ZM10.776 22.595V14.74H5.89v7.855h4.885Zm10.824-.48V11.149h-.527c-1.293 0-2.299-.575-2.92-1.676-.72 1.101-1.677 1.676-2.97 1.676-1.293 0-2.3-.575-2.921-1.676-.719 1.101-1.677 1.676-2.97 1.676-1.293 0-2.299-.575-2.92-1.676-.72 1.101-1.677 1.676-2.97 1.676h-.48v10.968c0 .335.192.479.527.479h1.437V14.74c0-.24.096-.48.335-.67a.946.946 0 0 1 .67-.288h4.886c.287 0 .526.096.718.288a.943.943 0 0 1 .288.67v7.855h9.291c.335 0 .527-.144.527-.48H21.6ZM23.42 7.46l-2.635-4.5H4.645L1.197 7.365c-.144.239-.192.479-.192.766 0 .24 0 .383.048.48.431 1.053 1.245 1.58 2.347 1.58.67 0 1.245-.24 1.724-.72.48-.479.719-1.053.767-1.723 0-.336.143-.48.479-.48.335 0 .478.144.478.48 0 .67.24 1.245.72 1.724a2.35 2.35 0 0 0 1.723.719c.67 0 1.246-.24 1.725-.72a2.35 2.35 0 0 0 .718-1.723c0-.336.192-.48.527-.48s.479.144.479.48c0 .67.239 1.245.719 1.724.48.479 1.053.719 1.724.719.67 0 1.245-.24 1.724-.72a2.35 2.35 0 0 0 .719-1.723c0-.336.191-.48.526-.48s.48.144.48.48c0 .67.238 1.245.718 1.724.48.479 1.054.719 1.772.719.575 0 1.101-.192 1.533-.527.43-.335.718-.814.861-1.34v-.288a2.36 2.36 0 0 0-.096-.575Z'%3E%3C/path%3E%3C/svg%3E");
    }
    .individual {
      margin: 0 auto;
      width: 50px;
      height: 50px;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' role='presentation' class='sc-jlZhew bRgksp' viewBox='0 0 25 25'%3E%3Cpath d='M8.5 7.476c0 1.121.39 2.048 1.171 2.83.78.78 1.708 1.17 2.83 1.17s2.049-.39 2.83-1.17c.78-.782 1.17-1.709 1.17-2.83 0-1.074-.39-2-1.17-2.83-.781-.78-1.708-1.17-2.83-1.17s-2.05.39-2.83 1.17c-.78.83-1.17 1.756-1.17 2.83Zm-.975 0c0-1.366.488-2.537 1.464-3.513C9.964 2.988 11.135 2.5 12.5 2.5c1.365 0 2.536.488 3.512 1.463.976.976 1.463 2.146 1.463 3.513 0 1.414-.487 2.585-1.463 3.56-.976.976-2.146 1.464-3.512 1.464s-2.537-.488-3.512-1.464c-.976-.975-1.464-2.146-1.464-3.56ZM20.5 22.499h-1.024v-1.024c0-1.95-.683-3.61-2.049-4.975-1.317-1.317-2.975-2-4.927-2-1.903 0-3.56.683-4.927 2.049-1.365 1.317-2.049 2.975-2.049 4.927V22.5H4.5v-1.024c0-2.195.78-4.049 2.342-5.61 1.56-1.61 3.463-2.39 5.658-2.39 2.195 0 4.097.78 5.658 2.342 1.561 1.56 2.342 3.463 2.342 5.658V22.5Z'%3E%3C/path%3E%3C/svg%3E");
    }
  `;
});
