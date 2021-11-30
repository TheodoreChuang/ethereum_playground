import EpicGame from "./EpicGame.json";

/**
 * Parse on-chain character data
 */
export const transformCharacterData = characterData => {
  return {
    name: characterData.name,
    imageURI: characterData.imageURI,
    hp: characterData.hp.toNumber(),
    maxHp: characterData.maxHp.toNumber(),
    attackDamage: characterData.attackDamage.toNumber(),
  };
};

export { EpicGame };
