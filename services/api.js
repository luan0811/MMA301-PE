import axios from 'axios';

const BASE_URL = 'https://66e7a752b17821a9d9d9817b.mockapi.io';

// Fetch all art tools
export const getArtTools = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/assignment`);
    return response.data;
  } catch (error) {
    console.error('Error fetching art tools:', error);
    throw error;
  }
};

// Fetch a single art tool by ID
export const getArtToolById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/assignment/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching art tool with id ${id}:`, error);
    throw error;
  }
};

