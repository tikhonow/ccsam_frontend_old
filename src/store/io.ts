import FileSaver from "file-saver";
import { useAppStore, useContainer, useSolver } from ".";
import axios from "axios";

import { emit, on, postMessage } from "../messenger";
import { SourceSaveObject } from "../objects/source";
import { ReceiverSaveObject } from "../objects/receiver";
import { RoomSaveObject } from "../objects/room";
import { RayTracerSaveObject } from "../compute/raytracer";
import { RT60SaveObject } from "../compute/rt";
import { ImageSourceSaveObject } from "../compute/raytracer/image-source";
import { Example } from "../examples";

export type ContainerSaveObject = (SourceSaveObject | ReceiverSaveObject | RoomSaveObject);
export type SolverSaveObject = (RayTracerSaveObject | RT60SaveObject | ImageSourceSaveObject);

export type SaveState = {
  meta: {
    version: `${number}.${number}.${number}`;
    name: string;
    timestamp: string;
  };
  containers: ContainerSaveObject[];
  solvers: SolverSaveObject[];
};

const getSaveState = () => {
  const solvers = useSolver.getState().solvers;
  const containers = useContainer.getState().containers;
  const { projectName, version } = useAppStore.getState();
  const savedContainers = [] as SaveState["containers"];
  const savedSolvers = [] as SaveState["solvers"];

  Object.keys(containers).forEach(uuid => {
    savedContainers.push(containers[uuid].save() as ContainerSaveObject);
  });

  Object.keys(solvers).forEach(uuid => {
    savedSolvers.push(solvers[uuid].save() as SolverSaveObject);
  });

  return {
    meta: {
      version,
      name: projectName,
      timestamp: new Date().toISOString()
    },
    containers: savedContainers,
    solvers: savedSolvers
  };
};


declare global {
  interface EventTypes {
    SAVE: () => void | undefined;
    OPEN: () => void | undefined;
    NEW: (success?: boolean) => void | undefined;
    OPEN_DIALOG: () => void | undefined;
    RESTORE: {
      file?: File;
      json: SaveState;
    };
    OPEN_EXAMPLE: Example;
  }
}


on("SAVE", (callback) => {
  const state = getSaveState();
  const options = { type: "application/json" };
  const blob = new Blob([JSON.stringify(state)], options);

  const projectName = state.meta.name;
  FileSaver.saveAs(blob, `${projectName}.json`);
  if (callback) callback();
});

const createFileInput = () => {
  let tempinput = document.createElement("input");
  tempinput.type = "file";
  tempinput.accept = "application/json";
  tempinput.setAttribute("style", "display: none");
  return tempinput;
};

const open = (callback: (files: FileList | undefined) => Promise<any>) => {
  const tempinput = createFileInput();
  document.body.appendChild(tempinput);
  tempinput.addEventListener("change", async (e) => {
    const files = (e.target as HTMLInputElement).files;
    if (!files) {
      tempinput.remove();
      callback(undefined);
      return;
    }
    callback(files);
  });
  tempinput.click();
};


on("OPEN", async (callback) => {
  open(async (files: FileList | undefined) => {
    if (!files) return;
    const objectURL = URL.createObjectURL(files![0]);
    try {
      const result = await (await fetch(objectURL)).text();
      const json = JSON.parse(result);
      emit("RESTORE", { file: files[0], json });
    } catch (e) {
      console.warn(e);
    }
    emit("RENDERER_SHOULD_ANIMATE", true);
    if (callback) callback();
  });
});


on("NEW", (callback) => {
  console.log(23214);
  const confirmed = confirm("Create a new project? Unsaved data will be lost.");
  if (confirmed) {
    const version = useAppStore.getState().version;
    const newSaveState = {
      json: {
        containers: [],
        solvers: [],
        meta: {
          name: "untitled",
          version,
          timestamp: new Date().toJSON()
        }
      }
    };
    emit("RESTORE", newSaveState);
  }
  if (callback) callback(confirmed);
});


on("OPEN_DIALOG", () => {
  useAppStore.getState().set(store => {
    store.settingsDrawerVisible = true;
  });
});
on("RESTORE", ({ file, json }) => {
  emit("DESELECT_ALL_OBJECTS");
  emit("RESTORE_CONTAINERS", json.containers);
  emit("RESTORE_SOLVERS", json.solvers);
  useAppStore.getState().set((state) => {
    state.projectName = json.meta.name;
  });
  useAppStore.getState().set(store => {
    store.settingsDrawerVisible = false;
  });
});

async function downloadImage(url) {
  /*axios({
    url: str,
    method: 'GET',
    responseType: 'blob', // important
  }).then((response) => {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'file.json');
    return link
  });*/
  let response = await axios.get(url).then(res => {
    const json = res.data;
    emit("NEW", (success) => {
      if (success) {
        emit("RESTORE", { json });
        postMessage("SHOULD_ADD_RAYTRACER");
        postMessage("SHOULD_ADD_IMAGE_SOURCE");
        postMessage("SHOULD_ADD_ENERGYDECAY");
        postMessage("SHOULD_ADD_RT60");
      }
    });
  });
}

on("OPEN_EXAMPLE", (example) => {
  //const json = examples[example] as SaveState;
  //emit("NEW", (success) => {
  //  if(success){
  //   emit("RESTORE", { json });
  // }
  //})
  downloadImage(example);
  //postMessage("SHOULD_ADD_RAYTRACER")
  //postMessage('SHOULD_ADD_IMAGE_SOURCE')
  //postMessage('SHOULD_ADD_ENERGYDECAY')
  //postMessage("SHOULD_ADD_RT60")
});






