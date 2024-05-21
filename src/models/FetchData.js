// Fetch data from API
const fetchDataFromAPI = async () => {
    try {
      const response = await fetch('http://universities.hipolabs.com/search?country=United%20Arab%20Emirates');
      const responseData = await response.json();
      const data = responseData.map((item, index) => {
        return { 
            id: index + 1,
            ...item
        }
      });
      localStorage.setItem('cachedData', JSON.stringify(data));
      return data;
    } catch (error) {
      throw new Error('Failed to fetch data from API');
    }
  };
//   reterive data from local storage when ever required
  const getCachedData = () => {
    const cachedData = localStorage.getItem('cachedData');
    return cachedData ? JSON.parse(cachedData) : [];
  };
  
  export { fetchDataFromAPI, getCachedData };