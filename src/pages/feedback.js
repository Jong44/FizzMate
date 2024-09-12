import db from '@/config/firestore'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import Head from 'next/head'
import React, { useState } from 'react'
import Swal from 'sweetalert2'

const Index = () => {
  const [form, setForm] = useState({
    name: '',
    comment: ''
  })

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.comment) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Komentar tidak boleh kosong'
      })
      return
    }
    try{
      const docRef = await addDoc(collection(db, 'feedbacks'), {
        name: form.name ? form.name : 'Anonim',
        comment: form.comment,
        createdAt: serverTimestamp()
      })
      successAlert()
      console.log('Document written with ID: ', docRef.id)
    } catch (e) {
      console.error('Error adding document: ', e)
    }

    setForm({
      name: '',
      comment: ''
    })
  }

  const successAlert = () => {
    Swal.fire({
      icon: 'success',
      title: 'Berhasil',
      text: 'Umpan balik berhasil dikirim'
    })
  }

  return (
    <>
      <Head>
        <title>Umpan Balik</title>
      </Head>
      <main>
        <div className='w-full h-[84vh] flex justify-center items-center'>
          <div className='w-[30rem] border rounded-lg p-10'>
            <h1 className='text-xl font-bold text-center'>Umpan Balik</h1>
            <form className='mt-5' onSubmit={handleSubmit}>
              <div className='mb-5'>
                <label className='block'>Nama</label>
                <p className='text-xs text-gray-500 mb-2'>Kosongkan jika ingin mengirim sebagai anonim</p>
                <input type='text' className='w-full border p-2 rounded-lg' onChange={handleChange} name='name' value={form.name} />
              </div>
              <div className='mb-5'>
                <label className='block mb-2'>Komentar</label>
                <textarea className='w-full border p-2 rounded-md' onChange={handleChange} name='comment' value={form.comment}></textarea>
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