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
        {mode === 'normal' ?
          (<img className='w-full'
            src={'https://firebasestorage.googleapis.com/v0/b/dpsm-rgb.appspot.com/o/assets%2F1.png?alt=media&token=3bc139ef-29b4-4873-9d2d-a7419c665406'} />)
          :
          (<img className='w-full'
            src={'https://firebasestorage.googleapis.com/v0/b/dpsm-rgb.appspot.com/o/assets%2F2.png?alt=media&token=4ee2848c-062c-4e8c-a086-587e79a4ef8b'} />)}
      </div>
    </main>
  )
}