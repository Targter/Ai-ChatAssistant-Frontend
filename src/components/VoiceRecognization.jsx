import React, { useEffect, useState } from "react";

import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

import { useChat } from "../hooks/useChat";
function VoiceRecognition({ isListening, setCaptionData }) {
  const [segments, setSegments] = useState([]);
  const { fetchAudio } = useChat();
  // const [isListening, setIsListening] = useState(false);
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();
  let silenceTimer = null;

  if (!browserSupportsSpeechRecognition) {
    console.log("Speech recognition not supported");
    return null;
  }
  useEffect(() => {
    if (isListening) {
      SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
    } else {
      SpeechRecognition.stopListening();
      finalizeSegment();
    }
  }, [isListening]);
  const finalizeSegment = () => {
    if (transcript) {
      setCaptionData(transcript);
      // Add the segment to local state
      setSegments((prevSegments) => [...prevSegments, transcript]);

      // Reset the transcript for the next segment
      resetTranscript();

      // Call the fetchAudio function passed from the parent
      fetchAudio(transcript);
    }
  };

  useEffect(() => {
    if (transcript) {
      // Clear previous timer and set a new one
      if (silenceTimer) clearTimeout(silenceTimer);

      // Start a new timer to check for a 1-second pause
      silenceTimer = setTimeout(() => {
        finalizeSegment(); // Finalize the segment after 1 sec of silence
      }, 1000);
    }

    // Clear the timer on component unmount
    return () => clearTimeout(silenceTimer);
  }, [transcript]);

  return (
    // <div className="pointer-events-auto  min-w-auto">
    <div>
      {/* <h3>Current Transcription:</h3> */}
      <p className="text-center max-w-[350px] mb-3  rounded-md mr-[460px] max-h-[40px] bg-black text-white ">
        {transcript}
      </p>
    </div>
    // </div>
  );
}

export default VoiceRecognition;
