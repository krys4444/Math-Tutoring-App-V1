import { supabase } from "./supabase"

export interface Grade {
  grade_id: number
  grade: number
}

export interface UserGrade {
  user_id: string
  grade_id: number
  created_at: string
  updated_at: string
}

export const gradeService = {
  // Get all available grades
  async getGrades(): Promise<{ data: Grade[] | null; error: any }> {
    const { data, error } = await supabase.from("grades").select("*")

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

    // First, delete any existing grade for this user
    const { error: deleteError } = await supabase.from("user_grade").delete().eq("user_id", user.id)

    if (deleteError) {
      return { data: null, error: deleteError }
    }

    // Then insert the new grade
    const { data, error } = await supabase
      .from("user_grade")
      .insert({
        user_id: user.id,
        grade_id: grade_id,
      })
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
      .select("*, grades(grade_id, grade)")
      .eq("user_id", user.id)
      .single()

    return { data, error }
  },
}
