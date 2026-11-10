import styled, { css } from 'styled-components';

export default styled.div(({ theme }) => {
  return css`
    .upload-box {
      border: 0.125rem dashed ${theme.base.palette['border-line']};
      border-radius: 0.5rem;
      padding: 0.25rem 0.5rem;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      background-color: ${theme.base.palette['secondary-background']};
      transition: all 0.2s ease;
      min-height: 2.25rem;

      .upload-progress {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        width: 100%;
      }

      &:hover {
        border-color: ${theme.base.palette['interactive']};
        background-color: ${theme.base.palette['secondary-background']};
      }

      &.dragging {
        border-color: ${theme.base.palette['interactive']};
        background-color: ${theme.base.palette['secondary-background']};
      }

      .upload-text {
        margin: 0;
        white-space: nowrap;
      }
    }

    .file-loaded {
      border: 0.125rem solid ${theme.base.palette['border-line']};
      border-radius: 0.5rem;
      padding: 0.25rem 0.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: ${theme.base.palette['secondary-background']};
      height: 2.25rem;
      gap: 0.5rem;

      .file-info {
        display: flex;
        align-items: center;
        flex: 1;
        min-width: 0;

        .file-details {
          display: flex;
          flex-direction: row;
          align-items: center;
          margin-left: 0.25rem;
          flex: 1;
          gap: 0.25rem;
          min-width: 0;

          .file-name {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-weight: 500;
          }

          .file-size {
            white-space: nowrap;
            flex-shrink: 0;
          }
        }
      }

      .file-actions {
        display: flex;
        gap: 0.25rem;
        align-items: center;
        flex-shrink: 0;
      }
    }
  `;
});
