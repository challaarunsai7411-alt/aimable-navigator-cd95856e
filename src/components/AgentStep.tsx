import { motion } from "framer-motion";
import { Check, Loader2, Clock, AlertTriangle } from "lucide-react";
import type { AgentStep as AgentStepType } from "@/lib/agentScenarios";

interface AgentStepProps {
  step: AgentStepType;
  index: number;
}

const statusConfig = {
  pending: { icon: Clock, color: "text-muted-foreground", bg: "bg-secondary" },
  running: { icon: Loader2, color: "text-accent", bg: "bg-accent/10" },
  done: { icon: Check, color: "text-primary", bg: "bg-primary/10" },
  warning: { icon: AlertTriangle, color: "text-agent-warning", bg: "bg-agent-warning/10" },
};

const AgentStepComponent = ({ step, index }: AgentStepProps) => {
  const config = statusConfig[step.status];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`flex gap-3 p-3 rounded-lg ${config.bg} border border-border/50`}
    >
      <div className="mt-0.5 shrink-0">
        <Icon
          className={`h-4 w-4 ${config.color} ${step.status === "running" ? "animate-spin" : ""}`}
        />
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <p className="text-sm text-foreground/90">{step.thought}</p>
        <div className="font-mono text-xs text-muted-foreground">
          <span className="text-primary/70">{step.action}</span>
          {step.element && <span>(#{step.element})</span>}
          {step.text && <span className="text-accent/70"> "{step.text}"</span>}
        </div>
      </div>
    </motion.div>
  );
};

export default AgentStepComponent;
