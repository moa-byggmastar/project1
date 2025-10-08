import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
    try {
        const result = await db.query('SELECT * FROM highscores ORDER BY attempts ASC LIMIT 10')
        return NextResponse.json(result.rows) // Eventuellt använd return new Response(result.rows)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Failed to fetch highscores' }, { status: 500 })
    }
}

export async function POST(req: Request) {
    const body = await req.json()

    try {
        const { name, attempts } = body

        const match = await db.query('SELECT * FROM highscores WHERE name = $1 AND attempts = $2', [name, attempts])
        console.log(match.rows)

        if (match.rows.length == 0) {
            const result = await db.query(
                'INSERT INTO highscores ( name, attempts, date) VALUES ($1, $2, CURRENT_DATE) RETURNING *', [name, attempts])

            return NextResponse.json(result.rows[0])
        } else {
            return NextResponse.json({ message: 'Highscore already exists' }, { status: 200 })
        }

    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Failed to save highscore' }, { status: 500 })
    }
}