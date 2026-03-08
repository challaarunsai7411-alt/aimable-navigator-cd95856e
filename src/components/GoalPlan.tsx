import { motion } from "framer-motion";
import { Brain } from "lucide-react";

interface GoalPlanProps {
  plan: {
    goal: string;
    parameters: Record<string, string | string[]>;
  };
}

const GoalPlan = ({ plan }: GoalPlanProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="flex items-center gap-2 mb-3">
        <Brain className="h-4 w-4 text-accent" />
        <span className="text-sm font-medium text-accent">Goal Interpretation</span>
      </div>
      <div className="rounded-lg terminal-bg border p-4 font-mono text-sm">
        <pre className="text-primary/80 whitespace-pre-wrap">
{JSON.stringify(plan, null, 2)}
        </pre>
      </div>
    </motion.div>
  );
};

export default GoalPlan;
