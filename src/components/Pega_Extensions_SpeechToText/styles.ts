import styled from 'styled-components';

const StyledWrapper = styled.div`
  .custom-toast {
    padding: 12px 16px;
    border-radius: 4px;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
    animation: slideIn 0.3s ease-in-out;

    &--success {
      background-color: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    &--error {
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    &--info {
      background-color: #d1ecf1;
      color: #0c5460;
      border: 1px solid #bee5eb;
    }
  }

  .listening-indicator {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background-color: #e7f3ff;
    border-left: 4px solid #2196f3;
    border-radius: 4px;
    font-weight: 500;
    color: #1976d2;
  }

  .pulse {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #ff6b6b;
    animation: pulse 1.5s ease-in-out infinite;
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.2);
      opacity: 0.7;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes slideIn {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .interim-text {
    padding: 8px 12px;
    background-color: #f5f5f5;
    border-radius: 4px;
    color: #666;
    font-size: 14px;
  }

  .text-display-area {
    width: 100%;

    input {
      width: 100%;
      padding: 12px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-size: 14px;
      resize: vertical;

      &:focus {
        outline: none;
        border-color: #2196f3;
        box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
      }

      &:disabled {
        background-color: #f5f5f5;
        cursor: not-allowed;
      }
    }
  }
`;

export default StyledWrapper;
