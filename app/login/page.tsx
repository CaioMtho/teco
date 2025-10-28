export default function Page(){
    return (
        <div className="bg-gray-100 h-full flex justify-center">
            <div className='bg-white border-2 border-gray-200 object-center w-auto my-48 px-5'>
                <div className=''>
                <h1 className='text-center text-4xl p-2'>login</h1>
                <div className='w-full'>
                    <div >
                        <label>email:</label>
                        <input type='email' className='bg-gray-100 border-1 border-gray-200 block'></input>
                    </div>
                    <div>
                        <label>senha:</label>
                        <input type='password' className='bg-gray-100 border-1 border-gray-200 block'></input>
                    </div>
                    <div className='w-full mb-3 mt-1 flex justify-end'>
                        <button className="p-3 py-2 mx-auto mt-2 text-black font-medium transition-colors 
                    bg-white border rounded-md hover:bg-gray-100 ">entrar</button>
                    </div>
                </div>
            </div>
            </div>
        </div>
    )
}