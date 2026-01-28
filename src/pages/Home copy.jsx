// // /////imp histry

// /////imp histry   vry vry imp code not to delete=======================

import React, { useContext, useRef, useState } from "react";
import { userDataContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import { BiMenuAltRight } from "react-icons/bi";
import { RxCross2 } from "react-icons/rx";
import aiImg from "../assets/assistant.gif";
import userImg from "../assets/user.gif";

import axios from "axios";
import { useEffect } from "react";

function Home() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("Sleeping");
  const [speechAllowed, setSpeechAllowed] = useState(false);
  const [hamb, setHamb] = useState(false);
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const [showHistory, setShowHistory] = useState(false);

  const toggleHistory = () => {
    setShowHistory((prev) => !prev);
  };

  const { serverUrl, setUserData, userData, getGeminiResponse } =
    useContext(userDataContext);

  //  const [listening, setListening] = useState(false);
  const isSpeakingRef = useRef(false);
  const recognitionRef = useRef(null);
  const synth = window.speechSynthesis;
  const isRecognizingRef = useRef(false);
const isApiCallingRef = useRef(false);

  // const enableSpeech = () => {
  //   synth.cancel();
  //   const test = new SpeechSynthesisUtterance("Speech enabled!");
  //   synth.speak(test);
  //   isSpeakingRef.current = true;
  //   setSpeechAllowed(true);
  //   console.log(" Speech permission unlocked");
  // };


  const handleLogout = async () => {
  try {
    // Stop speech synthesis immediately
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    // Stop mic if active
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort(); // safe stop
        console.log("🛑 Mic stopped on logout");
      } catch (e) {
        console.warn("Mic stop error on logout:", e);
      }
    }

    // Reset speaking state so onend/onresult handlers won't restart mic
    isSpeakingRef.current = false;
    isRecognizingRef.current = false;
    setAiText("");
    setUserText("");
    setStatus("Sleeping");

    // Logout API
    await axios.get(`${serverUrl}/api/auth/logout`, {
      withCredentials: true,
    });

    setUserData(null);
    navigate("/signup");
  } catch (error) {
    console.log(error);
  } finally {
    setUserData(null);
  }
};


  const clearHistory = async () => {
    try {
      await axios.delete(`${serverUrl}/api/user/clear-history`, {
        withCredentials: true,
      });

      setUserData((prev) => ({
        ...prev,
        history: [],
      }));
    } catch (error) {
      console.error("Failed to clear history", error);
    }
  };

  const speak = (text) => {
    if (!text) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    setUserText("");

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "hi-IN";

    const voices = synth.getVoices();
    const hindiVoice = voices.find((v) => v.lang === "hi-IN");
    if (hindiVoice) utter.voice = hindiVoice;

    // Pause mic before speaking
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
        console.log("🔇 Mic paused during speech");
      } catch (e) {
        console.warn("Abort error:", e);
      }
    }

    isSpeakingRef.current = true;

    // Speech starts
    utter.onstart = () => {
      console.log("🗣️ Speaking started");
      setStatus("Speaking"); // <---- moved here!
    };

    utter.onend = () => {
      console.log("✅ Speech finished");
      isSpeakingRef.current = false;
      setAiText("");
      setStatus("Pausing");

      // Restart mic safely
      setTimeout(() => {
        if (recognitionRef.current) {
          try {
            recognitionRef.current.start();
            setStatus("Listening");
            console.log("🎧 Restarted listening after speaking");
          } catch (err) {
            console.warn("⚠️ Mic restart error:", err);
          }
        }
      }, 1200);
    };

    utter.onerror = (e) => console.log("❌ Speech error:", e);
    synth.speak(utter);
  };

  
  const handleCommand = (data) => {
    const { type, userInput, response } = data;
    speak(response || "Okay.");
    speak(response);
    console.log("Command received:", data.response);

    if (!data || typeof data !== "object") {
      console.warn("Invalid data received:", data);
      speak("Sorry, I couldn't process that command.");
      return;
    }

    if (type === "calculator_open") {
      window.open(`https://www.google.com/search?q=calculator`, "_blank");
    }
    if (type === "instagram_open") {
      window.open(`https://www.instagram.com/`, "_blank");
    }
    if (type === "google_search") {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}'`, "_blank");
    }
  
    if (type === "facebook_open") {
      window.open(`https://www.facebook.com/`, "_blank");
    }
    if (type === "weather_show") {
      window.open(`https://www.google.com/search?q=weather`, "_blank");
    }
    if (type === "youtube_search" || type === "youtube_play") {
      const query = encodeURIComponent(userInput);
      window.open(
        `https://www.youtube.com/results?search_query=${query}`,
        "_blank",
      );
    }
  };

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";
    // recognitionRef.interimResults = false;
    recognition.interimResults = false;

    recognitionRef.current = recognition;
    let isMounted = true; //  flag to avoid setState on unmounted component

    // start recognition after 1  second delay only if component still mounted
    const startTimeout = setTimeout(() => {
      if (isMounted && !isSpeakingRef.current) {
        try {
          recognition.start();
          setStatus("Listening");
          // console.log("Recognition requested to start");
        } catch (error) {
          if (error.name !== "InvalidStateError") {
            console.error(error);
          }
        }
      }
    }, 1000);

    let restartTimeout;
    const safeRecognition = () => {
      clearTimeout(restartTimeout);
      restartTimeout = setTimeout(() => {
        if (!isRecognizingRef.current && !isSpeakingRef.current) {
          try {
            recognition.start();
            isRecognizingRef.current = true;
            console.log("🎧 Safe recognition restart");
            setStatus("Listening");
          } catch (err) {
            if (err.name !== "InvalidStateError") console.error(err);
          }
        }
      }, 1500);
    };

    recognition.onstart = () => {
      console.log("Recognition started");
      isRecognizingRef.current = true;
      setStatus("Listening");
    };

    // recognition.onend = () => {
    //   console.log("🎤 Recognition ended");
    //   isRecognizingRef.current = false;

    //   //  Restart after small delay (only if not speaking)
    //   if (!isSpeakingRef.current) {
    //     setTimeout(() => {
    //       try {
    //         // recognition.start();
    //         safeRecognition();
    //         console.log("🔁 Recognition restarted automatically");
    //         setStatus("Listening");
    //       } catch (error) {
    //         if (error.name === "InvalidStateError") {
    //           console.warn("Recognition already active");
    //         } else {
    //           console.error(error);
    //         }
    //       }
    //     }, 800); // delay to let browser release mic
    //   } else {
    //     console.log(" Skipping restart because we’re speaking");
    //   }
    // };
    recognition.onend = () => {
  console.log("🎤 Recognition ended");
  isRecognizingRef.current = false;

  if (isSpeakingRef.current) {
    console.log("Skipping restart because speaking");
  }
};


    recognition.onerror = (event) => {
      // console.warn("Recognition error", event.error);
      isRecognizingRef.current = false;
      // setListening(false);
      setStatus("Sleeping");
      if (event.error !== "aborted" && isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          if (isMounted) {
            try {
              // recognition.start()
              safeRecognition();
              setStatus("Listening");
              // console.log("Recognition started after error");
            } catch (error) {
              if (error.name !== "InvalidStateError")
                console.error("Start error ", error);
            }
          }
        }, 1000);
      }
    };

    ///mine
    recognition.onresult = async (e) => {


      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      console.log("heard:", transcript);
            if (transcript.length < 3) {
  console.log("Ignoring short noise input");
  return;
}

      // stop mic immediately
      setAiText("");
      setUserText(transcript);
      recognition.stop();
      isRecognizingRef.current = false;
      setStatus("Pausing");

      setUserText(transcript);
      const data = await getGeminiResponse(transcript);

      setUserData((prev) =>
        prev
          ? { ...prev, history: [...(prev.history || []), transcript] }
          : prev,
      );

      if (!data) {
        console.error(" getGeminiResponse returned undefined for:", transcript);
        speak("Sorry, I didn’t understand that.");
        return;
      }

      // handleCommand(data);
      handleCommand(data); // <-- speaks inside here
      setAiText(data.response);
      setUserText("");
    };

    return () => {
      recognition.stop();
      isMounted = false;
      // setListening(false)
      setStatus("Sleeping");
      isRecognizingRef.current = false;

      clearTimeout(startTimeout);
    };
  }, []);




  return (
    <div className="w-full min-h-screen  h-[100vh]  bg-gradient-to-t  from-black to-[#04044d] flex flex-col gap-[15px] justify-center items-center p-6 ">
      {showHistory ? (
 
          <div className="max-h-screen w-full">
       

          <div className="flex fixed inset-0 z-50 flex-col h-[30%] sm:flex-row gap-4 sm:gap-6 mx-auto w-1/2 items-center justify-center">
            <button
              onClick={handleLogout}
              className="w-full sm:w-auto min-w-[140px] h-[48px] sm:h-[56px]
               text-white rounded-full
               text-sm sm:text-base font-semibold
               px-6 transition transform hover:scale-105"
              style={{
                background: "linear-gradient(90deg, #1b2a4b, #0f1a33)", // dark bluish gradient
                boxShadow:
                  "0 0 5px #3b82f6, 0 0 10px #3b82f6, 0 0 20px #3b82f6", // subtle blue glow
              }}
            >
              Log Out
            </button>

            <button
              onClick={() => navigate("/customize")}
              className="w-full sm:w-auto min-w-[180px] h-[48px] sm:h-[56px]
               text-white rounded-full
               text-sm sm:text-base font-semibold
               px-6 transition transform hover:scale-105"
              style={{
                background: "linear-gradient(90deg, #1e3b6a, #11233d)", // slightly brighter blue
                boxShadow:
                  "0 0 5px #3b82f6, 0 0 10px #3b82f6, 0 0 25px #3b82f6", // glowing effect
              }}
            >
              Customize Assistant
            </button>

            <button
              onClick={clearHistory}
              className="w-full sm:w-auto min-w-[160px] h-[48px] sm:h-[56px]
               text-white rounded-full
               text-sm sm:text-base font-semibold
               px-6 transition transform hover:scale-105"
              style={{
                background: "linear-gradient(90deg, #19294f, #0e1a34)", // dark purple-blue
                boxShadow:
                  "0 0 5px #5c7ef0, 0 0 10px #5c7ef0, 0 0 20px #5c7ef0", // subtle glow
              }}
            >
              Clear History
            </button>
          </div>
 
 <div className="w-full h-1 fixed top-[30%] bg-gray-400 mt-7">
           {/* <div className="w-full h-1 fixed top-[30%] bg-gray-400 mt-7"></div> */}
          <h1 className="text-white fixed top-[30%] font-semibold text-[19px] m-7">History</h1>
          <div className="w-full h-[60%] fixed top-[40%] z-50 overflow-y-auto  flex flex-col gap-[20px] ">
            {userData.history &&
              userData.history.map((his, idx) => (
                <span
                  key={idx}
                  // className="text-gray-200 text-[18px] truncate "
                  className="text-gray-200 text-[18px] ml-4"
                >
                  {idx + 1}. {his}
                </span>
              ))}
          </div>
</div>
          <RxCross2
            onClick={() => setShowHistory(false)}
            className="text-white mt-4 absolute top-[20px] right-[20px] w-[25px] h-[25px]  "
          />
        </div>

      ) : (
        <>
          <BiMenuAltRight
            onClick={() => setHamb(true)}
            className="text-white block lg:hidden  mt-4 absolute top-[20px] right-[20px] w-[25px] h-[25px]  "
          />
          {hamb && (
            <div
              className={`${
                hamb ? "translate-x-0" : "translate-x-full"
              } fixed top-0 left-0 w-screen h-screen bg-[#00000053] backdrop-blur-lg z-50`}
            >
              {/* menu content */}
              
        

              {/* showHistory ? ( */}
        <div className="max-h-screen">
       

          <div className="flex fixed inset-0 z-50 flex-col h-[30%] sm:flex-row gap-4 sm:gap-6 mx-auto w-1/2 items-center justify-center">
            <button
              onClick={handleLogout}
              className="w-full sm:w-auto min-w-[140px] h-[48px] sm:h-[56px]
               text-white rounded-full
               text-sm sm:text-base font-semibold
               px-6 transition transform hover:scale-105"
              style={{
                background: "linear-gradient(90deg, #1b2a4b, #0f1a33)", // dark bluish gradient
                boxShadow:
                  "0 0 5px #3b82f6, 0 0 10px #3b82f6, 0 0 20px #3b82f6", // subtle blue glow
              }}
            >
              Log Out
            </button>

            <button
              onClick={() => navigate("/customize")}
              className="w-full sm:w-auto min-w-[180px] h-[48px] sm:h-[56px]
               text-white rounded-full
               text-sm sm:text-base font-semibold
               px-6 transition transform hover:scale-105"
              style={{
                background: "linear-gradient(90deg, #1e3b6a, #11233d)", // slightly brighter blue
                boxShadow:
                  "0 0 5px #3b82f6, 0 0 10px #3b82f6, 0 0 25px #3b82f6", // glowing effect
              }}
            >
              Customize Assistant
            </button>

            <button
              onClick={clearHistory}
              className="w-full sm:w-auto min-w-[160px] h-[48px] sm:h-[56px]
               text-white rounded-full
               text-sm sm:text-base font-semibold
               px-6 transition transform hover:scale-105"
              style={{
                background: "linear-gradient(90deg, #19294f, #0e1a34)", // dark purple-blue
                boxShadow:
                  "0 0 5px #5c7ef0, 0 0 10px #5c7ef0, 0 0 20px #5c7ef0", // subtle glow
              }}
            >
              Clear History
            </button>
          </div>
 
 <div className="w-full h-1 fixed top-[30%] bg-gray-400 mt-7">
           {/* <div className="w-full h-1 fixed top-[30%] bg-gray-400 mt-7"></div> */}
          <h1 className="text-white fixed top-[30%] font-semibold text-[19px] m-7">History</h1>
          <div className="w-full h-[60%] fixed top-[40%] z-50 overflow-y-auto  overflow-x-auto whitespace-nowrap flex flex-col gap-[20px] ">
            {userData.history &&
              userData.history.map((his, idx) => (
                <span
                  key={idx}
                  // className="text-gray-200 text-[18px] truncate "
                  className="text-gray-200 text-[18px] ml-4"
                >
                  {idx + 1}. {his}
                </span>
              ))}
          </div>
</div>
          <RxCross2
            onClick={() => setShowHistory(false)}
            className="text-white mt-4 absolute top-[20px] right-[20px] w-[25px] h-[25px]  "
          />
        </div>
      {/* ) */}

              <RxCross2
                onClick={() => setHamb(false)}
                className="text-white mt-4 absolute top-[20px] right-[20px] w-[25px] h-[25px]  "
              />
            </div>
          )}

          <button
            onClick={handleLogout}
            className="min-w-[150px] text-white   hidden lg:block absolute top-[20px] right-[20px] h-[60px] bg-white text-black rounded-full text-[17px] font-semibold mt-[20px] cursor-pointer"
          style={{
                background: "linear-gradient(90deg, #1b2a4b, #0f1a33)", // dark bluish gradient
                boxShadow:
                  "0 0 5px #3b82f6, 0 0 10px #3b82f6, 0 0 20px #3b82f6", // subtle blue glow
              }}
            
         >
            Log Out
          </button>
          <button
            onClick={() => navigate("/customize")}
            className="min-w-[150px]   hidden lg:block absolute top-[100px] px-[20px] py-[10px] right-[20px] h-[60px] bg-blue-600 text-white rounded-full text-[17px] font-semibold mt-[20px] cursor-pointer"
              style={{
                background: "linear-gradient(90deg, #1b2a4b, #0f1a33)", // dark bluish gradient
                boxShadow:
                  "0 0 5px #3b82f6, 0 0 10px #3b82f6, 0 0 20px #3b82f6", // subtle blue glow
              }}
          >
            Customize  Assistant
          </button>
          <button
            onClick={toggleHistory}
            className="min-w-[150px] text-white  hidden lg:block absolute top-[180px] right-[20px] h-[60px] bg-white text-black rounded-full text-[17px] font-semibold mt-[20px] cursor-pointer"
             style={{
                background: "linear-gradient(90deg, #1b2a4b, #0f1a33)", // dark bluish gradient
                boxShadow:
                  "0 0 5px #3b82f6, 0 0 10px #3b82f6, 0 0 20px #3b82f6", // subtle blue glow
              }}>
            history
          </button>

          <div className=" w-[300px] h-[400px] flex justify-center items-center overflow-hidden   ">
            <img
              src={userData?.assistantImage}
              alt=""
              className="h-full object-cover rounded-4xl shadow-lg"
              
              
            />
          </div>

          <h1 className="text-white text-2xl">
            I'm{" "}
            <span
              className={`text-2xl font-bold transition-colors duration-300 ${
                status === "Listening"
                  ? "text-green-400"
                  : status === "Speaking"
                    ? "text-blue-400"
                    : "text-yellow-400"
              }`}
            >
              {userData?.assistantName || "Assistant"}
            </span>
          </h1>

          {/* Dynamic Status Text based on the new 'status' state */}
          <p className="text-gray-300 text-lg font-mono tracking-wider">
            Status:
            {status === "Listening" ? (
              <span className="text-green-400 font-semibold">LISTENING...</span>
            ) : status === "Speaking" ? (
              <span className="text-blue-400 font-semibold">SPEAKING...</span>
            ) : status === "Pausing" ? (
              <span className="text-yellow-300 font-semibold">PAUSING...</span>
            ) : (
              <span className="text-yellow-400 font-semibold">SLEEPING</span>
            )}
          </p>
          <div className="h-44 w-44">
            {!aiText && (
              <img
                src={userImg}
                alt=""
                className="h-full w-full object-cover"
              />
            )}
            {aiText && (
              <img src={aiImg} alt="" className="h-full w-full object-cover" />
            )}
          </div>
          <h1 className="text-white text-xl font-semibold text-center w-[70%] mx-auto ">
            {userText ? `you - ${userText}` : aiText ? `Ai - ${aiText}` : null}
          </h1>


{/*   enable button      */}
          {/* {!speechAllowed && (
            <button
              onClick={enableSpeech}
              className="bg-blue-600 text-white px-4 py-2 rounded "
                style={{
                background: "linear-gradient(90deg, #19294f, #0e1a34)", // dark purple-blue
                boxShadow:
                  "0 0 5px #5c7ef0, 0 0 10px #5c7ef0, 0 0 20px #5c7ef0", // subtle glow
              }}
            >
              Enable Voice
            </button>
          )} */}
        </>
      )}{" "}
    </div>
  );
}

export default Home;

























