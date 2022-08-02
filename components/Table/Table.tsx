import React, { useMemo } from "react";
import { useTable } from "react-table";
import tableStyles from "./table.module.scss";

export const Table = () => {
  const data = useMemo(
    () => [
      {
        iconCol: "Hello",
        nameCol: "World",
        linkCol: "World",
      },
      
    ],
    []
  );
  const columns = useMemo(
    () => [
      {
        Header: "Icon",
        accessor: "iconCol", // accessor is the "key" in the data
      },
      {
        Header: "Name",
        accessor: "nameCol",
      },
      {
        Header: "Link",
        accessor: "linkCol",
      },
    ],
    []
  );
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });
  return (
    <div className={tableStyles.tableContainer}>
      <table {...getTableProps()} className={tableStyles.table}>
        <thead className={tableStyles.tableHead}>
          {headerGroups.map((headerGroup, ind) => (
            <tr
              {...headerGroup.getHeaderGroupProps()}
              key={ind}
              className={tableStyles.tableRow}
            >
              {headerGroup.headers.map((column, ind) => (
                <th
                  {...column.getHeaderProps()}
                  key={ind}
                  className={tableStyles.th}
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()} className={tableStyles.tableBody}>
          {rows.map((row, ind) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                key={ind}
                className={tableStyles.tableRow}
              >
                {row.cells.map((cell, ind) => {
                  return (
                    <td
                      {...cell.getCellProps()}
                      key={ind}
                      className={tableStyles.tableData}
                    >
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
