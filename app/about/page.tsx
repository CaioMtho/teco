import Link from 'next/link'

export default function Page() {
  return (
    <main className="bg-white">
      <div className="max-w-5xl mx-auto py-12 px-4">
        <section className="text-center">
          <h1 className="text-4xl sm:text-5xl font-semibold mb-4">Sobre nós</h1>
          <p className="text-lg text-gray-700 mx-auto max-w-3xl">
            O Teco é um marketplace que conecta técnicos de informática a clientes que
            precisam de suporte rápido e confiável. Atuamos como intermediários, oferecendo
            garantias, meios de pagamento seguros e avaliações transparentes para reduzir
            riscos e facilitar a contratação para ambos os lados.
          </p>
        </section>

        <hr className="my-12 border-t border-gray-300" />

        <section id="missao" aria-labelledby="missao-heading" className="mt-12">
          <h2 id="missao-heading" className="text-3xl text-center font-semibold mb-4">Missão</h2>
          <p className="text-center text-gray-700 max-w-3xl mx-auto">
            Facilitar o acesso a suporte técnico qualificado de forma rápida, transparente
            e acessível, conectando pessoas a profissionais preparados e promovendo confiança
            por meio de garantias e avaliações.
          </p>
        </section>

        <hr className="my-12 border-t border-gray-300" />

        <section id="visao" aria-labelledby="visao-heading" className="mb-12">
          <h2 id="visao-heading" className="text-3xl text-center font-semibold mb-4">Visão</h2>
          <p className="text-center text-gray-700 max-w-3xl mx-auto">
            Ser referência em serviços técnicos sob demanda na cidade de São Paulo,
            reconhecido por eficiência, segurança e qualidade de atendimento.
          </p>
        </section>

        <hr className="my-12 border-t border-gray-300" />

        <section id="valores" aria-labelledby="valores-heading" className="mb-12">
          <h2 id="valores-heading" className="text-3xl text-center font-semibold mb-8">Valores</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <article className="p-6 border rounded-lg border-gray-400 bg-white">
              <h3 className="text-xl font-medium mb-2 text-center">Transparência</h3>
              <p className="text-sm text-gray-700 text-center">
                Processos, critérios de avaliação e políticas de cobrança são claros e
                acessíveis para todos os usuários.
              </p>
            </article>

            <article className="p-6 border rounded-lg border-gray-400 bg-white">
              <h3 className="text-xl font-medium mb-2 text-center">Agilidade com segurança</h3>
              <p className="text-sm text-gray-700 text-center">
                Priorizamos respostas rápidas sem abrir mão de verificações e garantias
                que protejam clientes e profissionais.
              </p>
            </article>

            <article className="p-6 border rounded-lg border-gray-400 bg-white">
              <h3 className="text-xl font-medium mb-2 text-center">Uso responsável de dados</h3>
              <p className="text-sm text-gray-700 text-center">
                Coletamos apenas o essencial, com consentimento e em conformidade com a
                legislação. Os dados são tratados com confidencialidade e segurança.
              </p>
            </article>

            <article className="p-6 border rounded-lg border-gray-400 bg-white">
              <h3 className="text-xl font-medium mb-2 text-center">Igualdade e inclusão</h3>
              <p className="text-sm text-gray-700 text-center">
                Promovemos um ambiente sem discriminação e com oportunidades iguais para
                todos os profissionais e clientes da plataforma.
              </p>
            </article>
          </div>
        </section>

        <section className="mt-12 text-center">
          <p className="text-gray-700">Quer tirar uma dúvida?</p>
          <Link href="/contact" className="inline-block mt-6 px-6 py-2 border border-gray-400 rounded-lg text-gray-700 hover:opacity-90">Fale conosco</Link>
        </section>
      </div>
    </main>
  )
}
