export interface ITiles {
    idR: number;
    idC: number;
    house: boolean
    houseName?: number;
    enemys?: string[];
    enemyRoute?: number[];
    visible?: boolean;
    investigation?: boolean;
    roofN?: boolean;
    roofS?: boolean;
    roofE?: boolean;
    roofW?: boolean;
    doorN: boolean;
    doorS: boolean;
    doorE: boolean;
    doorW: boolean;
}

