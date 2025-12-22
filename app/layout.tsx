
import "./globals.css";

// import Navbar from "./Component/navbar"
// import Footer from "./Component/footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
      
       {/* <Navbar /> */}
        {children}
        {/* <Footer /> */}
      </body>
    </html>
  );
}
