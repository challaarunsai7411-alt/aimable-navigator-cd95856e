import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Bot, Shield, Eye, Zap, Accessibility } from "lucide-react";
import CommandInput from "@/components/CommandInput";
import AgentRunner from "@/components/AgentRunner";
import { findScenario, type Scenario } from "@/lib/agentScenarios";

const Index = () => {
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleCommand = (command: string) => {
    const matched = findScenario(command);
    setScenario(matched);
    setIsRunning(true);
  };

  const handleComplete = useCallback(() => {
    setIsRunning(false);
  }, []);

  const handleReset = () => {
    setScenario(null);
    setIsRunning(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center glow-primary">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-foreground">NavAgent AI</h1>
              <p className="text-xs text-muted-foreground">Autonomous Web Navigation</p>
            </div>
          </div>
          {scenario && (
            <button
              onClick={handleReset}
              className="text-xs px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
            >
              New Task
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        {!scenario ? (
          /* Landing / Input State */
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-73px)] px-4 py-12 space-y-10">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-3"
            >
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto glow-primary">
                <Bot className="h-9 w-9 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                What do you need to find?
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto text-sm">
                Describe your goal in plain language. The AI agent will navigate the web, 
                interact with pages, and bring back the results — no screen reader needed.
              </p>
            </motion.div>

            <CommandInput onSubmit={handleCommand} disabled={isRunning} />

            {/* Feature cards */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl w-full"
            >
              {[
                { icon: Eye, label: "Page Perception", desc: "Reads accessibility trees & DOM" },
                { icon: Zap, label: "Smart Actions", desc: "Click, type, scroll, extract" },
                { icon: Shield, label: "CAPTCHA Aware", desc: "Detects & alerts on CAPTCHAs" },
                { icon: Accessibility, label: "Accessible First", desc: "Built for screen reader users" },
              ].map((f) => (
                <div
                  key={f.label}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border text-center"
                >
                  <f.icon className="h-5 w-5 text-primary" />
                  <span className="text-xs font-medium text-foreground">{f.label}</span>
                  <span className="text-[11px] text-muted-foreground">{f.desc}</span>
                </div>
              ))}
            </motion.div>
          </div>
        ) : (
          /* Agent Running State */
          <div className="py-8">
            <AgentRunner scenario={scenario} onComplete={handleComplete} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
