// External Dependencies
import {
  FC,
  MouseEvent,
  useCallback,
  useState
} from 'react';
import {
  Box,
  FormControlLabel,
  IconButton,
  Menu,
  Switch,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';

// Local Typings
interface Props {
  colorBlindMode: boolean;
  darkMode: boolean;
  setColorBlindMode: (colorBlindMode: boolean) => void;
  setDarkMode: (darkMode: boolean) => void;
}

// Component Definition
const Settings: FC<Props> = ({
  colorBlindMode,
  darkMode,
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
        onClose={handleClose}
        open={open}
      >
        <Box
          display="flex"
          flexDirection="column"
          padding={2}
        >
          <FormControlLabel
            control={(
              <Switch
                checked={colorBlindMode}
                onChange={() => setColorBlindMode(!colorBlindMode)}
              />
            )}
            label="Color Blind Mode"
            labelPlacement="start"
          />

          <FormControlLabel
            control={(
              <Switch
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
              />
            )}
            label="Dark Mode"
            labelPlacement="start"
          />
        </Box>
      </Menu>
    </>
  );
}

export default Settings;
