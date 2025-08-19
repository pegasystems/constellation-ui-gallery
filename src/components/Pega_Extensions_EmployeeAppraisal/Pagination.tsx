import React from 'react';
import type { PaginationProps } from './interfaces';

const Pagination: React.FC<PaginationProps> = ({ pageNumber, hasMoreResults, onPageChange }) => {
  const prevDisabled = pageNumber <= 1;

  return (
    <div style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }} className='pagination-container'>
      <button onClick={() => onPageChange(pageNumber - 1)} disabled={prevDisabled} type='button'>
        Prev
      </button>
      <button onClick={() => onPageChange(pageNumber + 1)} disabled={!hasMoreResults} type='button'>
        Next
      </button>
    </div>
  );
};

export default Pagination;
