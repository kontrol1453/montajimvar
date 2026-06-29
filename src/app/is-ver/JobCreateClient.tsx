"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import StepIndicator from "./StepIndicator";
import StepCategory from "./StepCategory";
import StepPhotos from "./StepPhotos";
import StepLocation from "./StepLocation";
import StepDetails from "./StepDetails";
import StepConfirm from "./StepConfirm";

interface FormData {
  categoryIds: number[];
  photos: string[];
  city: string;
  district: string;
  location: string;
  accessInfo: string;
  title: string;
  description: string;
  urgency: string;
  budgetMin: string;
  budgetMax: string;
}

const initialFormData: FormData = {
  categoryIds: [],
  photos: [],
  city: "",
  district: "",
  location: "",
  accessInfo: "",
  title: "",
  description: "",
  urgency: "normal",
  budgetMin: "",
  budgetMax: "",
};

export default function JobCreateClient() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>(initialFormData);
  const totalSteps = 5;

  const updateData = useCallback((partial: Partial<FormData>) => {
    setData((prev) => ({ ...prev, ...partial }));
  }, []);

  const next = () => setStep((s) => Math.min(s + 1, totalSteps));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <div className="max-w-2xl mx-auto">
      <StepIndicator current={step} total={totalSteps} />

      <div className="bg-dark-card border border-white/[0.06] rounded-xl p-6 md:p-8">
        {step === 1 && (
          <StepCategory
            data={data}
            updateData={updateData}
            onNext={next}
          />
        )}
        {step === 2 && (
          <StepPhotos
            data={data}
            updateData={updateData}
            onNext={next}
            onBack={back}
          />
        )}
        {step === 3 && (
          <StepLocation
            data={data}
            updateData={updateData}
            onNext={next}
            onBack={back}
          />
        )}
        {step === 4 && (
          <StepDetails
            data={data}
            updateData={updateData}
            onNext={next}
            onBack={back}
          />
        )}
        {step === 5 && (
          <StepConfirm
            data={data}
            onBack={back}
            onReset={() => {
              setData(initialFormData);
              setStep(1);
            }}
          />
        )}
      </div>
    </div>
  );
}
