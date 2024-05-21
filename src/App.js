import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { fetchDataFromAPI, getCachedData } from './models/FetchData';
import ListingPage from './view/ListingPage';
import DetailsPage from './view/DetailsPage';
import '../src/css/App.css';

const App = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const cachedData = getCachedData();
    if (cachedData.length > 0) {
      setData(cachedData);
    } else {
      async function fetchData() {
        try {
          const newData = await fetchDataFromAPI();
          setData(newData);
          // Save fetched data to local storage
          localStorage.setItem('cachedData', JSON.stringify(newData));
        } catch (error) {
          console.log('Failed to fetch data from API');
        }
      }
      fetchData();
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<ListingPage data={data} />} />
        <Route path="/details/:id" element={<DetailsPage data={data} />} />
      </Routes>
    </Router>
  );
};

export default App;