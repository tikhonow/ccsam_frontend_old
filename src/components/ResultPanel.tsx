import * as React from "react";
import Button from "@mui/material/Button";
import { emit } from "../messenger";
import useToggle from "./hooks/use-toggle";
import { useSolverProperty } from "./parameter-config/SolverComponents";
import RayTracer from "../compute/raytracer";
import PropertyRowFolder from "./parameter-config/property-row/PropertyRowFolder";
import PropertyButton from "./parameter-config/property-row/PropertyButton";
import { useSolver } from "../store";

const Output = ({ uuid }: { uuid: string }) => {
  const [open, toggle] = useToggle(true);
  const [impulseResponsePlaying, setImpulseResponsePlaying] = useSolverProperty<RayTracer, "impulseResponsePlaying">(uuid, "impulseResponsePlaying", "RAYTRACER_SET_PROPERTY");
  return (
    <PropertyRowFolder label="Impulse Response" open={open} onOpenClose={toggle}>
      <PropertyButton event="RAYTRACER_CALL_METHOD"
                      args={{ method: "calculateImpulseResponse", uuid, isAsync: true, args: undefined }}
                      label="Calculate" tooltip="Calculates the impulse response" />
      <PropertyButton event="RAYTRACER_PLAY_IR" args={uuid} label="Play" tooltip="Plays the calculated impulse response"
                      disabled={impulseResponsePlaying} />
      <PropertyButton event="RAYTRACER_DOWNLOAD_IR" args={uuid} label="Download"
                      tooltip="Downloads the calculated broadband impulse response" />
      <PropertyButton event="RAYTRACER_DOWNLOAD_IR_OCTAVE" args={uuid} label="Download by Octave"
                      tooltip="Downloads the impulse response in each octave" />
    </PropertyRowFolder>
  );
};

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

export default function ResultPanel() {
  const solvers = useSolver(state => state.withProperty(solver => solver.kind));
  const rayt = [...solvers].filter(([uuid, _], i) => _ == "ray-tracer").map(([uuid, _], i) => {
    return uuid;
  })[0];
  const [value, setValue] = React.useState("one");
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <div>
      <Button
        onClick={() => {
          emit("TOGGLE_RESULTS_PANEL", true);
        }}
        variant="contained" disableElevation>
        Disable elevation
      </Button>
    </div>
  );
}

