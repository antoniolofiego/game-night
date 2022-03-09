import { useState } from 'react';
import { useTable, useFilters, useSortBy } from 'react-table';

export const Table = ({ columns, data }) => {
  const [nameFilter, setNameFilter] = useState('');

  const handleNameChange = (e) => {
    const value = e.target.value || undefined;
    setNameFilter(value);
    setFilter('name', value);
  };

  const {
    getTableProps, // table props from react-table
    getTableBodyProps, // table body props from react-table
    headerGroups, // headerGroups, if your table has groupings
    rows, // rows for the table based on the data passed
    prepareRow,
    setFilter, // Prepare the row (this function needs to be called for each row before getting the row props)
  } = useTable(
    {
      columns,
      data,
    },
    useFilters,
    useSortBy
  );

  return (
    <>
      <input
        value={nameFilter}
        onChange={handleNameChange}
        placeholder={'Search name'}
      />
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr key={Math.random()} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  key={Math.random()}
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className={
                    column.isSorted
                      ? column.isSortedDesc
                        ? 'sort-desc'
                        : 'sort-asc'
                      : ''
                  }
                >
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr key={Math.random()} {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td
                      key={Math.random()}
                      {...cell.getCellProps()}
                      className='max-w-lg text-center border'
                    >
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};
