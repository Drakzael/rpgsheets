import { Icon } from "./icon";

export class GameMetadataEditor {
  type!: "number" | "text" | "scale" | "dots" | "squares" | "dots_squares" | "health";
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
    defaultIcon: string | Icon,
    values: { name: string, overlap: boolean, icon: string | Icon }[]
  };
  icons?: {
    empty: string,
    full: string,
    plus?: string,
    minus?: string
  };
}

export type RowType = "title" | "note" | "spacer" | "value" | "freeValue" | "state-start" | "state-end" | "state";
export type ValueType = "text" | "number" | string;

export class GameMetadataValueState {
  type = "state";
  group!: string;
  value!: string;
  action!: string;
  default?: boolean;
}

export class GameMetadataValue {
  name!: string;
  nameExpr!: string;
  type?: RowType;
  mode?: string[]; // value limited to modes
  editor?: ValueType; // value, freeValue
  value!: string; // value
  values!: string[]; // value.dots_squares
  nameValue!: string; // value (code for modifying name)
  hint?: string[]; // text
  readonly?: boolean; // text
  prefix!: string; // freeValue
  defaultCount!: number; // freeValue, longText
  count?: number; // spacer
  rows?: GameMetadataValue[]; // state
  group?: string; // state
  action?: string; // state;
  default?: boolean; //state;
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
  pageBreak?: boolean;
}

export class GameMetadata {
  name!: string;
  code!: string;
  modes?: { name: string, code: string }[];
  editors?: { [key: string] : GameMetadataEditor };
  gridRows!: GameMetadataRow[];
  icons?: { [key: string]: Icon };
}

export class GameMetadataOverview {
  code!: string;
  name!: string;
  deprecated?: boolean;
}
