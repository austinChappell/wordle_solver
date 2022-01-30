// External Dependencies
import {
  FC,
  MouseEvent,
  useCallback,
  useState
} from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Menu,
  Switch,
  TextField,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import styled from '@emotion/styled';

// Local Typings
interface Props {
  colorBlindMode: boolean;
  darkMode: boolean;
  numOfGuesses: number;
  onClickResetGame: () => void;
  setColorBlindMode: (colorBlindMode: boolean) => void;
  setDarkMode: (darkMode: boolean) => void;
  setNumOfGuesses: (numOfGuesses: number) => void;
  setWordLength: (wordLength: number) => void;
  wordLength: number;
}

// Local Variables
const StyledFormControlLabel = styled(FormControlLabel)({
  marginLeft: 0,
});

// Component Definition
const Settings: FC<Props> = ({
  colorBlindMode,
  darkMode,
  numOfGuesses,
  onClickResetGame,
  setColorBlindMode,
  setDarkMode,
  setNumOfGuesses,
  setWordLength,
  wordLength,
}) => {
  const [localNumOfGuesses, setLocalNumOfGuesses] = useState(numOfGuesses);
  const [localWordLength, setLocalWordLength] = useState(wordLength);

  const [isGameSettingsDialogOpen, setIsGameSettingsDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const handleClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    if (event?.currentTarget) {
      setAnchorEl(event?.currentTarget);
    }
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleClickGameSettings = useCallback(() => {
    setIsGameSettingsDialogOpen(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setIsGameSettingsDialogOpen(false);
  }, [])

  const handleSaveGameSettings = useCallback(() => {
    setNumOfGuesses(localNumOfGuesses);
    setWordLength(localWordLength);
    handleCloseDialog();
    onClickResetGame();
  }, [
    handleCloseDialog,
    localNumOfGuesses,
    localWordLength,
    onClickResetGame,
    setNumOfGuesses,
    setWordLength,
  ]);

  return (
    <>
      <IconButton onClick={handleClick}>
        <SettingsIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          horizontal: 'right',
          vertical: 'bottom',
        }}
        onClose={handleClose}
        open={open}
        transformOrigin={{
          horizontal: 'right',
          vertical: 'top',
        }}
      >
        <Box
          alignItems="flex-start"
          display="flex"
          flexDirection="column"
          padding={2}
        >
          <StyledFormControlLabel
            control={(
              <Switch
                checked={colorBlindMode}
                onChange={() => setColorBlindMode(!colorBlindMode)}
              />
            )}
            label="Color Blind Mode"
            labelPlacement="start"
          />

          <StyledFormControlLabel
            control={(
              <Switch
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
              />
            )}
            label="Dark Mode"
            labelPlacement="start"
          />

          <Box
            alignItems="center"
            display="flex"
            flexDirection="column"
            marginTop={2}
            width="100%"
          >
            <Button
              onClick={handleClickGameSettings}
            >
              Game Settings
            </Button>

            <Button
              onClick={onClickResetGame}
            >
              Reset Game
            </Button>
          </Box>
        </Box>
      </Menu>

      <Dialog open={isGameSettingsDialogOpen}>
        <DialogTitle>
          Game Settings
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            Adjusting game settings will reset your guesses.
          </DialogContentText>

          <Box
            marginTop={2}
            paddingY={1}
          >
            <TextField
              fullWidth
              inputProps={{ max: 12, min: 2 }}
              label="Letters per word"
              onChange={(evt) => {
                setLocalWordLength(Number(evt.target.value))
              }}
              type="number"
              value={localWordLength.toString()}
            />
          </Box>

          <Box paddingY={1}>
            <TextField
              fullWidth
              inputProps={{ min: 1 }}
              label="Number of guesses"
              onChange={(evt) => {
                setLocalNumOfGuesses(Number(evt.target.value))
              }}
              type="number"
              value={localNumOfGuesses.toString()}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button
            color="primary"
            onClick={handleCloseDialog}
            variant="outlined"
          >
            Cancel
          </Button>

          <Button
            color="primary"
            onClick={handleSaveGameSettings}
            variant="contained"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Settings;
