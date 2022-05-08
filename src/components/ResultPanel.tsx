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
  function impulseResponseExist() {
    if (typeof name.impulseResponse !== 'undefined') {
      return true
    }
    return false
  }
  const [open, toggle] = useToggle(true);
  const name = useSolver((state) => state.solvers[uuid]) as RayTracer;
  if (name){
    return (
      <PropertyRowFolder label="Impulse Response" open={open} onOpenClose={toggle}>
        <PropertyButton event="RAYTRACER_CALL_METHOD"
                        disabled={!name.impulseResponseCreate}
                        args={{ method: "calculateImpulseResponse", uuid, isAsync: true, args: undefined }}
                        label="Calculate" tooltip="Calculates the impulse response" />
        <PropertyButton event="RAYTRACER_PLAY_IR" args={uuid} label="Play" tooltip="Plays the calculated impulse response"
                        disabled={!name.impulseResponseCreate} />
        <PropertyButton event="RAYTRACER_DOWNLOAD_IR" args={uuid} label="Download"
                        disabled={!name.impulseResponseCreate}
                        tooltip="Downloads the calculated broadband impulse response" />
        <PropertyButton event="RAYTRACER_DOWNLOAD_IR_OCTAVE" args={uuid} label="Download by Octave"
                        tooltip="Downloads the impulse response in each octave"
                        disabled={!name.impulseResponseCreate}/>
      </PropertyRowFolder>
    );
  }
  return <></>

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
      <Output uuid={rayt}/>
      <Button
        onClick={() => {
          emit("TOGGLE_RESULTS_PANEL", true);
        }}
        variant="contained" disableElevation>
        Показать графики
      </Button>
    </div>
  );
}

