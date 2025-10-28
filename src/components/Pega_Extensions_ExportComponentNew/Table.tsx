import React from 'react';

type Column<T> = {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  onSort?: () => void;
  date?: boolean;
};


type TableProps<T> = {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  loadingMessage?: string;
  onClick?: (value: string, value2: string) => void;
  sortByField?: string;
  sortByType?: 'ASC' | 'DESC';
};

function Table<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  loadingMessage = 'Loading...',
  onClick,
  sortByField,
  sortByType
}: TableProps<T>) {
  return (
    <div style={{ position: 'relative' }}>
      <table>
        <thead>
          <tr>
            {columns.map((col) => {
              const isSorted = col.key === sortByField;
              return (
                <th
                  key={String(col.key)}
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
            data.map((row : any) => (
              <tr key={row.pzInsKey}>
                {columns.map((col) => {
                  const isAction = String(col.key) === 'Action';
                  let cellContent: React.ReactNode;
                  if (isAction) {
                    cellContent = (
                      <button
                        type="button"
                        onClick={() => onClick?.(row.EmployeeID, row.EmployeeName)}
                      >
                        View Details
                      </button>
                    );
                  } else if (col.render) {
                    cellContent = col.render(row);
                  } else {
                    const value = row[col.key as keyof T] ?? '';
                    if (col.date && typeof value === 'string' && value) {
                      const date = new Date(value);
                      if (!Number.isNaN(date)) {
                        cellContent = date.toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        });
                      } else {
                        cellContent = value; // fallback if invalid date
                      }
                    } else {
                      cellContent = value;
                    }
                  }
                  return <td key={String(col.key)}>{cellContent}</td>;
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Loading overlay */}
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
