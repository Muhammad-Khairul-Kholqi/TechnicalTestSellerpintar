import LeftContent from "@/app/components/registration/leftContent"
import RightContent from "@/app/components/registration/rightContent"

export const metadata = {
    title: 'Signup | BlogGZ.',
};

export default function RegistrationPage() {
    return (
        <div className="min-h-screen bg-white flex">
            <LeftContent />
            <RightContent />
        </div>
    )
}