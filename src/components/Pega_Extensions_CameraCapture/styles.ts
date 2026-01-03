import { type themeDefinition } from '@pega/cosmos-react-core';
import styled, { css } from 'styled-components';

export default styled.div(({ theme }: { theme: typeof themeDefinition }) => {
  return css`
    margin: 0;

    .camera-container {
      width: 100%;
      height: 26.25rem;
      border-radius: 0.5rem;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .camera-video {
      width: 100%;
      height: 100%;
      object-fit: contain;
      background: ${theme.base.colors.black};
      transition: opacity 0.3s ease-in-out;
    }

    .captured-wrapper {
      width: 80%;
      height: auto;
      border-radius: 0.5rem;
      overflow: hidden;
    }

    .captured-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: opacity 0.3s ease-in-out;
    }

    .camera-buttons {
      width: fit-content;
    }

    .inputAddon {
      display: inline-flex;
      padding: 0.3165rem 0.75rem;
      margin-right: 0.3125rem;
      border: 0.0625rem solid ${theme.base.palette['border-line']};
      background: ${theme.base.palette['primary-background']};
      border-left: 0;
      border-radius: 0 0.375rem 0.375rem 0;
    }

    .custom-toast {
      position: fixed;
      bottom: 1.5rem;
      right: 1.5rem;
      padding: 0.625rem 1rem;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      box-shadow: 0 0.25rem 0.625rem rgba(0, 0, 0, 0.15);
      z-index: 9999;
    }

    .custom-toast--success {
      background-color: ${theme.base.colors.green.dark};
      color: ${theme.base.colors.white};
    }

    .custom-toast--error {
      background-color: ${theme.base.colors.red.dark};
      color: ${theme.base.colors.white};
    }
  `;
});
