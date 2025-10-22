import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  .wrap {
    padding:12px 20px;
    display:grid;
    grid-template-columns:1fr 360px;
    gap:20px;
    background-color:#ffffff;
    font-family:Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
    color-scheme: light;

    select {
      padding: 7px 8px !important;
      border-radius: 4px !important;
    }

`;

export default GlobalStyle;
