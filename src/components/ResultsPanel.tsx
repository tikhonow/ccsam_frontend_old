import React from "react";

import { ResultStore, useResult } from "../store/result-store";
import Dialog from "@mui/material/Dialog";

import LTPChart from "./results/LTPChart";
import RT60Chart from "./results/RT60Chart";
import { useAppStore } from "../store/app-store";
import { pickProps } from "../common/helpers";
import { SAChart } from "./results/SACharts";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";


const TabTitle = (id) => {
  const name = useResult((state) => state.results[id].name);
  return name;
};


const resultKeys = (state: ResultStore) => Object.keys(state.results);

export const ResultsPanel = () => {
  const keys = useResult(resultKeys);
  const [value, setValue] = React.useState("one");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  const { resultsPanelOpen, set } = useAppStore(store => pickProps(["resultsPanelOpen", "set"], store));

  const handleClose = () => {
    set(store => {
      store.resultsPanelOpen = false;
    });
  };
  console.log(keys);

  return keys.length > 0 ? (
    <Dialog
      fullWidth={true}
      maxWidth={"lg"}
      open={resultsPanelOpen}
      onClose={handleClose}
    >
      <div
        style={{
          margin: "0",
          background: "#fff"
        }}
      >
        <TabContext
          value={value}
        >
          <TabList onChange={handleChange}>
            {keys.map((key, i) => (
              <Tab label={"TAB"} value={i.toString()} />
            ))}
          </TabList>
          {keys.map((key, i) => (
            <TabPanel value={i.toString()}><ChartSelect uuid={key} />
            </TabPanel>
          ))}
        </TabContext>
      </div>
    </Dialog>
  ) : <Dialog
    fullWidth={true}
    maxWidth={"lg"}
    open={resultsPanelOpen}
    onClose={handleClose}
  >No Results Yet!</Dialog>;
};

const ChartSelect = (uuid) => {

  useResult((state) => console.log(state.results[uuid.uuid].kind));
  console.log(uuid);

  switch (useResult((state) => state.results[uuid.uuid].kind)) {

    case "linear-time-progression":
      return <LTPChart uuid={uuid.uuid} events />;
      break;

    case "statisticalRT60":
      return <RT60Chart uuid={uuid.uuid} events />;
      break;

    case "surfaceall":
      return <SAChart uuid={uuid.uuid} events />;

    default:
      return null;
  }

};
