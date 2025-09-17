import React from 'react'
import { db } from '@/lib/db'

export default async function page() {
    console.log(db)
    // Example: const result = await db.query('SELECT * FROM session')
    return (
        <div>page</div>
    )
}
