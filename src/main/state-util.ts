import { AppInternalState } from "../types/internal-state";
import * as fs from "fs";
import { deepFreeze } from "../util/equals";
import { initialTipos, defaultTampa } from "./state";
import { telasDisponiveis } from "./telas";

export function readState(file: string): AppInternalState | undefined {
  const fileContent = fs.readFileSync(file).toString();
  if (fileContent) {
    const json = JSON.parse(fileContent) as AppInternalState;
    //if (!json.equipamentoTipos /* || !json.equipamentoTipos.length */ )
    (json as any).equipamentoTipos = initialTipos;
    for (const e of json.equipamentos) {
      if (!e.configuracoes) (e as any).configuracoes = [];
      if ((e as any).tipo == "glow64") {
        delete (e as any).tipo;
        (e as any).tipoUid = 1;
      } else if ((e as any).tipo == "par16") {
        delete (e as any).tipo;
        (e as any).tipoUid = 2;
      } else if ((e as any).tipo) {
        throw new Error("Json inválido");
      }
    }
    for (const t of json.equipamentoTipos) {
      if (!t.configuracoes) (t as any).configuracoes = [];
    }
    (json as any).animacao = false;
    if (!json.arquivos) {
      (json as any).arquivos = [];
    }
    if (!json.telas) {
      (json as any).telas = {
        aberta: null
      };
    }
    if (!json.tampa) {
      (json as any).tampa = defaultTampa;
    } else {
      (json as any).tampa.uriWildcardsState = "pending";
      (json as any).tampa.abrirEndPointFinal = null;
      (json as any).tampa.fecharEndPointFinal = null;
      (json as any).tampa.requesting = false;

      if ((json as any).tampa.abrindo) {
        (json as any).tampa.aberto = true;
      } else if ((json as any).tampa.fechando) {
        (json as any).tampa.aberto = false;
      }
      (json as any).tampa.abrindo = false;
      (json as any).tampa.fechando = false;
      if (
        (json as any).tampa.tampaTime &&
        !(json as any).tampa.requestWhaitTime
      ) {
        (json as any).tampa.requestWhaitTime = (json as any).tampa.tampaTime;
        delete (json as any).tampa.tampaTime;
      }
      if (
        (json as any).tampa.tampaPlayDelay &&
        !(json as any).tampa.playDelayTime
      ) {
        (json as any).tampa.playDelayTime = (json as any).tampa.tampaPlayDelay;
        delete (json as any).tampa.tampaPlayDelay;
      }
    }

    // if (!json.player) {
    (json as any).player = {
      arquivo: null,
      state: "stop",
      volume: 1,
      repeat: false
    };
    //}
    (json as any).telas.disponiveis = telasDisponiveis();
    if (!json.httpServer)
      (json as any).httpServer = {
        open: false,
        port: 8080
      };
    deepFreeze(json);
    return json;
  }
  return undefined;
}
