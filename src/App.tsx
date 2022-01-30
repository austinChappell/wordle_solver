import { useCallback, useEffect, useMemo, useState } from 'react';
import WordRow from './WordRow';
import { List, ListItem, ListItemText } from '@mui/material';

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
  const handleSetWord = useCallback((word: string) => {
    setAttemptedWords([
      ...attemptedWords,
      word,
    ]);
  }, [attemptedWords]);

  const remainingPossibleWords = useMemo(() => {
    const unknownConfirmedLetters = attemptedWords
      .join('')
      .split('')
      .filter(letter =>
        !confirmedLetters.includes(letter) && !excludedLetters.includes(letter));

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
      .filter(word =>
        unknownConfirmedLetters
          .every(letter => word.includes(letter)))
  }, [attemptedWords, confirmedLetters, excludedLetters, words]);

  useEffect(() => {
    fetch('./words.txt')
      .then((r) => r.text())
      .then(text => {
        setWords(text.split('\n').filter(word => word.length === 5));
      })
  }, []);

  console.log('words : ', words);

  return (
    <div className="App">
      {Array(6).fill(Boolean).map((_attempt, index) => (
        <WordRow
          key={index}
          onSetWord={handleSetWord}
          showEditButton={index === attemptedWords.length}
        />
      ))}

      <List>
        {remainingPossibleWords.slice(0, 20).map(word => (
          <ListItem key={word}>
            <ListItemText
              primary={word}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default App;
