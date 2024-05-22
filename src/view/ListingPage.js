import React, { useEffect, useState } from "react";
import { fetchDataFromAPI, getCachedData } from "../models/FetchData";
import { useNavigate } from "react-router-dom";
import "../css/ListingPage.css"; // Import CSS file

// Modal Component
const Modal = ({ isOpen, closeModal, handleConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Are you sure you want to delete this item?</h2>
        <div className="modal-buttons">
          <button className="delete-button" onClick={handleConfirm}>Delete</button>
          <button onClick={closeModal}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

const ListingPage = () => {
  const history = useNavigate();
  const [data, setData] = useState([]); // This state will hold all the records retrieved from API
  const [filteredData, setFilteredData] = useState([]); // this state will alsways store filtered data
  const [currentPage, setCurrentPage] = useState(1); // State to store current page count
  const [sortOrder, setSortOrder] = useState("asc"); // State to store the sort order
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [itemIdToDelete, setItemIdToDelete] = useState(null); // State to store item ID to delete
  const recordsPerPage = 10;
  const [isLoading, setLoading] = useState(true); // State to show loading message

  useEffect(() => {
    // check if data is already exist in local storage then only call API
    const cachedData = getCachedData();
    if (cachedData.length > 0) {
        setData(cachedData);
        setFilteredData(cachedData.slice(0, recordsPerPage));
        setLoading(false);
    } else {
    async function fetchData() {
      try {
        const newData = await fetchDataFromAPI();
        setData(newData);
        setFilteredData(newData.slice(0, recordsPerPage));
      } catch (error) {
        const cachedData = getCachedData();
        if (cachedData.length === 0) {
          console.log("Failed to fetch data from API");
        } else {
          setData(cachedData);
          setFilteredData(cachedData.slice(0, recordsPerPage));
        }
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    }       
  }, []);

//   On click redirect to the details page with ID
  const handleItemClick = (id) => {
    history(`/details/${id}`);
  };

//   Here i am sorting the list alphbatically asc and dsc order
  const handleSort = () => {
    const sortedData = [...data].sort((a, b) => {
      if (sortOrder === "asc") {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
    setData(sortedData);
    setFilteredData(sortedData.slice(0, currentPage * recordsPerPage));
    setSortOrder(sortOrder === "asc" ? "desc" : "asc"); // Toggle sort order
  };

  const handleSearch = (keyword) => {
    const filtered = data.filter((item) =>
      item.name.toLowerCase().includes(keyword.toLowerCase())
    );
    setFilteredData(filtered.slice(0, currentPage * recordsPerPage));
  };

  const handleDelete = (id) => {
    setItemIdToDelete(id);
    setShowModal(true);
  };

  const confirmDelete = () => {
    const updatedData = data.filter((item) => item.id !== itemIdToDelete);
    setData(updatedData);
    setFilteredData(updatedData.slice(0, currentPage * recordsPerPage));
    // Update local storage
    localStorage.setItem("cachedData", JSON.stringify(updatedData));
    setShowModal(false);
  };
// Here we will show next 10 records from the list
  const handleShowMore = () => {
    setCurrentPage((prevPage) => prevPage + 1);
    setFilteredData(data.slice(0, (currentPage + 1) * recordsPerPage));
  };

  const handleShowLess = () => {
    setCurrentPage((prevPage) => 1);
    setFilteredData(data.slice(0, currentPage * recordsPerPage));
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
    <div>
        <header className="details-header">
            <h1>List of Universities</h1>
        </header>
    </div>
    <div className="listing-container">
      {isLoading ? (
        <div className="loading-message">
          <button className="show-more-button">Loading...</button>
        </div>
      ) : (
        <div>
          <div className="btn-container">
            <button className="sort-button" onClick={handleSort}>
              Sort By Name {sortOrder === "asc" ? "▲" : "▼"}
            </button>
            <input
              className="listing-input"
              type="text"
              placeholder="Search..."
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <ul className="listing-list">
            {filteredData.map((item) => (
              <li
                key={item.id}
                className="listing-item"
                onClick={() => handleItemClick(item.id)}
              >
                <div className="listing-name">{item.name}</div>
                <div>
                  <button
                    className="delete-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="show-more-container">
            {filteredData.length < data.length ? (
              <button className="show-more-button" onClick={handleShowMore}>
                Show More Results...
              </button>
            ) : (
              <button className="show-more-button" onClick={handleShowLess}>
                Show Less Results...
              </button>
            )}
          </div>
        </div>
      )}

      {/* Modal Component */}
      <Modal
        isOpen={showModal}
        closeModal={closeModal}
        handleConfirm={confirmDelete}
      />
    </div>
    </>
  );
};

export default ListingPage;
