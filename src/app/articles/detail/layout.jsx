import SecondHeader from "@/app/partials/secondHeader";
import Footer from "@/app/partials/footer";

export default function DetailArticleLayout({children}) {
    return (
        <div className="min-h-screen flex flex-col">
            <SecondHeader />
            <main className="flex-grow">{children}</main>
            <Footer />
        </div>
    )
}