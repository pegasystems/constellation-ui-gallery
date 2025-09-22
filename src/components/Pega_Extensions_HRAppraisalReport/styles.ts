// style.ts
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #fff;
    margin: 0;
    color: #333;
  }

  .d-none {
    display: none
  }

  .card {
    padding: 20px;
  }

  .dashboard {
  }

  h1 {
    color: #0b66c2;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }

  th, td {
    border: 1px solid #ddd;
    padding: 12px 15px;
    text-align: center;
  }

  th {
    background-color: #f5f5f5;
    color: #000;
  }

  button {
    background-color: #70707026;
    border: none;
    padding: 6px 10px;
    cursor: pointer;
    border-radius: 4px;
    transition: 0.3s;
  }

  button:hover:not(:disabled) {
    background-color: rgb(21, 100, 179);
    color: white;
  }

  .notice {
    font-style: italic;
    color: gray;
    margin-bottom: 20px;
  }

  input[type="text"] {
    padding: 8px 12px !important;
    width: 300px !important;
    margin-bottom: 15px;
    border-radius: 4px;
    border: 1px solid #ccc;
    font-size: 1em;
  }

  /* Accordion styles */
  .accordion-item {
    background: white;
    border: 1px solid #ccc;
    margin-bottom: 10px;
    border-radius: 4px;
    overflow: hidden;
  }

  .accordion-header {
    padding: 12px 15px;
    background: #e3f2fd;
    cursor: pointer;
    user-select: none;
    font-weight: 600;
    color: #0b66c2;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .accordion-header:hover {
    background: #bbdefb;
  }

  .accordion-content {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1), padding 0.25s ease;
    padding: 0 15px;
    background: #fff;
    will-change: max-height;
  }

  .accordion-content.show {
    padding: 15px;
  }

  .kra-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
  }

  .kra-table th, .kra-table td {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: center;
  }

  .kra-table th {
    background-color: #f5f5f5;
    color: #000;
  }

  .comments {
    margin-top: 15px;
    font-size: 0.95em;
  }

  .comments h4 {
    margin-bottom: 5px;
    color: #0b66c2;
  }

  .comments p {
    background-color: #f1f1f1;
    padding: 10px;
    border-left: 4px solid #0b66c2;
    margin-bottom: 10px;
  }

  /* Modal styles */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
    box-sizing: border-box;
  }

  .modal-content {
    background: #ffffff;
    border-radius: 8px;
    width: 95%;
    max-width: 1280px;
    max-height: 90vh;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid #e5e5e5;
    position: sticky;
    top: 0;
    background: #ffffff;
    z-index: 1;
  }

  .modal-body {
    padding: 16px 20px;
    overflow: auto;
    flex: 1 1 auto;
  }

  .modal-close {
    background: transparent;
    border: none;
    font-size: 24px;
    line-height: 1;
    cursor: pointer;
  }

  .pagination-container button {
    border-radius: 0;
  }

  .pagination-container button:first-of-type {
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
    border-right: none;
  }

  .pagination-container button:last-of-type {
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
  }

`;

export default GlobalStyle;
