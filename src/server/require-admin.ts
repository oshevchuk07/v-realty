import { auth } from "@/auth";
import { redirect } from "next/navigation";

// proxy.ts already blocks unauthenticated page loads, but Server Actions can in
// principle be invoked directly - this is the real gate for mutations
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    redirect('/admin/login')
  }
}