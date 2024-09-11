import Head from 'next/head'
import React from 'react'

const Index = () => {
  return (
    <>
      <Head>
        <title>Umpan Balik</title>
      </Head>
      <main>
        <div className='w-full h-[84vh] flex justify-center items-center'>
          <div className='w-[30rem] border rounded-lg p-10'>
            <h1 className='text-xl font-bold text-center'>Umpan Balik</h1>
            <form className='mt-5'>
              <div className='mb-5'>
                <label className='block mb-2'>Nama</label>
                <input type='text' className='w-full border p-2 rounded-lg' />
              </div>
              <div className='mb-5'>
                <label className='block mb-2'>Komentar</label>
                <textarea className='w-full border p-2 rounded-md'></textarea>
              </div>
              <button type='submit' className='bg-black text-white p-2 rounded-lg w-full'>Kirim</button>
            </form>
          </div>
        </div>
      </main>
    </>
  )
}

export default Index