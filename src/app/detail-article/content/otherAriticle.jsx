import ImageDummy from "@/app/assets/bg-header.jpg";
import { ChevronRight, ChevronLeft } from 'lucide-react';

export default function OtherArticle() {
    const dummyArticles = Array.from({ length: 3 }, (_, i) => ({
        id: i + 1,
        date: "April 12 2025",
        title: `Cybersecurity Essentials Every Developer Should Know`,
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus repellendus nisi deleniti.",
        tags: ["Technology", "Design"]
    }));

    return (
        <div className="flex justify-center p-5">
            <div className="w-full max-w-[1000px]">
                <span className="text-lg text-black font-medium">Other Articles</span>
                <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 items-start gap-8 mt-5">
                    {dummyArticles.map((article) => (
                        <a key={article.id} href="#" className="flex flex-col items-start space-y-2 group">
                            <img
                                src={ImageDummy.src}
                                alt=""
                                className="w-full h-full rounded-lg group-hover:scale-105 duration-300"
                            />
                            <span className="text-gray-400 text-sm mt-2">{article.date}</span>
                            <h1 className="font-semibold text-lg group-hover:underline duration-300">{article.title}</h1>
                            <p className="text-gray-600">{article.description}</p>
                            <div className="flex items-center gap-4">
                                {article.tags.map((tag, index) => (
                                    <div
                                        key={index}
                                        className="bg-[#BFDBFE] group-hover:bg-[#BFDBFE]/80 duration-300 rounded-full px-4 py-1"
                                    >
                                        <span className="text-sm">{tag}</span>
                                    </div>
                                ))}
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    )
}