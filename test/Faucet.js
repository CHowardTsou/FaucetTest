const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Faucet', function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployContractAndSetVariables() {
    const Faucet = await ethers.getContractFactory('Faucet');
    const faucet = await Faucet.deploy();
    const provider = await ethers.getDefaultProvider("goerli","BF5Huh4v27NnQSNeN_C3rbP6tanh-vrQ");

    let withdrawOneEther = ethers.utils.parseUnits('1', 'ether');
    

    const [owner, signer2] = await ethers.getSigners();
    console.log('faucet address: ', faucet.address);
    console.log('Owner address: ', owner.address);
    return { faucet, owner , signer2, withdrawOneEther, provider};
  }

  it('should deploy and set the owner correctly', async function () {
    const { faucet, owner } = await loadFixture(deployContractAndSetVariables);

    expect(await faucet.owner()).to.equal(owner.address);
  });

  it('should revert withdraw 1 ether', async function () {
    const { faucet, withdrawOneEther} = await loadFixture(deployContractAndSetVariables);
    await expect(faucet.withdraw(withdrawOneEther)).to.be.reverted;
  });

  it('should only owner can do it', async function () {
    const { faucet, owner, signer2, withdrawOneEther} = await loadFixture(deployContractAndSetVariables);
    
    await expect(faucet.connect(signer2).withdrawAll()).to.be.reverted;
    console.log(faucet.deployTransaction.value.toString());
  });

  it('should destruct', async function () {
    const { faucet, owner, signer2, provider} = await loadFixture(deployContractAndSetVariables);
    //console.log(faucet.address);
    const contra = await provider.getCode(faucet.address);
    console.log(contra);
    expect(await faucet.connect(owner).destroyFaucet()).to.be.reverted;
  });
});