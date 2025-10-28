import Image from 'next/image'

export default function Page(){
    return (
        <div className="">
            <h1 className='text-5xl pb-3 pt-9 ps-6'>Dashboard</h1>
            <div id="dashboard" className="bg-white border-2 border-gray-200 rounded-lg m-12 mx-auto w-200 py-6">
                <h2 className='ml-9 text-2xl'>nome do usuário</h2>
                <div className="flex mx-6 my-3 p-3">
                    <Image 
                        src="/user-icon.png"
                        alt="icone"
                        className="my-auto w-42 h-42 bg-gray-300 rounded-xl"
                        width={64}
                        height={64}
                    />
                    <div className='flex flex-col ml-3 w-full'>
                        <label>email:</label>
                        <input type="text" disabled className='w-full bg-gray-200 rounded-md h-6 mb-3'></input>
                        <label>telefone:</label>
                        <input type="text" disabled className='w-full bg-gray-200 rounded-md h-6 mb-3'></input>
                        <label>endereço:</label>
                        <input type="text" disabled className='w-full bg-gray-200 rounded-md h-6 mb-3'></input>
                        <label>sobre:</label>
                        <input type="text" disabled className='w-full bg-gray-200 rounded-md h-6 mb-3'></input>

                    </div>
                    
                </div>
            </div>
        </div>
    )
}