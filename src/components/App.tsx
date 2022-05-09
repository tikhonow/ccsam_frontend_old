import React from "react";
import SplitterLayout from "react-splitter-layout";
import { FocusStyleManager, Position, Toaster } from "@blueprintjs/core";
import ObjectView from "./object-view/ObjectView";
// import ConstructionsView from "./ConstructionsView";
import PanelContainer from "./panel-container/PanelContainer";
import { emit, messenger, on } from "../messenger";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";

import SignInSide from "../Login";

import MainRightPanel from "./MainRightPanel";

import "../css";
import "./App.css";
import { Stat } from "./parameter-config/Stats";

import SaveDialog from "./SaveDialog";

import { NavBarComponent } from "./NavBarComponent";
import { Provider } from "react-redux";
import store, { persistor } from "../store";

import { ResultsPanel } from "./ResultsPanel";
import { MaterialSearch } from "./MaterialSearch";
import EditorContainer from "./EditorContainer";
import FullScreenDialog from "./ListOf";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ProtectedRoute from "../store/auth/ProtectedRoute";
import SignUp from "../Register";

const darkTheme = createTheme({
  palette: {
    mode: "light"
  }
});


const AppToaster = Toaster.create({
  className: "app-toaster",
  position: Position.TOP,
  maxToasts: 5
});


FocusStyleManager.onlyShowFocusOnTabs();


export interface AppProps {
  rightPanelTopInitialSize: number;
  bottomPanelInitialSize: number;
  rightPanelInitialSize: number;
  leftPanelInitialSize: number;
}

type AppState = {
  stats: Stat[];
};


class MainEditor1 extends React.Component<AppProps, AppState> {
  state: AppState;
  canvas: React.RefObject<HTMLCanvasElement>;
  canvasOverlay: React.RefObject<HTMLDivElement>;
  orientationOverlay: React.RefObject<HTMLDivElement>;
  responseOverlay: React.RefObject<HTMLDivElement>;
  statsCanvas: React.RefObject<HTMLCanvasElement>;
  rightPanelTopSize = this.props.rightPanelTopInitialSize;
  bottomPanelSize = this.props.bottomPanelInitialSize;
  rightPanelSize = this.props.rightPanelInitialSize;
  leftPanelSize = this.props.leftPanelInitialSize;
  editorResultSplitterRef: React.RefObject<SplitterLayout>;

  constructor(props: AppProps) {
    super(props);
    this.state = {
      stats: [] as Stat[]
    };

    this.canvas = React.createRef<HTMLCanvasElement>();
    this.responseOverlay = React.createRef<HTMLDivElement>();
    //this.clfViewerOverlay = React.createRef<HTMLDivElement>();
    this.canvasOverlay = React.createRef<HTMLDivElement>();
    this.orientationOverlay = React.createRef<HTMLDivElement>();
    this.statsCanvas = React.createRef<HTMLCanvasElement>();
    this.editorResultSplitterRef = React.createRef<SplitterLayout>();
    this.saveLayout = this.saveLayout.bind(this);
  }


  componentDidMount() {
    this.canvas.current && messenger.postMessage("APP_MOUNTED", this.canvas.current);
    let lastPanelSize = 50;
    if (this.editorResultSplitterRef.current) {
      //@ts-ignore
      lastPanelSize = this.editorResultSplitterRef.current.state.secondaryPaneSize || 50;
    }
    const openPanel = () => {
      if (lastPanelSize == 0) {
        lastPanelSize = 50;
      }
      this.editorResultSplitterRef.current!.setState({ secondaryPaneSize: lastPanelSize }, () => emit("RENDERER_SHOULD_ANIMATE", false));
    };
    const closePanel = () => {
      //@ts-ignore
      lastPanelSize = this.editorResultSplitterRef.current!.state.secondaryPaneSize;
      this.editorResultSplitterRef.current!.setState({ secondaryPaneSize: 0 }, () => emit("RENDERER_SHOULD_ANIMATE", false));
    };

    on("TOGGLE_RESULTS_PANEL", (open) => {
      console.log(this.editorResultSplitterRef.current);

      if (this.editorResultSplitterRef.current) {
        emit("RENDERER_SHOULD_ANIMATE", true);
        //@ts-ignore
        if (this.editorResultSplitterRef.current.state.secondaryPaneSize == 0 || open) {
          openPanel();
        } else {
          closePanel();
        }
      }
    });
  }

  saveLayout() {
    const layout = {
      bottomPanelInitialSize: this.bottomPanelSize,
      rightPanelInitialSize: this.rightPanelSize,
      leftPanelInitialSize: this.leftPanelSize,
      rightPanelTopInitialSize: this.rightPanelTopSize
    };
    localStorage.setItem("layout", JSON.stringify(layout));
  }

  render() {
    const ObjectViewPanel = (
      <PanelContainer>
        <ObjectView />
      </PanelContainer>
    );

    const Editor = (
      <EditorContainer>
        <div id="response-overlay" className={"response_overlay response_overlay-hidden"} ref={this.responseOverlay} />
        <div id="canvas_overlay" ref={this.canvasOverlay} />
        <div id="orientation-overlay" ref={this.orientationOverlay} />
        <canvas id="renderer-canvas" ref={this.canvas} />
      </EditorContainer>
    );
    const MainApp = (
      <ThemeProvider theme={darkTheme}>
        <NavBarComponent />
        {/* <SettingsDrawer /> */}


        <MaterialSearch />
        <FullScreenDialog />

        <SaveDialog />
        {/* center and right */}
        <SplitterLayout
          secondaryMinSize={0}
          primaryMinSize={50}
          customClassName={"modified-splitter-layout"}
          secondaryInitialSize={this.props.rightPanelInitialSize}
          primaryIndex={0}
          onDragStart={() => {
            emit("RENDERER_SHOULD_ANIMATE", true);
          }}
          onDragEnd={() => {
            emit("RENDERER_SHOULD_ANIMATE", false);
            this.saveLayout();
          }}
          onSecondaryPaneSizeChange={(value: number) => {
            this.rightPanelSize = value;
            // this.setState({ rightPanelSize: value });
          }}
        >
          <SplitterLayout
            vertical
            secondaryInitialSize={0}
            onDragStart={() => {
              emit("RENDERER_SHOULD_ANIMATE", true);
            }}
            onDragEnd={() => {
              emit("RENDERER_SHOULD_ANIMATE", false);
            }}
            ref={this.editorResultSplitterRef}
          >
            {Editor}
            <PanelContainer>
              <ResultsPanel />
            </PanelContainer>
          </SplitterLayout>

          <SplitterLayout
            vertical
            onDragEnd={() => {
              this.saveLayout();
            }}
          >
            <PanelContainer className="panel full parameter-config-panel">
              <MainRightPanel />
            </PanelContainer>
          </SplitterLayout>
        </SplitterLayout>
      </ThemeProvider>
    );
    return (
      <ThemeProvider theme={darkTheme}>
        <NavBarComponent />
        {/* <SettingsDrawer /> */}


        <MaterialSearch />
        <FullScreenDialog />

        <SaveDialog />
        {/* center and right */}
        <SplitterLayout
          secondaryMinSize={0}
          primaryMinSize={50}
          customClassName={"modified-splitter-layout"}
          secondaryInitialSize={this.props.rightPanelInitialSize}
          primaryIndex={0}
          onDragStart={() => {
            emit("RENDERER_SHOULD_ANIMATE", true);
          }}
          onDragEnd={() => {
            emit("RENDERER_SHOULD_ANIMATE", false);
            this.saveLayout();
          }}
          onSecondaryPaneSizeChange={(value: number) => {
            this.rightPanelSize = value;
            // this.setState({ rightPanelSize: value });
          }}
        >
          <SplitterLayout
            vertical
            secondaryInitialSize={0}
            onDragStart={() => {
              emit("RENDERER_SHOULD_ANIMATE", true);
            }}
            onDragEnd={() => {
              emit("RENDERER_SHOULD_ANIMATE", false);
            }}
            ref={this.editorResultSplitterRef}
          >
            {Editor}
            <PanelContainer>
              <ResultsPanel />
            </PanelContainer>
          </SplitterLayout>

          <SplitterLayout
            vertical
            onDragEnd={() => {
              this.saveLayout();
            }}
          >
            <PanelContainer className="panel full parameter-config-panel">
              <MainRightPanel />
            </PanelContainer>
          </SplitterLayout>
        </SplitterLayout>
      </ThemeProvider>
    );
  }
}

function Example() {
  const [count, setCount] = React.useState(false);

  return <div>
    <p>Вы кликнули раз</p>
  </div>;
}

export default class App extends React.Component<any, any> {
  render() {
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={null}>
          <Router>
            <div>
              <Switch>
                <Route exact path="/login" component={SignInSide} />
                <Route exact path="/registration" component={SignUp} />
                <ProtectedRoute exact path="/" render={(props) => <MainEditor1 {...cram.state} />} />
              </Switch>
            </div>
          </Router>
        </PersistGate>
      </Provider>
    );
  }
}

declare global {
  interface EventTypes {
    TOGGLE_RESULTS_PANEL: any;
  }
}
