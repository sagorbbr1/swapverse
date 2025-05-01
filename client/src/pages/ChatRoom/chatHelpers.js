import axios from "axios";

export const startChat = async (userId) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/chats`,
      { userId },
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (err) {
    console.error("Failed to start chat:", err.response?.data || err.message);
    throw err;
  }
};
