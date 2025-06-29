import { supabase } from "./supabase"

export interface Course {
  course_id: number
  course_name: string
  course_code: string
  description: string
  grade_id: number
  subject: string
  duration_weeks: number
  difficulty_level: string
  prerequisites: string[]
  learning_objectives: string[]
  created_at: string
  updated_at: string
}

export interface UserCourse {
  user_id: string
  course_id: number
  enrollment_date: string
  progress: number
  status: "enrolled" | "completed" | "dropped"
}

export const courseService = {
  // ✅ Get all courses for the user's selected grade
  async getCoursesForUserGrade(): Promise<{ data: Course[] | null; error: any }> {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError || !session?.user) {
      return { data: null, error: { message: "User not authenticated" } }
    }

    const userId = session.user.id

    // 1. Get user's selected grade_id from user_grade
    const { data: userGradeData, error: userGradeError } = await supabase
      .from("user_grade")
      .select("grade_id")
      .eq("user_id", userId)
      .single()

    if (userGradeError || !userGradeData?.grade_id) {
      return {
        data: null,
        error: { message: "No grade selected. Please select a grade first." },
      }
    }

    const gradeId = userGradeData.grade_id

    // 2. Fetch courses that match that grade_id
    const { data: coursesData, error: coursesError } = await supabase
      .from("courses")
      .select("*")
      .eq("grade_id", gradeId)
      .order("course_name", { ascending: true })

    return { data: coursesData, error: coursesError }
  },

  // ✅ Get a specific course by ID
  async getCourseById(courseId: number): Promise<{ data: Course | null; error: any }> {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("course_id", courseId)
      .single()

    return { data, error }
  },

  // ✅ Enroll user in a course
  async enrollInCourse(courseId: number): Promise<{ data: any; error: any }> {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError || !session?.user) {
      return { data: null, error: { message: "User not authenticated" } }
    }

    const userId = session.user.id

    const { data, error } = await supabase.from("user_courses").insert([
      {
        user_id: userId,
        course_id,
        enrollment_date: new Date().toISOString(),
        progress: 0,
        status: "enrolled",
      },
    ])

    return { data, error }
  },
}
