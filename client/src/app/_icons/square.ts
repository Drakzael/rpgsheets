import { Icon } from "../_models/icon"

export const IconSquareEmpty: Icon = {
  viewBox: "0 0 100 105",
  path: "M 5.0002116,5.0002116 V 94.999886 H 94.999886 V 5.0002116 Z M 15.000118,15.000118 H 84.99998 V 84.99998 H 15.000118 Z"
};

export const IconSquareCrossed: Icon = {
  viewBox: "0 0 100 105",
  path: "M 5.0002116 5.0002116 L 5.0002116 94.999886 L 94.999886 94.999886 L 94.999886 5.0002116 L 5.0002116 5.0002116 z M 25.08064 15.000118 L 74.375305 15.000118 L 49.784558 39.644092 L 25.08064 15.000118 z M 15.000118 25.226884 L 39.642025 49.808846 L 15.000118 74.503979 L 15.000118 25.226884 z M 84.99998 25.495085 L 84.99998 74.773214 L 60.357556 50.190735 L 84.99998 25.495085 z M 50.215023 60.355489 L 74.919458 84.99998 L 25.623759 84.99998 L 50.215023 60.355489 z "
};

export const IconSquareFull: Icon = {
  viewBox: "0 0 100 105",
  path: "M 5,5 H 95 V 95 H 5 Z"
};


export const IconsSquare = {
  "square.empty": IconSquareEmpty,
  "square.crossed": IconSquareCrossed,
  "square.full": IconSquareFull
};
