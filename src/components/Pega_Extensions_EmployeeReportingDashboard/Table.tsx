import React from 'react';

type Column<T> = {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  onSort?: () => void;
  button?: boolean;
  date?: boolean;
};

type TableProps<T> = {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  loadingMessage?: string;
  sortByField?: string;
  sortByType?: 'ASC' | 'DESC';
};

function Table<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  loadingMessage = 'Loading...',
  sortByField,
  sortByType
}: TableProps<T>) {
  return (
    <div style={{ position: 'relative' }}>
      <table>
        <thead>
          <tr>
            {columns.map((col, index) => {
              const isSorted = col.key === sortByField;
              return (
                <th
                  key={`header-${String(col.key)}-${index}`}
                  style={{ cursor: col.sortable ? 'pointer' : 'default', userSelect: 'none' }}
                  onClick={col.sortable ? col.onSort : undefined}
                >
                  <span>{col.label}</span>
                  {col.sortable && isSorted && (
                    <span style={{ marginLeft: '0.25rem' }}>
                      {sortByType === 'ASC' ? '▲' : '▼'}
                    </span>
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>No data available</td>
            </tr>
          ) : (
            data.map((row: any) => (
              <tr key={row.unique || row.pzInsKey || Math.random()}>
                {columns.map((col, colIndex) => {
                  let cellContent: React.ReactNode;
                  if (col.button) {
                    const value = row[col.key as keyof T] ?? '';
                    let label = '';

                    switch (value) {
                      case 'Pending':
                        label = 'Start Appraisal';
                        break;
                      case 'Completed':
                        label = 'View Summary';
                        break;
                      case 'InProgress':
                        label = 'Continue Appraisal';
                        break;
                      default:
                        label = 'Open';
                    }
                    const linkHref = `/appraisal/${row.EmployeeID}`;

                    cellContent = (
                      <a
                        href={linkHref}
                        className='action-button'
                        style={{ textDecoration: 'none', display: 'inline-block' }}
                      >
                        {label}
                      </a>
                    );
                  } else if (col.render) {
                    cellContent = col.render(row);
                  } else {
                    const value = row[col.key as keyof T] ?? '';

                    if (col.date && typeof value === 'string') {
                      const date = new Date(value);
                      cellContent = date.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      });
                    } else {
                      cellContent = value;
                    }

                  }

                  return (
                    <td key={`cell-${row.unique || row.pzInsKey}-${String(col.key)}-${colIndex}`}>
                      {cellContent}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {loading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(255,255,255,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none'
          }}
        >
          <p className="notice">{loadingMessage}</p>
        </div>
      )}
    </div>
  );
}

export default Table;
