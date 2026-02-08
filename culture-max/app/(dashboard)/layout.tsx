"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <>
      <nav className="bg-[#003595] shadow-md">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="font-bold text-lg text-[#D0B787]">CultureMax</span>
            <div className="flex gap-4">
              <Link
                href="/recommendation"
                className="text-sm text-white/80 hover:text-[#D0B787] transition-colors duration-200"
              >
                Recommendation
              </Link>
              <Link
                href="/profile"
                className="text-sm text-white/80 hover:text-[#D0B787] transition-colors duration-200"
              >
                Profile
              </Link>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="text-sm text-white/80 hover:text-[#D0B787] transition-colors duration-200 cursor-pointer"
          >
            Sign out
          </button>
        </div>
      </nav>
      {children}
    </>
  );
}
