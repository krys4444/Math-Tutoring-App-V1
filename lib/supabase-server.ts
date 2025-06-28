import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

export function createServerClient() {
  const cookieStore = cookies()

  return createClient(
    "https://mfolgktmajmwfskarijw.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mb2xna3RtYWptd2Zza2FyaWp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxMjEzNzksImV4cCI6MjA2NDY5NzM3OX0.TcQcuqo4z6SsArEnDCb5O2neGd8sZRvvAw0ZY_XMA-M",
    {
      auth: {
        storage: {
          getItem: (key: string) => {
            return cookieStore.get(key)?.value
          },
          setItem: (key: string, value: string) => {
            cookieStore.set(key, value)
          },
          removeItem: (key: string) => {
            cookieStore.delete(key)
          },
        },
      },
    },
  )
}
