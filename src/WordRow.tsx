// External Dependencies
import {
  ChangeEvent,
  FC,
  useCallback,
  useState
} from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from '@mui/material';
import styled from '@emotion/styled';

// Local Dependencies
import LetterGrid, { LetterGuess, Result } from './LetterGrid';

// Local Typings
type Step = 'word' | 'yellowLetters' | 'greenLetters';
interface Props {
  colorBlindMode: boolean;
  onSetGuess: (guess: LetterGuess[]) => void;
  showEditButton: boolean;
  wordLength: number;
}

// Local Variables
const defaultLetterGuess: LetterGuess = {
  letter: '',
  result: Result.Wrong,
};
const Container = styled.div({
  alignItems: 'flex-start',
  display: 'flex',
  flexDirection: 'column',
});
const getTitle = (step: Step, colorBlindMode: boolean) => {
  switch (step) {
    case 'word':
      return 'Enter Your Guess';
    case 'yellowLetters':
      return `Select the ${colorBlindMode ? 'Blue' : 'Yellow'} Letters`;
    case 'greenLetters':
      return `Select the ${colorBlindMode ? 'Orange' : 'Green'} Letters`;
  }
}

// Component Definition
const WordRow: FC<Props> = ({
  colorBlindMode,
  onSetGuess,
  showEditButton,
  wordLength,
}) => {
  const [letters, setLetters] = useState<LetterGuess[]>(Array(wordLength).fill(defaultLetterGuess));
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [value, setValue] = useState('');
  const [step, setStep] = useState<Step>('word');

  const handleChange = useCallback((evt: ChangeEvent<HTMLInputElement>) => {
    if (evt.target.value.trim().length <= wordLength) {
      setValue(evt.target.value.trim().toUpperCase());
    }
  }, [wordLength]);

  const handleCompleteWord = useCallback(() => {
    if (value.length !== wordLength) {
      return;
    }

    setLetters(value.split('').map(letter => ({
      letter,
      result: Result.Wrong,
    })));

    setStep('yellowLetters');
  }, [value, wordLength]);

  const handleClickCancel = useCallback(() => {
    setIsDialogOpen(false);
    setValue('');
  }, []);

  const handleCompleteYellowLetters = useCallback(() => {
    setStep('greenLetters');
  }, []);

  const handleClickEdit = useCallback(() => {
    setIsDialogOpen(true);
  }, []);

  const handleClickDone = useCallback(() => {
    onSetGuess(letters);
    setIsDialogOpen(false);
  }, [letters, onSetGuess]);

  const handleClickLetter = useCallback((index: number, result: Result) => () => {
    const currentLetter = letters[index];

    const newResult = currentLetter.result === Result.Wrong ? result : Result.Wrong;

    setLetters(letters.map((l, i) => ({
      letter: l.letter,
      result: i === index ? newResult : l.result,
    })));
  }, [letters]);

  return (
    <>
      <Container>
        <LetterGrid
          colorBlindMode={colorBlindMode}
          letters={letters}
        />

        {showEditButton && (
          <Box
            display="flex"
            justifyContent="flex-end"
            marginTop={1}
            width="100%"
          >
            <Button
              color="primary"
              onClick={handleClickEdit}
              size={window.innerWidth < 500 ? 'small' : 'medium'}
              variant="contained"
            >
              Add Guess
            </Button>
          </Box>
        )}
      </Container>

      <Dialog
        fullWidth
        maxWidth="xs"
        open={isDialogOpen}
      >
        <DialogTitle>
          {getTitle(step, colorBlindMode)}
        </DialogTitle>

        {step === 'word' && (
          <form onSubmit={handleCompleteWord}>
            <DialogContent>
              <TextField
                autoFocus
                fullWidth
                label="Your Guess"
                onChange={handleChange}
                value={value}
              />
            </DialogContent>

            <DialogActions>
              <Button
                color="primary"
                onClick={handleClickCancel}
                variant="outlined"
              >
                Cancel
              </Button>

              <Button
                color="primary"
                type="submit"
                variant="contained"
              >
                Next
              </Button>
            </DialogActions>
          </form>
        )}

        {step === 'yellowLetters' && (
          <>
            <DialogContent>
              <LetterGrid
                colorBlindMode={colorBlindMode}
                letters={letters}
                onClickLetter={handleClickLetter}
                onClickResult={Result.Exists}
              />
            </DialogContent>

            <DialogActions>
              <Button
                color="primary"
                onClick={() => setStep('word')}
                variant="outlined"
              >
                Back
              </Button>

              <Button
                autoFocus
                color="primary"
                onClick={handleCompleteYellowLetters}
                variant="contained"
              >
                Next
              </Button>
            </DialogActions>
          </>
        )}

        {step === 'greenLetters' && (
          <>
            <DialogContent>
              <LetterGrid
                colorBlindMode={colorBlindMode}
                letters={letters}
                onClickLetter={handleClickLetter}
                onClickResult={Result.Correct}
              />
            </DialogContent>

            <DialogActions>
              <Button
                color="primary"
                onClick={() => setStep('yellowLetters')}
                variant="outlined"
              >
                Back
              </Button>

              <Button
                autoFocus
                color="primary"
                onClick={handleClickDone}
                variant="contained"
              >
                Done
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  )
}

export default WordRow