import * as React from "react";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import SpeakerIcon from "@mui/icons-material/Speaker";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import { postMessage } from "./messenger";

const actions = [
  {
    icon: <SpeakerIcon />, name: "Источник", message: (e) => {
      e.persist();
      postMessage("SHOULD_ADD_SOURCE");
    }
  },
  {
    icon: <KeyboardVoiceIcon />, name: "Приемник", message: (e) => {
      e.persist();
      postMessage("SHOULD_ADD_RECEIVER");
    }
  }
];

export default function SpeedDialTooltipOpen() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <SpeedDial
      ariaLabel="SpeedDial tooltip example"
      sx={{ position: "absolute", bottom: 16, right: 16 }}
      icon={<SpeedDialIcon />}
      onClose={handleClose}
      onOpen={handleOpen}
      open={open}
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
          tooltipOpen
          onClick={action.message}
        />
      ))}
    </SpeedDial>
  );
}
