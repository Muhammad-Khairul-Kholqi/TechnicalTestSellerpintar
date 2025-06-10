import {
    Newspaper,
    BookOpenCheck,
    Clock3,
    Flame,
} from "lucide-react";

const features = [
    {
        title: "Latest Articles",
        desc: "Always up to date with the latest relevant content.",
        icon: Newspaper,
    },
    {
        title: "Read More Comfortably",
        desc: "A clean and focused display for the best reading experience.",
        icon: BookOpenCheck,
    },
    {
        title: "Quick Access",
        desc: "Open and read articles in an instant without any obstacles.",
        icon: Clock3,
    },
    {
        title: "Most Popular Topics",
        desc: "Follow the trends and read articles that are currently being discussed.",
        icon: Flame,
    },
];

export default function LeftContent() {
    return (
        <section className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-blue-300 to-blue-600">
            <div className="flex flex-col justify-center items-center p-12 w-full">
                <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-8 border border-white/30 shadow-xl w-full max-w-2xl">
                    <h1 className="text-4xl font-bold mb-6 text-gray-800">
                        Browse
                        <span className="text-blue-700"> Quality Articles</span>
                    </h1>

                    <div className="grid grid-cols-2 gap-6 mb-8">
                        {features.map(({ title, desc, icon: Icon }, index) => (
                            <div
                                key={index}
                                className="bg-white/40 p-5 rounded-xl border border-white/30"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-white rounded-lg">
                                        <Icon className="w-6 h-6 text-blue-700" />
                                    </div>
                                    <h3 className="font-semibold">{title}</h3>
                                </div>
                                <p className="text-sm text-gray-800">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
  