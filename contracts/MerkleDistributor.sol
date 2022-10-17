// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/// @title MerkleDistributor
/// @author Rastko Misulic
/// @notice You can use this contract to airdrop ERC721s 
/// @dev Using MerkleProof to verify claim requests
contract MerkleDistributor is ReentrancyGuard{
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    address private immutable admin;
    IERC721 public immutable token;
    bytes32 public immutable merkleRoot;

    mapping(address => bool) private claimedAddresses;

    event Claimed(address indexed claimAddress, uint256 tokenID);

    constructor(IERC721 token_, bytes32 merkleRoot_) {
        token = IERC721(token_);
        merkleRoot = merkleRoot_;
        admin = msg.sender;
    }

    /// @notice Transfer ERC721 to claim address
    /// @dev Require msg.sender in Merkle tree
    /// @param merkleProof - generated MerkleProof
    function claim(bytes32[] calldata merkleProof) external nonReentrant {
        //require(msg.sender != admin,'Invalid function call');
        require(!claimedAddresses[msg.sender], 'MerkleDistributor: Drop already claimed.');
        bytes32 node = keccak256(abi.encodePacked(msg.sender));
        require(MerkleProof.verify(merkleProof, merkleRoot, node), 'MerkleDistributor: Invalid proof.');
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        claimedAddresses[msg.sender] = true;
        IERC721(token).safeTransferFrom(admin, msg.sender, tokenId);

        emit Claimed(msg.sender, tokenId);

    }

    function getCurrentTokenID() public view returns(uint256) {
        return _tokenIdCounter.current();
    }
}