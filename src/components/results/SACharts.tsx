import React from "react";
import { timeFormat, timeParse } from "d3-time-format";
import { Result, ResultKind, useResult } from "../../store/result-store";
import { pickProps } from "../../common/helpers";
import styled from "styled-components";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);


export type BarGroupProps = {
  uuid: string;
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  events?: boolean;
};

export interface RTData {
  frequency: number;
  sabine: number;
  eyring: number;
  ap: number;
}

const testrtdata: RTData[] = [
  {
    frequency: 125,
    sabine: 0.2,
    eyring: 0.35,
    ap: 0.2
  },
  {
    frequency: 250,
    sabine: 0.4,
    eyring: 0.55,
    ap: 0.2
  },
  {
    frequency: 500,
    sabine: 0.2,
    eyring: 0.2,
    ap: 0.2
  },
  {
    frequency: 1000,
    sabine: 0.3,
    eyring: 0.45,
    ap: 0.2
  },
  {
    frequency: 2000,
    sabine: 0.2,
    eyring: 0.45,
    ap: 0.2
  },
  {
    frequency: 4000,
    sabine: 0.2,
    eyring: 0.25,
    ap: 0.2
  }];

//type CityName = 'New York' | 'San Francisco' | 'Austin';

const blue = "#48beff";
const green = "#43c593";
const darkgreen = "#14453d";
const black = "#000000";

export const background = "#612efb";

type RtType = "Sabine" | "Eyring" | "AP";

const defaultMargin = { top: 0, right: 0, bottom: 40, left: 0 };

const parseDate = timeParse("%Y-%m-%d");
const format = timeFormat("%b %d");
const formatDate = (date: string) => format(parseDate(date) as Date);

// accessors
const getFreq = (d: RTData) => d.frequency;
const getFreqAsString = (d: RTData) => (d.frequency).toString();
const getSabine = (d: RTData) => d.sabine;
const getEyring = (d: RTData) => d.eyring;

const VerticalContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.div`
  display: flex; 
  justify-content: center;
`;

const HorizontalContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
`;

const LegendContainer = styled.div`
 display: flex;
 flex-direction: column;
 align-items: center;
 padding: 0px 16px;
`;

const FrequencyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 16px;
`;

const GraphContainer = styled.div`
  display: flex;
  flex: 8;
  width: 80%;
`;


export const SAChart = ({
                          uuid,
                          width = 500,
                          height = 300,
                          events = false
                        }: BarGroupProps) => {
  const {
    info,
    data,
    from
  } = useResult(state => pickProps(["info", "data", "from"], state.results[uuid] as Result<ResultKind.SurfaceAll>));
  console.log(data);
  const data2 = {
    labels: data.name,
    datasets: [
      {
        label: "# of Votes",
        data: data.area,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)"
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)"
        ],
        borderWidth: 1
      }
    ]
  };

  return width < 10 ? null : (
    <VerticalContainer>
      <Title>{"Statistical RT60 Results"}</Title>
      <HorizontalContainer>
        <GraphContainer>
          <Doughnut data={data2} />
        </GraphContainer>
      </HorizontalContainer>
    </VerticalContainer>
  );
};

export default SAChart;

