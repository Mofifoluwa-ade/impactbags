"use client";

import { useEffect, useState } from "react";
import { GeneratedToken } from "@/types";

const STEPS = [
  "Reading your cause...",
  "Naming your token...",
  "Writing the pitch...",
  "Building viral hook...",
  "Calculating fee splits...",
  "Finalising token identity...",
];

interface GeneratingScreenProps {
  cause: string;
  onGenerated: (token: GeneratedToken) => void;
  onError: () => void;
}

export function GeneratingScreen({
  cause,
  onGenerated,
  onError,
}: GeneratingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let stepIdx = 0;

    const stepInterval = setInterval(() => {
      if (stepIdx < STEPS.length - 1) {
        setCompletedSteps((prev) => [...prev, stepIdx]);
        stepIdx++;
        setCurrentStep(stepIdx);
      }
    }, 600);

    const generate = async () => {
      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cause }),
        });

        const data = await res.json();

        if (!res.ok || data.error) {
          throw new Error(data.error || "Generation failed");
        }

        clearInterval(stepInterval);
        setCompletedSteps([0, 1, 2, 3, 4, 5]);
        setCurrentStep(STEPS.length);

        setTimeout(() => onGenerated(data), 500);
      } catch (err) {
        clearInterval(stepInterval);
        const msg =
          err instanceof Error ? err.message : "Unknown error. Please retry.";
        setErrorMsg(msg);
        setTimeout(() => onError(), 2500);
      }
    };

    generate();
    return () => clearInterval(stepInterval);
  }, [cause, onGenerated, onError]);

  if (errorMsg) {
    return (
      <div className="screen-enter flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-4xl">⚠️</div>
        <div
          className="text-base font-medium text-center"
          style={{ color: "var(--text-primary)" }}
        >
          Generation failed
        </div>
        <div
          className="text-sm text-center max-w-xs"
          style={{ color: "var(--text-muted)" }}
        >
          {errorMsg}
        </div>
        <div className="text-xs" style={{ color: "var(--text-muted)" }}>
          Returning to home...
        </div>
      </div>
    );
  }

  return (
    <div className="screen-enter flex flex-col items-center justify-center min-h-[480px] gap-8 py-12">
      {/* Spinner */}
      <div className="relative">
        <div
          className="w-16 h-16 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: "var(--border-color)", borderTopColor: "var(--gold)" }}
        />
        <div
          className="absolute inset-0 w-16 h-16 rounded-full border border-transparent"
          style={{
            background:
              "radial-gradient(circle, var(--gold-bg) 0%, transparent 70%)",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-xl">
          ✦
        </div>
      </div>

      {/* Title */}
      <div className="text-center">
        <div
          className="text-xl font-bold mb-1"
          style={{ fontFamily: "var(--font-syne)", color: "var(--text-primary)" }}
        >
          AI is cooking
          <span className="inline-flex gap-0.5 ml-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-1 h-1 rounded-full inline-block"
                style={{
                  background: "var(--gold)",
                  animation: `pulse-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </span>
        </div>
        <div className="text-sm" style={{ color: "var(--text-muted)" }}>
          Building your community token
        </div>
      </div>

      {/* Steps */}
      <div className="w-full max-w-xs space-y-3">
        {STEPS.map((step, i) => {
          const isDone = completedSteps.includes(i);
          const isActive = currentStep === i;
          const isPending = !isDone && !isActive;

          return (
            <div
              key={i}
              className="flex items-center gap-3 transition-all duration-300"
              style={{
                opacity: isPending ? 0.3 : 1,
                transform: isActive ? "translateX(4px)" : "none",
              }}
            >
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 transition-all duration-300"
                style={{
                  background: isDone
                    ? "var(--green)"
                    : isActive
                    ? "var(--gold-bg)"
                    : "var(--bg-surface2)",
                  border: isActive
                    ? "1px solid var(--gold)"
                    : isDone
                    ? "none"
                    : "1px solid var(--border-color)",
                }}
              >
                {isDone ? (
                  <span style={{ color: "#041a08", fontSize: "10px" }}>✓</span>
                ) : isActive ? (
                  <span style={{ color: "var(--gold)", fontSize: "10px" }}>
                    ●
                  </span>
                ) : (
                  <span
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "9px",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                )}
              </div>
              <span
                className="text-sm"
                style={{
                  color: isDone
                    ? "var(--green)"
                    : isActive
                    ? "var(--text-primary)"
                    : "var(--text-muted)",
                  fontFamily: isActive ? "var(--font-dm)" : "var(--font-dm)",
                  fontWeight: isActive ? 500 : 400,
                }}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>

      {/* Cause preview */}
      <div
        className="w-full max-w-xs rounded-xl p-3 text-xs text-center"
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border-color)",
          color: "var(--text-muted)",
          fontStyle: "italic",
        }}
      >
        &ldquo;{cause}&rdquo;
      </div>
    </div>
  );
}
