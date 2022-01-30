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
  FormControlLabel,
  Link,
  List,
  ListItem,
  ListItemText,
  Paper,
  Switch,
  Typography
} from '@mui/material';

// Local Dependencies
import WordRow from './WordRow';
import { LetterGuess, Result } from './LetterGrid';
import { maxPossibilitiesToShow, numOfGuesses, numOfLetters } from './constants';

function App() {
  const [colorBlindMode, setColorBlindMode] = useState(false);
  const [words, setWords] = useState<string[] | null>(null);
  const [attemptedGuesses, setAttemptedGuesses] = useState<LetterGuess[][]>([]);

  const handleSetGuess = useCallback((guess: LetterGuess[]) => {
    setAttemptedGuesses([
      ...attemptedGuesses,
      guess,
    ]);
  }, [attemptedGuesses]);

  const remainingPossibleWords = useMemo(() => (words ?? [])
    .filter(word =>
      attemptedGuesses.every(guess =>
        guess.every((l, i) => {
          const isExistingLetter = l.result === Result.Exists &&
            word.includes(l.letter) &&
            word[i] !== l.letter;

          const isMatchingLetter = l.result === Result.Correct &&
            word[i] === l.letter;

          const isWrongLetter = l.result === Result.Wrong &&
            !word.includes(l.letter);

          return isExistingLetter || isMatchingLetter
            || isWrongLetter;
        }))
    ), [attemptedGuesses, words]);

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
        <Box
          display="flex"
          justifyContent="space-between"
        >
          <Typography
            component="h1"
            variant="h4"
          >
            Wordle Solver
          </Typography>

          <FormControlLabel
            control={(
              <Switch
                checked={colorBlindMode}
                onChange={() => setColorBlindMode(mode => !mode)}
              />
            )}
            label="Color Blind Mode"
            labelPlacement="start"
          />
        </Box>

        <Typography
          component="h2"
          gutterBottom
        >
          Help with solving <Link href="https://www.powerlanguage.co.uk/wordle/">wordle</Link> riddles.
        </Typography>

        {Array(numOfGuesses).fill(Boolean).slice(0, attemptedGuesses.length + 1).map((_attempt, index) => (
          <WordRow
            colorBlindMode={colorBlindMode}
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
