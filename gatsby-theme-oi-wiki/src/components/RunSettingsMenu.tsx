import {
  Button,
  FormControlLabel,
  FormGroup,
  makeStyles,
  Popover,
  Switch,
} from '@material-ui/core'
import { Tune } from '@material-ui/icons'
import React, { useCallback, useState } from 'react'

export interface RunSettings {
  o2: boolean
}

const useStyles = makeStyles((theme) => ({
  menu: {
    padding: theme.spacing(1),
  },
}))

interface RunSettingsMenuProps {
  settings: RunSettings
  setSettings: React.Dispatch<React.SetStateAction<RunSettings>>
}

export function RunSettingsMenu ({
  settings,
  setSettings,
}: RunSettingsMenuProps): React.ReactElement {
  const classes = useStyles()

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const handleBtnClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(e.currentTarget)
    },
    [],
  )

  return (
    <>
      <Button
        startIcon={<Tune />}
        variant="outlined"
        onClick={handleBtnClick}
      >
        选项
      </Button>
      <Popover
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => {
          setAnchorEl(null)
        }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        <FormGroup className={classes.menu}>
          <FormControlLabel
            checked={settings.o2}
            control={
              <Switch
                size="small"
                checked={settings.o2}
                onChange={(e) => {
                  setSettings((prev) => ({ ...prev, o2: e.target.checked }))
                }}
              />
            }
            label="开启O2优化"
          />
        </FormGroup>
      </Popover>
    </>
  )
}
