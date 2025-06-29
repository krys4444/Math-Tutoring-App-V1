import { supabase } from "./supabase"

export interface Lesson {
  lesson_id: number
  lesson_name: string
  description: string
  subunit_id: number
  order: number
  content_type: string
  content_url?: string
  content_text?: string
  estimated_duration_minutes?: number
  difficulty_level?: string
  learning_objectives?: string[]
  created_at: string
  updated_at: string
}

export const lessonService = {
  // ✅ Get all lessons for a given subunit ID (from the URL)
  async getLessonsBySubunitId(subunitId: number): Promise<{ data: Lesson[] | null; error: any }> {
    const { data, error } = await supabase
      .from("lessons")
      .select("*")
      .eq("subunit_id", subunitId)
      .order("order", { ascending: true })

    return { data, error }
  },

  // ✅ Get a specific lesson by its lesson ID
  async getLessonById(lessonId: number): Promise<{ data: Lesson | null; error: any }> {
    const { data, error } = await supabase.from("lessons").select("*").eq("lesson_id", lessonId).single()

    return { data, error }
  },

  // ✅ Optional: Mark lesson as completed for a user
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
