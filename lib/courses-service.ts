import { supabase } from "./supabase"

export interface Course {
  course_id: number
  course_name: string
  course_code: string
  description: string
  grade: number
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
  // Get all courses for the user's selected grade
  async getCoursesForUserGrade(): Promise<{ data: Course[] | null; error: any }> {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return { data: null, error: { message: "User not authenticated" } }
    }

    // First get the user's selected grade
    const { data: userGradeData, error: gradeError } = await supabase
      .from("grades")
      .select("grade_id")
      .eq("user_id", session.user.id)

    if (gradeError) {
      return { data: null, error: { message: "No grade selected. Please select a grade first." } }
    }

    // Then get courses for that grade level
    const { data: coursesData, error: coursesError } = await supabase
      .from("courses")
      .select("*")
      .eq("grade", userGradeData.grades.grade)

    return { data: coursesData, error: coursesError }
  },



  // Get a specific course by ID
  async getCourseById(courseId: number): Promise<{ data: Course | null; error: any }> {
    const { data, error } = await supabase.from("courses").select("*").eq("course_id", courseId).single()

    return { data, error }
  },


  // Enroll user in a course
  async enrollInCourse(courseId: number): Promise<{ data: any; error: any }> {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return { data: null, error: { message: "User not authenticated" } }
    }
