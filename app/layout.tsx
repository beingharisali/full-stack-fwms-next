import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import RoleNavigation from "@/components/RoleNavigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <RoleNavigation />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
