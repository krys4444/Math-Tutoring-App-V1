import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://mfolgktmajmwfskarijw.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mb2xna3RtYWptd2Zza2FyaWp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxMjEzNzksImV4cCI6MjA2NDY5NzM3OX0.TcQcuqo4z6SsArEnDCb5O2neGd8sZRvvAw0ZY_XMA-M"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
