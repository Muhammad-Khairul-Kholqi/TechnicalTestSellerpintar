import MainHeader from "@/app/partials/mainHeader";
import Footer from "@/app/partials/footer";

export default function LayoutHome({ children }) {
    return (
        <div className="flex flex-col min-h-screen">
            <MainHeader />
            <main className="flex-grow">{children}</main>
            <Footer />
        </div>
    );
}
