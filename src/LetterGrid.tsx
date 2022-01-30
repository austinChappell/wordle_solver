// External Dependencies
import { FC } from 'react'
import styled from '@emotion/styled';
import { Typography } from '@mui/material';

// Local Typings
export enum Result {
  Wrong,
  Exists,
  Correct,
}
export interface LetterGuess {
  letter: string;
  result: Result;
}

interface Props {
  colorBlindMode: boolean;
  letters: LetterGuess[];
  onClickLetter?: (index: number, result: Result) => () => void;
  onClickResult?: Result;
}

// Local Variables
const getBackgroundColor = (result: Result, colorBlindMode: boolean) => {
  switch (result) {
    case Result.Correct:
      return colorBlindMode ? '#DB7500' : '#038A0E';
    case Result.Exists:
      return colorBlindMode ? '#329BDB' : '#CCA80A';
    case Result.Wrong:
      return '#000000';
  }
}
const Grid = styled.div({
  display: 'flex',
});
const size = window.innerWidth < 500 ? 32 : 40;
const LetterContainer = styled.button<{
  colorBlindMode: boolean;
  result: Result;
}>(({
  colorBlindMode,
  result
}) => ({
  alignItems: 'center',
  backgroundColor: getBackgroundColor(result, colorBlindMode),
  border: '1px solid #DDDDDD',
  color: '#FFFFFF',
  display: 'flex',
  justifyContent: 'center',
  height: size,
  margin: 4,
  outlineColor: 'blue',
  outlineWidth: 4,
  width: size,
}));

// Component Definition
const LetterGrid: FC<Props> = ({
  colorBlindMode,
  letters,
  onClickLetter,
  onClickResult,
}) => {
  return (
    <Grid>
      {letters.map((l, index) => (
        <LetterContainer
          colorBlindMode={colorBlindMode}
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