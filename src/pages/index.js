import { Inter } from 'next/font/google';
import Header from '../components/Header';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  return (
    <>
      <header>
        <Header />
      </header>
      <main
        className={`flex min-h-screen flex-col items-center justify-between p-2`}
      >
      </main>
    </>

  )
}
