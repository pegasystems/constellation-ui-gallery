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
