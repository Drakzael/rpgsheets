import { Icon } from "./icon";

export class GameMetadataEditor {
  type!: "number" | "text" | "dots" | "squares" | "dots_squares" | "health";
  min?: number;
  max?: number;
  maxExpr?: string;
  defaultValue?: string | number;
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

export type RowType = "title" | "spacer" | "value" | "freeValue";
export type ValueType = "text" | "number" | string;

export class GameMetadataValue {
  name!: string;
  nameExpr!: string;
  type?: RowType;
  editor?: ValueType; // value, freeValue
  value!: string; // value
  values!: string[]; // value.dots_squares
  nameValue!: string; // value (code for modifying name)
  hint?: string[]; // text
  readonly?: boolean; // text
  prefix!: string; // freeValue
  defaultCount!: number; // freeValue, longText
}

export class GameMetadataFreeValue {
  name!: string;
  prefix!: string;
  defaultCount!: number;
  editor?: ValueType;
  hint?: string[]; // text
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
