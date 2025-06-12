export default function Footer() {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="flex flex-wrap items-center gap-3 justify-center py-15 px-5 bg-gradient-to-br from-[#2563EBDB] to-[#011c55db] text-white mt-10">
            <span className="font-semibold text-md">BlogGZ.</span>
            <span>© {currentYear} Blog genzet. All rights reserved.</span>
        </footer>
    );
}