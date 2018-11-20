import * as React from "react";
// import {Monitor} from './Monitor'
import { Server } from "./Server";
import { ConexaoDMX } from "./ConexaoDMX";
import { Mesa } from "./Mesa";
import { Equipamentos } from "./equipamentos/Equipamentos";
import { AppInternalState } from "../types/internal-state";
import { Cenas } from "./Cenas";
import { action } from "../util/action";
import { listen, close } from "../util/listeners";
import { deepFreeze } from "../util/equals";
import "../util/prevent-selection";

const empty = {};
export class App extends React.Component<{}, AppInternalState | {}> {
  constructor(props: {}) {
    super(props);
    this.state = empty;
    action({ type: "app-start" });
    // this.stateListener = this.stateListener.bind(this);
    listen(this.stateListener);
  }
  stateListener = (data: AppInternalState) => {
    for (const key in data) {
      deepFreeze(data[key]);
    }
    this.setState(data);
  };

  componentWillUnmount() {
    close(this.stateListener);
  }

  //     setArquivos(arquivos:Arquivo[]){
  //         this.setState({
  //             arquivos
  //         },()=>ipcRenderer.send('state',this.state));
  //     }

  inputEl: HTMLInputElement | null = null;
  salvarMesa() {
    const nome = (this.inputEl && this.inputEl.value) || "";
    if (this.inputEl) this.inputEl.value = "";
    action({ type: "salvar-mesa", nome });
  }

  render() {
    if (this.state == empty) return null;
    const state = this.state as AppInternalState;
    return (
      <div>
        <div
          style={{
            borderBottom: "1px solid #ddd",
            paddingBottom: "10px"
          }}
        >
          <button onClick={() => action({ type: "novo" })}>Novo</button>{" "}
          <button onClick={() => action({ type: "abrir" })}>Abrir</button>{" "}
          <button onClick={() => action({ type: "salvar" })}>Salvar</button>{" "}
        </div>
        {state.animacao ? (
          <div
            style={{
              position: "fixed",
              top: "0",
              right: "0",
              bottom: "0",
              left: "0",
              background: "rgba(255,255,255,.6)",
              zIndex: 1
            }}
            ref={el => {
              if (el) {
                if (
                  document.activeElement &&
                  (document.activeElement as any).blur
                )
                  (document.activeElement as any).blur();
              }
            }}
          />
        ) : null}
        {/*<Monitor />*/}
        <Server port={state.httpServer.port} open={state.httpServer.open} />
        <ConexaoDMX {...state.dmx} />
        <Cenas {...state} />
        <div style={{ textAlign: "right", paddingBottom: "5px" }}>
          <input type="text" ref={el => (this.inputEl = el)} />{" "}
          <button onClick={() => this.salvarMesa()}>Salvar</button>
        </div>
        <Mesa canais={state.canais} />
        <Equipamentos
          equipamentoTipos={state.equipamentoTipos}
          equipamentos={state.equipamentos}
          canais={state.canais}
          cenas={state.cenas}
        />
        {/*<Arquivos onChange={arquivos=>this.setArquivos(arquivos)} />*/}
      </div>
    );
  }
}
