import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`

.dashboard {
  padding: 20px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  border-radius: 8px;
}

h1 {
  color: #2a4d69;
}

.section {
  margin-top: 30px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fafafa;
}

.section h2, .section h3, .section p {
  margin-bottom: 10px;
  margin-top: 10px;
}

.section h2 {
  color: #1a3c5d;
  margin-top: 0;
  margin-bottom: 10px;
}

.info-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.info-card {
  flex: 1;
  min-width: 250px;
  background: #eaf2f8;
  border-left: 5px solid #2a4d69;
  padding: 15px;
  border-radius: 5px;
}

p span {
  font-weight: bold;
}

label {
  font-weight: bold;
}

textarea {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  resize: vertical;
}

summary {
  font-weight: bold;
  cursor: pointer;
  background: #eaf2f8;
  padding: 10px;
  border-radius: 4px;
  border-left: 5px solid #2a4d69;
  margin-top: 15px;
}

details {
  margin-top: 10px;
  padding: 10px;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
}

details p {
  margin: 5px 0;
}

.print-btn {
  display: block;
  margin: 40px auto 20px auto;
  padding: 12px 24px;
  background: #2a4d69;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}

.print-btn:hover {
  background: #1d3557;
}

.header {
  background-color: #f0f0f0;
  padding: 15px;
  border-left: 5px solid #2a4d69;
  margin-bottom: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

table, th, td {
  border: 1px solid #444;
}

th, td {
  padding: 10px;
  text-align: center;
}

.comments {
  margin-top: 30px;
}

.comments textarea {
  width: 100%;
  box-sizing: border-box;
  min-height: 120px;
}

canvas {
  max-width: 100%;
}

@media print {
  .print-btn {
    display: none;
  }
  .section {
    page-break-inside: avoid;
  }
}

`;

export default GlobalStyle;
