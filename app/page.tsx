"use client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Sparkles } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { AuthForm } from "@/components/auth-form"
import Dashboard from "./dashboard/page"
import { useState } from "react"

export default function HomePage() {
  const { user, loading } = useAuth()
  const [isAuthOpen, setIsAuthOpen] = useState(false)

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">M</span>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // If user is authenticated, show dashboard
  if (user) {
    return <Dashboard />
  }

  // Show landing page for unauthenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <span className="text-xl font-semibold text-gray-800">MathTutor</span>
        </div>
        <div className="flex items-center gap-4">
          <Dialog open={isAuthOpen} onOpenChange={setIsAuthOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" className="text-gray-600 hover:text-gray-800">
                Sign in
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Welcome to MathTutor</DialogTitle>
              </DialogHeader>
              <AuthForm onSuccess={() => setIsAuthOpen(false)} />
            </DialogContent>
          </Dialog>
          <Button
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-full"
            onClick={() => setIsAuthOpen(true)}
          >
            Get started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-16">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-8">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span className="text-sm text-gray-600">Trusted by 10,000+ students</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6">
            Math made <span className="text-purple-500">simple</span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
            Learn mathematics at your own pace with AI-powered tutoring that adapts to how you think and learn best.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-4 rounded-full text-lg"
              onClick={() => setIsAuthOpen(true)}
            >
              Start learning free →
            </Button>
            <Button variant="ghost" size="lg" className="text-gray-600 hover:text-gray-800 px-8 py-4 text-lg">
              Watch demo
            </Button>
          </div>
        </div>
      </main>

      {/* Courses Section */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Ontario Math Courses</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: "Grade 9 Math", color: "bg-blue-100 border-blue-200" },
            { title: "Foundations of Mathematics", color: "bg-green-100 border-green-200" },
            { title: "Principles of Mathematics", color: "bg-orange-100 border-orange-200" },
          ].map((course, index) => (
            <div key={index} className={`${course.color} border-2 rounded-2xl p-6 hover:shadow-lg transition-shadow`}>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{course.title}</h3>
              <p className="text-gray-600 mb-4">Comprehensive curriculum designed for Ontario students</p>
              <Button variant="outline" className="w-full bg-transparent" onClick={() => setIsAuthOpen(true)}>
                Explore Course
              </Button>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
