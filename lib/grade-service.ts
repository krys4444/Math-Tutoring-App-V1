import { supabase } from "./supabase"

export interface Grade {
  grade_id: number
  grade: number
}

export interface UserGrade {
  id: string
  user_id: string
  grade_id: number
  grade: number
  created_at: string
  updated_at: string
}

// Get all available grades
export async function getAvailableGrades(): Promise<{ data: Grade[] | null; error: Error | null }> {
  try {
    const { data, error } = await supabase.from("grade").select("grade_id, grade").order("grade_id")

    if (error) {
      console.error("Error fetching grades:", error)
      return { data: null, error }
    }

    return { data: data || [], error: null }
  } catch (error) {
    console.error("Error in getAvailableGrades:", error)
    return { data: null, error: error as Error }
  }
}

// Get user's current grade
export async function getUserGrade(): Promise<{ data: UserGrade | null; error: Error | null }> {
  try {
    const { data: user } = await supabase.auth.getUser()

    if (!user.user) {
      return { data: null, error: new Error("User not authenticated") }
    }

    const { data, error } = await supabase
      .from("user_grade")
      .select(`
        id,
        user_id,
        grade_id,
        created_at,
        updated_at,
        grade (
          grade
        )
      `)
      .eq("user_id", user.user.id)
      .single()

    if (error) {
      // If no grade found, that's not an error - user just hasn't selected one yet
      if (error.code === "PGRST116") {
        return { data: null, error: null }
      }
      console.error("Error fetching user grade:", error)
      return { data: null, error }
    }

    // Flatten the grade data
    const userGrade: UserGrade = {
      id: data.id,
      user_id: data.user_id,
      grade_id: data.grade_id,
      grade: (data.grade as any).grade,
      created_at: data.created_at,
      updated_at: data.updated_at,
    }

    return { data: userGrade, error: null }
  } catch (error) {
    console.error("Error in getUserGrade:", error)
    return { data: null, error: error as Error }
  }
}

// Save user's grade selection
export async function saveUserGrade(gradeId: number): Promise<{ error: Error | null }> {
  try {
    const { data: user } = await supabase.auth.getUser()

    if (!user.user) {
      return { error: new Error("User not authenticated") }
    }

    // Use upsert to either insert or update the user's grade
    const { error } = await supabase.from("user_grade").upsert(
      {
        user_id: user.user.id,
        grade_id: gradeId,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id",
      },
    )

    if (error) {
      console.error("Error saving user grade:", error)
      return { error }
    }

    return { error: null }
  } catch (error) {
    console.error("Error in saveUserGrade:", error)
    return { error: error as Error }
  }
}
