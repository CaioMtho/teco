
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from 'next/link'
import Image from 'next/image'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Analytics } from "@vercel/analytics/next"
import { supabase } from 'lib/supabase/client'

import EntrarButton from "../components/menu/entrar-button"
import MenuPopover from "../components/menu/menuPopover"


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
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <header className="w-auto bg-neutral-900 text-white z-9000">
          <div className="px-5 shadow-sm flex items-center z-9000">
            <Link href="/">
              <Image
                src="/teco-logo-escuro-sem-fundo.png"
                alt="logo"
                width={100}
                height={100}
              />
            </Link>



            
            <EntrarButton />
            <MenuPopover />
          </div>
        </header>
 
        {children}
        
        <footer className="bg-gray-300 py-12 text-gray-600" aria-labelledby="footer-heading">
          <div className="max-w-7xl mx-auto px-4" id="footer-heading">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-start">
                <Link href="/" className="mb-4 inline-flex items-center">
                  <Image src="/teco-logo-escuro-sem-fundo(1).png" alt="Teco" width={60} height={60} />
                  <span className="ml-3 font-semibold text-gray-700">Teco</span>
                </Link>
                <p className="text-sm text-gray-600">Conectando suporte de TI com quem precisa dele</p>
                <div className="mt-4 flex space-x-3" aria-label="redes sociais">
                  <a href="https://github.com/CaioMtho/teco" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                    Github
                  </a>
                </div>
              </div>

              <nav className="text-sm" aria-label="Mapa do site">
                <h3 className="font-medium mb-2 text-gray-700">Mapa do site</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/" className="hover:underline">Início</Link>
                  </li>
                  <li>
                    <Link href="/about" className="hover:underline">Sobre</Link>
                  </li>
                  <li>
                    <Link href="/dashboard" className="hover:underline">Dashboard</Link>
                  </li>
                  <li>
                    <Link href="/blog" className="hover:underline">Blog</Link>
                  </li>
                </ul>
              </nav>

              <div>
                <h3 className="font-medium mb-2 text-gray-700">Contato</h3>
                <address className="not-italic text-sm mb-4">
                  <div>e-mail: <a href="mailto:contato@teco.com" className="hover:underline">contato@teco.com</a></div>
                  <div>Telefone: <a href="tel:+5511999999999" className="hover:underline">+55 (11) 99999-9999</a></div>
                </address>

                </div>
            </div>

            <div className="mt-8 border-t border-gray-200 pt-6 flex flex-col md:flex-row items-center justify-between text-sm">
              <p className="text-gray-600">© {new Date().getFullYear()} Teco. Todos os direitos reservados.</p>

              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <Link href="/terms" className="hover:underline">Termos</Link>
                <Link href="/privacy" className="hover:underline">Privacidade</Link>
                <Link href="/cookies" className="hover:underline">Cookies</Link>
              </div>
            </div>
          </div>
        </footer>
        <Analytics/>
      </body>
    </html>
  );
}
