import styled, { css } from 'styled-components';

export default styled.div(() => {
  return css`
    /* All-decided summary banner */
    .summary-banner {
      display: flex;
      align-items: center;
      padding: 0.5rem 0.75rem;
      border-radius: 0.25rem;
    }

    .summary-banner--success {
      background-color: #f3faf5;
    }

    .summary-banner--urgent {
      background-color: #fff5f5;
    }

    /* Progress pills row */
    .progress-pills {
      flex-wrap: wrap;
    }

    .pill {
      display: inline-block;
      height: 0.375rem;
      flex: 1 1 1.5rem;
      border-radius: 0.25rem;
      min-width: 1rem;
      max-width: 3rem;
      cursor: pointer;
      transition: background-color 0.2s ease, transform 0.1s ease;

      &:hover {
        transform: scaleY(1.6);
      }
    }

    .pill--active {
      transform: scaleY(1.6);
    }

    .pill--pending {
      background-color: #e0e0e0;
    }

    .pill--current {
      background-color: #0070d2;
    }

    .pill--accepted {
      background-color: #2e844a;
    }

    .pill--rejected {
      background-color: #c23934;
    }

    .pill--locked {
      background-color: #e0e0e0;
      opacity: 0.4;
      cursor: not-allowed;

      &:hover {
        transform: none;
      }
    }

    /* Field rows inside the profile card */
    .field-row {
      border-bottom: 0.0625rem solid #f0f0f0;
      padding: 0.375rem 0;

      &:last-child {
        border-bottom: none;
      }
    }

    .field-label {
      min-width: 10rem;
      font-weight: 600;
    }

    .field-value {
      flex: 1;
    }

    /* Reject button — override to red/destructive */
    .btn-reject-wrapper button {
      background-color: #c23934;
      border-color: #c23934;
      color: #ffffff;

      &:hover,
      &:focus {
        background-color: #a31f1a;
        border-color: #a31f1a;
        color: #ffffff;
      }

      &:active {
        background-color: #8a1915;
        border-color: #8a1915;
      }
    }
  `;
});
