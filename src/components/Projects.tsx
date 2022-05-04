import * as React from "react";
import { useLayoutEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import MediaCard from "../Card";
import ImportDialog from "./ImportDialog";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface Project {
  name: string;
  date: string;
  version: string;
  description: string;
  purpose: string;
  image: string;
  file: string;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component={"span"} variant={"body2"}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`
  };
}

export default function VerticalTabs() {
  const [value, setValue] = useState(0);
  const [data, setData] = useState([] as Project[]);
  useLayoutEffect(() => {
    const fetchPrices = async () => {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/projects/`);
      const data = await res.json();
      setData(data);
    };
    fetchPrices();
  }, []);


  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    console.log(data);
  };
  const a = [
    ["Concord", "ping2.png", "Хдесь должно быть описание", "concord", "Студия"],
    ["Auditorium", "ping3.png", "Концертный зал", "auditorium", "Большой зал"],
    ["Shoebox", "ping1.png", "Хдесь должно быть описание", "shoebox", "Общее назначение"],
    ["Торус", "ping4.png", "half Torus", "half", "Не выбрано"]
  ];

  // @ts-ignore
  return (
    <Box
      sx={{ flexGrow: 1, bgcolor: "background.paper", display: "flex", height: "70%" }}
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: "divider" }}
      >
        <Tab label="Проекты" {...a11yProps(0)} />
        <Tab label="Импорт" {...a11yProps(1)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            "& > :not(style)": {
              m: 1
            }
          }}
        >
          {data.map(
            (el) => (
              <MediaCard name={el.name} image={el.image} descr={el.description} purpose={el.purpose} args={el.file}
                         key={el[0]} />
            )
          )}
        </Box>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ImportDialog />
      </TabPanel>
    </Box>
  );
}
