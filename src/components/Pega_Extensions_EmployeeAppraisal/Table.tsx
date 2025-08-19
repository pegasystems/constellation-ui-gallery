import React from 'react';

type Column<T> = {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
};

type TableProps<T> = {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  loadingMessage?: string;
  onClick: (value: string, value2: string) => void;
};

function Table<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  loadingMessage = 'Loading...',
  onClick
}: TableProps<T>) {
  return (
    <div>
      { loading ? (
        <p className="notice">{loadingMessage}</p>
      ) : (
        <table>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={String(col.key)}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>No data available</td>
              </tr>
            ) : (
              data.map((row : any) => (
                <tr key={ row.EmployeeID }>
                  {columns.map((col) => {
                    const isAction = String(col.key) === 'Action';
                    let cellContent: React.ReactNode;
                    if (isAction) {
                      cellContent = (
                        <button
                          type="button"
                          onClick={() => onClick(row.EmployeeID, row.EmployeeName)}
                        >
                          View Details
                        </button>
                      );
                    } else if (col.render) {
                      cellContent = col.render(row);
                    } else {
                      cellContent = row[col.key as keyof T] ?? '';
                    }
                    return (
                      <td key={String(col.key)}>
                        {cellContent}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Table;
