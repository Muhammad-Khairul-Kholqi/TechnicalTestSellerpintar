"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import ImageDummy from "@/app/assets/offc-image.jpg";
import Link from "next/link";

export default function DetailArticlePage() {
    const { id } = useParams();
    const BASE_API = process.env.NEXT_PUBLIC_BASE_API;

    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showFullContent, setShowFullContent] = useState(false);
    const [relatedArticles, setRelatedArticles] = useState([]);
    const [loadingRelated, setLoadingRelated] = useState(false);

    const fetchArticleDetail = async (articleId) => {
        try {
            setLoading(true);
            const token = Cookies.get("token");
            const response = await axios.get(`${BASE_API}/articles/${articleId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setArticle(response.data);
            return response.data;
        } catch (err) {
            console.error("Failed to fetch article:", err);
            setError("Failed to load article.");
            return null;
        } finally {
            setLoading(false);
        }
    };

    const fetchRelatedArticles = async (categoryId, excludeId) => {
        if (!categoryId) return;

        setLoadingRelated(true);
        try {
            const token = Cookies.get("token");
            const response = await axios.get(`${BASE_API}/articles`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const articles = Array.isArray(response.data)
                ? response.data
                : response.data?.data || [];

            const filtered = articles.filter(
                art => art.categoryId === categoryId && art.id !== excludeId
            );
            setRelatedArticles(filtered.slice(0, 3));
        } catch (err) {
            console.error("Failed to fetch related articles:", err);
        } finally {
            setLoadingRelated(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchArticleDetail(id).then((articleData) => {
                if (articleData) {
                    fetchRelatedArticles(articleData.categoryId, id);
                }
            });
        }
    }, [id]);

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getTrimmedContent = (html, wordLimit = 100) => {
        if (!html) return "";
        const plainText = html.replace(/<[^>]+>/g, "");
        const words = plainText.split(/\s+/);
        return words.length <= wordLimit
            ? html
            : words.slice(0, wordLimit).join(" ") + " ...";
    };

    if (loading) return <p className="mt-20 text-center text-gray-500">Loading article...</p>;
    if (error) return <p className="mt-20 text-center text-red-500">{error}</p>;
    if (!article) return <p className="mt-20 text-center text-gray-500">Article not found</p>;

    return (
        <>
            <div className="mt-[70px] flex justify-center p-5">
                <div className="w-full max-w-[1300px] mt-10">
                    <div className="flex flex-col items-center space-y-5">
                        <div className="flex items-center justify-center flex-wrap gap-3">
                            <span className="text-gray-600 text-sm">
                                {formatDate(article.createdAt)}
                            </span>
                            <div className="bg-gray-600 p-0.5 rounded-full"></div>
                            <span className="text-gray-600 text-sm">
                                Created by {article.user?.username || "Unknown"}
                            </span>
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
                            {article.content && article.content.split(/\s+/).length > 100 && (
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

            <div className="flex justify-center p-5">
                <div className="w-full max-w-[1000px]">
                    <span className="text-lg text-black font-medium">
                        Other Articles
                    </span>

                    {loadingRelated ? (
                        <p className="mt-5 text-gray-500">Loading related articles...</p>
                    ) : (
                        <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 items-start gap-8 mt-5">
                            {relatedArticles.map((art) => (
                                <Link
                                    key={art.id}
                                    href={`/articles/${art.id}`}
                                    className="flex flex-col items-start space-y-2 group"
                                >
                                    <img
                                        src={art.imageUrl || ImageDummy.src}
                                        alt={art.title}
                                        className="w-full h-48 object-cover rounded-lg group-hover:scale-105 duration-300"
                                    />
                                    <span className="text-gray-400 text-sm mt-2">
                                        {formatDate(art.createdAt)}
                                    </span>
                                    <h1 className="font-semibold text-lg group-hover:underline duration-300 line-clamp-2">
                                        {art.title}
                                    </h1>
                                    <p className="text-gray-600 line-clamp-3">
                                        {art.description ||
                                            (art.content ?
                                                getTrimmedContent(art.content, 20).replace(/<[^>]+>/g, '')
                                                : "No description available")}
                                    </p>
                                    <div className="flex items-center gap-4">
                                        {art.category && (
                                            <div className="bg-[#BFDBFE] group-hover:bg-[#BFDBFE]/80 duration-300 rounded-full px-4 py-1">
                                                <span className="text-sm">
                                                    {art.category.name}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {!loadingRelated && relatedArticles.length === 0 && (
                        <p className="mt-5 text-gray-500">No related articles found</p>
                    )}
                </div>
            </div>
        </>
    );
}