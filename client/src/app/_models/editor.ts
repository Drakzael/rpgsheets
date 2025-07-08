import { GameMetadataEditor } from "./gamemetadata";

export class DoubleScaleEditor {
  constructor(private data: GameMetadataEditor) {

  }

  get overlap() {
    if (this.data.overlap === undefined) {
      return true;
    }
    return this.data.overlap.toString() === "true";
  }
}
