const { MerkleTree } = require('merkletreejs');
const KECCAK256 = require('keccak256');
const {expect} = require('chai');
const { ethers } = require('hardhat');
const { inputToConfig } = require('@ethereum-waffle/compiler');

describe('MerkleDistributor', () => {
    beforeEach(async () => {
        [signer1, signer2, signer3, signer4] = await ethers.getSigners();

        walletAddresses = [signer1, signer2, signer3, signer4].map((s) => s.address);

        leaves = walletAddresses.map((x) => KECCAK256(x));
        tree = new MerkleTree(leaves, KECCAK256, {sortPairs: true});

        uris = ["3327","MVPW Studio","NFTizer"]
        MVPWNFT = await ethers.getContractFactory('MVPWNFT', signer1);
        mvpwNFT = await MVPWNFT.deploy(uris);

        MerkleDistributor = await ethers.getContractFactory('MerkleDistributor', signer1);
        merkleDistributor = await MerkleDistributor.deploy(mvpwNFT.address, tree.getHexRoot());
    });

    describe('Claim', () => {
        it('should have 0 NFTs', async () => {
            expect(await mvpwNFT.balanceOf(signer2.address)).to.be.equal(0);
        });
        it('should receive NFT', async () => {
            const proof = tree.getHexProof(KECCAK256(signer2.address));
            await merkleDistributor.connect(signer2).claim(proof);

            expect(await mvpwNFT.balanceOf(signer2.address)).to.be.equal(1);
        });
        it('should revert if owner tries to claim', async () => {
            const proof = tree.getHexProof(KECCAK256(signer1.address));

            expect(await merkleDistributor.connect(signer1).claim(proof)).to.be.revertedWith('MerkleDistributor: Invalid proof.');
        });
        it('should emit event Claimed', async () => {
            const proof = tree.getHexProof(KECCAK256(signer1.address));
            const tokenID = merkleDistributor.getCurrentTokenID();
            expect(await merkleDistributor.connect(signer1).claim(proof)).to.emit(merkleDistributor,'Claimed').withArgs(signer1.address,tokenID);
        })
    });

});