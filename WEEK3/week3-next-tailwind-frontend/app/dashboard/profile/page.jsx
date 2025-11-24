export const metadata = {
  title: "Profile",
  description: "Access your profile details here.",
};

import ProfileView from "@/components/profile/user-profile";

export default function Page() {
  return (
    <div className="space-y-8 text-black">
      <ProfileView />
    </div>
  );
}