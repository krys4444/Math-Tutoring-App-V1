import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

export default function AuthCodeError() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Authentication Error</h1>
          <p className="text-gray-600">There was a problem confirming your email address.</p>
        </div>

        <Alert className="mb-6">
          <AlertDescription>
            The confirmation link may have expired or been used already. Please try signing in or request a new
            confirmation email.
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <Link href="/" className="block">
            <Button className="w-full bg-purple-500 hover:bg-purple-600">Back to Sign In</Button>
          </Link>
          <Link href="/auth/resend" className="block">
            <Button variant="outline" className="w-full">
              Resend Confirmation Email
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
