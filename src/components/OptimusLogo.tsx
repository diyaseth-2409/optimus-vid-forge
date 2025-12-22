import { motion } from "framer-motion";

export function OptimusLogo({ className }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={className}
    >
      <div className="flex items-center gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            <span className="text-black dark:text-white">OPTIMUS</span>
          </h1>
          <p className="text-xs text-muted-foreground -mt-0.5">AI Video Studio</p>
        </div>
      </div>
    </motion.div>
  );
}
