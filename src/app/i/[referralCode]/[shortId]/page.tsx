// app/i/[referralCode]/[shortId]/page.tsx
// import InvitePage from "@/app/invite/page";
import InvitePage from '../../../invite/page';  // ✅ Alternative with relative imports

export default function ShortInvitePage() {
    return <InvitePage />;
}