import * as React from "react";
import { screen } from "electron";

export interface MonitorState {
  monitorCriado: boolean;
}
export class Monitor extends React.Component<{ monitorCriado: boolean }, {}> {
  constructor(props: {}) {
    super(props);
    this.state = { monitorCriado: false };
    // ipcRenderer.on('screen-closed',()=>{
    //     this.setState({
    //         monitorCriado: false
    //     });
    // });
  }
  select: any = null;

  render() {
    return (
      <div className="monitor">
        <select ref={el => (this.select = el)} onChange={() => this.change()}>
          {screen.getAllDisplays().map((d, i) => (
            <option key={d.id} value={d.id}>
              {i + 1}) {d.size.width}x{d.size.height}
            </option>
          ))}
        </select>{" "}
        {!this.props.monitorCriado ? (
          <button onClick={() => this.criarMonitor()}>Criar Tela</button>
        ) : (
          <strong>Tela Criada</strong>
        )}
      </div>
    );
  }

  change() {
    if (this.props.monitorCriado) {
      // action({type:'new-screen-request',
      //   id: parseInt(this.select.value)
      // });
    }
  }

  criarMonitor() {
    this.setState({
      monitorCriado: true
    });
    // action({type:'new-screen-request',
    //   id: parseInt(this.select.value)
    // });
  }
}
