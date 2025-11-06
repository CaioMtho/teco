import RequestCard from '../../components/request-card'

export default function Page() {
  return (
    <main className="bg-white">
      <h1 className='text-5xl  pt-9 ps-6 pb-3'>Requisições</h1>
      <hr></hr>
      <div id="" className="bg-white mx-12 pt-6 pb-6 grid grid-cols-4">
        <RequestCard/>
        <RequestCard/>
        <RequestCard/>
        <RequestCard/>
        <RequestCard/>
      </div>
    </main>
  )
}
