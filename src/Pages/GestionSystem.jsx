import { useState, useEffect } from "react";
import styles from "./GestionSystem.module.css";
import { Table } from "../Components/Table";
import { Modals } from "../Components/Modals";
import User from "../components/User";

function GestionSystem() {
  const [modalOpen, setModalOpen] = useState(false);
  const [rows, setRows] = useState([]); // Initially empty
  const [rowToEdit, setRowToEdit] = useState(null);

  useEffect(() => {
    async function getProductdetails() {
      // Example token, replace with actual
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("No token found in localStorage");
        return;
      }

      try {
        const res = await fetch("http://localhost:5296/api/Review", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch data from /api/Review");
        }
        const data = await res.json();
        console.log("Fetched rows:", data);
        setRows(data); // Set the review data
      } catch (err) {
        console.error("Error fetching product details:", err.message);
      }
    }
    getProductdetails();
  }, []);

  const handleDeleteRow = (targetIndex) => {
    setRows(rows.filter((_, idx) => idx !== targetIndex));
  };

  const handleEditRow = (idx) => {
    setRowToEdit(idx);
    setModalOpen(true);
  };

  const handleSubmit = (newRow) => {
    if (rowToEdit === null) {
      setRows([...rows, newRow]);
    } else {
      setRows(
        rows.map((currRow, idx) => (idx !== rowToEdit ? currRow : newRow))
      );
    }
  };

  return (
    <>
      <User />
      <div className={styles.GestionSystem}>
        <Table
          rows={rows}
          deleteRow={handleDeleteRow}
          editRow={handleEditRow}
        />
        <button onClick={() => setModalOpen(true)} className={styles.btn}>
          Add
        </button>
        {modalOpen && (
          <Modals
            closeModal={() => {
              setModalOpen(false);
              setRowToEdit(null);
            }}
            onSubmit={handleSubmit}
            defaultValue={rowToEdit !== null && rows[rowToEdit]}
          />
        )}
      </div>
    </>
  );
}

export default GestionSystem;
