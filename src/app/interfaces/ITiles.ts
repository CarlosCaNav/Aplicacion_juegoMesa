export interface Tiles {
    idR: number;
    idC: number;
    house: boolean
    houseName?: number;
    streetH?: number;
    streetV?: number;
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

