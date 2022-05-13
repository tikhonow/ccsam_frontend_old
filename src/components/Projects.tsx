import * as React from "react";
import { useLayoutEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import MediaCard from "../Card";
import ImportDialog from "./ImportDialog";
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';

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
  const [ex, setEx] = useState(false);
  const [data, setData] = useState([] as Project[]);
  useLayoutEffect(() => {
    const fetchPrices = async () => {
      await axios.get(`${process.env.REACT_APP_API_URL}/projects/`).then(
        res => {setData(res.data);
        setEx(true);}
      ).catch(()=>
        setEx(false)
      );
    };
    fetchPrices();
  }, []);


  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

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
          {data.length>0?
            data.map(
            (el) => (
              <MediaCard name={el.name} image={el.image} descr={el.description} purpose={el.purpose} args={el.file}
                         key={el[0]} />
            )
          ) :
            <Box sx={{ display: 'flex' }}>
              <CircularProgress />
            </Box>}
        </Box>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ImportDialog/>
      </TabPanel>
    </Box>
  );
}
