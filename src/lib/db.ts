import { Client } from 'pg'

const db = new Client({
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    host: process.env.PGHOST,
    ssl: true
})

async function dbFunction() {
    return await db.connect()
}

await dbFunction()

export { db }