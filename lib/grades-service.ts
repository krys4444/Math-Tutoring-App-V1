import { supabase } from "./supabase"

export interface Grade {
  id: number
  grade_name: string
  grade_level: number
  description: string
}

export interface UserGrade {
  id: number
  user_id: string
  grade_id: number
  created_at: string
  updated_at: string
}

export const gradeService = {
  // Get all available grades
  async getGrades(): Promise<{ data: Grade[] | null; error: any }> {
    const { data, error } = await supabase.from("grades").select("*").order("grade_level", { ascending: true })

    return { data, error }
  },

  // Save user's grade selection
  async saveUserGrade(grade_id: number): Promise<{ data: any; error: any }> {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { data: null, error: { message: "User not authenticated" } }
    }

    // Use upsert to handle both insert and update cases
    const { data, error } = await supabase
      .from("user_grade")
      .upsert(
        {
          user_id: user.id,
          grade_id: grade_id,
        },
        {
          onConflict: "user_id",
          ignoreDuplicates: false,
        },
      )
      .select()

    return { data, error }
  },

  // Get user's current grade
  async getUserGrade(): Promise<{ data: any; error: any }> {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { data: null, error: { message: "User not authenticated" } }
    }

    const { data, error } = await supabase
      .from("user_grade")
      .select(`
        *,
        grades (
          id,
          grade_name,
          grade_level,
          description
        )
      `)
      .eq("user_id", user.id)
      .single()

    return { data, error }
  },
}
