import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { emit } from "../messenger";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import SaveIcon from "@mui/icons-material/Save";
import HelpIcon from "@mui/icons-material/Help";
import { useAppStore } from "../store/app-store";

type Anchor = "top" | "left" | "bottom" | "right";

const components = {
  NEW: FolderOpenIcon,
  OPEN: FolderOpenIcon,
  SAVE: SaveIcon,
  SHOW_IMPORT_DIALOG: ImportExportIcon,
  Help: HelpIcon

};

function DynamicIcon(name: string) {
  const Component = React.createElement(components[name]);
  return Component;
}

export default function TemporaryDrawer() {
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false
  });

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
      (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
          event.type === "keydown" &&
          ((event as React.KeyboardEvent).key === "Tab" ||
            (event as React.KeyboardEvent).key === "Shift")
        ) {
          return;
        }

        setState({ ...state, [anchor]: open });
      };

  const list = (anchor: Anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <ListItem button
                  onClick={() => {
                    useAppStore.getState().set(store => {
                      store.settingsDrawerVisible = true;
                    });
                  }}
        >
          <ListItemIcon>
            {DynamicIcon("NEW")}
          </ListItemIcon>
          <ListItemText primary={"New"} />
        </ListItem>
        {[
          ["Open", "OPEN"],
          ["Save", "SAVE"]
        ].map((text, index) => (
          <ListItem button key={text[0]}
                    onClick={(e) => {
                      emit(text[1] as keyof EventTypes, Boolean(text[2]));
                    }}
          >
            <ListItemIcon>
              {DynamicIcon(text[1])}
            </ListItemIcon>
            <ListItemText primary={text[0]} />
          </ListItem>
        ))}
      </List>
      <Divider />
    </Box>
  );

  return (
    <div>
      <React.Fragment key={"left"}>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={toggleDrawer("left", true)}
        >
          <MenuIcon />
        </IconButton>
        <Drawer
          anchor="left"
          open={state["left"]}
          onClose={toggleDrawer("left", false)}
        >
          {list("left")}
        </Drawer>
      </React.Fragment>
    </div>
  );
}
