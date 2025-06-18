"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Sparkles, BookOpen } from "lucide-react"
import { generatePersonalizedLesson, type PersonalizedLessonResponse } from "@/lib/openai-service"

export function PersonalizedLesson() {
  const [loading, setLoading] = useState(true)
  const [result, setResult] = useState<PersonalizedLessonResponse | null>(null)

  const lessonContent = `Lesson Concept: Introduction to Quadratic Functions

A quadratic function is any function that can be written in the form f(x) = ax² + bx + c, where a, b, and c are constants and a ≠ 0, and its graph creates a U-shaped curve called a parabola. 

The coefficient 'a' determines whether the parabola opens upward (when a > 0) or downward (when a < 0), while the vertex represents the minimum point (if opening upward) or maximum point (if opening downward) of the function. 

You can find the x-coordinate of the vertex using the formula x = -b/(2a), and substituting this value back into the original equation gives you the y-coordinate of the vertex.`

  // Auto-generate personalization when component mounts
  useEffect(() => {
    const generatePersonalization = async () => {
      setLoading(true)
      setResult(null)

      const response = await generatePersonalizedLesson()
      setResult(response)
      setLoading(false)
    }

    generatePersonalization()
  }, [])

  return (
    <div className="max-w-4xl space-y-6">
      {/* Original Lesson */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-500" />
            Math Lesson
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded-lg">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans leading-relaxed">{lessonContent}</pre>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              Personalizing Your Lesson...
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500 mx-auto mb-4" />
                <p className="text-gray-600">AI is connecting this lesson to your interests...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {result && !loading && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              Personalized Connection
              {result.selectedInterest && (
                <span className="text-sm font-normal text-gray-600">(Connected to: {result.selectedInterest})</span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {result.error ? (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">{result.error}</AlertDescription>
              </Alert>
            ) : (
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <p className="text-gray-800 leading-relaxed">{result.connection}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-blue-800 mb-2">How it works:</h3>
          <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
            <li>Your interests are automatically loaded from the database</li>
            <li>OpenAI GPT-4 analyzes the lesson and your interests</li>
            <li>AI selects one of your interests and explains how it connects to quadratic functions</li>
            <li>You get a personalized explanation that makes math more relevant to you!</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}
