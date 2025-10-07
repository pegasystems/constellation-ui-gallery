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

    header {
      grid-column:1/-1;
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:12px;
    }

    h1 {
      margin:0;
      font-size:22px;
      letter-spacing:0.2px;
      color:#111827;
    }

    .sub {
      color:#6b7280;
      font-size:14px;
    }

    .controls {
      display:flex;
      gap:8px;
      align-items:center;
    }

    .control input,
    .control select {
      background:#f9fafb;
      border:1px solid #d1d5db;
      padding:8px 10px;
      border-radius:8px;
      color:#111827;
    }

    .card {
      background:#ffffff;
      padding:16px;
      border-radius:12px;
      box-shadow:0 2px 6px rgba(0,0,0,0.08);
      border:1px solid #e5e7eb;
    }

    /* Left column content */
    .main {
      display:grid;
      grid-template-rows:auto auto 1fr;
      gap:16px;
    }

    .kpi-row { display:flex; gap:12px }

    .kpi {
      flex:1;
      padding:14px;
      border-radius:12px;
      background:#f9fafb;
      display:flex;
      flex-direction:column;
      gap:8px;
      border:1px solid #e5e7eb;
    }

    .kpi .value { font-weight:700; font-size:22px; color:#111827 }
    .kpi .label { color:#374151; font-size:14px }
    .kpi .small { color:#6b7280; font-size:12px }

    .charts {
      display:flex;
      gap:12px;
      align-items:stretch;
    }

    .donut-legend {
      display:flex;
      flex-direction:column;
      gap:6px;
      margin-top:12px;
    }

    .legend-item {
      display:flex;
      gap:8px;
      align-items:center;
      font-size:14px;
      color:#374151;
    }

    .legend-color {
      width:12px;
      height:12px;
      border-radius:3px;
    }

    .bar-wrap {
      flex:1;
      display:flex;
      flex-direction:column;
    }

    .bar-chart {
      display:flex;
      align-items:end;
      gap:12px;
      height:220px;
      padding-top:8px;
    }

    .bar {
      height:100%;
      flex:1;
      display:flex;
      align-items:flex-end;
      justify-content:center;
    }

    .bar > div {
      width:36px;
      border-radius:8px 8px 0 0;
      background:linear-gradient(180deg,#2563eb,#000000);
      min-height:12px;
      display:flex;
      align-items:flex-end;
      justify-content:center;
      padding-bottom:6px;
      color:#fff;
      font-weight:700;
    }

    .dept-labels {
      display:flex;
      justify-content:space-between;
      margin-top:8px;
      color:#374151;
      font-size:12px;
    }

    /* Overdue alert */
    .overdue {
      display:flex;
      gap:12px;
      align-items:center;
      justify-content:space-between;
      padding:12px;
      border-radius:10px;
      background:#fef2f2;
      border:1px solid #fecaca;
    }

    .overdue .count {
      font-size:20px;
      font-weight:800;
      color:#dc2626;
    }

    .overdue button, .overdue a {
      background:#fff;
      border:1px solid #d1d5db;
      padding:8px 10px;
      border-radius:8px;
      color:#111827;
      cursor:pointer;
      text-decoration: none;
    }

    /* Right column (filters + lists) */
    .side {
      display:flex;
      flex-direction:column;
      gap:12px;
    }

    .list {
      max-height:510px;
      overflow:auto;
      padding-top: 8px;
      display:flex;
      flex-direction:column;
      gap:8px;
    }

    .list-item {
      display:flex;
      align-items:center;
      justify-content:space-between;
      padding:10px;
      border-radius:10px;
      background:#f9fafb;
      border:1px solid #e5e7eb;
    }

    .list-item .meta {
      color:#6b7280;
      font-size:14px;
    }

    table {
      width:100%;
      border-collapse:collapse;
      color:#111827;
    }

    th,
    td {
      padding:10px;
      text-align:left;
      font-size:14px;
      border-bottom:1px dashed #e5e7eb;
    }

    th {
      color:#374151;
      font-weight:600;
    }

    .btn {
      padding:8px 10px;
      border-radius:8px;
      border:0;
      background:#2563eb;
      color:#fff;
      font-weight:700;
      cursor:pointer;
    }

    .small-btn {
      padding:6px 8px;
      border-radius:8px;
      border:1px solid #d1d5db;
      background:#fff;
      color:#111827;
      cursor:pointer;
    }

    .muted {
      color:#6b7280;
    }

    footer {
      grid-column:1/-1;
      margin-top:8px;
      color:#6b7280;
      font-size:14px;
      text-align:center;
    }
  }

  /* Responsive */
  @media (max-width:980px) {
    .wrap {
      grid-template-columns:1fr;
      padding:12px;

      .charts { flex-direction:column; }
      .donut-wrap { width:100%; }
    }
  }


  /* Modal */
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
  }

  .modal-box {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.12);
    width: 800px;
    max-width: 90%;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .modal-header h2 {
    margin: 0;
    font-size: 20px;
    color: #111827;
  }

  .modal-close {
    background: #fff;
    border: 1px solid #d1d5db;
    padding: 6px 10px;
    border-radius: 8px;
    cursor: pointer;
    color: #374151;
    font-size: 14px;
  }

  .modal-close:hover { background: #f3f4f6; }

  .modal-content {
    color: #374151;
    font-size: 15px;
    line-height: 1.5;
    height: 300px;
    overflow-y: scroll;
  }

  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }

  .modal-footer .cancel {
    background: #fff;
    border: 1px solid #d1d5db;
    color: #111827;
    padding: 8px 12px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
  }

  .modal-footer .confirm {
    background: #2563eb;
    color: #fff;
    border: none;
    padding: 8px 12px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
  }

  .loader-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    position: absolute;
    left: 0;
    top: 0;
    height: 600px;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.8);
  }

  .loader {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #2563eb;
    border-radius: 50%;
    width: 28px;
    height: 28px;
    animation: spin 1s linear infinite;
  }

  .loader-text {
    margin-top: 8px;
    font-size: 13px;
    color: #374151;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

`;

export default GlobalStyle;
