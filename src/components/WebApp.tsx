import * as React from "react";
// import {Monitor} from './Monitor'
import { ConexaoDMX } from "./ConexaoDMX";
import { Mesa } from "./Mesa";
import { Equipamentos } from "./equipamentos/Equipamentos";
import { AppInternalState } from "../types/internal-state";
import { Cenas } from "./Cenas";
import { action } from "../util/action";
import { close } from "../util/listeners";
import { deepFreeze } from "../util/equals";

const empty = {};
export class WebApp extends React.Component<{}, AppInternalState | {}> {
  constructor(props: {}) {
    super(props);
    this.state = empty;
    const socket = new WebSocket("ws://" + location.host + "/state");
    socket.onmessage = event => {
      this.stateListener(JSON.parse(event.data) as AppInternalState);
    };
  }

  stateListener(data: AppInternalState) {
    for (const key in data) {
      deepFreeze(data[key]);
    }
    this.setState(data);
  }

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
    if (this.state == empty) return <div>HELLO World!</div>;
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
