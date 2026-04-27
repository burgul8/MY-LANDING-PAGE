import { Shield } from "lucide-react";

export default function StepFooter({ currentStep, totalSteps }) {
  return (
    <div className="fixed bottom-0 right-0 left-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md border-t" style={{ background: "rgba(13,27,75,0.85)", borderColor: "rgba(0,194,199,0.15)" }} dir="rtl">
      <span className="text-sm text-muted-foreground font-inter">
        שלב {currentStep + 1} מתוך {totalSteps}
      </span>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Shield className="w-4 h-4 text-primary" />
        <span className="font-inter">מוגן ומאובטח</span>
      </div>
    </div>
  );
}