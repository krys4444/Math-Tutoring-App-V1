"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, BookOpen, Clock, Users, Star } from "lucide-react"
import { useState, useEffect } from "react"
import { courseService, type Course } from "@/lib/courses-service"

export default function CoursePage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id

  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadCourse = async () => {
      if (courseId) {
        setLoading(true)
        setError(null)

        const { data, error: courseError } = await courseService.getCourseById(Number(courseId))

        if (courseError) {
          setError(courseError.message)
        } else {
          setCourse(data)
        }

        setLoading(false)
      }
    }

    loadCourse()
  }, [courseId])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
            <div className="h-6 w-px bg-gray-300" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-lg font-semibold text-gray-800">MathTutor</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          {loading ? (
            <>
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <BookOpen className="w-12 h-12 text-gray-400" />
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-4">Loading Course...</h1>
            </>
          ) : error ? (
            <>
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-red-500 text-2xl">⚠️</span>
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-4">Course Not Found</h1>
              <p className="text-xl text-gray-600 mb-8">{error}</p>
            </>
          ) : course ? (
            <>
              <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-12 h-12 text-purple-500" />
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-4">{course.course_name}</h1>
              <p className="text-xl text-gray-600 mb-4">{course.description}</p>
              <div className="flex items-center justify-center gap-6 mb-8">
                <span className="text-sm text-gray-500">Grade {course.grade_id}</span>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">{course.duration_weeks} weeks</span>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">{course.difficulty_level}</span>
              </div>
              <p className="text-lg text-gray-600 mb-8">
                Course content coming soon! We're working hard to bring you an amazing learning experience.
              </p>
            </>
          ) : (
            <>
              <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-12 h-12 text-purple-500" />
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-4">Course Content Coming Soon!</h1>
              <p className="text-xl text-gray-600 mb-8">
                We're working hard to bring you an amazing learning experience for Course ID: {courseId}
              </p>
            </>
          )}
        </div>

        {/* Feature Preview Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card className="border-2 border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <BookOpen className="w-5 h-5" />
                Interactive Lessons
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-600">
                Engaging video lessons with interactive exercises and real-time feedback to help you master mathematical
                concepts.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Clock className="w-5 h-5" />
                Progress Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-600">
                Track your learning progress with detailed analytics and personalized recommendations for improvement.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <Users className="w-5 h-5" />
                AI Tutoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-600">
                Get instant help from our AI tutor that adapts to your learning style and provides personalized
                explanations.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-700">
                <Star className="w-5 h-5" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-orange-600">
                Earn badges and certificates as you complete lessons and demonstrate mastery of mathematical concepts.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <p className="text-gray-600 mb-6">
            {course
              ? "Ready to start learning? View the course units below!"
              : "Want to be notified when this course is ready? We'll send you an email as soon as it's available!"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => router.back()} className="bg-purple-500 hover:bg-purple-600 px-8 py-3">
              Back to My Courses
            </Button>
            {course && (
              <Button
                onClick={() => router.push(`/course/${courseId}/units`)}
                className="bg-green-500 hover:bg-green-600 px-8 py-3"
              >
                View Course Units
              </Button>
            )}
            <Button
              variant="outline"
              className="px-8 py-3 bg-transparent"
              onClick={() => alert("Notification feature coming soon!")}
            >
              Notify Me When Ready
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
