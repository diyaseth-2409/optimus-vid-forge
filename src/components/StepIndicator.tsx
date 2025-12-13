import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: { label: string; description: string }[];
  onStepClick?: (step: number) => void;
}

export function StepIndicator({
  currentStep,
  totalSteps,
  steps,
  onStepClick,
}: StepIndicatorProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <button
              onClick={() => onStepClick?.(index)}
              disabled={index > currentStep}
              className={cn(
                "flex items-center gap-3 transition-all duration-200",
                index <= currentStep ? "cursor-pointer" : "cursor-not-allowed opacity-50"
              )}
            >
              {/* Step circle */}
              <motion.div
                animate={{
                  scale: index === currentStep ? 1.1 : 1,
                  backgroundColor: index < currentStep 
                    ? "hsl(var(--success))" 
                    : index === currentStep 
                      ? "hsl(var(--primary))" 
                      : "hsl(var(--secondary))",
                }}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-display font-semibold text-sm",
                  index < currentStep ? "text-success-foreground" : 
                  index === currentStep ? "text-primary-foreground shadow-lg shadow-primary/30" : 
                  "text-muted-foreground"
                )}
              >
                {index < currentStep ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  index + 1
                )}
              </motion.div>

              {/* Step label */}
              <div className="hidden md:block text-left">
                <p className={cn(
                  "text-sm font-medium",
                  index === currentStep ? "text-foreground" : "text-muted-foreground"
                )}>
                  {step.label}
                </p>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
            </button>

            {/* Connector */}
            {index < totalSteps - 1 && (
              <div className="flex-1 mx-4 h-0.5 bg-border relative hidden md:block">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: index < currentStep ? "100%" : "0%" }}
                  className="absolute inset-0 bg-success"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
