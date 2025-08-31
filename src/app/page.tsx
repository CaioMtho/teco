import Image from "next/image";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
      <h1 className="text-2xl sm:text-3xl font-bold text-center">
        Teco veio ao mundo!
      </h1>
      <h2>
        Coisas novas virão...  
      </h2>
      <Image
        src="/teco-logo-escuro.png"
        alt="Logo teco"
        width={400}
        height={200}
      />
      </main>
      
    </div>
  );
}
