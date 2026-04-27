import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function QuestionField({ question, value, onChange, error, type = "text", options = [] }) {
  return (
    <div className="space-y-6 w-full" dir="rtl">
      <motion.h2
        className="text-3xl md:text-5xl font-inter font-bold text-foreground leading-tight tracking-tight"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        {question}
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.5 }}
        className={error ? "animate-shake" : ""}
      >
        {type === "choice" ? (
          <div className="flex flex-wrap gap-4">
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => onChange(opt)}
                style={value === opt ? {
                  borderColor: "#00C2C7",
                  background: "rgba(0,194,199,0.15)",
                  color: "#00C2C7",
                  boxShadow: "0 4px 20px rgba(0,194,199,0.25)"
                } : error ? {
                  borderColor: "hsl(var(--destructive))",
                  color: "white",
                  background: "rgba(255,255,255,0.05)"
                } : {
                  borderColor: "rgba(255,255,255,0.15)",
                  color: "white",
                  background: "rgba(255,255,255,0.05)"
                }}
                className="px-8 py-5 rounded-xl border-2 text-lg font-inter font-medium transition-all duration-200 hover:border-[#00C2C7] hover:text-[#00C2C7]"
              >
                {opt}
              </button>
            ))}
          </div>
        ) : type === "textarea" ? (
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="הקלד/י כאן..."
            className={`bg-secondary/50 backdrop-blur-sm border-2 text-lg font-inter text-foreground placeholder:text-muted-foreground h-32 resize-none transition-all duration-300 focus:ring-2 focus:ring-primary/30 ${
              error ? "border-destructive" : "border-border focus:border-primary"
            }`}
          />
        ) : (
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="הקלד/י כאן..."
            className={`bg-secondary/50 backdrop-blur-sm border-2 text-lg font-inter text-foreground placeholder:text-muted-foreground h-14 transition-all duration-300 focus:ring-2 focus:ring-primary/30 ${
              error ? "border-destructive" : "border-border focus:border-primary"
            }`}
          />
        )}
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-destructive text-sm mt-2 font-inter"
          >
            שדה חובה
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}