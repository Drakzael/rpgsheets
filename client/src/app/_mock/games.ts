import { Sheet } from "../_models/sheet";
import { System } from "../_models/system";

export const games: System[] = [
  {
    name: "Whitewolf",
    code: "whitewolf",
    games: [
      {
        name: "Vampire",
        code: "vampire"
      }, {
        name: "Werewolf",
        code: "werewolf"
      }, {
        name: "Reve de Draoon",
        code: "revedragon"
      }
    ]
  }
];

export const sheets: Sheet[] = [
  {
    name: "Drakzael",
    game: "vampire",
    numericValues: {
      attribute: {
        strength: 5,
        dexterity: 3,
        stamina: 4
      }
    },
    stringValues: {

    }
  }
]