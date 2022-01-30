import { useEffect, useMemo, useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [words, setWords] = useState<string[] | null>(null);
  const [attemptedWords, setAttemptedWords] = useState<string[]>([]);
  const [excludedLetters, setExcludedLetters] = useState<string[]>([]);
  const [confirmedLetters, setConfirmedLetters] = useState<(string | null)[]>([
    null,
    null,
    null,
    null,
    null,
  ]);

  const remainingPossibleWords = useMemo(() => {
    const remainingWords = (words ?? [])
      .filter(w => !attemptedWords.includes(w))
      .filter(w => excludedLetters.some(letter => w.includes(letter)));

    if (!confirmedLetters.filter(Boolean).length) {
      return remainingWords;
    }

    return remainingWords
      .filter(word =>
        confirmedLetters
          .every((letter, index) =>
            letter === null || word[index] === letter))
  }, [attemptedWords, confirmedLetters, excludedLetters, words]);

  useEffect(() => {
    console.log('fetching words....')

    fetch('./words.txt')
      .then((r) => r.text())
      .then(text => {
        setWords(text.split('\n').filter(word => word.length === 5));
      })
  }, []);

  console.log('words : ', words);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
