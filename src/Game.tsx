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
import { maxPossibilitiesToShow, numOfGuesses, numOfLetters } from './constants';
import Settings from './Settings';
import styled from '@emotion/styled';

// Local Typings
interface Props {
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
}

// Local Variables
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

          const isWrongLetter = l.result === Result.Wrong &&
            !word.includes(l.letter);

          return isExistingLetter
            || isMatchingLetter
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
              onClickResetGame={handleResetGame}
              setColorBlindMode={setColorBlindMode}
              setDarkMode={setDarkMode}
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
