import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import TreeView from "@mui/lab/TreeView";
import TreeItem, { treeItemClasses, TreeItemProps } from "@mui/lab/TreeItem";
import Typography from "@mui/material/Typography";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { SvgIconProps } from "@mui/material/SvgIcon";
import Container from "../../objects/container";
import properCase from "../../common/proper-case";
import { emit, on } from "../../messenger";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItemLabel from "../tree-item-label/TreeItemLabel";
import { RoomIcon } from "../icons";
import { useContainer } from "../../store";
import { pickProps } from "../../common/helpers";
////
import SpeakerIcon from "@mui/icons-material/Speaker";
import MicIcon from "@mui/icons-material/Mic";
import HomeIcon from "@mui/icons-material/Home";
import Crop32Icon from "@mui/icons-material/Crop32";
///
import Room from "../../objects/room";

declare module "react" {
  interface CSSProperties {
    "--tree-view-color"?: string;
    "--tree-view-bg-color"?: string;
  }
}

type StyledTreeItemProps = TreeItemProps & {
  bgColor?: string;
  color?: string;
  labelIcon?: React.ElementType<SvgIconProps>;
  labelInfo?: string;
  labelText: string;
};

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
  color: theme.palette.text.secondary,
  [`& .${treeItemClasses.content}`]: {
    color: theme.palette.text.secondary,
    borderTopRightRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
    paddingRight: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    "&.Mui-expanded": {
      fontWeight: theme.typography.fontWeightRegular
    },
    "&:hover": {
      backgroundColor: theme.palette.action.hover
    },
    "&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused": {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
      color: "var(--tree-view-color)"
    },
    [`& .${treeItemClasses.label}`]: {
      fontWeight: "inherit",
      color: "inherit"
    }
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 0,
    [`& .${treeItemClasses.content}`]: {
      paddingLeft: theme.spacing(2)
    }
  }
}));

function StyledTreeItem(props: StyledTreeItemProps) {
  const {
    bgColor,
    color,
    labelIcon: LabelIcon,
    labelInfo,
    labelText,
    ...other
  } = props;

  return (
    <StyledTreeItemRoot
      label={
        <Box sx={{ display: "flex", alignItems: "center", p: 0.5, pr: 0 }}>
          <Box component={LabelIcon} color="inherit" sx={{ mr: 1 }} />
          <Typography variant="body2" sx={{ fontWeight: "inherit", flexGrow: 1 }}>
            {labelText}
          </Typography>
          <Typography variant="caption" color="inherit">
            {labelInfo}
          </Typography>
        </Box>
      }
      style={{
        "--tree-view-color": color,
        "--tree-view-bg-color": bgColor
      }}
      {...other}
    />
  );
}

/////////////////
type ClickEvent = React.MouseEvent<HTMLElement, MouseEvent>;

export interface MapChildrenProps {
  parent: string;
  container: Container;
  expanded: string[];
  setExpanded: (value: React.SetStateAction<string[]>) => void;
}

function MapChildren(props: MapChildrenProps) {
  const { container, expanded, setExpanded, parent } = props;
  const [selected, setSelected] = useState(container.selected);
  const [name, setName] = useState(container.name);
  const [purpose, setPurpose] = useState((container as Room).purpose);
  const [description, setDescription] = useState((container as Room).description);
  const className = selected ? "container-selected" : "";
  const draggable = true;
  const key = container.uuid;
  const nodeId = container.uuid;
  const meta = properCase(container["kind"]);
  const genericLabel = name || "untitled";
  const onClick = useCallback((e: ClickEvent) => {
    if (container["kind"] !== "room") {
      emit(e.shiftKey ? "APPEND_SELECTION" : "SET_SELECTION", [container]);
    }
  }, [container]);

  useEffect(() => on("APPEND_SELECTION", (containers) => {
    if (containers.includes(container)) {
      setSelected(true);
    }
  }), [container]);

  useEffect(() => on("SET_SELECTION", (containers) => {
    setSelected(containers.includes(container));
  }), [container]);

  const event = `${container.kind.toUpperCase()}_SET_PROPERTY` as "SOURCE_SET_PROPERTY";
  useEffect(() => on(event, ({ uuid, property, value }) => {
    if (uuid === container.uuid && property === "name") {
      console.log(value);
      setName(value as string);
    }
  }), [container.uuid]);

  const collapseIcon = (
    <ExpandMoreIcon onClick={() => setExpanded(expanded.filter((x) => x !== container.uuid))} fontSize="inherit" />
  );
  const expandIcon = (
    <ChevronRightIcon onClick={() => setExpanded(expanded.concat(container.uuid))} fontSize="inherit" />
  );

  const labelText = genericLabel;
  const roomLabel = <TreeItemLabel icon={<RoomIcon fontSize="inherit" />} {...{ label: genericLabel, meta }} />;

  const onKeyDown = (e) => {
    e.preventDefault();
  };

  if (container.parent?.uuid !== parent) {
    return <></>;
  }

  switch (container["kind"]) {
    case "surface":
      return (
        <StyledTreeItem
          labelIcon={Crop32Icon}
          color="#1a73e8"
          bgColor="#e8f0fe"
          {...{ className, labelText, onClick, draggable, key, nodeId }} />
      );

    case "source":
      return (
        <StyledTreeItem
          labelIcon={SpeakerIcon}
          labelInfo={key}
          color="#3c8039"
          bgColor="#e6f4ea"
          {...{ className, labelText, onClick, draggable, key, nodeId }} />
      );
    case "receiver":
      return (
        <StyledTreeItem
          labelIcon={MicIcon}
          labelInfo={key}
          color="#e3742f"
          bgColor="#fcefe3"
          {...{ className, labelText, onClick, draggable, key, nodeId }} />
      );

    case "room":
      return (
        <div>
          <Typography gutterBottom>
            {description}
          </Typography>
          <StyledTreeItem labelText={genericLabel}
                          labelIcon={HomeIcon}
                          labelInfo={purpose}
                          {...{ onClick, draggable, key, nodeId, collapseIcon, className, expandIcon, onKeyDown }}>
            {(container.children.filter(x => x instanceof Container && x.parent?.uuid === container.uuid) as Container[]).map((x) => (
              <MapChildren
                parent={container.uuid}
                container={x}
                expanded={expanded}
                setExpanded={setExpanded}
                key={x.uuid + "-map-children"}
              />
            ))}
          </StyledTreeItem>
        </div>

      );

    case "container":
      return <>
        <StyledTreeItem
          labelInfo={container.children.length.toString()}
          labelText={"Поверхности"}
          {...{ onClick, draggable, key, nodeId, collapseIcon, className, expandIcon, onKeyDown }}>{
          (container.children.filter(x => x instanceof Container && x.parent?.uuid === container.uuid) as Container[]).map((x) => (
            <MapChildren
              parent={container.uuid}
              container={x}
              expanded={expanded}
              setExpanded={setExpanded}
              key={x.uuid + "-map-children"}
            />
          ))}            </StyledTreeItem>
      </>;
    default:
      return <></>;
  }
}

//////////
export default function NewObjectsTreeView() {
  const { containers, getWorkspace } = useContainer(state => pickProps(["containers", "getWorkspace"], state));
  const keys = Object.keys(containers);
  const workspace = getWorkspace();
  const [expanded, setExpanded] = useState(["containers"]);
  return (
    <TreeView
      aria-label="gmail"
      defaultExpanded={["3"]}
      defaultCollapseIcon={<ArrowDropDownIcon />}
      defaultExpandIcon={<ArrowRightIcon />}
      defaultEndIcon={<div style={{ width: 24 }} />}
      sx={{ height: 264, flexGrow: 1, maxWidth: 400, overflowY: "auto" }}
    >
      {keys.map((x: string) => (
        <MapChildren
          parent={workspace ? workspace.uuid : ""}
          container={containers[x]}
          expanded={expanded}
          setExpanded={setExpanded}
          key={containers[x].uuid + "tree-item-container"}
        />
      ))}
    </TreeView>
  );
}
