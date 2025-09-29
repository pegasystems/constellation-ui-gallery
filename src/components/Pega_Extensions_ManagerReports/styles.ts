import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`

h1, h2 {
  color: #333;
}

.section {
  max-width: 1170px;
  background-color: #fff;
  padding: 25px;
  margin: 0 auto 40px;
  box-shadow: 0 0 10px rgba(0,0,0,0.05);
  border-radius: 6px;
}

.widget {
  background-color: #eef6ff;
  padding: 20px;
  margin-top: 15px;
  border: 1px solid #cce0ff;
  border-radius: 6px;
  color: #0056b3;
  font-size: 16px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
padding: 12px;
border-bottom: 1px dashed #ddd;
text-align: left;
font-size: 14px;
color: #3a3a3a;
}

.action-button {
  background-color: #007bff;
  color: white;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer; text-decoration:none;
}

.action-button:hover {
  background-color: #0056b3;
}

.chart-container {
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  justify-content: flex-start;
  align-items: flex-start;
  margin-top: 10px;
}

.chart-container > div {
  flex: 1 1 300px;
  max-width: 500;
}
.queueChart{max-width:350px;}
.EmptyCont{max-width:50px;}

canvas {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 0;
}

.link {
  color: #007bff;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}
h1 {
font-size: 25px;
}
h2 {font-size: 18px;}

`;

export default GlobalStyle;
