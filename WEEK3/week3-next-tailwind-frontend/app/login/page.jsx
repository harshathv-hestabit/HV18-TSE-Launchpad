export const metadata = {
  title: "Login",
  description: "Access your account by logging in to the dashboard.",
};

import LoginForm from "@/components/profile/login-form";
export default function Page() {
  return (
    <div className="space-y-8 text-black">
      <LoginForm />
    </div>
  );
}
