import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { LogoutButton } from "@/components/shared/logout-button"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  return (
    <main className="p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Welcome, {profile?.full_name}</h1>
        <LogoutButton />
      </div>
      <p className="mt-2 text-gray-600">Email: {user.email}</p>
      <p className="text-gray-600">Role: {profile?.role}</p>
      <p className="text-gray-600">
        Verification status: {profile?.identity_verification_status}
      </p>
    </main>
  )
}
