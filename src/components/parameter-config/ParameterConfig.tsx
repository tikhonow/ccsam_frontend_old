import React, { useEffect, useState } from "react";
import { on } from "../../messenger";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import "./ParameterConfig.css";
import RayTracerTab from "./RayTracerTab";
import { ImageSourceTab } from "./image-source-tab/ImageSourceTab";
import { useSolver } from "../../store";
import styled from "styled-components";
import RT60Tab from "./RT60Tab";
import EnergyDecayTab from "./EnergyDecayTab";
import CalculateIcon from "@mui/icons-material/Calculate";
import Tooltip from "@mui/material/Tooltip";

const SelectContainer = styled.div`
  display: grid;
  margin: 0 1em 1em 1em;
`;
const TabText = styled.div`
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
`;

export interface ParameterConfigState {
  selectedTabIndex: number;
  tabNames: string[];
}

const SolverComponentMap = (uuid, kind) => {
  switch (kind) {
    case "image-source":
      return <ImageSourceTab uuid={uuid} />;
    case "ray-tracer":
      return <RayTracerTab uuid={uuid} />;
    case "rt60":
      return <RT60Tab uuid={uuid} />;
    case "energydecay":
      return <EnergyDecayTab uuid={uuid} />;
    default:
      return <></>;
  }
};

const SolverOptionTitle = ({ uuid }) => {
  const name = useSolver((state) => state.solvers[uuid].name);
  return (
    <option value={uuid}>{name}</option>
  );
};

export const SolversTab = () => {
  const solvers = useSolver(state => state.withProperty(solver => solver.kind));
  const [index, setIndex] = useState(0);
  useEffect(() => on("NEW", () => setIndex(0)), []);
  const [selectedSolverId, setSelectedSolverId] = useState("choose");
  const [value, setValue] = React.useState("1");
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    console.log(rayt);
    setValue(newValue);
  };

  function getUUid(name) {
    return [...solvers].filter(([uuid, _], i) => _ == name).map(([uuid, _], i) => {
      return uuid;
    })[0];

  }

  const rayt = getUUid("ray-tracer");
  const rt60 = getUUid("rt60");
  const longText = `
    Aliquam eget finibus ante, non facilisis lectus. Sed vitae dignissim est, vel aliquam tellus.
    Praesent non nunc mollis, fermentum neque at, semper arcu.
    Nullam eget est sed sem iaculis gravida eget vitae justo.
    `;
  return (
    <TabContext value={value}>
      <TabList scrollButtons="auto" onChange={handleChange}>
        <Tab icon={<Tooltip title={longText}><CalculateIcon /></Tooltip>} iconPosition="end" label="Трассировка"
             value="1" />
        <Tab icon={<Tooltip title={longText}><CalculateIcon /></Tooltip>} iconPosition="end" label="Статические методы"
             value="2" />
        <Tab disabled label="Волновой метод" value="3" />
      </TabList>
      <TabPanel value="1">
        <RayTracerTab uuid={rayt} />
      </TabPanel>
      <TabPanel value="2">
        <RT60Tab uuid={rt60} />
      </TabPanel>
      <TabPanel value="3">Item Three</TabPanel>
    </TabContext>
  );
};
