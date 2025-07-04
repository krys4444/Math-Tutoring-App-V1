import { supabase } from "./supabase"

export interface Lesson {
  lesson_id: number
  lesson_content: string
  sub_unit_id: number
}

export const lessonService = {
  // ✅ Get all lessons for a given sub_unit_id (from the URL)
  async getLessonsBySubunitId(subunitId: number): Promise<{ data: Lesson[] | null; error: any }> {
    const { data, error } = await supabase.from("lessons").select("*").eq("sub_unit_id", subunitId)

    return { data, error }
  },

  // ✅ Get a specific lesson by its lesson_id
  async getLessonById(lessonId: number): Promise<{ data: Lesson | null; error: any }> {
    const { data, error } = await supabase.from("lessons").select("*").eq("lesson_id", lessonId).single()

    return { data, error }
  },

  // ✅ Optional: Mark lesson as completed for a user (if you want to track progress later)
  async markLessonCompleted(userId: string, lessonId: number): Promise<{ data: any; error: any }> {
    const { data, error } = await supabase.from("user_lesson_progress").upsert([
      {
        user_id: userId,
        lesson_id: lessonId,
        completed: true,
        completed_at: new Date().toISOString(),
      },
    ])

    return { data, error }
  },
}
