import { BsFillTrashFill, BsFillPencilFill } from "react-icons/bs";
import styles from "./Table.module.css";
import PropTypes from "prop-types";
export const Table = ({ rows, deleteRow, editRow }) => {
  if (!Array.isArray(rows) || rows.length === 0) {
    return <div className="no-data">No data available</div>;
  }

  return (
    <div className={styles.tablewrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Product</th>
            <th>Customer</th>
            <th>Rating</th>
            <th>Review Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => {
            const { product, customer, rating, reviewDate } = row;

            return (
              <tr key={idx}>
                <td>{product.productName}</td>
                <td>
                  {customer.firstName} {customer.lastName}
                </td>
                <td>{rating}</td>
                <td>{new Date(reviewDate).toLocaleDateString()}</td>
                <td className={styles.fit}>
                  <span className={styles.actions}>
                    <BsFillTrashFill
                      className={styles.deletebtn}
                      onClick={() => deleteRow(idx)}
                    />
                    <BsFillPencilFill
                      className={styles.editbtn}
                      onClick={() => editRow(idx)}
                    />
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

Table.propTypes = {
  rows: PropTypes.node.isRequired,
  deleteRow: PropTypes.node.isRequired,
  editRow: PropTypes.node.isRequired,
};
