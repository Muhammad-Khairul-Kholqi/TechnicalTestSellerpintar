import '@/app/styles/globals.css'
import { Archivo } from "next/font/google";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={archivo.className}>
        {children}
      </body>
    </html>
  );
}