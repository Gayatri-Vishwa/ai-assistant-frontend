import React, { createContext } from "react";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
// 
export const userDataContext = createContext();

function UserContext({ children }) {
  const [userData, setUserData] = useState(null);
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [historyy, setHistoryy] = useState([]); 

// axios.defaults.baseURL = "https://ai-assistant-se75.onrender.com";
axios.defaults.withCredentials = true;



  const serverUrl = "https://ai-assistant-se75.onrender.com";
  // const serverUrl = "https://ai-assistant-chi-wheat.vercel.app";
  

  const handleCurrentUser = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/current`, {
        withCredentials: true,
      });
      setUserData(result.data);
      // console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  };




 
  const getGeminiResponse = async (command) => {
  try {
    const result = await axios.post(
      `${serverUrl}/api/user/asktoassistant`,
      { command },
      { withCredentials: true }
    );
    return result.data; // always has .response
  } catch (error) {
    console.error("🔥 Gemini request failed:", error);
    return { response: "Assistant failed to respond" };
  }
};


  useEffect(() => {
    handleCurrentUser();
  },[]);

  const value = {
    serverUrl,
    userData,
    setUserData,
    handleCurrentUser,
    backendImage,
    setBackendImage,
    frontendImage,
    selectedImage,
    setSelectedImage,
    setFrontendImage,
    getGeminiResponse,
    historyy,
    setHistoryy,
  };

  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
}

export default UserContext;

