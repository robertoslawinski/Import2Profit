import styles from "./DataTable.module.css";

export default function DataTable({ columns, rows, empty = "Sem dados para apresentar." }) {
  return (
    <div className={styles.wrap}>
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows?.length ? (
            rows.map((row) => (
              <tr key={row._id || row.id || row.sku || row.name}>
                {columns.map((column) => (
                  <td key={column.key}>{column.render ? column.render(row) : row[column.key]}</td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className={styles.empty}>{empty}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
