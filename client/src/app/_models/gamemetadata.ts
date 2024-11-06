import { Icon } from "./icon";

export class GameMetadataEditor {
  type!: "text" | "dots" | "squares" | "dots_squares" | "health";
  min?: number;
  max?: number;
  maxExpr?: string;
  freeEdit?: boolean = false;
  freeEditDots?: boolean = false;
  freeEditSquares?: boolean = false;
  overlap?: boolean = true;
  values?: { name: string, tip: string}[];
  types?: {
    defaultIcon: Icon,
    values: { name: string, overlap: boolean, icon: Icon }[]
  }
}

export type ValueType = "text" | "number" | string;

export class GameMetadataValue {
  name!: string;
  value!: string | string[];
  hint?: string[];
  type?: ValueType;
  readonly?: boolean;
}

export class GameMetadataFreeValue {
  name!: string;
  prefix!: string;
  defaultCount!: number;
  type?: undefined | "number" | string;
}

export class GameMetadataColumn {
  title?: string;
  gridRows?: GameMetadataRow[];
  rows?: GameMetadataValue[];
  freeRows?: GameMetadataFreeValue;
  defaultType?: ValueType;
}

export class GameMetadataRow {
  title?: string;
  gridColumns!: GameMetadataColumn[];
  defaultType?: ValueType;
}

export class GameMetadata {
  name!: string;
  code!: string;
  editors?: { [key: string] : GameMetadataEditor };
  gridRows!: GameMetadataRow[];
}

export class GameMetadataOverview {
  code!: string;
  name!: string;
}
