import LeftContent from "@/app/components/login/leftContent";
import RightContent from "@/app/components/login/rightContent";

export const metadata = {
  title: 'Login | BlogGZ.',
};

export default function LoginPage() {
    return (
      <div className="min-h-screen bg-white flex">
        <LeftContent />
        <RightContent />
      </div>
    );
  }
  