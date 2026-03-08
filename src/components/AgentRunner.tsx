import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import GoalPlan from "./GoalPlan";
import AgentStepComponent from "./AgentStep";
import PageStateView from "./PageStateView";
import ResultCard from "./ResultCard";
import type { Scenario, AgentStep } from "@/lib/agentScenarios";

interface AgentRunnerProps {
  scenario: Scenario;
  onComplete: () => void;
}

const AgentRunner = ({ scenario, onComplete }: AgentRunnerProps) => {
  const [showPlan, setShowPlan] = useState(false);
  const [steps, setSteps] = useState<AgentStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [showResult, setShowResult] = useState(false);
  const [latestPageState, setLatestPageState] = useState(scenario.steps[0]?.pageState || null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [steps, showPlan, showResult]);

  // Simulation engine
  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      // Show plan after brief delay
      await delay(800);
      if (cancelled) return;
      setShowPlan(true);

      await delay(1000);

      // Process each step
      for (let i = 0; i < scenario.steps.length; i++) {
        if (cancelled) return;

        const step = { ...scenario.steps[i], status: "running" as const };
        setCurrentStepIndex(i);
        setSteps((prev) => [...prev, step]);

        if (step.pageState) {
          setLatestPageState(step.pageState);
        }

        // Simulate execution time
        await delay(1200 + Math.random() * 800);
        if (cancelled) return;

        // Mark done
        setSteps((prev) =>
          prev.map((s, idx) => (idx === i ? { ...s, status: "done" as const } : s))
        );
      }

      await delay(600);
      if (cancelled) return;
      setShowResult(true);
      onComplete();
    };

    run();
    return () => { cancelled = true; };
  }, [scenario, onComplete]);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 px-4">
      {/* User command */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-start gap-3 p-4 rounded-lg bg-secondary/50 border border-border max-w-3xl mx-auto"
      >
        <span className="text-xs font-mono text-muted-foreground mt-0.5">USER</span>
        <p className="text-foreground">{scenario.command}</p>
      </motion.div>

      {showPlan && <GoalPlan plan={scenario.goalPlan} />}

      {steps.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 max-w-5xl mx-auto">
          {/* Steps column */}
          <div className="lg:col-span-3 space-y-2">
            <p className="text-xs font-medium text-muted-foreground mb-2">Agent Reasoning Loop</p>
            {steps.map((step, i) => (
              <AgentStepComponent key={i} step={step} index={i} />
            ))}
          </div>

          {/* Page state column */}
          <div className="lg:col-span-2">
            <p className="text-xs font-medium text-muted-foreground mb-2">Perceived Page State</p>
            {latestPageState && <PageStateView state={latestPageState} />}
          </div>
        </div>
      )}

      {showResult && <ResultCard result={scenario.finalResult} />}

      <div ref={bottomRef} />
    </div>
  );
};

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export default AgentRunner;
