import { supabase } from "./supabase"

export interface Lesson {
  id: string
  topic: string
  body_md: string
  title?: string
  description?: string
  order_index?: number
  created_at?: string
  updated_at?: string
}

// Fetch lessons by topic with authentication
export async function getLessonsByTopic(topic: string): Promise<{ data: Lesson[] | null; error: Error | null }> {
  try {
    // Check if user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError) {
      console.error("Authentication error:", authError)
      return { data: null, error: new Error("Authentication failed") }
    }

    if (!user) {
      return { data: null, error: new Error("User not authenticated") }
    }

    // Select only body_md where topic = Percentages
    const { data, error } = await supabase.from("lessons").select("body_md").eq("topic", topic)

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

// Fetch all lessons with authentication
export async function getAllLessons(): Promise<{ data: Lesson[] | null; error: Error | null }> {
  try {
    // Check if user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError) {
      console.error("Authentication error:", authError)
      return { data: null, error: new Error("Authentication failed") }
    }

    if (!user) {
      return { data: null, error: new Error("User not authenticated") }
    }

    const { data, error } = await supabase
      .from("lessons")
      .select("body_md")
      .eq("topic", Percentages)

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
