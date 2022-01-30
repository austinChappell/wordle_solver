// External Dependencies
import { FC } from "react"
import styled from "@emotion/styled";
import { Typography } from "@mui/material";

export enum Result {
  Wrong,
  Exists,
  Correct,
}
export interface LetterGuess {
  letter: string;
  result: Result;
}

// Local Typings
interface Props {
  letters: LetterGuess[];
  onClickLetter?: (index: number, result: Result) => () => void;
  onClickResult?: Result;
}

// Local Variables
const getBackgroundColor = (result: Result) => {
  switch (result) {
    case Result.Correct:
      return '#038A0E';
    case Result.Exists:
      return '#CCA80A';
    case Result.Wrong:
      return '#222222';
  }
}
const Grid = styled.div({
  display: 'flex',
});
const LetterContainer = styled.button<{ result: Result }>(({ result }) => ({
  alignItems: 'center',
  backgroundColor: getBackgroundColor(result),
  color: '#FFFFFF',
  display: 'flex',
  justifyContent: 'center',
  height: 40,
  margin: 8,
  outlineColor: 'blue',
  outlineWidth: 4,
  width: 40,
}));

// Component Definition
const LetterGrid: FC<Props> = ({
  letters,
  onClickLetter,
  onClickResult,
}) => {
  return (
    <Grid>
      {letters.map((l, index) => (
        <LetterContainer
          disabled={!onClickLetter}
          key={index}
          onClick={onClickLetter?.(index, onClickResult ?? Result.Correct)}
          result={l.result}
          tabIndex={0}
        >
          <Typography component="span">
            {l.letter}
          </Typography>
        </LetterContainer>
      ))}
    </Grid>
  )
}

export default LetterGrid