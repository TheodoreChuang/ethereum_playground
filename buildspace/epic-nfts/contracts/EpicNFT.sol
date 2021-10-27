// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "hardhat/console.sol";

import {Base64} from "./libraries/Base64.sol";

contract EpicNFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // SVG template
    string openSvg =
        "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='black' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";

    string closeSvg = "</text></svg>";

    // personalities traits
    string[] firstWords = [
        "Active",
        "Affectionate",
        "Curious",
        "Easygoing",
        "Inquisitive",
        "Intelligent",
        "Interactive",
        "Friendly"
        "Gentle"
        "Loyal",
        "Playful",
        "Sensitive",
        "Sweet",
        "Social"
    ];

    // physical traits
    string[] secondWords = [
        "Athletic",
        "Buff",
        "Chubby",
        "Lean"
        "Patchy",
        "Plump",
        "Slender",
        "Spotted",
        "Striped",
        "Ripped"
    ];

    // cat breeds
    string[] thirdWords = [
        "Ragdoll",
        "ExoticShorthair",
        "BritishShorthair",
        "Persian",
        "MaineCoon",
        "AmericanShorthair",
        "DevonRex",
        "Sphynx",
        "Scottish Fold",
        "Abyssinian",
        "Oriental",
        "Siamese",
        "Bengal",
        "RussianBlue",
        "Siberian"
    ];

    constructor() ERC721("SquareNFT", "SQUARE") {
        console.log("EpicNFT constructor");
    }

    /*
     * Mint a new NFT
     */
    function makeAnEpicNft() public {
        uint256 newItemId = _tokenIds.current();

        string memory first = pickRandomWordFromList(
            "FIRST_WORD",
            firstWords,
            newItemId
        );
        string memory second = pickRandomWordFromList(
            "SECOND_WORD",
            secondWords,
            newItemId
        );
        string memory third = pickRandomWordFromList(
            "THIRD_WORD",
            thirdWords,
            newItemId
        );
        string memory combinedWord = string(
            abi.encodePacked(first, second, third)
        );

        string memory finalSvg = string(
            abi.encodePacked(openSvg, combinedWord, closeSvg)
        );

        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        // We set the title of our NFT as the generated word.
                        '{"name": "',
                        combinedWord,
                        '", "description": "A highly acclaimed collection of squares.", "image": "data:image/svg+xml;base64,',
                        // We add data:image/svg+xml;base64 and then append our base64 encode our svg.
                        Base64.encode(bytes(finalSvg)),
                        '"}'
                    )
                )
            )
        );

        string memory finalTokenUri = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        console.log("\n--------------------");
        console.log(finalTokenUri);
        console.log("--------------------\n");

        _safeMint(msg.sender, newItemId);

        _setTokenURI(newItemId, finalTokenUri);

        _tokenIds.increment();

        console.log(
            "An NFT w/ ID %s has been minted to %s",
            newItemId,
            msg.sender
        );
    }

    function pickRandomWordFromList(
        string memory salt,
        string[] memory list,
        uint256 tokenId
    ) internal pure returns (string memory) {
        uint256 rand = random(
            string(abi.encodePacked(salt, Strings.toString(tokenId)))
        );
        rand = rand % list.length;
        return list[rand];
    }

    function random(string memory input) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(input)));
    }
}
