export interface ITiles {
  idR: number;
  idC: number;
  house: boolean;
  houseName?: number;
  enemyRoute: number;
/*   enemies: string[]; */
  enemyLow: number;
  enemyMedium: number;
  enemySplitter: number;
  enemyHigh: number;
  enemyFinal: boolean;
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
