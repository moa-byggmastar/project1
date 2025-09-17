"use client"
import { useState, useEffect } from "react"

interface Result {
  guess: number
  attempts: number
  success: boolean
}

interface Highscore {
  id: number
  name: string
  attempts: number
  date: string
}

export default function GuessNumberGame() {
  const [target, setTarget] = useState(() => Math.floor(Math.random() * 100) + 1)
  const [guess, setGuess] = useState<number | "">("")
  const [attempts, setAttempts] = useState(0)
  const [message, setMessage] = useState("")
  const [results, setResults] = useState<Result[]>([])
  const [highscores, setHighscores] = useState<Highscore[]>([])
  const [playerName, setPlayerName] = useState('')

  //Get highscores from API
  useEffect(() => {
    const fetchHighScores = async () => {
      try {
        const res = await fetch('/api/highscores')
        const data = await res.json()
        setHighscores(data)
      } catch (error) {
        console.error('Failed to fetch highscores:', error)
      }
    }
    fetchHighScores()
  }, [])

  const handleGuess = async () => {
    if (guess === '') return
    const g = Number(guess)
    setAttempts((prev) => prev + 1)

    if (g === target) {
      setMessage(`Rätt! Numret var ${target}. Du klarade det på ${attempts + 1} försök.`)
      setResults((prev) => [...prev, { guess: g, attempts: attempts + 1, success: true }])

      //Save highscore if it's better than existing ones
      if (playerName.trim() !== '') {
        try {
          const res = await fetch('/api/highscores', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: playerName, attempts: attempts + 1 }),
          })

          if (res.ok) {
            const newScore = await res.json()
            setHighscores((prev) => [...prev, newScore].sort((a, b) => a.attempts - b.attempts).slice(0, 10))
          }
        } catch (error) {
          console.error('Failed to save highscore:', error)
        }
      }

      //start a new game
      setTarget(Math.floor(Math.random() * 100) + 1)
      setAttempts(0)
    } else if (g < target) {
      setMessage('För lågt! Försök igen.')
      setResults((prev) => [...prev, { guess: g, attempts: attempts + 1, success: false }])
    } else {
      setMessage('För högt! Försök igen.')
      setResults((prev) => [...prev, { guess: g, attempts: attempts + 1, success: false }])
    }

    setGuess('')
  }

  const restartGame = () => {
    setTarget(Math.floor(Math.random() * 100) + 1)
    setGuess("")
    setAttempts(0)
    setMessage('Spelet har startats om. Gissa ett nytt nummer.')
    setResults([])
  }

  return (
    <main className='min-h-screen flex flex-col items-center justify-center p-6 bg-pink-300'>
      <h1 className='text-2xl font-bold mb-4 text-white'>Gissa Numret (1-100)</h1>

      <div className='flex space-x-2 mb-4'>
        <input
          type="number"
          value={guess}
          onChange={(e) => setGuess(e.target.value === "" ? "" : Number(e.target.value))}
          placeholder='Din gissning'
          className='border border-pink-600 rounded px-3 py-2 w-32 placeholder-pink-600 bg-pink-300 text-pink-600'
        />
        <button onClick={handleGuess} className='bg-pink-400 text-white px-4 py-2 rounded hover:bg-pink-200'>Gissa</button>
        <button onClick={restartGame} className='bg-pink-400 text-white px-4 py-2 rounded hover:bg-pink-200'>Starta Om</button>
      </div>

      <p className='mb-4 text-white'>{message}</p>

      <h2 className='text-xl font-semibold mb-2 text-white'>Historik</h2>
      <ul>
        {results.map((r, i) => (
          <li key={i} className={`p-2 rounded mb-2 ${r.success ? 'bg-green-200' : 'bg-pink-400'}`}>
            Försök {r.attempts}: Du gissade {r.guess}{' '}
            {r.success ? "✅" : "❌"}
          </li>
        ))}
      </ul>

      <h2 className='text-xl font-semibold mt-6 mb-2 text-white'>Highscore</h2>
      <ol className='w-64'>
        {highscores.map((h) => (
          <li key={h.id} className='bg-white/80 text-pink-700 p-2 rounded mb-2 flex justify-between'>
            <span>{h.name}</span>
            <span>{h.attempts} försök</span>
          </li>
        ))}
      </ol>
    </main>
  )
}
