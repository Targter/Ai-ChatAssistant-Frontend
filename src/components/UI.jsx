import { useRef, useState } from "react";
import { FaMicrophone } from "react-icons/fa";
import { useChat } from "../hooks/useChat";

import "regenerator-runtime/runtime"; // Import regenerator-runtime globally
import VoiceRecognition from "./VoiceRecognization";
export const UI = ({ hidden, ...props }) => {
  const [inputValue, setInputValue] = useState("");
  const input = useRef();
  const {
    loading,
    cameraZoomed,
    setCameraZoomed,
    message,
    audioPlaying,
    fetchAudio,
  } = useChat();

  const sendMessage = () => {
    const text = input.current?.value; // Safely access input value
    if (input.current) {
      setInputValue(text);
      input.current.value = ""; // Clear the input value
      input.current.placeholder = "";
      if (text && text.trim() !== "") {
        console.log("call input");
        fetchAudio(text);
      }
    }
  };
  if (hidden) {
    return null;
  }

  const [isListening, setIsListening] = useState(false);
  const toggleListening = () => {
    setIsListening((prevState) => !prevState); // Toggle the listening state
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bottom-0 z-10  flex justify-between p-4 flex-col pointer-events-none ">
        <div className="w-full flex h-[70px] fixed p-2 top-0 left-0 bg-[#000000ba]">
          <div className="bgimage h-full w-full ml-3"></div>
        </div>
        {/* <div className="pointer-events-auto"> </div> */}
        <div className="w-full flex flex-col items-end justify-center gap-4 mt-[100px] ">
          <button
            onClick={() => setCameraZoomed(!cameraZoomed)}
            className="pointer-events-auto bg-gray-500 hover:bg-gray-600 text-white p-4 rounded-md"
          >
            {cameraZoomed ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
                />
              </svg>
            )}
          </button>
          <button
            onClick={() => {
              const body = document.querySelector("body");
              if (body.classList.contains("greenScreen")) {
                body.classList.remove("greenScreen");
              } else {
                body.classList.add("greenScreen");
              }
            }}
            className="pointer-events-auto bg-gray-500 hover:bg-gray-600 text-white p-4 rounded-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
          </button>
        </div>
        <div>
          <div className="flex w-full justify-center">
            <VoiceRecognition
              isListening={isListening}
              inputdata={inputValue}
            />
          </div>
          <div className="w-full absolute left-[340px]"></div>
          <div className="flex items-center gap-2 pointer-events-auto max-w-screen-sm w-full mx-auto">
            <button
              className={`flex justify-center items-center rounded-full p-2 h-[60px] ${
                audioPlaying ? "bg-red-500" : "bg-gray-500"
              }`}
              onClick={toggleListening}
              // disabled={audioPlaying}
            >
              <FaMicrophone className="text-xl" />
            </button>

            <input
              className="w-full placeholder:text-gray-800 placeholder:italic p-4 rounded-md bg-opacity-50 bg-white backdrop-blur-md"
              placeholder="Type a message..."
              ref={input}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
            />
            <button
              disabled={loading || message}
              onClick={sendMessage}
              className={`bg-gray-500 hover:bg-gray-600 text-white p-4 px-10 font-semibold uppercase rounded-md ${
                loading || message ? "cursor-not-allowed opacity-30" : ""
              }`}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
