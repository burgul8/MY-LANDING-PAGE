import React,{useState} from "react";
import {motion,AnimatePresence} from "framer-motion";
import {Button} from "@/components/ui/button";
import {ArrowLeft,Loader2,Send} from "lucide-react";

import ProgressPulse from "../components/landing/ProgressPulse";
import StepFooter from "../components/landing/StepFooter";
import QuestionField from "../components/landing/QuestionField";
import SuccessScreen from "../components/landing/SuccessScreen";
import BackgroundOrbs from "../components/landing/BackgroundOrbs";

const BG_IMAGE="https://media.base44.com/images/public/69efce5d0ae5b56b9b62e666/74f94693a_generated_095a713b.png";
const LOGO_URL="https://barel-group.co.il/wp-content/uploads/2025/07/Group-164097.png";

const QUESTIONS=[
{key:"question_1",text:"מה השם המלא שלך?",type:"text"},
{key:"question_2",text:"מספר טלפון ליצירת קשר",type:"text"},
{key:"question_3",text:"שכיר או עצמאי?",type:"choice",options:["שכיר","עצמאי"]},
{key:"question_4",text:"סוג העסק שלך?",type:"choice",options:["פטור","מורשה",'חברה בע"מ']},
{
key:"question_5",
text:(a)=>a.question_3==="שכיר"
?"מה ממוצע ההכנסה החודשית שלך?"
:"מהו המחזור השנתי של העסק?",
type:"text"
},
{key:"question_6",text:"האם יש עיקולים, הגבלות או חובות?",type:"choice",options:["כן","לא"]},
{key:"question_7",text:"לכמה הלוואה אתה רלוונטי?",type:"choice",options:["עד 50,000","עד 100,000","עד 200,000","עד 300,000"]},
{key:"question_8",text:"מהי מטרת ההלוואה?",type:"textarea"}
];

const STEPS=[
{questionIndices:[0,1]},
{questionIndices:[2]},
{questionIndices:[3]},
{questionIndices:[4]},
{questionIndices:[5]},
{questionIndices:[6]},
{questionIndices:[7]}
];

const TOTAL_STEPS=STEPS.length;

export default function Landing(){

const [currentStep,setCurrentStep]=useState(0);
const [answers,setAnswers]=useState({});
const [errors,setErrors]=useState({});
const [isSubmitting,setIsSubmitting]=useState(false);
const [isSuccess,setIsSuccess]=useState(false);
const [direction,setDirection]=useState(1);

const shouldSkipStep2=()=>answers.question_3==="שכיר";

const handleAnswer=(key,val)=>{
setAnswers(prev=>({...prev,[key]:val}));

if(errors[key]){
setErrors(prev=>({...prev,[key]:false}));
}
};

const validateStep=()=>{
const step=STEPS[currentStep];
let ok=true;
let newErrors={};

step.questionIndices.forEach((qi)=>{
const q=QUESTIONS[qi];

if(q.key==="question_4" && shouldSkipStep2()) return;

if(!answers[q.key] || answers[q.key].trim()===""){
newErrors[q.key]=true;
ok=false;
}
});

setErrors(newErrors);
return ok;
};

const handleNext=()=>{
if(!validateStep()) return;

setDirection(1);

if(currentStep===1 && shouldSkipStep2()){
setCurrentStep(3);
}else{
setCurrentStep(s=>s+1);
}
};

const handleBack=()=>{
setDirection(-1);

if(currentStep===3 && shouldSkipStep2()){
setCurrentStep(1);
}else{
setCurrentStep(s=>s-1);
}
};


const handleSubmit = async()=>{

if(!validateStep()) return;

setIsSubmitting(true);

const leadData={
name:answers.question_1 || "",
phone:answers.question_2 || "",
status:answers.question_3 || "",
business_type:answers.question_4 || "",
income:answers.question_5 || "",
debts:answers.question_6 || "",
loan_amount:answers.question_7 || "",
purpose:answers.question_8 || ""
};

try{

await fetch(
"https://script.google.com/macros/s/AKfycbypy8hLBenBZU6uYSSeUJeBr0XdQbCviT-he1plRQqUQ6EF9b8k7MMM8ZrlsCP9xEuW/exec",
{
method:"POST",
body:JSON.stringify(leadData),
headers:{
"Content-Type":"application/json"
}
}
);

setIsSuccess(true);

}catch(error){
console.error(error);
alert("שגיאה בשליחה");
}

setIsSubmitting(false);

};


if(isSuccess){
return(
<div className="min-h-screen bg-background">
<BackgroundOrbs bgImage={BG_IMAGE}/>
<SuccessScreen/>
</div>
);
}

const step=STEPS[currentStep];
const effectiveTotal=shouldSkipStep2()?TOTAL_STEPS-1:TOTAL_STEPS;
const effectiveStep=shouldSkipStep2() && currentStep>=3 ? currentStep-1 : currentStep;
const isLast=currentStep===TOTAL_STEPS-1;

return(
<div className="min-h-screen bg-background relative overflow-hidden">

<BackgroundOrbs bgImage={BG_IMAGE}/>

<ProgressPulse
currentStep={effectiveStep}
totalSteps={effectiveTotal}
/>

<div className="fixed top-0 left-0 right-0 z-40 flex justify-center py-3">
<img src={LOGO_URL} className="h-9 object-contain"/>
</div>

<div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-20">
<div className="w-full max-w-2xl">

<AnimatePresence mode="wait">
<motion.div
key={currentStep}
initial={{opacity:0,x:100}}
animate={{opacity:1,x:0}}
exit={{opacity:0,x:-100}}
className="space-y-10"
>

<div className="space-y-8">
{step.questionIndices.map((qi)=>{
const q=QUESTIONS[qi];

return(
<QuestionField
key={q.key}
question={
typeof q.text==="function"
?q.text(answers)
:q.text
}
value={answers[q.key]||""}
onChange={(v)=>handleAnswer(q.key,v)}
error={errors[q.key]}
type={q.type}
options={q.options||[]}
/>
);
})}
</div>

<div className="flex justify-between pt-4" dir="rtl">

{currentStep>0?(
<Button onClick={handleBack}>
חזרה
<ArrowLeft className="w-4 h-4 rotate-180"/>
</Button>
):<div/>}

{isLast?(
<Button
onClick={handleSubmit}
disabled={isSubmitting}
>
{isSubmitting?(
<>
<Loader2 className="w-5 h-5 animate-spin"/>
שולח...
</>
):(
<>
<Send className="w-5 h-5"/>
שליחה
</>
)}
</Button>
):(
<Button onClick={handleNext}>
הבא
<ArrowLeft className="w-5 h-5"/>
</Button>
)}

</div>

</motion.div>
</AnimatePresence>

</div>
</div>

<StepFooter
currentStep={effectiveStep}
totalSteps={effectiveTotal}
/>

</div>
);

}
