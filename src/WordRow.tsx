// External Dependencies
import { ChangeEvent, FC, useCallback, useState } from "react"
import { Box, Button, Dialog, DialogContent, DialogTitle, Input, Typography } from '@mui/material';
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

    if (currentLetter.result !== Result.Wrong) {
      return;
    }

    setLetters(letters.map((l, i) => ({
      letter: l.letter,
      result: i === index ? result : l.result,
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

      <Dialog open={isDialogOpen}>
        <DialogTitle>
          {getTitle(step)}
        </DialogTitle>

        <DialogContent>
          {step === 'word' && (
            <Container>
              <Input
                autoFocus
                onChange={handleChange}
                value={value}
              />

              <Box marginLeft={2}>
                <Button
                  color="primary"
                  onClick={handleCompleteWord}
                  variant="contained"
                >
                  Next
                </Button>
              </Box>
            </Container>
          )}

          {step === 'yellowLetters' && (
            <Container>
              <LetterGrid
                letters={letters}
                onClickLetter={handleClickLetter}
                onClickResult={Result.Exists}
              />

              <Box marginLeft={2}>
                <Button
                  color="primary"
                  onClick={handleCompleteYellowLetters}
                  variant="contained"
                >
                  Next
                </Button>
              </Box>
            </Container>
          )}

          {step === 'greenLetters' && (
            <Container>
              <LetterGrid
                letters={letters}
                onClickLetter={handleClickLetter}
                onClickResult={Result.Correct}
              />

              <Box marginLeft={2}>
                <Button
                  color="primary"
                  onClick={handleClickDone}
                  variant="contained"
                >
                  Done
                </Button>
              </Box>
            </Container>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default WordRow