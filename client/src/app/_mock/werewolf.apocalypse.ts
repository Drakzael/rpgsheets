import { GameMetadata } from "../_models/gamemetadata";

export const werewolfApocalypse: GameMetadata = {
  name: "Mockup Werewolf",
  code: "werewolf.apocalypse",
  editors: {
    attribute: { type: "dots", min: 1, max: 5 },
    ability: { type: "dots", min: 0, max: 5 },
    renown: { type: "dots_squares", min: 0, max: 10, overlap: true },
    willpower: { type: "dots_squares", min: 0, max: 10, overlap: false, freeEditSquares: true }
  },
  gridRows: [{
    defaultType: "text",
    gridColumns: [{
      rows: [
        { name: "Nom", value: "$sheet.name" },
        { name: "Joueur", readonly: true, value: "$sheet.player" }
      ]
    }, {
      rows: [
        { name: "Lignée", value: "general.breed" },
        { name: "Auspice", value: "general.auspice" },
        { name: "Tribe", value: "general.tribe" }
      ]
    }, {
      rows: [
        { name: "Meute", value: "general.pack_name" },
        { name: "Totem", value: "general.pack_totem" },
        { name: "Concept", value: "general.concept" }
      ]
    }]
  }, {
    title: "Attributs",
    defaultType: "attribute",
    gridColumns: [{
      title: "Physique",
      rows: [
        { name: "Force", value: "attribute.strength" },
        { name: "Dextérité", value: "attribute.dexterity" },
        { name: "Vigueur", value: "attribute.stamina" }
      ]
    }, {
      title: "Social",
      rows: [
        { name: "Charisme", value: "attribute.charisma" },
        { name: "Manipulation", value: "attribute.manipulation" },
        { name: "Apparance", value: "attribute.appearance" }
      ]
    }, {
      title: "Mental",
      rows: [
        { name: "Perception", value: "attribute.perception" },
        { name: "Intelligence", value: "attribute.intelligence" },
        { name: "Astuce", value: "attribute.wits" }
      ]
    }]
  }, {
    title: "Capacités",
    defaultType: "ability",
    gridColumns: [{
      title: "Talents",
      rows: [
        { name: "Vigilance", value: "ability.alertness" },
        { name: "Athlétisme", value: "ability.athletics" },
        { name: "Bagarre", value: "ability.brawl" },
        { name: "Esquive", value: "ability.dodge" },
        { name: "Empathie", value: "ability.empathy" },
        { name: "expression", value: "ability.expression" },
        { name: "intimidation", value: "ability.intimidation" },
        { name: "Appel primal", value: "ability.primalUrge" },
        { name: "Conn. de la rue", value: "ability.streetwise" },
        { name: "Subterfuge", value: "ability.subterfuge" }
      ]
    }, {
      title: "Compétences",
      rows: [
        { name: "Animaux", value: "ability.animalKen" },
        { name: "Conduite", value: "ability.drive" },
        { name: "Etiquette", value: "ability.etiquette" },
        { name: "Armes à feu", value: "ability.firearms" },
        { name: "Mélée", value: "ability.melee" },
        { name: "leadership", value: "ability.leadership" },
        { name: "Représentation", value: "ability.performance" },
        { name: "Artisanat", value: "ability.repair" },
        { name: "Furtivité", value: "ability.stealth" },
        { name: "Survie", value: "ability.survival" }
      ]
    }, {
      title: "Connaissances",
      rows: [
        { name: "Informatique", value: "ability.computer" },
        { name: "Enigmes", value: "ability.enigmas" },
        { name: "Investigation", value: "ability.investigation" },
        { name: "Droit", value: "ability.law" },
        { name: "Langues", value: "ability.linguistics" },
        { name: "Médecine", value: "ability.medecine" },
        { name: "Occultisme", value: "ability.occult" },
        { name: "Politique", value: "ability.politics" },
        { name: "Rituels", value: "ability.rituals" },
        { name: "Sciences", value: "ability.science" }
      ]
    }]
  }, {
    title: "Avantages",
    gridColumns: []
  }, {
    gridColumns: [{
      title: "Renom",
      defaultType: "renown",
      rows: [
        { name: "Gloire", value: ["renown.glory_perma", "renown.glory_tmp"] },
        { name: "Honneur", value: ["renown.honor_perma", "renown.honor_tmp"] },
        { name: "Sagesse", value: ["renown.wisdom_perma", "renown.wisdom_tmp"] }
      ]
    }, {
      defaultType: "willpower",
      rows: [
        {name: "Rage", value: ["rage.max", "rage.current"]},
        {name: "Gnose", value: ["gnosis.max", "gnosis.current"]},
        {name: "Volonté", value: ["willpower.max", "willpower.current"]}
      ]
    }, {

    }]
  }]
};
