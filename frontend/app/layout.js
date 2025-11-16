// import "./globals.css";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";

// export const metadata = {
//   title: "AI Tutor – Inclusive Assistant",
//   description: "Chat via text, voice, and gestures",
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//        <head>
//       <script src="https://cdn.lordicon.com/lordicon.js"></script>
//       </head>
//       <body className="min-h-screen flex flex-col">
//         <Navbar />
//         <main className="flex-1 max-h-[90vh] ">{children}</main>
//         {/* <Footer /> */}
//       </body>
//     </html>
//   );
// }






import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Script from "next/script"; // ✅ Add this import

export const metadata = {
  title: "AI Tutor – Inclusive Assistant",
  description: "Chat via text, voice, and gestures",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 max-h-[90vh]">{children}</main>
        {/* <Footer /> */}

        {/* ✅ Safe Lordicon script (loads only on client after hydration) */}
        <Script
          src="https://cdn.lordicon.com/lordicon.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
