"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import ImageDummy from "@/app/assets/offc-image.jpg";

export default function DetailArticlePage() {
    const { id } = useParams();
    const BASE_API = process.env.NEXT_PUBLIC_BASE_API;

    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showFullContent, setShowFullContent] = useState(false);

    const fetchArticleDetail = async (articleId) => {
        try {
            const token = Cookies.get("token");

            const response = await axios.get(`${BASE_API}/articles/${articleId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setArticle(response.data);
        } catch (err) {
            console.error("Failed to fetch article:", err);
            setError("Failed to load article.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchArticleDetail(id);
        }
    }, [id]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getTrimmedContent = (html, wordLimit = 100) => {
        const plainText = html.replace(/<[^>]+>/g, '');
        const words = plainText.split(/\s+/);

        if (words.length <= wordLimit) return html;

        const trimmed = words.slice(0, wordLimit).join(" ") + " ...";
        return trimmed;
    };
    

    if (loading) return <p className="mt-20 text-center text-gray-500">Loading article...</p>;
    if (error) return <p className="mt-20 text-center text-red-500">{error}</p>;
    if (!article) return null;

    const dummyArticles = Array.from({ length: 3 }, (_, i) => ({
        id: i + 1,
        date: "April 12 2025",
        title: `Cybersecurity Essentials Every Developer Should Know`,
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus repellendus nisi deleniti.",
        tags: ["Technology", "Design"]
    }));

    return (
        <>
            <div className="bg-white border border-gray-200 rounded-xl px-5 py-15">
                <div className="">
                    <div className="flex flex-col items-center space-y-5">
                        <div className="flex items-center justify-center flex-wrap gap-3">
                            <span className="text-gray-600 text-sm">{formatDate(article.createdAt)}</span>
                            <div className="bg-gray-600 p-0.5 rounded-full"></div>
                            <span className="text-gray-600 text-sm">Created by {article.user?.username || "Unknown"}</span>
                        </div>

                        <h1 className="text-center w-full max-w-[500px] font-semibold lg:text-2xl md:text-xl sm:text-xl">
                            {article.title}
                        </h1>

                        <img
                            src={article.imageUrl || ImageDummy.src}
                            alt={article.title}
                            className="w-full max-w-[1000px] h-full rounded-lg border border-gray-200"
                        />
                    </div>

                    <div className="flex justify-center mt-5">
                        <div className="w-full max-w-[1000px] text-gray-600 text-md text-justify whitespace-pre-line">
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: showFullContent
                                        ? article.content
                                        : getTrimmedContent(article.content, 100),
                                }}
                            />
                            {article.content.split(/\s+/).length > 100 && (
                                <button
                                    onClick={() => setShowFullContent(!showFullContent)}
                                    className="mt-2 cursor-pointer text-sm text-blue-600 hover:underline"
                                >
                                    {showFullContent ? "Close" : "Read More"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
