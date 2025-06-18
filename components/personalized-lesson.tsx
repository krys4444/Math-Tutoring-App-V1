"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

interface PersonalizedLessonResponse {
  selectedInterest: string
  connection: string
  error?: string
}

export default function PersonalizedLesson() {
  const [response, setResponse] = useState<PersonalizedLessonResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const generateLesson = async () => {
      try {
        setIsLoading(true)
        const res = await fetch("/api/personalized-lesson", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })

        const data = await res.json()
        setResponse(data)
      } catch (error) {
        setResponse({
          selectedInterest: "",
          connection: "",
          error: `Network error: ${error instanceof Error ? error.message : "Unknown error"}`,
        })
      } finally {
        setIsLoading(false)
      }
    }

    generateLesson()
  }, [])

  const lessonContent = `Lesson Concept: Introduction to Quadratic Functions

A quadratic function is any function that can be written in the form f(x) = ax² + bx + c, where a, b, and c are constants and a ≠ 0, and its graph creates a U-shaped curve called a parabola. 

The coefficient 'a' determines whether the parabola opens upward (when a > 0) or downward (when a < 0), while the vertex represents the minimum point (if opening upward) or maximum point (if opening downward) of the function. 

You can find the x-coordinate of the vertex using the formula x = -b/(2a), and substituting this value back into the original equation gives you the y-coordinate of the vertex.`

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <Alert>
        <AlertDescription>
          This page automatically connects math lessons to your personal interests using AI. Make sure you have selected
          interests in the "Your Interests" tab first.
        </AlertDescription>
      </Alert>

      {/* Original Lesson */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">📚 Today's Math Lesson</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded-lg">
            <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">{lessonContent}</pre>
          </div>
        </CardContent>
      </Card>

      {/* AI Personalized Connection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-blue-600">🤖 How This Connects to Your Interests</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <span className="ml-3 text-gray-600">AI is connecting this lesson to your interests...</span>
            </div>
          ) : response?.error ? (
            <Alert>
              <AlertDescription className="text-red-600">{response.error}</AlertDescription>
            </Alert>
          ) : response ? (
            <div className="space-y-4">
              {response.selectedInterest && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">🎯 Selected Interest: {response.selectedInterest}</p>
                </div>
              )}
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-gray-700 leading-relaxed">{response.connection}</p>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
