import React, { useMemo, useRef } from "react";
import Surface from "../objects/surface";
import { emit } from "../messenger";
import { AcousticMaterial } from "../db/acoustic-material";
import { absorptionGradient } from "./AbsorptionGradient";
import { Icon } from "@blueprintjs/core";
import Button from "@mui/material/Button";
import { useAppStore, useContainer, useMaterial } from "../store";
import ListItem from "@mui/material/ListItem";
import { pickProps } from "../common/helpers";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from "chart.js";
import { Bar } from "react-chartjs-2";
import "./MaterialSearch.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


const min = (a: number, b: number) => (a < b ? a : b);

type MaterialDrawerListItemProps = {
  item: AcousticMaterial;
}

const MaterialDrawerListItem = ({ item }: MaterialDrawerListItemProps) => {
  const { set, selectedMaterial } = useMaterial(state => pickProps(["set", "selectedMaterial"], state));

  const onClick = () => set(store => {
    store.selectedMaterial = item.uuid;
  });

  return (
    <div
      className={`material_drawer-list_item-${selectedMaterial === item.uuid ? "selected" : "container"}`}
      onClick={onClick}>
      <ListItem>{item.material}</ListItem>
      <div className="material_drawer-list_item-right">
        <div className="material_drawer-list_item-absorption"
             style={{ background: `${absorptionGradient(item.absorption)}` }} />
      </div>
    </div>
  );
};


const Absorption = ({ absorption }: { absorption: AcousticMaterial["absorption"] }) => {
  const options = {
    scaleShowLabels: false,
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: "Коэфициенты поглощения"
      }
    }
  };

  const labels = Object.keys(absorption);
  const data = {
    labels,
    datasets: [
      {
        data: Object.values(absorption),
        borderColor: "rgb(38,104,204)",
        backgroundColor: "rgba(155,248,236,0.5)"
      }
    ]
  };
  return (
    <div>
      <Bar options={options} data={data} />
    </div>
  );
};

const MaterialProperties = () => {

  const { selectedMaterial, material } = useMaterial(state => ({
    selectedMaterial: state.selectedMaterial,
    material: state.materials.get(state.selectedMaterial)
  }));
  return material ? (
    <div>
      <div className={"material_drawer-display-material_name"}><span>{material.name}</span></div>
      <div className={"material_drawer-display-material_material"}>
        <span>{material.material}</span>
        <span className="muted-text" style={{ textAlign: "right" }}>{material.uuid}</span>
      </div>
      <Absorption absorption={material.absorption} />
    </div>
  ) : <div>Nothing Selected</div>;
};

const MaterialList = () => {
  const { bufferLength, query, search } = useMaterial(state => pickProps(["bufferLength", "query", "search"], state));
  const filteredItems = useMemo(() => search(query), [query]);
  return (
    <div className="material_drawer-list">
      {filteredItems.slice(0, min(bufferLength, filteredItems.length)).map(item => <MaterialDrawerListItem item={item}
                                                                                                           key={`item-${item.uuid}`} />)}
    </div>
  );
};

const MaterialAssignButton = () => {
  const selectedSurfaces = useContainer(state => [...state.selectedObjects].filter(x => x.kind === "surface")) as Surface[];
  const selectedMaterial = useMaterial(state => state.materials.get(state.selectedMaterial));
  return (
    <Button
      disabled={selectedSurfaces.length == 0}
      onClick={(e) => {
        if (selectedMaterial) {
          emit("ASSIGN_MATERIAL", {
            material: selectedMaterial as AcousticMaterial,
            target: selectedSurfaces
          });
        }
      }}
    >Применить</Button>
  );
};

export const MaterialSearch = () => {
  const listref = useRef<HTMLDivElement>();
  const listScroll = 0;
  const {
    bufferLength,
    query,
    search,
    set
  } = useMaterial(state => pickProps(["bufferLength", "query", "search", "set"], state));
  const {
    materialDrawerOpen,
    set: setAppStore
  } = useAppStore(state => pickProps(["materialDrawerOpen", "set"], state));

  const setQuery = (query: string) => set(store => {
    store.query = query;
  });


  return (
    <Dialog
      keepMounted
      fullWidth={true}
      maxWidth={"lg"}
      onClose={() => setAppStore(draft => {
        draft.materialDrawerOpen = false;
      })}
      open={materialDrawerOpen}
    >
      <DialogTitle>Выбор материалов</DialogTitle>
      <DialogContent>
        <div className="material_drawer-grid">
          <DialogContentText>
            Звукоизоляционные материалы отталкивают звуковые волны и не дают им распространяться дальше. Как правило,
            чем толще поверхность, тем лучше она отражает звук. Исключение составляют звукоизоляционные плиты, рулоны и
            полотна малой толщины, которые порой обеспечивают более эффективную звукозащиту, чем бетон или кирпичная
            кладка.

            Индекс звукоизоляции (RW) показывает, насколько хорошо материал отражает звук. Измеряется этот показатель в
            децибелах. Звукоотражающим эффектом обладают гладкие поверхности – листы металла, стекло, текстолитовые
            плиты, а больше всего – мраморная стена.
          </DialogContentText>
          <div className="material_drawer-container">
            <div className="material_drawer-searchbar-container">

              <div className="material_drawer-searchbar-input_container">
                <Icon icon="search" iconSize={14} color="darkgray" className="material_drawer-search_icon" />
                <input
                  type="text"
                  className="material_drawer-searchbar-input"
                  value={query}
                  onChange={e => setQuery(e.currentTarget.value)}
                />
              </div>
            </div>
            <MaterialList />
            <div>
              <a
                className="show-more"
                onClick={() => set(store => {
                  store.bufferLength = store.bufferLength + 15;
                })}
              >
                show more...
              </a>
            </div>
            <div className={"material_drawer-display-container"}>
              <MaterialProperties />

            </div>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setAppStore(draft => {
          draft.materialDrawerOpen = false;
        })}>Cancel</Button>
        <MaterialAssignButton />
      </DialogActions>
    </Dialog>
  );
};

