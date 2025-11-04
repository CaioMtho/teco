'use client'
import Link from 'next/link'

export default function RequestCard(): React.JSX.Element{
    return (
        <div className="border-1 p-2 border-gray-300 rounded-md m-2">
            <h3 className="text-xl">titulo</h3>
            <hr className="text-gray-300"></hr>
            <p className="h-32 overflow-hidden text-gray-600">descricao 
                asijpiergapwirgprgepogepgi
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum exercitationem eligendi commodi! Quisquam illo, suscipit architecto fugiat repudiandae, atque incidunt sapiente vel sit consectetur alias ducimus adipisci nulla temporibus omnis.</p>
        <Link href="/" className="inline-block w-auto p-3 mt-2 text-white font-medium transition-colors 
        bg-gray-800 border rounded-md hover:bg-gray-600 ">visualizar</Link>

        </div>
    )
}