import React, { useState } from "react";
import { emit } from "../../messenger";
import { pickProps } from "../../common/helpers";
import useToggle from "../hooks/use-toggle";
import { createPropertyInputs, PropertyButton } from "./SolverComponents";
import PropertyRowFolder from "./property-row/PropertyRowFolder";
import PropertyRow from "./property-row/PropertyRow";
import PropertyRowLabel from "./property-row/PropertyRowLabel";
import EnergyDecay from "../../compute/energy-decay";

export interface EnergyDecayTabProps {
  uuid: string;
}

export interface EnergyDecayTabState {

}

function useEnergyDecayProperties(properties: (keyof EnergyDecay)[], ed: EnergyDecay, set: any) {
  const [state, setState] = useState(pickProps(properties, ed));
  const setFunction = <T extends keyof typeof state>(property: T, value: typeof state[T]) => {
    setState({ ...state, [property]: value });
  };
  return [state, setFunction] as [typeof state, typeof setFunction];
};

const { PropertyTextInput, PropertyNumberInput, PropertyCheckboxInput } = createPropertyInputs<EnergyDecay>(
  "ENERGYDECAY_SET_PROPERTY"
);

const General = ({ uuid }: { uuid: string }) => {
  const [open, toggle] = useToggle(true);
  return (
    <PropertyRowFolder label="General" open={open} onOpenClose={toggle}>
      <PropertyTextInput uuid={uuid} label="Name" property="name" tooltip="Sets the name of the solver" />
      <PropertyRow>
        <PropertyRowLabel label={"Upload IR"}></PropertyRowLabel>
        <div style={{ alignItems: "center" }}>
          <input
            type="file"
            id="irinput"
            accept=".wav"
            onChange={(e) => {
              //console.log(e.target.files);
              const reader = new FileReader();

              reader.addEventListener("loadend", (loadEndEvent) => {
                emit("ENERGYDECAY_SET_PROPERTY", { uuid: uuid, property: "broadbandIR", value: reader.result });
              });

              reader.readAsArrayBuffer(e.target!.files![0]);
            }
            }
          />
        </div>
      </PropertyRow>
      <PropertyButton event="CALCULATE_AC_PARAMS" args={uuid} label="Calculate Parameters"
                      tooltip="Calculates Acoustical Parameters from Uploaded IR" />
    </PropertyRowFolder>
  );
};

export const EnergyDecayTab = ({ uuid }: EnergyDecayTabProps) => {
  return (
    <General uuid={uuid} />
  );
};

export default EnergyDecayTab;
