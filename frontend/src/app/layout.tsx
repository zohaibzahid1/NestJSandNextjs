import './globals.css';
import type { Metadata } from 'next';
import { StoreProvider } from "@/context/storeContext";
import Navbar from "@/globalnavbar/navbar";

export const metadata: Metadata = {
  title: 'Next Auth App',
  description: 'Login, Signup, Google Auth, Address',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <Navbar />
        <StoreProvider>
          <main>{children}</main>
        </StoreProvider>
      </body>
    </html>
  );
}
