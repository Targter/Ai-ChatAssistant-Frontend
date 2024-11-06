import { createContext, useContext, useEffect, useState } from "react";
import { mouthCues } from "../../public/mouth_cues";
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
      // console.log("nto called");
      // console.log(text);
      //
      setLoading(true);
      const response = await fetch(
        `https://ttserver-psi.vercel.app/stream/${encodeURIComponent(text)}`,
        {
          method: "GET",
        }
      );
      // const audio = new Audio("public/oa.wav");
      // // Define manually-provided properties for the message
      // // const audio = new Audio("public/oa.wav");
      // const message = {
      //   text: "this is my data", // Text from the input
      //   audio: audio, // Audio URL from the fetched blob
      //   lipsync: {
      //     mouthCues,
      //   }, // Use default or empty lipsync data if not available
      //   facialExpression: "smile",
      //   animation: "Idle",
      // };
      // audio.play();
      // // Update messages array with the new message object
      // // setMessages((prevMessages) => [...prevMessages, message]);
      // setLoading(false);
      // setMessage(message);
      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        // console.log(response);
        // Define manually-provided properties for the message
        const audio = new Audio(audioUrl);
        const message = {
          text: "this is my data", // Text from the input
          audio: audio, // Audio URL from the fetched blob
          lipsync: {
            mouthCues,
          }, // Use default or empty lipsync data if not available
          facialExpression: "smile",
          animation: "Idle",
        };
        audio.play();
        // Update messages array with the new message object
        // setMessages((prevMessages) => [...prevMessages, message]);
        setLoading(false);
        setMessage(message);
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

  // This function should be defined to update the model’s mouth shape
  // Define this function to update the model’s mouth shape
  // const updateMouthShape = (shape) => {
  //   // Implement your Three.js logic here to set the mouth shape
  //   // Example: setting the mouth shape to "closed" or "neutral"
  //   console.log("Setting mouth shape to:", shape);
  // };

  // // Lip-sync effect
  // useEffect(() => {
  //   if (message?.audio && message?.lipsync) {
  //     const audio = message.audio;
  //     audio.play();

  //     const syncMouth = () => {
  //       const currentTime = audio.currentTime;
  //       const currentCue = message.lipsync.mouthCues.find(
  //         (cue) => currentTime >= cue.start && currentTime <= cue.end
  //       );

  //       if (currentCue) {
  //         updateMouthShape(currentCue.value); // Set mouth shape based on cue
  //       }

  //       if (!audio.ended) {
  //         requestAnimationFrame(syncMouth); // Continue animation if audio not ended
  //       } else {
  //         updateMouthShape("neutral"); // Reset to neutral shape when audio ends
  //       }
  //     };

  //     // Start the lip-sync
  //     requestAnimationFrame(syncMouth);

  //     audio.addEventListener("ended", onMessagePlayed);

  //     return () => {
  //       audio.removeEventListener("ended", onMessagePlayed);
  //     };
  //   }
  // }, [message]);

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
