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
  FormControlLabel,
  IconButton,
  Menu,
  Switch,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import styled from '@emotion/styled';

// Local Typings
interface Props {
  colorBlindMode: boolean;
  darkMode: boolean;
  onClickResetGame: () => void;
  setColorBlindMode: (colorBlindMode: boolean) => void;
  setDarkMode: (darkMode: boolean) => void;
}

// Local Variables
const StyledFormControlLabel = styled(FormControlLabel)({
  marginLeft: 0,
});

// Component Definition
const Settings: FC<Props> = ({
  colorBlindMode,
  darkMode,
  onClickResetGame,
  setColorBlindMode,
  setDarkMode,
}) => {
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
            display="flex"
            justifyContent="center"
            marginTop={2}
            width="100%"
          >
            <Button
              onClick={onClickResetGame}
            >
              Reset Game
            </Button>
          </Box>
        </Box>
      </Menu>
    </>
  );
}

export default Settings;
