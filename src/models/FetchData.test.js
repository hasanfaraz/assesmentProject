import { fetchDataFromAPI, getCachedData } from './FetchData';

describe('fetchDataFromAPI', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    localStorage.clear();
  });

  it('should fetch data from API and store it in localStorage', async () => {
    const mockData = [
      {
        alpha_two_code: "AE",
        country: "United Arab Emirates",
        domains: ["mbzuai.ac.ae"],
        id: 1,
        name: "Mohamed bin Zayed University of Artificial Intelligence (MBZUAI)",
        'state-province': "Abu Dhabi",
      },
      {
        alpha_two_code: "AE",
        country: "United Arab Emirates",
        domains: ["mbzuai.ac.ae"],
        id: 1,
        name: "Mohamed bin Zayed University of Artificial Intelligence (MBZUAI)",
        'state-province': "Abu Dhabi",
      }];
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockData)
    });

    const data = await fetchDataFromAPI();

    expect(data).toEqual(mockData);
  });

  it('should throw an error when fetch fails', async () => {
    global.fetch.mockRejectedValue(new Error('Failed to fetch'));

    await expect(fetchDataFromAPI()).rejects.toThrow('Failed to fetch data from API');
  });
});

describe('getCachedData', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return parsed data from localStorage if available', () => {
    const mockData = [{ name: 'University A' }, { name: 'University B' }];
    localStorage.setItem('cachedData', JSON.stringify(mockData));

    const data = getCachedData();

    expect(data).toEqual(mockData);
  });

  it('should return an empty array if there is no data in localStorage', () => {
    const data = getCachedData();

    expect(data).toEqual([]);
  });
});
