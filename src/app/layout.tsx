import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from 'next/link'
import Image from 'next/image'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Teco",
  description: "Plataforma Marketplace para Serviços de TI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="w-auto">
          <div className="px-5 shadow-sm flex">
              <Link href="/">
               <Image
                  src="/teco-logo-escuro-sem-fundo.png"
                  alt="logo"
                  width={100}
                  height={100}
                />
              </Link>
              <Image
               src="/search-icon.png"
                  alt="icone"
                  className="my-auto ml-auto mr-4 w-6 h-6"
                  width={64}
                  height={64}
                  />
              <input type="search" className="h-10 my-auto bg-gray-300 border-0 rounded-lg " name="search"></input>
              <Link href="/dashboard" className="my-auto mx-12">
                <Image 
                  src="/user-icon.png"
                  alt="icone"
                  className=" w-12 h-12"
                  width={64}
                  height={64}
                  />
              </Link>
          </div>
          
          <nav className="flex space-x-4 justify-center mx-auto pl-9 py-3">
            <Link href="/">inicio</Link>
            <Link href="/about">sobre</Link>  
            <Link href="/dashboard">dashboard</Link>  
          </nav>
        </header>
        {children}
        <footer className="bg-gray-300 py-12 text-center content-center text-gray-600">
          <div className="w-auto mx-auto">
            <div className="flex  w-min mx-auto">
              <Link href="/" className="px-2 border-r">inicio</Link>
              <Link href="/about" className="px-2 border-r">sobre</Link>  
              <Link href="/dashboard" className="px-2">dashboard</Link>  
            </div>
            <a href="https://github.com/CaioMtho/teco" target="_blank" className="text-center">repositório do github</a>

          </div>
          
          </footer>
      </body>
    </html>
  );
}
