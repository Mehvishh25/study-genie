"use client"

import { useState } from "react"

export default function DrawingSolver() {

  const [image,setImage] = useState<File | null>(null)
  const [text,setText] = useState("")
  const [result,setResult] = useState("")
  const [audioUrl,setAudioUrl] = useState("")

  const solve = async () => {

    const formData = new FormData()

    if(image) formData.append("image",image)
    formData.append("text",text)

    const res = await fetch("http://127.0.0.1:5000/solve-drawing",{
      method:"POST",
      body:formData
    })

    const data = await res.json()

    setResult(data.result)
    setAudioUrl(data.audio)
  }

  return(

    <div className="p-6">

      <h1 className="text-xl font-bold">Drawing Solver</h1>

      <input
      type="file"
      onChange={(e)=>setImage(e.target.files?.[0] || null)}
      />

      <textarea
      placeholder="Optional prompt"
      value={text}
      onChange={(e)=>setText(e.target.value)}
      />

      <button onClick={solve}>
        Solve
      </button>

      <pre className="mt-4">{result}</pre>

      {audioUrl && (
        <div className="mt-4">
          <h3>Listen to Explanation</h3>
          <audio controls src={audioUrl}></audio>
        </div>
      )}

    </div>
  )
}