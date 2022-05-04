import React from "react";
import { emit, postMessage } from "../messenger";
import { Button, Menu, MenuDivider, MenuItem, Navbar } from "@blueprintjs/core";
import { Classes, Popover2 } from "@blueprintjs/popover2";
import NewNavBar from "./NewNavBar";
import MenuItemText from "./MenuItemText";
import { Characters } from "../constants";
import create from "zustand";
import "./NavBarComponent.css";
import { useAppStore } from "../store";

interface MenuItemWithMessengerProps {
  label: string;
  hotkey?: string[];
  disabled?: boolean;
  message: string;
}

function MenuItemWithMessenger(props: MenuItemWithMessengerProps) {
  return (
    <MenuItem
      className={Classes.POPOVER2_DISMISS}
      text={<MenuItemText text={props.label} hotkey={props.hotkey || [""]} />}
      onClick={(e) => postMessage(props.message)}
      disabled={props.disabled}
    />
  );
}

type MenuItemWithEmitterProps = {
  label: string;
  hotkey?: string[];
  disabled?: boolean;
  event: keyof EventTypes;
  args?: EventTypes[MenuItemWithEmitterProps["event"]];
}

const MenuItemWithEmitter = ({ label, hotkey, disabled, event, args }: MenuItemWithEmitterProps) => {
  return (
    <MenuItem
      className={Classes.POPOVER2_DISMISS}
      text={<MenuItemText text={label} hotkey={hotkey || [""]} />}
      onClick={(e) => {
        emit(event, args);
      }}
      disabled={disabled}
    />
  );
};

type InteractionKind = "click" | "click-target" | "hover" | "hover-target" | undefined;

type MenuProps = {
  isOpen: boolean;
  onInteraction: (nextOpenState: boolean) => void;
}

export function FileMenu(props: MenuProps) {
  return (
    <Popover2
      minimal={true}
      transitionDuration={0}

      isOpen={props.isOpen}
      hoverOpenDelay={0}
      hoverCloseDelay={0}
      renderTarget={({ isOpen, ref, ...p }) => (
        <Button {...p} active={isOpen} elementRef={ref as React.RefObject<HTMLButtonElement>} text="File" />
      )}
      onInteraction={(e) => props.onInteraction(e)}
      content={
        <Menu>
          <MenuItemWithEmitter label="New" event="NEW" hotkey={[Characters.SHIFT, "N"]} />
          <MenuItemWithEmitter label="Open" event="OPEN" hotkey={[Characters.COMMAND, "O"]} />
          <MenuItemWithEmitter label="Save" event="SAVE" hotkey={[Characters.COMMAND, "S"]} />
          <MenuDivider />
          <MenuItemWithEmitter label="Import" event="SHOW_IMPORT_DIALOG" args={true}
                               hotkey={[Characters.COMMAND, "I"]} />
        </Menu>
      }
      placement="bottom-start"
    />
  );
}

export function EditMenu(props: MenuProps) {
  return (

    <Popover2
      minimal={true}
      onInteraction={(e) => props.onInteraction(e)}
      transitionDuration={0}
      isOpen={props.isOpen}
      renderTarget={({ isOpen, ref, ...p }) => (
        <Button {...p} active={isOpen} elementRef={ref as React.RefObject<HTMLButtonElement>} text="Edit" />
      )}
      content={
        <Menu>
          <MenuItemWithMessenger label="Undo" message="UNDO" hotkey={[Characters.COMMAND, "Z"]} disabled />
          <MenuItemWithMessenger
            label="Redo"
            message="REDO"
            hotkey={[Characters.SHIFT, Characters.COMMAND, "Z"]}
            disabled
          />
          <MenuDivider />
          <MenuItemWithMessenger
            label="Duplicate"
            message="SHOULD_DUPLICATE_SELECTED_OBJECTS"
            hotkey={[Characters.SHIFT, "D"]}
            disabled
          />
          <MenuDivider />
          <MenuItemWithMessenger label="Cut" message="CUT" hotkey={[Characters.COMMAND, "X"]} disabled />
          <MenuItemWithMessenger label="Copy" message="COPY" hotkey={[Characters.COMMAND, "C"]} disabled />
          <MenuItemWithMessenger label="Paste" message="PASTE" hotkey={[Characters.COMMAND, "V"]} disabled />
        </Menu>
      }
      placement="bottom-start"
    />
  );
}

const ProjectName = () => {
  const projectName = useAppStore(state => state.projectName);
  return (
    <Navbar.Group className="main-nav_bar-left_group main-nav_bar-projectname_text"
                  style={{ flex: 1, justifyContent: "center" }}>{projectName}</Navbar.Group>
  );
};


type NavBarStore = {
  openMenu: number | null;
  setOpenMenu: (openMenu: number | null) => void;
}

export const useNavBarStore = create<NavBarStore>((set) => ({
  openMenu: null,
  setOpenMenu: (openMenu: number | null) => set({ openMenu })
}));

export default useAppStore;


export function NavBarComponent() {
  const { openMenu, setOpenMenu } = useNavBarStore();

  return (
    <div>
      <NewNavBar />
    </div>
  );
}
