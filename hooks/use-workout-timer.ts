// src/hooks/useWorkoutTimer.ts (หรือจะวางไว้ที่อื่นก็ได้ตามโครงสร้างโปรเจกต์)
import { useState, useEffect, useCallback, useRef, useMemo } from "react";

// --- Configuration & Types --- (ย้ายมานี่ หรือจะ import จากไฟล์ config ก็ได้)
export const EXERCISES = [
  "Crunch (ท้องบน)", // 0
  "Reverse Crunch (ท้องล่าง)", // 1
  "Plank (แกนกลางลำตัว)", // 2
  "High Crunches (ท้องบน)", // 3
  "Flutter Kicks (ท้องล่าง)", // 4
  "Russian Twist (ท้องข้าง)", // 5
];
export const WORK_TIME = 20; // seconds
export const REST_TIME = 10; // seconds
export const SET_REST_TIME = 20; // seconds
export const TOTAL_SETS = 3;
export const COUNTDOWN_SECONDS = 3; // Show countdown for last 3 seconds

export type WorkoutPhase =
  | "Idle"
  | "Working"
  | "Resting"
  | "SetResting"
  | "Finished";

// --- Interface for Hook Return Value ---
export interface UseWorkoutTimerReturn {
  // State
  phase: WorkoutPhase;
  currentSet: number;
  currentExerciseIndex: number;
  timeLeft: number;
  isActive: boolean;
  isMuted: boolean;
  // Derived Data / Display Info
  currentExerciseName: string;
  nextExerciseName: string;
  statusText: string;
  formattedTime: string;
  overallProgress: number;
  phaseProgress: number;
  countdownNumber: number | null; // ส่งแค่ตัวเลข หรือ null
  // Controls
  togglePlayPause: () => void;
  resetWorkout: () => void;
  toggleMute: () => void;
  // Constants (เผื่อ UI อยากรู้)
  totalSets: number;
}

// --- The Custom Hook ---
export function useWorkoutTimer(): UseWorkoutTimerReturn {
  // --- Core State ---
  const [phase, setPhase] = useState<WorkoutPhase>("Idle");
  const [currentSet, setCurrentSet] = useState(1);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isActive, setIsActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Refs for audio elements
  const countSoundRef = useRef<HTMLAudioElement | null>(null);
  const startSoundRef = useRef<HTMLAudioElement | null>(null);
  const goRestSoundRef = useRef<HTMLAudioElement | null>(null);

  // --- Sound Management ---
  const preloadSounds = useCallback(() => {
    if (typeof window !== "undefined") {
      // Ensure running in browser
      if (!countSoundRef.current)
        countSoundRef.current = new Audio("/count.mp3");
      if (!startSoundRef.current)
        startSoundRef.current = new Audio("/start.mp3");
      if (!goRestSoundRef.current)
        goRestSoundRef.current = new Audio("/go-rest.mp3");
      countSoundRef.current.load();
      startSoundRef.current.load();
      goRestSoundRef.current.load();
    }
  }, []);

  useEffect(() => {
    preloadSounds();
  }, [preloadSounds]);

  const playSound = useCallback(
    (soundType: "count" | "start" | "go-rest") => {
      if (isMuted || typeof window === "undefined") return; // Don't play if muted or SSR
      let audio: HTMLAudioElement | null = null;
      switch (soundType) {
        case "count":
          audio = countSoundRef.current;
          break;
        case "start":
          audio = startSoundRef.current;
          break;
        case "go-rest":
          audio = goRestSoundRef.current;
          break;
      }
      if (audio) {
        audio.currentTime = 0;
        audio
          .play()
          .catch((e) => console.error(`Error playing ${soundType}:`, e));
      } else {
        console.warn(`Sound element ${soundType} not ready.`);
      }
    },
    [isMuted]
  );

  // --- Timer Logic ---
  useEffect(() => {
    if (!isActive || phase === "Idle" || phase === "Finished") {
      return;
    }

    const intervalId = setInterval(() => {
      // Play countdown sound (เช็ค timeLeft ก่อนลดค่า)
      if (timeLeft > 0 && timeLeft <= COUNTDOWN_SECONDS + 1) {
        playSound("count");
      }

      setTimeLeft((prevTime) => {
        const newTime = prevTime - 1;
        if (newTime < 0) {
          // Transition logic
          switch (phase) {
            case "Working": {
              playSound("go-rest");
              const isLastExerciseInSet =
                currentExerciseIndex === EXERCISES.length - 1;
              const isLastSetOverall = currentSet === TOTAL_SETS;
              if (isLastExerciseInSet) {
                if (isLastSetOverall) {
                  setPhase("Finished");
                  setIsActive(false);
                  return 0;
                } else {
                  setPhase("SetResting");
                  // *** แก้ไข: คำนวณค่า Set ใหม่ก่อน ***
                  const nextSet = currentSet + 1;
                  setCurrentSet(nextSet); // <--- ใช้ค่าที่คำนวณไว้
                  return SET_REST_TIME;
                }
              } else {
                setPhase("Resting");
                return REST_TIME;
              }
            }
            case "Resting": {
              playSound("start");
              setPhase("Working");
              // *** แก้ไข: คำนวณค่า Index ใหม่ก่อน ***
              const nextIndex = currentExerciseIndex + 1;
              setCurrentExerciseIndex(nextIndex); // <--- ใช้ค่าที่คำนวณไว้
              return WORK_TIME;
            }
            case "SetResting": {
              playSound("start");
              setPhase("Working");
              setCurrentExerciseIndex(0); // อันนี้ถูกแล้ว
              return WORK_TIME;
            }
            default:
              setIsActive(false);
              return 0;
          }
        } else {
          return newTime;
        }
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isActive, phase, timeLeft, currentSet, currentExerciseIndex, playSound]);

  // --- Control Functions ---
  const togglePlayPause = useCallback(() => {
    if (phase === "Finished") {
      resetWorkout();
      // Maybe start automatically after reset?
      // setTimeout(() => {
      //     setIsActive(true);
      //     setPhase("Working");
      //     setTimeLeft(WORK_TIME);
      //     playSound("start");
      // }, 100); // Small delay
      return;
    }
    if (phase === "Idle") {
      setIsActive(true);
      setPhase("Working");
      setTimeLeft(WORK_TIME);
      playSound("start");
    } else {
      setIsActive((prev) => !prev); // Toggle active state
    }
  }, [phase, playSound]); // Add playSound dependency

  const resetWorkout = useCallback(() => {
    setIsActive(false);
    setPhase("Idle");
    setCurrentSet(1);
    setCurrentExerciseIndex(0);
    setTimeLeft(WORK_TIME);
    preloadSounds(); // Reload sounds on reset
  }, [preloadSounds]); // Add preloadSounds dependency

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  // --- Derived Data & Formatting ---
  const getPhaseMaxTime = useCallback((): number => {
    switch (phase) {
      case "Working":
        return WORK_TIME;
      case "Resting":
        return REST_TIME;
      case "SetResting":
        return SET_REST_TIME;
      default:
        return 1;
    }
  }, [phase]);

  const phaseProgress = useCallback((): number => {
    const maxTime = getPhaseMaxTime();
    if (phase === "Idle" || phase === "Finished" || maxTime <= 0) return 0;
    const progress = ((maxTime - timeLeft) / maxTime) * 100;
    return Math.max(0, Math.min(100, progress));
  }, [timeLeft, getPhaseMaxTime, phase]);

  const overallProgress = useCallback((): number => {
    if (phase === "Idle") return 0;
    if (phase === "Finished") return 100;
    const totalExercisesInWorkout = EXERCISES.length * TOTAL_SETS;
    const completedExercisesBeforeCurrentSet =
      (currentSet - 1) * EXERCISES.length;
    let completedExercisesInCurrentSet = 0;

    // Logic for counting completed exercises within the current set
    if (phase === "Working") {
      // If working, count exercises *before* the current one
      completedExercisesInCurrentSet = currentExerciseIndex;
    } else if (phase === "Resting") {
      // If resting, we just finished the currentExerciseIndex
      completedExercisesInCurrentSet = currentExerciseIndex + 1;
    } else if (phase === "SetResting") {
      // If resting between sets, the previous set is fully complete
      completedExercisesInCurrentSet = EXERCISES.length;
    }

    const totalCompleted =
      completedExercisesBeforeCurrentSet + completedExercisesInCurrentSet;
    const progress = (totalCompleted / totalExercisesInWorkout) * 100;
    return Math.max(0, Math.min(100, progress));
  }, [phase, currentSet, currentExerciseIndex]);

  const formattedTime = useMemo((): string => {
    const displaySeconds = Math.max(0, timeLeft);
    const mins = Math.floor(displaySeconds / 60);
    const secs = displaySeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }, [timeLeft]);

  const statusText = useMemo((): string => {
    switch (phase) {
      case "Working":
        return "ออกกำลังกาย";
      case "Resting":
        return "พัก";
      case "SetResting":
        return "พักระหว่างเซ็ต";
      case "Finished":
        return "เสร็จสิ้น!";
      case "Idle":
        return "พร้อมเริ่ม";
      default:
        return "";
    }
  }, [phase]);

  const currentExerciseName = useMemo((): string => {
    switch (phase) {
      case "Working":
        return EXERCISES[currentExerciseIndex] ?? "โหลดท่า...";
      case "Resting":
        return "พัก"; // Show "พัก" during normal rest
      case "SetResting":
        return "พักระหว่างเซ็ต"; // Show "พักระหว่างเซ็ต"
      case "Finished":
        return "เยี่ยมมาก!";
      case "Idle":
      default:
        return "กด 'เริ่ม' เลย!";
    }
  }, [phase, currentExerciseIndex]);

  const nextExerciseName = useMemo((): string => {
    switch (phase) {
      case "Working": {
        const isLastExerciseInSet =
          currentExerciseIndex === EXERCISES.length - 1;
        if (isLastExerciseInSet) {
          return currentSet === TOTAL_SETS ? "เสร็จสิ้น!" : "พักระหว่างเซ็ต";
        } else {
          return EXERCISES[currentExerciseIndex + 1] ?? "ท่าต่อไป...";
        }
      }
      case "Resting":
        // While resting, the "next" is the one we are about to start
        return EXERCISES[currentExerciseIndex + 1] ?? "ท่าต่อไป...";
      case "SetResting":
        // While resting between sets, the "next" is the first exercise
        return EXERCISES[0] ?? "ท่าแรก...";
      case "Idle":
        return EXERCISES[0] ?? "ท่าแรก...";
      case "Finished":
      default:
        return "-";
    }
  }, [phase, currentSet, currentExerciseIndex]);

  const countdownNumber = useMemo((): number | null => {
    if (
      isActive &&
      timeLeft <= COUNTDOWN_SECONDS &&
      timeLeft >= 1 &&
      phase !== "Finished" &&
      phase !== "Idle"
    ) {
      return timeLeft;
    }
    return null;
  }, [isActive, timeLeft, phase]);

  // --- Return Value ---
  return {
    phase,
    currentSet,
    currentExerciseIndex,
    timeLeft,
    isActive,
    isMuted,
    currentExerciseName,
    nextExerciseName,
    statusText,
    formattedTime,
    overallProgress: overallProgress(), // Call functions to get current value
    phaseProgress: phaseProgress(), // Call functions to get current value
    countdownNumber,
    togglePlayPause,
    resetWorkout,
    toggleMute,
    totalSets: TOTAL_SETS, // Export constant
  };
}
