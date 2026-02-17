import DashboardClient from '@/src/components/DashboardClient'
import { getSession } from '@/src/lib/getSession'
import React from 'react'

async function page() {
  const session = await getSession()

  return (
    <>
      <DashboardClient ownerId={session?.user?.id!}/>
     
    </>
  
  )
}

export default page