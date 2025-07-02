import React, { useState } from 'react'

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>React ⚛️ + Vite ⚡️ + Replit 🌀</p>
      <button
        onClick={() => setCount((count) => count + 1)}>
        count is: {count}
      </button>
      <p>
        Edit <code>App.jsx</code> and save to test HMR uupdates.
      </p>
    </div>
  )
}

export default App
