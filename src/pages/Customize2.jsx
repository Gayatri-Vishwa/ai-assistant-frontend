import React, { useContext, useState } from "react";
import { userDataContext } from "../context/userContext";
import { IoMdArrowRoundBack } from "react-icons/io";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Customize2() {
  const { userData,setUserData,selectedImage, serverUrl, backendImage } =
    useContext(userDataContext);
  const [assistantName, setAssistantName] = useState(
    userData?.assistantName || ""
  );
  const [loading, setloading] = useState(false);
  const navigate=useNavigate()

  const handleUpdateAssistant = async () => {
    try {
      setloading(true);
      let formData = new FormData();
      formData.append("assistantName", assistantName);

      if (backendImage) {
        formData.append("assistantImage", backendImage);  // actual file // because in multer,we naed it same  "assistantImage" 
      } else {
        formData.append("imageUrl", selectedImage);      // prebuilt URL
      }

      const result = await axios.post(
        `${serverUrl}/api/user/update`,
        formData,
        {
          withCredentials: true,
          // headers: { "Content-Type": "multipart/form-data" },
        }
      );





// Frontend
// const result = await axios.post(
//   `${serverUrl}/api/user/update`,
//   formData,
//   {
//     headers: {
//       "Content-Type": "multipart/form-data",
//       Authorization: `Bearer ${userData.token}` // token saved from login/signup
//     }
//   }
// );





      console.log(result.data);
      setUserData(result.data);
      setloading(false);
      navigate('/')
    } catch (error) {
      console.log("update error",error)
    } finally {
      setloading(false);
    }
  };

  return (
    <div className="w-full  relative min-h-screen bg-gradient-to-t from-black to-[#030368] flex flex-col justify-center items-center py-10 px-4">
     
     <IoMdArrowRoundBack  onClick={()=>navigate('/customize')}
     className="absolute top-[30px] left-[30px] cursor-pointer text-white mb-[40px] w-[30px] h-[30px]"/>
      <h1 className="text-white text-4xl text-center mb-22">
        Enter Your <span className="text-blue-400"> Assistant Name</span>
      </h1>
      <input
        type="text"
        required
        onChange={(e) => setAssistantName(e.target.value)}
        value={assistantName}
        placeholder="eg. Shifra"
        className="w-full max-w-[600px] h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 rounded-full text-[18px] px-[20px] py-[10px]"
      />

      {assistantName && (
        <button
          onClick={handleUpdateAssistant}
          className="max-w-[270px] text-white w-full h-[60px] bg-white text-black rounded-full text-[17px] font-semibold mt-[25px] cursor-pointer"
          style={{
                background: "linear-gradient(90deg, #1b2a4b, #0f1a33)", // dark bluish gradient
                boxShadow:
                  "0 0 5px #3b82f6, 0 0 10px #3b82f6, 0 0 20px #3b82f6", // subtle blue glow
              }}
       >
          {loading ? "Loading..." : "Finally create Your Assistant"}
        </button>
      )}
    </div>
  );
}

export default Customize2;
