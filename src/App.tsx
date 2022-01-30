import { useCallback, useEffect, useMemo, useState } from 'react';
import WordRow from './WordRow';
import { Box, Container, List, ListItem, ListItemText, Typography } from '@mui/material';
import { LetterGuess, Result } from './LetterGrid';

function App() {
  const [words, setWords] = useState<string[] | null>(null);
  const [attemptedGuesses, setAttemptedGuesses] = useState<LetterGuess[][]>([]);

  const handleSetGuess = useCallback((guess: LetterGuess[]) => {
    setAttemptedGuesses([
      ...attemptedGuesses,
      guess,
    ]);
  }, [attemptedGuesses]);

  const remainingPossibleWords = useMemo(() => {
    const attemptedWords = attemptedGuesses
      .map(guess =>
        guess.map(g => g.letter)
          .join(''));

    const excludedLetters = attemptedGuesses
      .flatMap(guess =>
        guess
          .filter(g => g.result === Result.Wrong)
          .map(g => g.letter));

    const confirmedLetters = Array(5).fill(null);

    attemptedGuesses.forEach(guess => {
      guess.forEach((l, index) => {
        if (l.result === Result.Correct) {
          confirmedLetters[index] = l.letter;
        }
      })
    })

    const unknownConfirmedLetters = attemptedWords
      .join('')
      .split('')
      .filter(letter =>
        !confirmedLetters.includes(letter) && !excludedLetters.includes(letter));

    const remainingWords = (words ?? [])
      .filter(w => !attemptedWords.includes(w))
      .filter(w => excludedLetters.every(letter => !w.includes(letter)));

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
  }, [attemptedGuesses, words]);

  useEffect(() => {
    fetch('./words.txt')
      .then((r) => r.text())
      .then(text => {
        setWords(text.toUpperCase().split('\n').filter(word => word.length === 5));
      })
  }, []);

  return (
    <Box marginTop={4}>
      <Container>
        {Array(6).fill(Boolean).map((_attempt, index) => (
          <WordRow
            key={index}
            onSetGuess={handleSetGuess}
            showEditButton={index === attemptedGuesses.length}
          />
        ))}

        {attemptedGuesses.length > 0 && (
          <Box marginTop={8}>
            <Typography>
              Possible Words
            </Typography>

            <List>
              {remainingPossibleWords.slice(0, 20).map(word => (
                <ListItem key={word}>
                  <ListItemText
                    primary={word}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default App;
