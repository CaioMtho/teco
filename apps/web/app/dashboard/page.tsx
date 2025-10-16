import Image from 'next/image'

export default function Page(){
    return (
      <div className=" mx-auto py-12 px-4">
        <h1 className='text-5xl pb-3 pt-9 ps-6'>Dashboard</h1>
        <div className=" mx-auto flex items-stretch flex-wrap justify-evenly flex-row px-6">
          <div id="dashboard" className=" bg-white border-2 border-gray-200 rounded-lg m-12 mx-auto py-6">
            <h2 className='ml-9 text-2xl'>Nome do usuário</h2>
            <div className="flex flex-wrap justify-evenly mx-6 my-3 p-3">
              <Image
                  src="/user-icon.png"
                  alt="icone"
                  className="my-auto w-42 h-42 bg-gray-300 rounded-xl"
                  width={64}
                  height={64}
                  />
              <div className='flex flex-col ml-3 w-full'>
                <label>Email:</label>
                <input type="text" disabled className='w-full bg-gray-200 rounded-md h-6 mb-3'></input>
                <label>Telefone:</label>
                <input type="text" disabled className='w-full bg-gray-200 rounded-md h-6 mb-3'></input>
                <label>Endereço:</label>
                <input type="text" disabled className='w-full bg-gray-200 rounded-md h-6 mb-3'></input>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-lg m-12 mx-auto w-100 py-3">
            <h4 className='text-2xl pb-3 pt-4 ps-6'>Suporte técnico - Segurança 
              <br /> (Recuperação do Servidor)</h4>
            <h2 className='ml-9 text-lg'>Nome do usuário</h2>
            <div className="flex mx-4 my-3 p-3">

              <div className='flex flex-col ml-3 w-full'>
                <h2>Cliente necessita:</h2>
                <p>Necessito de um reparo completa no servidor da empresa e verificar nível de segurança dos dados</p>
                <div class="flex my-3">
                  <button type="buttom" className='w-40 h-9 bg-blue-700 rounded-md mx-6 text-white' onClick="offerServico()">Oferecer serviço</button>
                  <button type="buttom" className='w-40 h-9 bg-gray-300 rounded-md mx-6 text-black' onClick="detailsService()">Ver detalhes</button>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="items-start flex-wrap justify-evenly flex-row px-6 pt-6 flex pb-3">
          <div className="bg-white border-2 border-gray-200 rounded-lg m-4 mx-auto w-100 py-3">
            <h4 className='text-2xl pb-3 pt-4 ps-6'>Suporte técnico - Software 
              <br /> (Auto CAD e REVIT)</h4>
            <h2 className='ml-9 text-lg'>Nome do usuário</h2>
            <div className="flex mx-4 my-3 p-3">

              <div className='flex flex-col ml-3 w-full'>
                <h2>Cliente necessita:</h2>
                <p>Necessito de um reparo na instalação desse software em algumas máquinas e a reposição da licença</p>
                <div class="flex my-3">
                  <button type="buttom" className='w-40 h-9 bg-blue-700 rounded-md mx-6 text-white' onClick="offerServico()">Oferecer serviço</button>
                  <button type="buttom" className='w-40 h-9 bg-gray-300 rounded-md mx-6 text-black' onClick="detailsService()">Ver detalhes</button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-lg m-4 mx-auto w-100 py-3">
            <h4 className='text-2xl pb-3 pt-4 ps-6'>Suporte técnico - Manutenção 
              <br /> (Manutenção Preventiva)</h4>
            <h2 className='ml-9 text-lg'>Nome do usuário</h2>
            <div className="flex mx-4 my-3 p-3">

              <div className='flex flex-col ml-3 w-full'>
                <h2>Cliente necessita:</h2>
                <p>Solicito uma "troca de óleo" em minha máquina, já faz um tempo que as engrenagens estão "gargalando..."</p>
                <div class="flex my-3">
                  <button type="buttom" className='w-40 h-9 bg-blue-700 rounded-md mx-6 text-white' onClick="offerServico()">Oferecer serviço</button>
                  <button type="buttom" className='w-40 h-9 bg-gray-300 rounded-md mx-6 text-black' onClick="detailsService()">Ver detalhes</button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-lg m-4 mx-auto w-100 py-3">
            <h4 className='text-2xl pb-3 pt-4 ps-6'>Suporte técnico - Hardware 
              <br /> (Não está ligando!)</h4>
            <h2 className='ml-9 text-lg'>Nome do usuário</h2>
            <div className="flex mx-4 my-3 p-3">

              <div className='flex flex-col ml-3 w-full'>
                <h2>Cliente necessita:</h2>
                <p>Necessito de um reparo em um equipamento utilizado na reposição de estoque da loja</p>
                <div class="flex my-3">
                  <button type="buttom" className='w-40 h-9 bg-blue-700 rounded-md mx-6 text-white' onClick="offerServico()">Oferecer serviço</button>
                  <button type="buttom" className='w-40 h-9 bg-gray-300 rounded-md mx-6 text-black' onClick="detailsService()">Ver detalhes</button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    )
}