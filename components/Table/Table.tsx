import React, { useMemo } from "react";
import { useTable } from "react-table";
import tableStyles from "./table.module.scss";

import { InferGetStaticPropsType } from "next";

interface TableProps {
  links: {
    id: string;
    shop_name: string;
    shop_url: string;
  };
}

export const Table: React.FC<TableProps> = ({ links }) => {
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
      {/* <div>
        {links.map((link, ind) => {
          return (
            <div key={ind}>
              <p>{link.shop_name}</p>
              <p>{link.shop_url}</p>
            </div>
          );
        })}
      </div> */}
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
