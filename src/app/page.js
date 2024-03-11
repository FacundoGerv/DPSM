"use client";
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';


export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');
  
  return (
    <main className="h-screen flex justify-center items-start">
      <div className='w-[80%] p-1 border-4 border-gray-900 rounded-md shadow-md'>
      </div>
    </main>
  )
}