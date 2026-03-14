/**
 * Daily Training Program types.
 * ADD-ONLY: Do not modify existing types.
 */

export interface Program {
  id: string
  name: string
  durationDays: number
  mainGoal: string
}

export interface ProgramDay {
  id: string
  programId: string
  dayNumber: number
  title: string
  notificationCopy: string
}

export interface UserDailyProgress {
  userId: string
  currentProgramId: string
  currentDay: number
  streakDays: number
  preferredTime: string
}
