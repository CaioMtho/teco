

export default function Page() {
  return (
    <div className="w-auto bg-white">
      <h1 className="text-5xl pb-3 pt-9 ps-6">Sobre</h1>

      <div className="py-12">
          <h1 className="text-center text-5xl mb-8">Teco</h1>
          <p className="text-center text-lg w-2/3 mx-auto">O Teco é um marketplace web que conecta técnicos de informática que
            prestam suporte a clientes que necessitam de serviços rápidos e confiáveis, a
            domicílio ou não. A plataforma atua como intermediadora, oferecendo
            garantias, segurança de pagamento e avaliação transparente. Diferente da
            contratação direta, o Teco busca minimizar fraudes, aumentar a confiança e
            facilitar tanto para quem contrata quanto para quem presta o serviço.
          </p>

        </div>
        <hr className="w-3/4 mx-auto bg-gray-400"></hr>

      <div className="w-auto bg-white">
        <div className="py-12">
          <h1 className="text-center text-5xl mb-8">missão</h1>
          <p className="text-center text-lg">Oferecer uma plataforma segura e confiável para conectar profissionais de suporte em informática a quem necessita de seus serviços.</p>

        </div>
        <hr className="w-3/4 mx-auto bg-gray-400"></hr>


        <div className="py-12">
          <h1 className="text-center text-5xl mb-8">visão</h1>
          <p className="text-center">Ser reconhecida como a principal e mais confiável plataforma de serviços de informática da cidade de São Paulo.</p>

        </div>
        <hr className="w-3/4 mx-auto bg-gray-400"></hr>


        <div className="mt-12">
          <h1 className="text-center text-5xl mb-8">valores</h1>

          <div className="flex bg-gray-100 py-12 mb-7">
          <div className="w-1/6 h-1/2 m-auto border p-6 rounded-lg border-gray-300 bg-white">
            <h2 className="pb-2 text-center text-2xl text-bold">Transparência</h2>
            <p className="text-center">Transparência entre plataforma e usuários, Nossas soluções devem ter funcionamento claro, com regras acessíveis e disponíveis para revisão a qualquer momento.
            </p>
          </div>

          <div className="w-1/6 h-1/2 m-auto border p-6 rounded-lg border-gray-300 bg-white">
            <h2 className="text-center text-2xl text-bold">Segurança</h2>
            <p className="text-center"> com segurança ponta-a-ponta, Garantir segurança de ponta a ponta para usuários e profissionais, com verificação de identidade, proteção de dados e políticas rigorosas contra comportamentos suspeitos.
            </p>
          </div>

          <div className="w-1/6 h-1/2 m-auto border p-6 rounded-lg border-gray-300 bg-white">
            <h2 className="text-center text-2xl text-bold">Uso responsável de dados</h2>
            <p className="text-center">Uso responsável dos dados: Coletamos apenas o essencial para funcionamento e segurança da plataforma, sempre com base na legislação vigente e consentimento do usuário
            </p>
          </div>

          <div className="w-1/6 h-1/2 m-auto border p-6 rounded-lg border-gray-300 bg-white">
            <h2 className="text-center text-2xl text-bold">Igualdade e inclusão</h2>
            <p className="text-center">Igualdade e inclusão no ambiente: Não toleramos nenhum comportamento discriminatório com base em raça, classe social, gênero ou sexualidade, seja institucionalmente ou no uso da plataforma.
            </p>
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}