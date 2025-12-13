import { motion } from "framer-motion";
import { Zap } from "lucide-react";

export function OptimusLogo({ className }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={className}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-lg shadow-primary/30">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="absolute -inset-1 rounded-lg bg-primary/20 blur-md -z-10" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            <span className="gradient-text">OPTIMUS</span>
          </h1>
          <p className="text-xs text-muted-foreground -mt-0.5">AI Video Studio</p>
        </div>
      </div>
    </motion.div>
  );
}
