import { motion } from "framer-motion";
import { Globe, Eye } from "lucide-react";
import type { PageState } from "@/lib/agentScenarios";

interface PageStateViewProps {
  state: PageState;
}

const PageStateView = ({ state }: PageStateViewProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg terminal-bg border p-4 space-y-3"
    >
      <div className="flex items-center gap-2">
        <Eye className="h-4 w-4 text-accent" />
        <span className="text-xs font-medium text-accent">Page State</span>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
        <Globe className="h-3 w-3" />
        <span className="truncate">{state.url}</span>
      </div>
      <p className="text-xs text-foreground/70 font-mono">{state.title}</p>

      <div className="space-y-1">
        {state.elements.map((el) => (
          <div
            key={el.id}
            className={`flex items-center gap-2 text-xs font-mono px-2 py-1 rounded ${
              el.highlighted
                ? "bg-primary/10 text-primary border border-primary/20"
                : "text-muted-foreground"
            }`}
          >
            <span className="text-muted-foreground w-8 shrink-0">{el.id}</span>
            <span className="text-accent/70 w-20 shrink-0">{el.role}</span>
            <span className="truncate">{el.name}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default PageStateView;
