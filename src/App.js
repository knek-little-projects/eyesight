import { useEffect, useState } from 'react';
import './App.css';

function Letter({ char, metricInfo, fontSize, className }) {
  if (typeof fontSize !== "number") {
    throw Error("fontSize is not a number");
  }
  const style = {
    fontSize: fontSize / 2 + "px",
    width: fontSize + "px"
  }
  return (
    <div className={className}>
      <div className="container">
        <div className="letter" style={style}>
          {char}
        </div>
        <div className='info'>
          &larr;{metricInfo}&rarr;
        </div>
      </div>
    </div>
  )
}

function MeasureTable({ sizes, letters, onLetterClick, activeLetterIndex }) {

  const columns = sizes.map(x => <th key={x}>{x} mm</th>)
  let rows = []
  let lastRow = null

  for (let i = 0; i < letters.length; i++) {
    if (i % sizes.length === 0) {
      lastRow = []
      rows.push(lastRow)
    }
    const c = letters[i]
    const active = activeLetterIndex === i && "active"
    lastRow.push(<td key={i} onClick={e => onLetterClick({ index: i, letter: c })} className={`measure ${active} ${c.measure}`}>{c.letter}</td>)
  }
  rows = rows.map((row, i) => <tr key={i}>{row}</tr>)

  return (
    <table>
      <thead>
        <tr>
          {columns}
        </tr>
      </thead>
      <tbody>
        {rows}
      </tbody>
    </table>
  )
}

const ROWS = 5
const LETTERS = "QWERTYUIOPASDFGHJKLZXCVBNM"
const MEASURE_UNKNOWN = "measure-unknown"
const MEASURE_RIGHT = "measure-right"
const MEASURE_WRONG = "measure-wrong"

function getDefaultSizes() {
  const sizes = []
  for (let i = 100; i > 0; i -= 5) {
    sizes.push(i)
  }
  return sizes
}

function genRandomLetters(sizes) {
  const letters = []
  let lastChar = null
  for (let i = 0; i < ROWS * sizes.length; i++) {
    let char = lastChar;
    while (char === lastChar) char = LETTERS[Math.floor(Math.random() * LETTERS.length)];
    lastChar = char;

    letters.push({
      letter: char,
      measure: MEASURE_UNKNOWN,
      size: sizes[i % sizes.length],
    })
  }
  return letters
}

function App() {
  const [_scale, setScale] = useState(1)
  const getScale = () => parseFloat(_scale) || 1
  const [sizes, setSizes] = useState(getDefaultSizes())
  const [letters, setLetters] = useState(genRandomLetters(sizes))
  const [letterIndex, setLetterIndex] = useState(0)
  const letter = letters[letterIndex]
  const [keyPressEvent, setKeyPressEvent] = useState(null)

  const onKeyPress = (e) => {
    const { key } = e
    const pressed = key.toLowerCase()
    const expected = letter.letter.toLowerCase()
    console.log("Current index is", letterIndex)
    if (pressed === expected || pressed === " ") {
      const measure = pressed === expected ? MEASURE_RIGHT : MEASURE_WRONG
      letter.measure = measure
      setLetterIndex(i => {
        const newIndex = (i + 1) % letters.length
        console.log("newIndex", newIndex)
        return newIndex
      })
    }
  }

  useEffect(() => {
    console.log("New key press ", keyPressEvent)
    keyPressEvent && onKeyPress(keyPressEvent);
  }, [keyPressEvent])

  useEffect(() => {
    console.log("REGISTERING KEYDOWN")
    document.addEventListener('keydown', e => setKeyPressEvent(e))
  }, [])

  const linearSampleStyle = {
    display: "inline-block",
    width: getScale() * 100 + "px",
    height: "20px",
    background: "gray",
    position: "absolute",
    left: 0,
    bottom: 0,
  }

  return (
    <div className="App">
      <div>
        Scale (px / mm)
        <input type="number" step="0.1" value={_scale} onChange={e => setScale(e.target.value)} />
        <input type="range" min="0.1" step="0.1" max="10" value={_scale} onChange={e => setScale(e.target.value)} />
      </div>
      <Letter className="main-letter" char={letter.letter} metricInfo={`${letter.size}mm`} fontSize={getScale() * letter.size} />
      <hr></hr>
      <MeasureTable
        sizes={sizes}
        letters={letters}
        activeLetterIndex={letterIndex}
        onLetterClick={({ index }) => setLetterIndex(index)}
      />
      <div className='linear-sasmple' style={linearSampleStyle} />
    </div>
  );
}

export default App;
