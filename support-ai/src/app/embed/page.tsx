import EmbedClient from '@/src/components/EmbedClient'
import { getSession } from '@/src/lib/getSession'
import React from 'react'

async function page() {
    const session = await getSession()
  return (
    <>
        <EmbedClient ownerId={session?.user?.id!}/>
    </>
  )
}

export default page
