import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";
import { getDisplayName, getInvitation, invitations } from "@/lib/invitations";
import { isRsvpConfigured } from "@/lib/rsvp";
import { InvitationShell } from "@/components/InvitationShell";
import { WelcomeSection } from "@/components/sections/WelcomeSection";
import { StorySection } from "@/components/sections/StorySection";
import { DetailsSection } from "@/components/sections/DetailsSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { LetterSection } from "@/components/sections/LetterSection";
import { FinaleSection } from "@/components/sections/FinaleSection";
import { PlaceholderBadge } from "@/components/PlaceholderBadge";

interface InvitePageProps {
  params: Promise<{ id: string }>;
}

/** Every guest page is pre-rendered at build time; unknown ids are a real 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return invitations.map((invitation) => ({ id: invitation.id }));
}

export async function generateMetadata({ params }: InvitePageProps): Promise<Metadata> {
  const invitation = getInvitation((await params).id);
  if (!invitation) return { title: "Không tìm thấy thiệp mời", robots: { index: false } };
  const name = getDisplayName(invitation);
  const title = `${name} ơi, bạn được mời!`;
  const description = `${siteConfig.graduate.fullName} trân trọng mời ${name} đến chung vui lễ tốt nghiệp — ${siteConfig.graduate.university}.`;
  return {
    title,
    description,
    // Personal invitations should never show up in search results.
    robots: { index: false, follow: false },
    // Setting openGraph here replaces the root's, so re-attach the shared (name-free) preview image.
    openGraph: { title, description, url: `/invite/${invitation.id}`, images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
    twitter: { title, description, images: ["/opengraph-image"] },
  };
}

export default async function InvitePage({ params }: InvitePageProps) {
  const invitation = getInvitation((await params).id);
  if (!invitation) notFound();

  const guest = {
    id: invitation.id,
    name: getDisplayName(invitation),
    fullName: invitation.recipientName,
    personalMessage: invitation.personalMessage,
  };
  const rsvpOpen = siteConfig.rsvp.enabled && invitation.rsvpEnabled === true && isRsvpConfigured();

  return (
    <InvitationShell guest={guest} config={siteConfig} devBadge={<PlaceholderBadge />}>
      <WelcomeSection guest={guest} config={siteConfig} />
      <StorySection config={siteConfig} />
      <DetailsSection guest={guest} config={siteConfig} />
      <GallerySection config={siteConfig} />
      <LetterSection guest={guest} config={siteConfig} />
      <FinaleSection guest={guest} config={siteConfig} rsvpOpen={rsvpOpen} />
    </InvitationShell>
  );
}
