import HeaderDetailArticle from "@/app/partials/headerDetailArticle"

export default function DetailArticleLayout({children}) {
    return (
        <>
            <HeaderDetailArticle />
            {children}
        </>
    )
}