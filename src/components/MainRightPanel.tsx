import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ObjectProperties from "./ObjectProperties";
import NewObjectsTreeView from "./object-view/NewObjectsView";
import { SolversTab } from "./parameter-config/ParameterConfig";
import { useContainer } from "../store";
import SpeedDialTooltipOpen from "../SpeedDial";
import ResultPanel from "./ResultPanel";


///////////


export default function ControlledAccordions() {
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const containers = useContainer(state => state.selectedObjects);
  const dis = (containers.size == 0);
  if (containers.size == 1) {
    const { uuid, kind } = [...containers.values()][0];
  }
  return (
    <div>
      <Accordion TransitionProps={{ unmountOnExit: true }} expanded={expanded === "panel1"}
                 onChange={handleChange("panel1")}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography sx={{ width: "33%", flexShrink: 0 }}>
            Объекты
          </Typography>
          <Typography sx={{ color: "text.secondary" }}>Управление комнатой и источниками</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <NewObjectsTreeView />
        </AccordionDetails>
      </Accordion>
      <Accordion TransitionProps={{ unmountOnExit: true }} expanded={expanded === "panel2"}
                 onChange={handleChange("panel2")}
                 disabled={dis}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2bh-content"
          id="panel1bh-header"
        >
          <Typography sx={{ width: "33%", flexShrink: 0 }}>
            Выбранный объект
          </Typography>
          <Typography
            sx={{ color: "text.secondary" }}>{dis ? "Ничего не выбрано" : [...containers.values()][0].name}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ObjectProperties />
        </AccordionDetails>
      </Accordion>
      <Accordion TransitionProps={{ unmountOnExit: true }} expanded={expanded === "panel3"}
                 onChange={handleChange("panel3")}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography sx={{ width: "33%", flexShrink: 0 }}>
            Симуляция
          </Typography>
          <Typography sx={{ color: "text.secondary" }}>Управление комнатой и источниками</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <SolversTab />
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === "panel4"} onChange={handleChange("panel4")}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography sx={{ width: "33%", flexShrink: 0 }}>
            Результаты
          </Typography>
          <Typography sx={{ color: "text.secondary" }}>Данные полученные из симуляции</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ResultPanel />
        </AccordionDetails>
      </Accordion>
      <SpeedDialTooltipOpen />
    </div>
  );

}
