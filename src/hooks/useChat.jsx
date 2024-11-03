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
        const message = {
          text: "this is my data", // Text from the input
          audio: audioUrl, // Audio URL from the fetched blob
          lipsync: {
            mouthCues: [
              { value: "A", start: 0.0, end: 0.3 },
              { value: "B", start: 0.4, end: 0.6 },
              { value: "C", start: 0.7, end: 1.0 },
              { value: "D", start: 1.1, end: 1.4 },
              { value: "E", start: 1.5, end: 1.8 },
            ],
          }, // Use default or empty lipsync data if not available
          facialExpression: "smile", // Set a default expression or based on context
          animation: "Idle", // Set the animation state for this message
        };

        // Update messages array with the new message object
        setMessages((prevMessages) => [...prevMessages, message]);
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
  const [audioPlaying, setaudioPlaying] = useState(false);
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

  //
  // const playAudio = () => {
  //   // const newAudio = new Audio(audioUrl);
  //   newAudio.onloadedmetadata = () => {
  //     setAudioDuration(url.duration); // Set audio duration
  //   };
  //   newAudio
  //     .play()
  //     .then(() => setAudio(newAudio)) // Store the current audio instance after playing starts
  //     .catch((error) => console.error("Error playing audio:", error));

  //   newAudio.onended = () => onAudioEnded();
  // };

  // // Handle when audio ends
  // const onAudioEnded = () => {
  //   setMessages((prevMessages) => prevMessages.slice(1)); // Remove the played audio from the queue
  //   setAudio(null); // Reset audio state after playing
  //   setAudioDuration(0); // Reset duration after playing

  //   // Play the next audio in the queue, if available
  //   if (messages.length > 1) {
  //     playAudio(messages[1]); // Play the next audio
  //   }
  // };

  // // Monitor the messages queue and play the next audio if none is currently playing
  // useEffect(() => {
  //   if (messages.length > 0 && !audio) {
  //     playAudio(messages[0]); // Play the first audio in the queue
  //   }
  // }, [messages, audio]);

  //
  // const playAudio = (audioUrl) => {
  //   const newAudio = new Audio(audioUrl);
  //   newAudio.onloadedmetadata = () => {
  //     setAudioDuration(newAudio.duration); // Set audio duration
  //     newAudio
  //       .play()
  //       .catch((error) => console.error("Error playing audio:", error));
  //   };
  //   newAudio.onended = () => onAudioEnded();
  //   setAudio(newAudio); // Store the current audio instance
  // };

  // const onAudioEnded = () => {
  //   setMessages((prevMessages) => prevMessages.slice(1)); // Remove the audio that just played
  //   setAudio(null); // Reset audio state after playing the message
  //   setAudioDuration(0); // Reset audio duration after playing
  //   if (messages.length > 1) {
  //     playAudio(messages[1]); // Play the next audio in the queue, if available
  //   }
  // };

  // useEffect(() => {
  //   if (messages.length > 0 && !audio) {
  //     playAudio(messages[0]); // Play the first audio when it is added
  //   }
  // }, [messages, audio]);

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
        setaudioPlaying,
        audioPlaying,
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
