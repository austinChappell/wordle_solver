// External Dependencies
import {
  FC,
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
  Typography,
} from '@mui/material';

// Local Dependencies
import WordRow from './WordRow';
import { LetterGuess, Result } from './LetterGrid';
import Settings from './Settings';
import styled from '@emotion/styled';

// Local Typings
interface Props {
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
}

// Local Variables
const maxPossibilitiesToShow = 50;
const generateGameId = () => Math.floor(Math.random() * 10_000).toString();
const CenterContainer = styled.div({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
});

// Component Definition
const Game: FC<Props> = ({
  darkMode,
  setDarkMode,
}) => {
  const [numOfGuesses, setNumOfGuesses] = useState(6);
  const [wordLength, setWordLength] = useState(5);
  const [gameId, setGameId] = useState(generateGameId());
  const [colorBlindMode, setColorBlindMode] = useState(false);
  const [words, setWords] = useState<string[] | null>(null);
  const [attemptedGuesses, setAttemptedGuesses] = useState<LetterGuess[][]>([]);

  const handleResetGame = useCallback(() => {
    setAttemptedGuesses([]);
    setGameId(generateGameId());
  }, []);

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

          const isResultWrong = l.result === Result.Wrong;
          const wordHasLetter = word.includes(l.letter);
          const wordHasLetterInExactLocation = word[i] === l.letter;
          const guessHasCorrectLetter = guess
            .some(l2 => l2.letter === l.letter && l2.result !== Result.Wrong);

          const isWrongLetter = (isResultWrong && !wordHasLetter) ||
            (isResultWrong && guessHasCorrectLetter && !wordHasLetterInExactLocation);

          return isExistingLetter
            || isMatchingLetter
            || isWrongLetter;
        }))
    ), [attemptedGuesses, words]);

  useEffect(() => {
    fetch('./words.txt')
      .then((r) => r.text())
      .then(text => {
        setWords(text.toUpperCase().split('\n').filter(word => word.length === wordLength));
      })
  }, [wordLength]);

  return (
    <main>
      <Box
        paddingX={4}
        paddingY={2}
      >
        <Container>
          <Box
            display="flex"
            justifyContent="flex-end"
          >
            <Settings
              colorBlindMode={colorBlindMode}
              darkMode={darkMode}
              numOfGuesses={numOfGuesses}
              onClickResetGame={handleResetGame}
              setColorBlindMode={setColorBlindMode}
              setDarkMode={setDarkMode}
              setNumOfGuesses={setNumOfGuesses}
              setWordLength={setWordLength}
              wordLength={wordLength}
            />
          </Box>

          <CenterContainer>
            <Typography
              component="h1"
              variant="h4"
            >
              Wordle Solver
            </Typography>

            <Typography
              color="textPrimary"
              component="h2"
              gutterBottom
            >
              Help with solving <Link href="https://www.powerlanguage.co.uk/wordle/">wordle</Link> riddles.
            </Typography>

            <Box
              key={gameId}
              marginY={6}
            >
              {Array(numOfGuesses).fill(Boolean).slice(0, attemptedGuesses.length + 1).map((_attempt, index) => (
                <WordRow
                  colorBlindMode={colorBlindMode}
                  key={index}
                  onSetGuess={handleSetGuess}
                  showEditButton={index === attemptedGuesses.length}
                  wordLength={wordLength}
                />
              ))}
            </Box>

            <Typography
              gutterBottom
            >
              Possible Words (showing {Math.min(remainingPossibleWords.length, maxPossibilitiesToShow)} of {remainingPossibleWords.length.toLocaleString()})
            </Typography>

            <Box
              maxWidth={200}
              width="100%"
            >
              <Paper variant="outlined">
                <List dense>
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
          </CenterContainer>
        </Container>
      </Box>
    </main>
  );
}

export default Game;
