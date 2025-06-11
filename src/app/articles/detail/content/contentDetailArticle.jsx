import ImageDummy from "@/app/assets/bg-header.jpg";

export default function ContentDetailArticle() {
    return (
        <div className="mt-[70px] flex justify-center p-5">
            <div className="w-full max-w-[1300px] mt-10">
                <div className="flex flex-col items-center space-y-5">
                    <div className="flex items-center gap-3">
                        <span className="text-gray-600 text-sm">February 4, 2025</span>
                        <div className="bg-gray-600 p-0.5 rounded-full"></div>
                        <span className="text-gray-600 text-sm">Created by Admin</span>
                    </div>

                    <h1 className="text-center w-full max-w-[500px] font-semibold lg:text-2xl md:text-xl sm:text-xl">Figma's New Dev Mode: A Game-Changer for Designers & Developers</h1>

                    <img
                        src={ImageDummy.src}
                        alt=""
                        className="w-full max-w-[1000px] h-full rounded-lg"
                    />
                </div>

                <div className="flex justify-center mt-5">
                    <p className="w-full max-w-[1000px] text-gray-600 text-sm text-justify">
                        🔧 What Is Dev Mode?
                        Dev Mode is a new interface within Figma that provides developer-focused tools and removes unnecessary UI clutter that designers typically use. Instead, developers can view ready-to-implement specs, such as spacing, color values, font styles, and asset exports—without disrupting the design file or asking the design team for clarifications.
                    </p>
                </div>
            </div>
        </div>
    )
}