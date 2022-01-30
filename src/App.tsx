// External Dependencies
import {
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import {
  Box,
  Container,
  Link,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography
} from '@mui/material';

// Local Dependencies
import WordRow from './WordRow';
import { LetterGuess, Result } from './LetterGrid';
import { maxPossibilitiesToShow, numOfGuesses, numOfLetters } from './constants';

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

    const confirmedLetters = Array(numOfLetters).fill(null);

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
      .filter(w => !w.split('').every(l => excludedLetters.includes(l)));

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
        setWords(text.toUpperCase().split('\n').filter(word => word.length === numOfLetters));
      })
  }, []);

  return (
    <Box marginY={4}>
      <Container>
        <Typography
          component="h1"
          variant="h4"
        >
          Wordle Solver
        </Typography>

        <Typography
          component="h2"
          gutterBottom
        >
          Help with solving <Link href="https://www.powerlanguage.co.uk/wordle/">wordle</Link> riddles.
        </Typography>

        {Array(numOfGuesses).fill(Boolean).slice(0, attemptedGuesses.length + 1).map((_attempt, index) => (
          <WordRow
            key={index}
            onSetGuess={handleSetGuess}
            showEditButton={index === attemptedGuesses.length}
          />
        ))}

        <Box marginTop={8}>
          <Typography gutterBottom>
            Possible Words (showing {Math.min(remainingPossibleWords.length, maxPossibilitiesToShow)} of {remainingPossibleWords.length.toLocaleString()})
          </Typography>

          <Paper variant="outlined">
            <List>
              {remainingPossibleWords.slice(0, maxPossibilitiesToShow).map(word => (
                <ListItem key={word}>
                  <ListItemText
                    primary={word}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}

export default App;
