"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Dumbbell,
  Timer,
  Clock,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useWorkoutTimer,
  type UseWorkoutTimerReturn,
} from "@/hooks/use-workout-timer";

// Enhanced background color function with gradient support
const getBackgroundStyle = (phase: UseWorkoutTimerReturn["phase"]): string => {
  switch (phase) {
    case "Working":
      return "bg-gradient-to-br from-emerald-50 to-emerald-100";
    case "Resting":
      return "bg-gradient-to-br from-sky-50 to-sky-100";
    case "SetResting":
      return "bg-gradient-to-br from-amber-50 to-amber-100";
    case "Finished":
      return "bg-gradient-to-br from-purple-50 to-purple-100";
    case "Idle":
      return "bg-gradient-to-br from-gray-50 to-white";
    default:
      return "bg-gradient-to-br from-gray-50 to-white";
  }
};

// Get accent color based on phase
const getAccentColor = (phase: UseWorkoutTimerReturn["phase"]): string => {
  switch (phase) {
    case "Working":
      return "bg-emerald-500";
    case "Resting":
      return "bg-sky-500";
    case "SetResting":
      return "bg-amber-500";
    case "Finished":
      return "bg-purple-500";
    case "Idle":
      return "bg-gray-500";
    default:
      return "bg-gray-500";
  }
};

// Get text color based on phase
const getTextColor = (phase: UseWorkoutTimerReturn["phase"]): string => {
  switch (phase) {
    case "Working":
      return "text-emerald-700";
    case "Resting":
      return "text-sky-700";
    case "SetResting":
      return "text-amber-700";
    case "Finished":
      return "text-purple-700";
    case "Idle":
      return "text-gray-700";
    default:
      return "text-gray-700";
  }
};

export default function WorkoutTimer() {
  const {
    phase,
    currentSet,
    isActive,
    isMuted,
    currentExerciseName,
    nextExerciseName,
    statusText,
    formattedTime,
    overallProgress,
    phaseProgress,
    countdownNumber,
    togglePlayPause,
    resetWorkout,
    toggleMute,
    totalSets,
  } = useWorkoutTimer();

  // Animation for the timer ring
  const [ringAnimation, setRingAnimation] = useState(false);

  useEffect(() => {
    // Pulse animation when time changes
    setRingAnimation(true);
    const timer = setTimeout(() => setRingAnimation(false), 300);
    return () => clearTimeout(timer);
  }, [formattedTime]);

  return (
    <div
      className={`min-h-dvh flex items-center justify-center p-4 transition-colors duration-500 ${getBackgroundStyle(
        phase
      )}`}
    >
      <Card className="w-full max-w-md shadow-xl border-0 overflow-hidden">
        {/* Colored header based on current phase */}
        <div
          className={`h-2 w-full ${getAccentColor(
            phase
          )} transition-colors duration-500`}
        />

        <CardContent className="p-6 pt-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-2">
              <Dumbbell className="w-7 h-7 mr-2" />
              <h1 className="text-3xl font-bold">Core Strength Builder</h1>
            </div>

            {phase !== "Idle" && phase !== "Finished" && (
              <div className="flex items-center justify-center mt-2 space-x-1">
                <span className="text-lg font-medium">เซ็ต</span>
                <span className={`text-xl font-bold ${getTextColor(phase)}`}>
                  {currentSet}
                </span>
                <span className="text-lg font-medium">จาก</span>
                <span className="text-xl font-bold">{totalSets}</span>
              </div>
            )}

            {phase === "Finished" && (
              <div className="mt-2 flex items-center justify-center">
                <span className="text-lg text-purple-600 font-semibold bg-purple-100 px-4 py-1 rounded-full animate-pulse">
                  สุดยอดไปเลย! พักผ่อนได้! 🎉
                </span>
              </div>
            )}
          </div>

          {/* Overall Progress */}
          {phase !== "Idle" && (
            <div className="mb-8">
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full ${getAccentColor(
                    phase
                  )} transition-all duration-300 ease-in-out`}
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>เริ่มต้น</span>
                <span>เสร็จสิ้น</span>
              </div>
            </div>
          )}

          {/* Timer Display */}
          <div
            className={`relative rounded-xl p-6 mb-8 text-center transition-all duration-300 ${cn(
              "bg-white border-2",
              phase === "Working"
                ? "border-emerald-300"
                : phase === "Resting"
                ? "border-sky-300"
                : phase === "SetResting"
                ? "border-amber-300"
                : phase === "Finished"
                ? "border-purple-300"
                : "border-gray-200"
            )} ${ringAnimation ? "scale-[1.02]" : "scale-100"}`}
          >
            <div className={`text-sm font-medium mb-1 ${getTextColor(phase)}`}>
              <span className="uppercase tracking-wider">{statusText}</span>
            </div>

            <div className="flex items-center justify-center">
              <Clock className={`w-6 h-6 mr-2 ${getTextColor(phase)}`} />
              <div
                className={`text-6xl font-bold tabular-nums mb-1 ${getTextColor(
                  phase
                )}`}
              >
                {formattedTime}
              </div>
            </div>

            {/* Countdown Display */}
            {countdownNumber !== null && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black bg-opacity-40 rounded-xl">
                <span className="text-8xl font-bold text-white">
                  {countdownNumber}
                </span>
              </div>
            )}

            {phase !== "Idle" && phase !== "Finished" && (
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mt-3">
                <div
                  className={`h-full ${getAccentColor(
                    phase
                  )} transition-all duration-300 ease-in-out`}
                  style={{ width: `${phaseProgress}%` }}
                />
              </div>
            )}
          </div>

          {/* Current & Next Exercise Cards */}
          <div className="grid grid-cols-1 gap-4 mb-8">
            {/* Current */}
            <div
              className={`p-4 rounded-xl ${
                phase === "Working"
                  ? "bg-emerald-50 border border-emerald-200"
                  : phase === "Resting"
                  ? "bg-sky-50 border border-sky-200"
                  : phase === "SetResting"
                  ? "bg-amber-50 border border-amber-200"
                  : "bg-gray-50 border border-gray-200"
              }`}
            >
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-2">
                {phase === "Working" ? "ท่าปัจจุบัน" : "สถานะ"}
              </h2>
              <div className="text-xl font-bold flex items-center">
                <div
                  className={`w-8 h-8 rounded-full ${getAccentColor(
                    phase
                  )} flex items-center justify-center mr-3`}
                >
                  {phase === "Working" ? (
                    <Dumbbell className="w-4 h-4 text-white" />
                  ) : (
                    <Timer className="w-4 h-4 text-white" />
                  )}
                </div>
                {currentExerciseName}
              </div>
            </div>

            {/* Next Exercise */}
            {nextExerciseName && (
              <div className="p-4 rounded-xl bg-white border border-gray-200">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-2">
                  ท่าถัดไป
                </h2>
                <div className="text-xl font-medium flex items-center text-gray-600">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                  </div>
                  {nextExerciseName}
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex gap-3 justify-center">
            <Button
              variant="outline"
              size="lg"
              className="text-lg h-16 px-4 sm:px-6 border-2"
              onClick={resetWorkout}
              disabled={phase === "Idle" && !isActive}
              aria-label="รีเซ็ตการออกกำลังกาย"
            >
              <RotateCcw className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
              รีเซ็ต
            </Button>

            <Button
              variant={isMuted ? "destructive" : "outline"}
              size="icon"
              className="h-16 w-16 border-2"
              onClick={toggleMute}
              aria-label={isMuted ? "เปิดเสียง" : "ปิดเสียง"}
            >
              {isMuted ? (
                <VolumeX className="h-6 w-6 sm:h-7 sm:w-7" />
              ) : (
                <Volume2 className="h-6 w-6 sm:h-7 sm:w-7" />
              )}
            </Button>
            <Button
              size="lg"
              className={cn(
                "text-lg h-16 px-6 sm:px-8 transition-all duration-300",
                phase === "Working"
                  ? "bg-emerald-500 hover:bg-emerald-600"
                  : phase === "Resting"
                  ? "bg-sky-500 hover:bg-sky-600"
                  : phase === "SetResting"
                  ? "bg-amber-500 hover:bg-amber-600"
                  : phase === "Finished"
                  ? "bg-purple-500 hover:bg-purple-600"
                  : "bg-gray-800 hover:bg-gray-700"
              )}
              onClick={togglePlayPause}
            >
              {isActive ? (
                <Pause className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
              ) : (
                <Play className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
              )}
              {phase === "Idle" || phase === "Finished"
                ? "เริ่ม"
                : isActive
                ? "หยุด"
                : "ต่อ"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
