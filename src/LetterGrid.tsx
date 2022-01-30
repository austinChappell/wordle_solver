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
  gap: 8,
  marginBottom: 8,
});
const size = '15vw'
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
  maxHeight: 60,
  maxWidth: 60,
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