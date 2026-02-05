"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StarsBackground from "@/app/components/ocx5/StarsBackground";
import OCX5HeaderNav from "@/app/components/ocx5/OCX5HeaderNav";
import HorizonBridge from "@/app/components/ocx5/HorizonBridge";
import OCX5Footer from "@/app/components/ocx5/OCX5Footer";
import ProfileHeader from "@/app/components/profile/ProfileHeader";
import TicketSection from "@/app/components/profile/TicketSection";
import ComingSoonBlock from "@/app/components/profile/ComingSoonBlock";
import BadgeSection from "@/app/components/profile/BadgeSection";
import AccountSettings from "@/app/components/profile/AccountSettings";
import { MOCK_TICKETS, MOCK_BADGES } from "@/app/components/profile/mockProfileData";
import type { ProfileUser, ProfileTicket, ProfileBadge } from "@/app/components/profile/types";
import { useAuth } from "@/components/AuthProvider";

const PROFILE_GRADIENT =
  "linear-gradient(to bottom,rgb(0, 0, 0) 0%,rgb(39, 28, 28) 25%, #2c090b 50%, #9a1a15 75%, #d43922 100%)";

export default function ProfilePage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/OCX5");
      return;
    }
  }, [user, authLoading, router]);

  // Mock data load (replace with React Query / SWR later)
  useEffect(() => {
    const t = setTimeout(() => {
      setDataLoading(false);
      setDataError(null);
    }, 400);
    return () => clearTimeout(t);
  }, []);

  const profileUser: ProfileUser | null = user
    ? {
        displayName:
          (user.user_metadata?.full_name as string) ||
          (user.user_metadata?.name as string) ||
          user.email?.split("@")[0] ||
          "User",
        email: user.email ?? "",
        avatarUrl: user.user_metadata?.avatar_url ?? null,
        verified: !!user.email_confirmed_at,
        totalTickets: MOCK_TICKETS.filter((t) => t.status === "upcoming").length,
      }
    : null;

  const handleViewTicketDetails = (ticket: ProfileTicket) => {
    // Placeholder: open modal or navigate to ticket detail page later
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBadgeDetails = (_badge: ProfileBadge) => {
    // Placeholder: bottom-sheet or modal later
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch {
      // silent
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white text-xl">Đang tải...</div>
      </div>
    );
  }

  if (!profileUser) {
    return null;
  }

  return (
    <div className="min-h-screen relative">
      <div
        className="fixed inset-0 z-0"
        style={{ background: PROFILE_GRADIENT }}
      />
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="relative w-full h-full">
          <StarsBackground />
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <OCX5HeaderNav showSectionNav={false} />

        <main className="max-w-[1200px] mx-auto w-full flex-1 px-4 sm:px-6 lg:px-8 py-8 pt-24 sm:pt-28 md:pt-32">
          {dataError && (
            <div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-red-300 text-center">
              {dataError}
            </div>
          )}

          {/* Single column layout: top to bottom */}
          <div className="flex flex-col gap-6 md:gap-8 max-w-2xl mx-auto">
            <ProfileHeader user={profileUser} />

            <section aria-labelledby="tickets-heading">
              <h2 id="tickets-heading" className="text-xl font-semibold text-white mb-4">
                🎟 Vé của tôi
              </h2>
              <TicketSection
                tickets={MOCK_TICKETS}
                onViewDetails={handleViewTicketDetails}
                loading={dataLoading}
              />
            </section>

            <section aria-labelledby="transfer-heading">
              <h2 id="transfer-heading" className="text-xl font-semibold text-white mb-4">
                🔄 Chuyển vé
              </h2>
              <ComingSoonBlock
                title="Chuyển vé"
                description="Chuyển vé cho người khác sẽ có trong phiên bản sau."
              />
            </section>

            <BadgeSection
              badges={MOCK_BADGES}
              onBadgeDetails={handleBadgeDetails}
              loading={dataLoading}
            />

            <AccountSettings
              displayName={profileUser.displayName}
              email={profileUser.email}
              onLogout={handleLogout}
            />
          </div>
        </main>

        <div className="relative w-full mt-auto">
          <HorizonBridge
            baseName="imgi_56_horizons_train"
            imageAlt="OCX5 Horizon"
            parallaxSpeed={0}
            position="flow"
            imageClassName="block h-auto w-full max-w-none origin-bottom"
          />
        </div>
        <OCX5Footer />
      </div>
    </div>
  );
}
