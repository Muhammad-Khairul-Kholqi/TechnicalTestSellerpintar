import LeftContent from "@/app/components/registration/leftContent"
import RightContent from "@/app/components/registration/rightContent"

export default function RegistrationPage() {
    return (
        <div className="min-h-screen bg-white flex">
            <LeftContent />
            <RightContent />
        </div>
    )
}