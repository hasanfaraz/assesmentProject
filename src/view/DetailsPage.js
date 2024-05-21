import React from 'react';
import { useParams } from 'react-router-dom';
import '../css/DetailsPage.css'; // Import CSS file

const DetailsPage = ({ data }) => {
  const { id } = useParams();
  // Data array of universities

  // Find the university by id
  const item = data.find(item => item.id === parseInt(id));

  //Fucntion to handle back
  const handleBack = () => {
    window.history.back();
  }

  // If item is not found, you can render a message or handle it accordingly
  if (!item) {
    return <div className="details-container">Item not found</div>;
  }

  return (
    <div className="details-wrapper">
      <header className="details-header">
        <h1>University Details</h1>
      </header>
      <div className="details-container">
        <table className="details-table">
          <tbody>
            <tr>
              <th>Name</th>
              <td>{item.name}</td>
            </tr>
            <tr>
              <th>Country</th>
              <td>{item.country}</td>
            </tr>
            {item['state-province'] && (
              <tr>
                <th>State/Province</th>
                <td>{item['state-province']}</td>
              </tr>
            )}
            <tr>
              <th>Website</th>
              <td><a href={item.web_pages[0]} target="_blank" rel="noopener noreferrer">{item.web_pages[0]}</a></td>
            </tr>
          </tbody>
        </table>
      </div>
      <button className="show-more-button" onClick={handleBack}>
                Back to List
              </button>
    </div>
  );
};

export default DetailsPage;
