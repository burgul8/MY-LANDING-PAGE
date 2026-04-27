import { motion } from "framer-motion";

export default function ProgressPulse({ currentStep, totalSteps }) {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="fixed top-0 right-0 left-0 z-50 h-1.5">
      <div className="h-full w-full" style={{ background: "rgba(255,255,255,0.08)" }}>
        <motion.div
          className="h-full rounded-l-full"
          style={{ originX: 1, background: "#00C2C7" }}
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
        />
      </div>
      <motion.div
        className="absolute top-0 h-full rounded-l-full opacity-50 blur-sm"
        style={{ background: "#00C2C7" }}
        style={{ originX: 1 }}
        initial={{ width: "0%" }}
        animate={{ width: `${progress}%` }}
        transition={{ type: "spring", stiffness: 80, damping: 20 }}
      />
    </div>
  );
}