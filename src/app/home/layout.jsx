import HeaderHome from "@/app/partials/headerHome";
import Footer from "@/app/partials/footer";

export default function LayoutHome({ children }) {
    return (
        <div className="flex flex-col min-h-screen">
            <HeaderHome />
            <main className="flex-grow">{children}</main>
            <Footer />
        </div>
    );
}
