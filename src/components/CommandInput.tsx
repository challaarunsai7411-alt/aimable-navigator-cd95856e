import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Send, Sparkles } from "lucide-react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

interface CommandInputProps {
  onSubmit: (command: string) => void;
  disabled?: boolean;
}

const SUGGESTIONS = [
  "Search Amazon for the cheapest wireless mouse",
  "Find the cheapest direct flight to London tomorrow",
  "Check the current weather in Tokyo",
];

const CommandInput = ({ onSubmit, disabled }: CommandInputProps) => {
  const [value, setValue] = useState("");

  const speechOptions = useMemo(() => ({
    onResult: (transcript: string) => {
      setValue(transcript);
    },
    onEnd: () => {
      // Auto-submit when speech ends if there's content
    },
  }), []);

  const { isListening, isSupported, start, stop } = useSpeechRecognition(speechOptions);

  const handleSubmit = useCallback(() => {
    if (!value.trim() || disabled) return;
    onSubmit(value.trim());
    setValue("");
  }, [value, disabled, onSubmit]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stop();
    } else {
      setValue("");
      start();
    }
  }, [isListening, start, stop]);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-5">
      {/* Primary: Large voice button */}
      {isSupported && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-3"
        >
          <button
            onClick={toggleListening}
            disabled={disabled}
            className={`relative h-20 w-20 rounded-full flex items-center justify-center transition-all disabled:opacity-30 ${
              isListening
                ? "bg-destructive text-destructive-foreground glow-primary"
                : "bg-primary text-primary-foreground glow-primary hover:opacity-90"
            }`}
            aria-label={isListening ? "Stop listening" : "Tap to speak your command"}
            autoFocus
          >
            {isListening ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
            {isListening && (
              <motion.span
                className="absolute inset-0 rounded-full border-2 border-primary"
                animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
          </button>
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {isListening ? "Listening… speak your command" : "Tap to speak"}
          </p>
        </motion.div>
      )}

      {/* Secondary: Text input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative"
      >
        <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-2 glow-primary focus-within:border-primary/50 transition-all">
          <Sparkles className="ml-3 h-5 w-5 text-primary shrink-0" />
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Or type your command here..."
            disabled={disabled}
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-base py-2"
            aria-label="Type your command for the AI agent"
          />
          <button
            onClick={handleSubmit}
            disabled={!value.trim() || disabled}
            className="p-2.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-30 transition-opacity"
            aria-label="Submit command"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </motion.div>

      {/* Live transcript feedback */}
      <AnimatePresence>
        {isListening && value && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-center"
          >
            <p className="text-sm text-foreground/80 italic" aria-live="polite">
              "{value}"
            </p>
            <button
              onClick={handleSubmit}
              disabled={!value.trim()}
              className="mt-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-30 transition-opacity"
            >
              Send this command
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Suggestion chips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex flex-wrap gap-2 justify-center"
      >
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => {
              setValue(s);
              onSubmit(s);
            }}
            disabled={disabled}
            className="text-xs px-3 py-1.5 rounded-full border border-border bg-secondary/50 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all disabled:opacity-30"
          >
            {s}
          </button>
        ))}
      </motion.div>
    </div>
  );
};

export default CommandInput;
