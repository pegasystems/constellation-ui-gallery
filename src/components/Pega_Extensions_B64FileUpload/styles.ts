import styled from 'styled-components';

export default styled.div`
  .upload-box {
    border: 0.125rem dashed #d0d0d0;
    border-radius: 0.5rem;
    padding: 0.25rem 0.5rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    background-color: #f9f9f9;
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
      border-color: #0066cc;
      background-color: #f0f5ff;
    }

    &.dragging {
      border-color: #0066cc;
      background-color: #e6f0ff;
    }

    .upload-text {
      margin: 0;
      color: #575757;
      font-size: 0.75rem;
      white-space: nowrap;
    }
  }

  .file-loaded {
    border: 0.125rem solid #d0d0d0;
    border-radius: 0.5rem;
    padding: 0.25rem 0.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #f9f9f9;
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
          color: #333333;
          font-size: 0.8rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-weight: 500;
        }

        .file-size {
          color: #888888;
          font-size: 0.7rem;
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

      .remove-button {
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.25rem;
        border-radius: 0.25rem;
        color: #0066cc;
        font-size: 1.25rem;
        font-weight: bold;
        line-height: 1;
        transition: all 0.2s ease;

        &:hover {
          color: #004199;
          background-color: #f0f5ff;
        }

        &:focus {
          outline: 0.125rem solid #0066cc;
          outline-offset: 0.125rem;
        }
      }
    }
  }
`;
