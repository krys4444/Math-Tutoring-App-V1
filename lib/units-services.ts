import { supabase } from "./supabase"

export interface Unit {
  unit_id: number
  unit_name: string
  description: string
  course_id: number
  order: number
  created_at: string
  updated_at: string
}

export const unitService = {
  // ✅ Get all units for a given course ID (from the URL)
  async getUnitsByCourseId(courseId: number): Promise<{ data: Unit[] | null; error: any }> {
    const { data, error } = await supabase
      .from("units")
      .select("*")
      .eq("course_id", courseId)
      .order("order", { ascending: true }) // optional: sort units by order field
      .order("unit_name", { ascending: true }) // secondary sort

    return { data, error }
  },

  // ✅ Get a specific unit by its unit ID
  async getUnitById(unitId: number): Promise<{ data: Unit | null; error: any }> {
    const { data, error } = await supabase
      .from("units")
      .select("*")
      .eq("unit_id", unitId)
      .single()

    return { data, error }
  },

  // ✅ Optional: Enroll a user in a unit (if you're tracking this later)
  async enrollInUnit(userId: string, unitId: number): Promise<{ data: any; error: any }> {
    const { data, error } = await supabase.from("user_units").insert([
      {
        user_id: userId,
        unit_id: unitId,
        progress: 0,
        started_at: new Date().toISOString(),
      },
    ])

    return { data, error }
  },
}
