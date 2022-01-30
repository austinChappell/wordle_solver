// External Dependencies
import { ChangeEvent, FC, useCallback, useState } from "react"
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Input, Typography } from '@mui/material';
import LetterGrid, { LetterGuess, Result } from "./LetterGrid";
import styled from "@emotion/styled";

// Local Typings
type Step = 'word' | 'yellowLetters' | 'greenLetters';
interface Props {
  onSetGuess: (guess: LetterGuess[]) => void;
  showEditButton: boolean;
}

// Local Variables
const defaultLetterGuess: LetterGuess = {
  letter: '',
  result: Result.Wrong,
};
const Container = styled.div({
  alignItems: 'center',
  display: 'flex',
});
const getTitle = (step: Step) => {
  switch (step) {
    case 'word':
      return 'Enter Your Guess';
    case 'yellowLetters':
      return 'Select the Yellow Letters';
    case 'greenLetters':
      return 'Select the Green Letters';
  }
}

// Component Definition
const WordRow: FC<Props> = ({
  onSetGuess,
  showEditButton,
}) => {
  const [letters, setLetters] = useState<LetterGuess[]>(Array(5).fill(defaultLetterGuess));
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [value, setValue] = useState('');
  const [step, setStep] = useState<Step>('word');

  const handleChange = useCallback((evt: ChangeEvent<HTMLInputElement>) => {
    if (evt.target.value.trim().length <= 5) {
      setValue(evt.target.value.trim().toUpperCase());
    }
  }, []);

  const handleCompleteWord = useCallback(() => {
    if (value.length !== 5) {
      return;
    }

    setLetters(value.split('').map(letter => ({
      letter,
      result: Result.Wrong,
    })));

    setStep('yellowLetters');
  }, [value]);

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
        <LetterGrid letters={letters} />

        {showEditButton && (
          <Button
            color="primary"
            onClick={handleClickEdit}
            variant="contained"
          >
            Add Word
          </Button>
        )}
      </Container>

      <Dialog
        fullWidth
        maxWidth="xs"
        open={isDialogOpen}
      >
        <DialogTitle>
          {getTitle(step)}
        </DialogTitle>

        {step === 'word' && (
          <>
            <DialogContent>
              <Input
                autoFocus
                fullWidth
                onChange={handleChange}
                value={value}
              />
            </DialogContent>

            <DialogActions>
              <Button
                color="primary"
                onClick={handleCompleteWord}
                variant="contained"
              >
                Next
              </Button>
            </DialogActions>
          </>
        )}

        {step === 'yellowLetters' && (
          <>
            <DialogContent>
              <LetterGrid
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