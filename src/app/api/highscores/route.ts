import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
    try {
        const result = await db.query('SELECT * FROM highscores ORDER BY attempts ASC LIMIT 10')
        return NextResponse.json(result.rows)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Failed to fetch highscores' }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { name, attempts } = body

        const result = await db.query(
            'INSERT INTO highscores ( name, attempts, date) VALUES ($1, $2, CURRENT_DATE) RETURNING *',
            [name, attempts]
        )

        return NextResponse.json(result.rows[0])
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Failed to save highscore' }, { status: 500 })
    }
}