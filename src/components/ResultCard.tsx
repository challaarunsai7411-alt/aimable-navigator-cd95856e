import { motion } from "framer-motion";
import { CheckCircle2, Volume2 } from "lucide-react";

interface ResultCardProps {
  result: string;
}

const ResultCard = ({ result }: ResultCardProps) => {
  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
  };

  // Auto-speak result on mount for accessibility
  useState(() => {
    const plainText = result.replace(/[*#_`]/g, "");
    speak("Task complete. " + plainText);
  });

  const handleSpeak = () => {
    if ("speechSynthesis" in window) {
      const plainText = result.replace(/[*#_`]/g, "");
      const utterance = new SpeechSynthesisUtterance(plainText);
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
  };

  // Simple markdown-ish rendering
  const renderResult = () => {
    return result.split("\n").map((line, i) => {
      const bolded = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>');
      return (
        <p
          key={i}
          className={`${line.trim() === "" ? "h-2" : "text-sm text-foreground/80"}`}
          dangerouslySetInnerHTML={{ __html: bolded }}
        />
      );
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-3xl mx-auto rounded-xl border border-primary/30 bg-card p-6 glow-primary space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          <span className="text-sm font-semibold text-primary">Task Complete</span>
        </div>
        <button
          onClick={handleSpeak}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground hover:opacity-80 transition-opacity"
          aria-label="Read results aloud"
        >
          <Volume2 className="h-3.5 w-3.5" />
          Read Aloud
        </button>
      </div>
      <div className="space-y-1">{renderResult()}</div>
    </motion.div>
  );
};

export default ResultCard;
