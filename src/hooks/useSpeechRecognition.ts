import { useState, useCallback, useRef, useEffect } from "react";

// Inline Web Speech API types for browser compatibility
type SRInstance = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: any) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: any) => void) | null;
};

type SRConstructor = { new (): SRInstance };

function getSR(): SRConstructor | undefined {
  return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
}

interface UseSpeechRecognitionOptions {
  onResult?: (transcript: string) => void;
  onEnd?: () => void;
  continuous?: boolean;
}

export function useSpeechRecognition(options: UseSpeechRecognitionOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SRInstance | null>(null);

  useEffect(() => {
    setIsSupported(!!getSR());
  }, []);

  const start = useCallback(() => {
    const SR = getSR();
    if (!SR) return;

    const recognition = new SR();
    recognition.continuous = options.continuous ?? false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      options.onResult?.(transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
      options.onEnd?.();
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [options]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  return { isListening, isSupported, start, stop };
}
