import { SheetOverview } from "./sheet";

export class Campain {
  id!: string;
  name!: string;
  description!: string;
  gmDescription?: string;
  sheets!: SheetOverview[];
  writable!: boolean;
  deletable!: boolean;
  mine!: boolean;
}