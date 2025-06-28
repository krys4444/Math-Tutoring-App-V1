import { supabase } from "./supabase"

export interface Lesson {
  id: string
  topic: string
  body_md: string
  created_at?: string
  updated_at?: string
}

// Fetch lessons by topic
export async function getLessonsByTopic(topic: string): Promise<{ data: Lesson[] | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from("lessons")
      .select("id, topic, body_md, created_at, updated_at")
      .eq("topic", topic)
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Error fetching lessons:", error)
      return { data: null, error }
    }

    return { data: data || [], error: null }
  } catch (error) {
    console.error("Error in getLessonsByTopic:", error)
    return { data: null, error: error as Error }
  }
}

// Fetch all lessons
export async function getAllLessons(): Promise<{ data: Lesson[] | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from("lessons")
      .select("id, topic, body_md, created_at, updated_at")
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Error fetching all lessons:", error)
      return { data: null, error }
    }

    return { data: data || [], error: null }
  } catch (error) {
    console.error("Error in getAllLessons:", error)
    return { data: null, error: error as Error }
  }
}
