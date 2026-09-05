import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { DEMO_COOKIE } from "@/lib/config";
import { createServerSupabase } from "@/lib/supabase/server";

export default async function HomePage() {
  const jar = await cookies();
  if (jar.get(DEMO_COOKIE)?.value === "1") {
    redirect("/azi");
  }

  const supabase = await createServerSupabase();
  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) redirect("/azi");
  }

  redirect("/login");
}
