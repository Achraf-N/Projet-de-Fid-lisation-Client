import styles from "./Modal.module.css";
import { useState } from "react";
import PropTypes from "prop-types";

export const Modal = ({ closeModal, onSubmit, defaultValue }) => {
  const [formState, setFormState] = useState(
    defaultValue || {
      reviewID: "",
      productID: "",
      productName: "",
      rating: "",
      customerID: "",
      customerName: "",
      reviewDate: "",
    }
  );
  const [errors, setErrors] = useState("");

  const validateForm = () => {
    const missingFields = Object.keys(formState).filter(
      (key) => !formState[key]
    );
    if (missingFields.length > 0) {
      setErrors(`Please fill in: ${missingFields.join(", ")}`);
      return false;
    }
    setErrors("");
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    onSubmit(formState);
    closeModal();
  };

  return (
    <div
      className={styles.modalcontainer}
      onClick={(e) => {
        if (e.target.className.includes("modalcontainer")) closeModal();
      }}
    >
      <div className={styles.modal}>
        <h2 className={styles.title}>Edit Review</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formgroup}>
            <label htmlFor="reviewID">Review ID</label>
            <input
              type="text"
              name="reviewID"
              onChange={handleChange}
              value={formState.reviewID}
              readOnly
            />
          </div>
          <div className={styles.formgroup}>
            <label htmlFor="productID">Product ID</label>
            <input
              type="text"
              name="productID"
              onChange={handleChange}
              value={formState.productID}
              readOnly
            />
          </div>
          <div className={styles.formgroup}>
            <label htmlFor="productName">Product Name</label>
            <input
              type="text"
              name="productName"
              onChange={handleChange}
              value={formState.productName}
              readOnly
            />
          </div>
          <div className={styles.formgroup}>
            <label htmlFor="rating">Rating</label>
            <input
              type="number"
              name="rating"
              onChange={handleChange}
              value={formState.rating}
              step="0.1"
              min="0"
              max="10"
            />
          </div>
          <div className={styles.formgroup}>
            <label htmlFor="customerID">Customer ID</label>
            <input
              type="text"
              name="customerID"
              onChange={handleChange}
              value={formState.customerID}
              readOnly
            />
          </div>
          <div className={styles.formgroup}>
            <label htmlFor="customerName">Customer Name</label>
            <input
              type="text"
              name="customerName"
              onChange={handleChange}
              value={formState.customerName}
              readOnly
            />
          </div>
          <div className={styles.formgroup}>
            <label htmlFor="reviewDate">Review Date</label>
            <input
              type="datetime-local"
              name="reviewDate"
              onChange={handleChange}
              value={formState.reviewDate}
            />
          </div>
          {errors && <div className={styles.error}>{errors}</div>}
          <div className={styles.modalactions}>
            <button type="submit" className={styles.btn}>
              Submit
            </button>
            <button
              type="button"
              className={styles.cancelbtn}
              onClick={closeModal}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

Modal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  defaultValue: PropTypes.shape({
    reviewID: PropTypes.number,
    productID: PropTypes.number,
    productName: PropTypes.string,
    rating: PropTypes.number,
    customerID: PropTypes.number,
    customerName: PropTypes.string,
    reviewDate: PropTypes.string,
  }),
};
