export interface ITiles {
  idR: number;
  idC: number;
  house: boolean;
  houseName?: number;
  enemies: string[];
  enemyRoute?: number;
  clearableTile?: boolean;
  visible?: boolean;
  investigation?: boolean;
  roof?: boolean;
  roofN?: boolean;
  roofS?: boolean;
  roofE?: boolean;
  roofW?: boolean;
  doorN: boolean;
  doorS: boolean;
  doorE: boolean;
  doorW: boolean;
}
