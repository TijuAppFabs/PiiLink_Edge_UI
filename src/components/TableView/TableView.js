// TableView.js
import React from "react";
import "./TableView.scss";

const TableView = ({
  th,
  data,
  showActions = false,
  showCommand = false,
  showEye = false,
  selectedIds = [],
  onRowClick,
}) => {
  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            {th.map((t, i) => (
              <th key={i}>{t}</th>
            ))}
            {showActions && <th>Action(s)</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => {
            const rowId = row.Id || row.ID || row.id; 
            const isSelected = selectedIds.includes(rowId);
            return (
              <tr
                key={rowIndex}
                className={isSelected ? "row-selected" : ""}
                onClick={() => onRowClick && onRowClick(row)}
                style={{ cursor: "pointer" }}
              >
                {Object.values(row).map((value, colIndex) => (
                  <td key={colIndex}>{value}</td>
                ))}
                {showActions && <td>{/* extra actions if needed */}</td>}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TableView;
