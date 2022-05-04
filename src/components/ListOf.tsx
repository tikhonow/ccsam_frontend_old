import * as React from "react";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { useAppStore } from "../store/app-store";
import { pickProps } from "../common/helpers";
import VerticalTabs from "./Projects";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog() {
  const { settingsDrawerVisible, set } = useAppStore(store => pickProps(["settingsDrawerVisible", "set"], store));

  const handleClickOpen = () => {
    set(store => {
      store.settingsDrawerVisible = true;
    });
  };

  const handleClose = () => {
    set(store => {
      store.settingsDrawerVisible = false;
    });
  };

  return (
    <div>
      <Dialog
        draggable={true}
        keepMounted
        fullWidth={true}
        maxWidth={"lg"}
        open={settingsDrawerVisible}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Примеры проектов
            </Typography>
          </Toolbar>
        </AppBar>
        <VerticalTabs />
      </Dialog>
    </div>
  );
}
