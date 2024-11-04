import { createContext, useContext, useEffect, useState } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  // const [messages, setMessages] = useState([]); // Messages now represent audio URLs
  // const [loading, setLoading] = useState(false);
  // const [cameraZoomed, setCameraZoomed] = useState(true);
  // const [audio, setAudio] = useState(null); // State for audio
  // const [audioDuration, setAudioDuration] = useState(0); // State for audio duration
  // const [url, seturl] = useState();
  // useEffect(() => {
  // const chat = async () => {
  //   setLoading(true);
  //   // Fetch audio for the message and add it to messages
  //   // const audioUrl = await fetchAudio(text);
  //   if (url) {
  //     setMessages((prevMessages) => [...prevMessages, url]); // Add the new audio URL to messages
  //   }
  //   setLoading(false);
  // };

  // chat();
  // }, []);/

  const fetchAudio = async (text) => {
    try {
      console.log("nto called");
      console.log(text);
      setLoading(true);
      const response = await fetch(
        `https://ttserver-psi.vercel.app/stream/${encodeURIComponent(text)}`,
        {
          method: "GET",
        }
      );

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        console.log(response);
        // Define manually-provided properties for the message
        const audio = new Audio(audioUrl);
        const message = {
          text: "this is my data", // Text from the input
          // audio: audioUrl, // Audio URL from the fetched blob
          lipsync: {
            mouthCues: [
              { value: "A", start: 0.0, end: 0.3 },
              { value: "B", start: 0.4, end: 0.6 },
              { value: "C", start: 0.7, end: 1.0 },
              { value: "D", start: 1.1, end: 1.4 },
            ],
          }, // Use default or empty lipsync data if not available
          facialExpression: "Crying", // Set a default expression or based on context
          animation: "sad", // Set the animation state for this message
        };

        audio.play();
        // Update messages array with the new message object
        // setMessages((prevMessages) => [...prevMessages, message]);
        setLoading(false);
        console.log("Audio URL fetched and message added");
      } else {
        console.error("Failed to fetch audio:", response.statusText);
        return null;
      }
    } catch (error) {
      console.error("Error fetching audio:", error);
      return null;
    }
  };
  //

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState();
  const [loading, setLoading] = useState(false);
  const [cameraZoomed, setCameraZoomed] = useState(true);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false); // State to control audio playback

  const onMessagePlayed = () => {
    setMessages((messages) => messages.slice(1));
  };

  useEffect(() => {
    if (messages.length > 0) {
      setMessage(messages[0]);
    } else {
      setMessage(null);
    }
  }, [messages]);

  return (
    <ChatContext.Provider
      value={{
        // chat,
        fetchAudio,
        message,
        onMessagePlayed,
        loading,
        cameraZoomed,
        setCameraZoomed,
        setIsAudioPlaying,
        isAudioPlaying,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
