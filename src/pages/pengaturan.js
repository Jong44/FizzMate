import Head from 'next/head'
import React from 'react'
import Swal from 'sweetalert2'

const Index = () => {
    const alertDelete = () => {
        Swal.fire({
            title: 'Apakah Anda yakin?',
            text: "Anda tidak akan dapat mengembalikan ini!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, hapus!'
        }).then((result) => {
            if (result.isConfirmed) {
                handleDeleteThread();
            }
        })
    }

    const handleDeleteThread = async () => {
        let threads = localStorage.getItem("threads");
        if (!threads) {
            Swal.fire(
                'Gagal!',
                'Percakapan tidak ditemukan.',
                'error'
            )
        }
        const response = await fetch(`/api/thread?threadId=${threads}`, {
            method: "DELETE",
        });
        const data = await response.json();
        if (data.deleted) {
            Swal.fire(
                'Terhapus!',
                'Percakapan telah dihapus.',
                'success'
            )
            localStorage.removeItem("threads");
        }
    }

  return (
    <>
        <Head>
            <title>Pengaturan</title>
        </Head>
        <main>
            <div className='flex flex-col p-10 max-md:p-5'>
                <div className='border w-full py-6 px-6 flex flex-col items-start rounded-lg'>
                    <p className='text-2xl font-bold text-center'>Percakapan</p>
                    <div className='h-[1px] bg-gray-200 my-2 w-32'></div>
                    <p className='my-4'>Hapus semua percakapan</p>
                    <button onClick={alertDelete} className=' text-white bg-black px-5 py-2 rounded-lg my-2'>Hapus</button>
                </div>
            </div>
        </main>
    </>
  )
}

export default Index