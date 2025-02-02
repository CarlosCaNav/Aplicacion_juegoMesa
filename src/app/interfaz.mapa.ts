export interface Mapa {
    id: number;
    calleH: number;
    calleV: number;
    casa: string;
    carretera: boolean;
    enemigos: string[];
    rutasEnemigos: number[];
    visible: boolean;
    pista: boolean;
    puertaSup: boolean;
    puertaInf: boolean;
    puertaDer: boolean;
    puertaIzq: boolean;

}