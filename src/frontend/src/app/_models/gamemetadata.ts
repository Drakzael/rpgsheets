export class GameMetadataEditor {
  type!: "text" | "dots" | "squares" | "dots_squares";
  min?: number;
  max?: number;
  freeEdit?: boolean = false;
  freeEditDots?: boolean = false;
  freeEditSquares?: boolean = false;
  overlap?: boolean = true;
}

export type ValueType = "text" | "number" | string;

export class GameMetadataValue {
  name!: string;
  value!: string | string[];
  type?: ValueType;
  readonly?: boolean;
}

export class GameMetadataColumn {
  title?: string;
  gridRows?: GameMetadataRow[];
  rows?: GameMetadataValue[];
  defaultType?: ValueType;
}

export class GameMetadataRow {
  title?: string;
  gridColumns!: GameMetadataColumn[];
  defaultType?: ValueType;
}

export class GameMetadata {
  code!: string;
  editors?: { [key: string] : GameMetadataEditor };
  gridRows!: GameMetadataRow[];
}
