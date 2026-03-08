import { useState } from "react";
import { motion } from "framer-motion";
import { Mic, Send, Sparkles } from "lucide-react";

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

  const handleSubmit = () => {
    if (!value.trim() || disabled) return;
    onSubmit(value.trim());
    setValue("");
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
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
            placeholder="Tell me what you need..."
            disabled={disabled}
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-base py-2"
            aria-label="Enter your command for the AI agent"
          />
          <button
            onClick={handleSubmit}
            disabled={!value.trim() || disabled}
            className="p-2.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-30 transition-opacity"
            aria-label="Submit command"
          >
            <Send className="h-4 w-4" />
          </button>
          <button
            className="p-2.5 rounded-lg bg-secondary text-secondary-foreground hover:opacity-80 transition-opacity"
            aria-label="Voice input (demo only)"
            title="Voice input — coming soon"
          >
            <Mic className="h-4 w-4" />
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex flex-wrap gap-2 justify-center"
      >
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => { setValue(s); }}
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
