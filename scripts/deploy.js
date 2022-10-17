const { MerkleTree } = require('merkletreejs');
const KECCAK256 = require('keccak256');
const { ethers } = require('hardhat');

async function main() {

  let whitelistAddresses = [
    "0xc5f4cfbcc2389528f8d464ef13237773132383f1",
    "0x9670565d943d1dce25e842e9666da047c55e1bcf",
    "0x0b3233fe361955d0fb9796d89eeadc834c21f3fc",
    "0xafd01787061442136a8fc3a57bb8a458e8dc983b",
    "0xe834717ecfb5e21cd712d5f41c249e36bb422c88",
    "0xbde8d21cb5b3c8f9b1c1b30214de56804fd9e47e",
    "0xbd4c9639cb942a1c01f5418492fca0fca9aa1dd9",
    "0x52641a84f69c900f48ae646074b9c674510f1483",
    "0x275986f4f52a03a24c926616e53165bc27edf65e",
    "0x233dda0e69dd6ef055f033ee824ff5f9a3bd247b",
    "0xa120690093dcd21a987c02eeb5f1e0b851b940a5",
    "0xebabce467b8e7f154a35977e26e020aa9eca5b99",
    "0x113cafef1bd8d119ac4af2fd69a35ba9a93939cd",
    "0xad6293a4a535a0fab0e5e659159a9c13ac69a0d9",
    "0x53e9ffb66ba92bbc32c0b8f23e189fd8c75c9a60",
    "0x756934eebd9d245956eb279ffe60bae37783ee48",
    "0xf91c3c481079ed4cb02174bfbbbd7a8569a16fde",
    "0x75df968c4e7306dfab9562948f64e905b97ed47c"
  ];

const leafNodes = whitelistAddresses.map(addr => keccak256(addr));
const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true});

signer1 = await ethers.getSigner();

uris = ["ipfs://bafkreicbkftsc4s22oxprpvsl5uaaf4cpfks3w4zzvray7jyqjzt4fwyva",
        "ipfs://bafkreifi4muorklcznc6iwcagjqrxcjaerwp3lyjlqsjyyuzbmdchw3ot4",
        "ipfs://bafkreigbim6uegdc2fchseznzq6r6erwj3cw3m6rb5wegbbuspv3ivu4cu",
        "ipfs://bafkreifbpacsnom4lpccogwlgmw6ot74o4e3v2nalththljg7qvrpz662u",
        "ipfs://bafybeicl7zisdevjfdgrsh7jk5unbjirr3ozxaepwue3ar7iaz5254bgfa",
        "ipfs://bafkreifqdtvm7c4xvp6ln5yg4fxb6pbbah3dylzp7rmpil6lng4dw226w4"]
MVPWNFT = await ethers.getContractFactory('MVPWNFT', signer1);
mvpwNFT = await MVPWNFT.deploy(uris);

MerkleDistributor = await ethers.getContractFactory('MerkleDistributor', signer1);
merkleDistributor = await MerkleDistributor.deploy(mvpwNFT.address, merkleTree.getHexRoot());
} 


main()
  .then(() => procces.exit(0))
  .catch((error) => {
    console.error(error);
  });