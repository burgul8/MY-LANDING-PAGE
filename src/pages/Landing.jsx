import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Send } from "lucide-react";
import { base44 } from "@/api/base44Client";

import ProgressPulse from "../components/landing/ProgressPulse";
import StepFooter from "../components/landing/StepFooter";
import QuestionField from "../components/landing/QuestionField";
import SuccessScreen from "../components/landing/SuccessScreen";
import BackgroundOrbs from "../components/landing/BackgroundOrbs";

const BG_IMAGE = "https://media.base44.com/images/public/69efce5d0ae5b56b9b62e666/74f94693a_generated_095a713b.png";
const LOGO_URL = "https://barel-group.co.il/wp-content/uploads/2025/07/Group-164097.png";

const QUESTIONS = [
  { key: "question_1", text: "מה השם המלא שלך?", type: "text" },
  { key: "question_2", text: "מספר טלפון ליצירת קשר", type: "text" },
  { key: "question_3", text: "שכיר או עצמאי?", type: "choice", options: ["שכיר", "עצמאי"] },
  { key: "question_4", text: "סוג העסק שלך?", type: "choice", options: ["פטור", "מורשה", "חברה בע\"מ"] }, // index 3 - עצמאי only
  { key: "question_5", text: (a) => a.question_3 === "שכיר" ? "מה ממוצע ההכנסה החודשית שלך?" : "מהו המחזור השנתי של העסק?", type: "text" }, // index 4
  { key: "question_6", text: "האם יש עיקולים, הגבלות, הוצאה לפועל או חובות כלשהם?", type: "choice", options: ["כן", "לא"] }, // index 5
  { key: "question_7", text: "לכמה הלוואה אתה רלוונטי?", type: "choice", options: ["עד 50,000", "עד 100,000", "עד 200,000", "עד 300,000"] }, // index 6
  { key: "question_8", text: "מהי מטרת ההלוואה?", type: "textarea" }, // index 7
];

// Steps: step 0 = questions 0,1 | step 1 = q3 | step 2 = q4 (עצמאי only) | step 3 = q5 | step 4 = q6 | step 5 = q7 | step 6 = q8
const STEPS = [
  { questionIndices: [0, 1] }, // 0
  { questionIndices: [2] },    // 1 - שכיר/עצמאי
  { questionIndices: [3] },    // 2 - סוג העסק (עצמאי only)
  { questionIndices: [4] },    // 3 - מחזור/הכנסה
  { questionIndices: [5] },    // 4
  { questionIndices: [6] },    // 5
  { questionIndices: [7] },    // 6
];

const TOTAL_STEPS = STEPS.length;

export default function Landing() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [direction, setDirection] = useState(1);

  const handleAnswer = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: false }));
    }
  };

  const validateStep = () => {
    const step = STEPS[currentStep];
    const newErrors = {};
    let valid = true;
    step.questionIndices.forEach((qi) => {
      const q = QUESTIONS[qi];
      // Skip validation for question_4 if שכיר
      if (q.key === "question_4" && shouldSkipStep2()) return;
      if (!answers[q.key] || answers[q.key].trim() === "") {
        newErrors[q.key] = true;
        valid = false;
      }
    });
    setErrors(newErrors);
    return valid;
  };

  // Step 2 = question_4 (סוג העסק) - skip if שכיר
  const shouldSkipStep2 = () => answers.question_3 === "שכיר";

  const handleNext = () => {
    if (!validateStep()) return;
    setDirection(1);
    if (currentStep === 1 && shouldSkipStep2()) {
      // Skip step 2 for שכיר
      setCurrentStep(3);
    } else if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setDirection(-1);
    if (currentStep === 3 && shouldSkipStep2()) {
      // Go back to step 1, skipping step 2
      setCurrentStep(1);
    } else if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setIsSubmitting(true);
    const leadData = {
      ...answers,
      submitted_at: new Date().toISOString(),
    };
    // map question_8 into the data
    await base44.entities.Lead.create(leadData);
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const isLastStep = currentStep === TOTAL_STEPS - 1;
  const effectiveTotalSteps = shouldSkipStep2() ? TOTAL_STEPS - 1 : TOTAL_STEPS;
  const effectiveCurrentStep = shouldSkipStep2() && currentStep >= 3 ? currentStep - 1 : currentStep;

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <BackgroundOrbs bgImage={BG_IMAGE} />
        <SuccessScreen />
      </div>
    );
  }

  const step = STEPS[currentStep];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden font-inter">
      <BackgroundOrbs bgImage={BG_IMAGE} />
      <ProgressPulse currentStep={effectiveCurrentStep} totalSteps={effectiveTotalSteps} />

      {/* Header with logo */}
      <div className="fixed top-0 left-0 right-0 z-40 flex justify-center items-center py-3" style={{ background: "rgba(13,27,75,0.85)", backdropFilter: "blur(10px)", borderBottom: "1px solid rgba(0,194,199,0.15)" }}>
        <img src={LOGO_URL} alt="קבוצת בר-אל" className="h-9 object-contain drop-shadow-lg" />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-20">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="space-y-10"
            >
              {/* Step number label */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.05 }}
                className="text-center"
                dir="rtl"
              >
                {currentStep === 0 && (
                  <p className="text-muted-foreground font-inter text-sm mb-3">
                    השותפים שלך למימון עסקי חכם ומהיר
                  </p>
                )}
                <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium font-inter tracking-wide border" style={{ background: "rgba(0,194,199,0.12)", color: "#00C2C7", borderColor: "rgba(0,194,199,0.3)" }}>
                  {currentStep === 0
                    ? "בואו נתחיל"
                    : isLastStep
                    ? "שלב אחרון"
                    : `שלב ${effectiveCurrentStep + 1} מתוך ${effectiveTotalSteps}`}
                </span>
              </motion.div>

              {/* Questions */}
              <div className="space-y-8">
                {step.questionIndices.map((qi) => {
                  const q = QUESTIONS[qi];
                  return (
                    <QuestionField
                      key={q.key}
                      question={typeof q.text === "function" ? q.text(answers) : q.text}
                      value={answers[q.key] || ""}
                      onChange={(val) => handleAnswer(q.key, val)}
                      error={errors[q.key]}
                      type={q.type}
                      options={q.options || []}
                    />
                  );
                })}
              </div>

              {/* Connecting line for first step (2 questions) */}
              {step.questionIndices.length > 1 && (
                <div className="absolute right-1/2 top-[42%] w-px h-16 bg-gradient-to-b from-primary/30 to-transparent hidden md:block" />
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between gap-4 pt-4" dir="rtl">
                {currentStep > 0 ? (
                  <Button
                    variant="ghost"
                    onClick={handleBack}
                    className="text-muted-foreground hover:text-foreground font-inter gap-2"
                  >
                    חזרה
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </Button>
                ) : (
                  <div />
                )}

                {isLastStep ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="font-inter text-base px-8 py-6 rounded-xl gap-2 transition-all"
                    style={{ background: "#00C2C7", color: "#0D1B4B", fontWeight: 700, boxShadow: "0 4px 20px rgba(0,194,199,0.35)" }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        שולח...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        שליחה
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    className="font-inter text-base px-8 py-6 rounded-xl gap-2 transition-all"
                    style={{ background: "#00C2C7", color: "#0D1B4B", fontWeight: 700, boxShadow: "0 4px 20px rgba(0,194,199,0.35)" }}
                  >
                    הבא
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <StepFooter currentStep={effectiveCurrentStep} totalSteps={effectiveTotalSteps} />
    </div>
  );
}