// External Dependencies
import { ChangeEvent, FC, useCallback, useState } from "react"
import { Button, Dialog, DialogContent, Input, Typography } from '@mui/material';
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
  display: 'flex',
});

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
        <DialogContent>
          {step === 'word' && (
            <>
              <Input
                onChange={handleChange}
                value={value}
              />

              <Button
                color="primary"
                onClick={handleCompleteWord}
                variant="contained"
              >
                Next
              </Button>
            </>
          )}

          {step === 'yellowLetters' && (
            <>
              <Typography>
                Select the yellow letters
              </Typography>

              <LetterGrid
                letters={letters}
                onClickLetter={handleClickLetter}
                onClickResult={Result.Exists}
              />

              <Button
                color="primary"
                onClick={handleCompleteYellowLetters}
                variant="contained"
              >
                Next
              </Button>
            </>
          )}

          {step === 'greenLetters' && (
            <>
              <Typography>
                Select the green letters
              </Typography>

              <LetterGrid
                letters={letters}
                onClickLetter={handleClickLetter}
                onClickResult={Result.Correct}
              />

              <Button
                color="primary"
                onClick={handleClickDone}
                variant="contained"
              >
                Done
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default WordRow