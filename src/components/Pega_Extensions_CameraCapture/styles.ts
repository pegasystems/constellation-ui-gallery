import styled, { css } from 'styled-components'

const StyledDiv = styled.div(() => css`
  margin: 0;

  input {
    border-color: #e4e4e4;
  }

  .camera-container {
    width: 100%;
    height: 420px;
    border-radius: 8px;
    overflow: hidden;
    background: #000;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .camera-video {
    width: 100%;
    height: 100%;
    object-fit: contain;
    background: #000;
    transition: opacity 0.3s ease-in-out;
  }

  .captured-wrapper {
    width: 80%;
    height: auto;
    border-radius: 8px;
    overflow: hidden;
    background: #000;
  }

  .captured-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: opacity 0.3s ease-in-out;
  }

  .camera-buttons {
    color: #fff;
    width: fit-content;
  }

  .inputAddon {
    display: inline-flex;
    padding: 7px 12px;
    margin-right: 5px;
    background: #f0f0f0;
    border: 1px solid #e4e4e4;
    border-left: 0;
    border-radius: 0 6px 6px 0;
  }

  .custom-toast {
    position: fixed;
    bottom: 24px;
    right: 24px;
    padding: 10px 16px;
    border-radius: 6px;
    font-size: 14px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
    z-index: 9999;
  }

  .custom-toast--success {
    background-color: #e6f4ea;
    color: #0f5132;
  }

  .custom-toast--error {
    background-color: #fdecea;
    color: #842029;
  }
`);

export default StyledDiv;
