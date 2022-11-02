// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/// @title MVPWorkshop NFT token
/// @author Rastko Misulic
/// @notice You can use this contract for creating NFT
/// @dev oppenzeppelin ERC721 with URIStorage 
contract MVPWNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    string[] public uris;
    bool private status;
    uint256 private numberOfAddresses;

    constructor(string[] memory _uris, uint256 _numberOfAddresses) ERC721("MVP Workshop NFT", "MVPWNFT") {
        uris = _uris;
        status = false;
        numberOfAddresses = _namberOfAddresses;
    }

    /// @notice Mints all tokens to owner
    /// @dev Using keccak256 for random number (Change to Chainlink VRF)
    function safeMint() public onlyOwner {
        require(!status,"Already minted");
        status = true;
        for(uint256 i = 0; i < uris.length; i++){
            uint256 tokenId = _tokenIdCounter.current();
            _tokenIdCounter.increment();
            _safeMint(msg.sender, tokenId);
            _setTokenURI(tokenId, uris[uint256(keccak256(abi.encodePacked(block.timestamp,msg.sender, tokenId))) % uris.length]);
        }
    }

    // The following functions are overrides required by Solidity.
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}
