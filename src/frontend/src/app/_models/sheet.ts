export class Sheet {
  name: string = "";
  game!: string;
  numericValues: { [key: string]: number } = {};
  stringValues: { [key: string]: string } = {};
}
