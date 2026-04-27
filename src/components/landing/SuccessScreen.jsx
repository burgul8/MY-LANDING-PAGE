import { motion } from "framer-motion";
import { CheckCircle2, Sparkles } from "lucide-react";

export default function SuccessScreen() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="flex flex-col items-center justify-center min-h-screen text-center px-6"
      dir="rtl"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
        className="relative mb-8"
      >
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
          <CheckCircle2 className="w-12 h-12 text-primary" />
        </div>
        <motion.div
          className="absolute inset-0 rounded-full bg-primary/20"
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-inter font-bold text-foreground">
          מעולה, סיימנו ✅
        </h1>
        <p className="text-lg text-muted-foreground font-inter max-w-md leading-relaxed">
          הפרטים נקלטו במערכת,<br />
          ונציג יחזור אליך בהקדם להמשך בדיקת התאמה.
        </p>
      </motion.div>
    </motion.div>
  );
}