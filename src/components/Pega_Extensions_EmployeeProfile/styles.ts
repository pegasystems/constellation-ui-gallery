// style.ts
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: #f4f6f9;
    margin: 0;
    padding: 0;
  }

  .profile-container {
    max-width: 1200px;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 6px 20px rgba(0,0,0,0.1);
    padding: 30px;
  }

  .profile-header {
    display: flex;
    align-items: center;
    border-bottom: 2px solid #eee;
    padding-bottom: 20px;
    margin-bottom: 20px;
  }

  .profile-pic {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 20px;
    border: 3px solid #0073e6;
  }

  .profile-header h2 {
    margin: 0;
    font-size: 26px;
    color: #2c3e50;
  }

  .profile-header p {
    margin: 5px 0;
    color: #777;
  }

  .profile-details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  .detail-card {
    background: #f9fbff;
    padding: 15px 20px;
    border-radius: 12px;
    border: 1px solid #e3e6f0;
  }

  .detail-card h4 {
    margin: 0 0 8px;
    font-size: 14px;
    color: #555;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .detail-card p {
    margin: 0;
    font-size: 16px;
    font-weight: bold;
    color: #333;
  }

  .email-link {
    color: #0073e6;
    text-decoration: none;
  }
`;

export default GlobalStyle;
