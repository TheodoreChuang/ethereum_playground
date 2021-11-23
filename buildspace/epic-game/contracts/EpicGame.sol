// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// NFT contract to inherit from.
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// Helper functions OpenZeppelin provides.
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "hardhat/console.sol";

import "./libraries/Base64.sol";

/**
 * @title EpicGame
 * @author teddy
 * @notice Contract for blockchain based on NFT characters
 *  - each account can have one character at a time
 */
contract EpicGame is ERC721 {
    /* ============ Structs ============ */

    // Character definition
    struct CharacterAttributes {
        uint256 characterIndex;
        string name;
        string imageURI;
        uint256 hp;
        uint256 maxHp;
        uint256 attackDamage;
    }

    // Game Boss (global single entity)
    struct BigBoss {
        string name;
        string imageURI;
        uint256 hp;
        uint256 maxHp;
        uint256 attackDamage;
    }

    /* ============ Events ============ */

    event CharacterNFTMinted(
        address sender,
        uint256 tokenId,
        uint256 characterIndex
    );
    event AttackComplete(uint256 newBossHp, uint256 newPlayerHp);

    /* ============ State Variables ============ */

    BigBoss public bigBoss;

    // Lists of selectable characters defined during contract deployment
    CharacterAttributes[] defaultCharacters;

    // Track ID of every character minted
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Map each NFT to its attributes (tokenId => CharacterAttributes)
    mapping(uint256 => CharacterAttributes) public nftHolderAttributes;

    // Link each player to their NFT (owner => tokenId)
    mapping(address => uint256) public nftHolders;

    /* ============ Constructor ============ */

    /**
     * Instantiate characters and big boss.
     */
    constructor(
        string[] memory characterNames,
        string[] memory characterImageURIs,
        uint256[] memory characterHp,
        uint256[] memory characterAttackDamage,
        string memory bossName,
        string memory bossImageURI,
        uint256 bossHp,
        uint256 bossAttackDamage
    ) ERC721("Heroes II", "HERO") {
        bigBoss = BigBoss({
            name: bossName,
            imageURI: bossImageURI,
            hp: bossHp,
            maxHp: bossHp,
            attackDamage: bossAttackDamage
        });

        console.log(
            "Done initializing boss: %s w/ HP %s, img %s",
            bigBoss.name,
            bigBoss.hp,
            bigBoss.imageURI
        );

        for (uint256 i = 0; i < characterNames.length; i += 1) {
            defaultCharacters.push(
                CharacterAttributes({
                    characterIndex: i,
                    name: characterNames[i],
                    imageURI: characterImageURIs[i],
                    hp: characterHp[i],
                    maxHp: characterHp[i],
                    attackDamage: characterAttackDamage[i]
                })
            );

            CharacterAttributes memory c = defaultCharacters[i];

            console.log(
                "Done initializing hero: %s w/ HP %s, img %s",
                c.name,
                c.hp,
                c.imageURI
            );
        }

        // increment it to 1, to skip default value of 0
        _tokenIds.increment();
    }

    /**
     * Mint the selected character for the account
     */
    function mintCharacterNFT(uint256 _characterIndex) external {
        uint256 newItemId = _tokenIds.current();

        // Assigns the tokenId to the caller's wallet address.
        _safeMint(msg.sender, newItemId);

        nftHolderAttributes[newItemId] = CharacterAttributes({
            characterIndex: _characterIndex,
            name: defaultCharacters[_characterIndex].name,
            imageURI: defaultCharacters[_characterIndex].imageURI,
            hp: defaultCharacters[_characterIndex].hp,
            maxHp: defaultCharacters[_characterIndex].maxHp,
            attackDamage: defaultCharacters[_characterIndex].attackDamage
        });

        console.log(
            "Minted NFT w/ tokenId %s and characterIndex %s",
            newItemId,
            _characterIndex
        );

        nftHolders[msg.sender] = newItemId;

        // Increment the tokenId for the next person that uses it.
        _tokenIds.increment();

        emit CharacterNFTMinted(msg.sender, newItemId, _characterIndex);
    }

    /**
     * Attack the big boss with our character. Beware, it attacks back!
     */
    function attackBoss() public {
        uint256 nftTokenIdOfPlayer = nftHolders[msg.sender];
        CharacterAttributes storage hero = nftHolderAttributes[
            nftTokenIdOfPlayer
        ];

        require(hero.hp > 0, "Unable to attack, hero is out of HP. RIP");

        require(
            bigBoss.hp > 0,
            "Nothing to attack. The boss has already defeat!"
        );

        console.log(
            "%s about to attack. Has %s HP and %s AD",
            hero.name,
            hero.hp,
            hero.attackDamage
        );
        console.log(
            "Boss: %s has %s HP and %s AD",
            bigBoss.name,
            bigBoss.hp,
            bigBoss.attackDamage
        );

        if (bigBoss.hp < hero.attackDamage) {
            bigBoss.hp = 0;
        } else {
            bigBoss.hp -= hero.attackDamage;
        }

        if (hero.hp < bigBoss.attackDamage) {
            hero.hp = 0;
        } else {
            hero.hp -= bigBoss.attackDamage;
        }

        console.log("Hero attacked boss. New boss hp: %s", bigBoss.hp);
        console.log("Boss attacked hero. New hero hp: %s\n", hero.hp);

        emit AttackComplete(bigBoss.hp, hero.hp);
    }

    /**
     * Get list of default heros
     */
    function getAllDefaultCharacters()
        public
        view
        returns (CharacterAttributes[] memory)
    {
        return defaultCharacters;
    }

    /**
     * Get big boss details
     */
    function getBigBoss() public view returns (BigBoss memory) {
        return bigBoss;
    }

    /**
     * Check and return player's latest hero if they minted one
     */
    function checkIfUserHasNFT()
        public
        view
        returns (CharacterAttributes memory)
    {
        uint256 userNftTokenId = nftHolders[msg.sender];

        if (userNftTokenId > 0) {
            return nftHolderAttributes[userNftTokenId];
        } else {
            CharacterAttributes memory emptyStruct;
            return emptyStruct;
        }
    }

    /**
     * Utility function to encode (base64 string) NFT data for tokenURI
     */
    function tokenURI(uint256 _tokenId)
        public
        view
        override
        returns (string memory)
    {
        CharacterAttributes memory charAttributes = nftHolderAttributes[
            _tokenId
        ];

        string memory strHp = Strings.toString(charAttributes.hp);
        string memory strMaxHp = Strings.toString(charAttributes.maxHp);
        string memory strAttackDamage = Strings.toString(
            charAttributes.attackDamage
        );

        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',
                        charAttributes.name,
                        " -- NFT #: ",
                        Strings.toString(_tokenId),
                        '", "description": "This is an NFT that lets people play in the game Metaverse Slayer!", "image": "',
                        charAttributes.imageURI,
                        '", "attributes": [ { "trait_type": "Health Points", "value": ',
                        strHp,
                        ', "max_value":',
                        strMaxHp,
                        '}, { "trait_type": "Attack Damage", "value": ',
                        strAttackDamage,
                        "} ]}"
                    )
                )
            )
        );

        string memory output = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        return output;
    }
}
