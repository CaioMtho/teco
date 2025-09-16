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
        <header className="w-auto bg-gray-800 text-white">
          <div className="px-5 shadow-sm flex items-center">
            <Link href="/">
              <Image
                src="/teco-logo-escuro-sem-fundo.png"
                alt="logo"
                width={100}
                height={100}
              />
            </Link>
            <nav className="flex space-x-8 flex-1 justify-center">
              <Link href="/" className="text-white font-medium hover:text-gray-300 transition-colors">Inicio</Link>
              <Link href="/about" className="text-white font-medium hover:text-gray-300 transition-colors">Sobre</Link>
              <Link href="/dashboard" className="text-white font-medium hover:text-gray-300 transition-colors">Dashboard</Link>
            </nav>
            <Image
              src="/search-icon.png"
              alt="icone"
              className="mr-4 w-6 h-6"
              width={64}
              height={64}
            />
            <input type="search" className="h-10 bg-gray-300 border-0 rounded-lg " name="search"></input>
            <Link href="/dashboard" className="mx-12">
              <Image
                src="/user-icon.png"
                alt="icone"
                className=" w-12 h-12"
                width={64}
                height={64}
              />
            </Link>
          </div>
        </header>
        {children}

        <footer className="bg-gray-300 py-12 text-gray-600" aria-labelledby="footer-heading">
          <div className="max-w-7xl mx-auto px-4" id="footer-heading">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-start">
                <Link href="/" className="mb-4 inline-flex items-center">
                  <Image src="/teco-logo-escuro-sem-fundo.png" alt="Teco" width={40} height={40} />
                  <span className="ml-3 font-semibold text-gray-700">Teco</span>
                </Link>
                <p className="text-sm text-gray-600">Conectando suporte de TI com quem precisa dele</p>
                <div className="mt-4 flex space-x-3" aria-label="redes sociais">
                  <a href="https://github.com/CaioMtho/teco" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                    <Image src="/github-icon.png" alt="GitHub" width={24} height={24} />
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
      </body>
    </html>
  );
}
