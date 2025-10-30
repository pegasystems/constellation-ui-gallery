import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  .wrap {
    padding:12px 20px;
    background-color:#ffffff;
    font-family:Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;

    select, input {
      width: 100%;
      padding: 8px 10px;
      border: 1px solid #ccc;
      border-radius: 6px;
      font-size: 14px;      
    }

    label {
      color: #3d3d3d;
    }

    ul.p-tree-container, ul.p-treenode-children {
        list-style-type: none;
    }

    ul li.p-treenode:last-child {
      border-bottom: 1px #000 solid;
    }

    ul li.p-treenode  {
      border: 1px #000 solid;
      border-bottom: 0px;
    }


    li div.p-treenode-content {
      padding: 6px;
    }

`;

export default GlobalStyle;
