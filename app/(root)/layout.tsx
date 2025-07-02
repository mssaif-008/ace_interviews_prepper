import React, { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { isAuthenticated } from "@/lib/actions/auth.action"
import { redirect } from "next/navigation"

const RootLayout = async ({children}: {children: ReactNode}) => {

  const isUseruthenticated = await isAuthenticated();

  if (!isUseruthenticated) redirect('/sign-in');

  return (
    <div className='root-layout'>
      <nav>
        <Link href='/' className="flex items-center gap-2">
          <Image src='/prepper-logo.png' alt="logo" width={38} height={32} />
          <span>Prepper</span>
        </Link>
      </nav>
      {children}
    </div>
  )
}

export default RootLayout