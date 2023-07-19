const hre = require("hardhat");
const { items } = require("../items.json");

const tokens = (n) => {
  return ethers.parseUnits(n.toString(), "ether");
};

async function main() {
  const [deployer] = await ethers.getSigners();
  const retailX = await hre.ethers.deployContract("RetailX");

  await retailX.waitForDeployment();

  const contractAddr = await retailX.getAddress();

  console.log("Deployed the RetailX contract", contractAddr);

  // Listing items...
  for (let i = 0; i < items.length; i++) {
    const transaction = await retailX
      .connect(deployer)
      .list(
        items[i].id,
        items[i].name,
        items[i].category,
        items[i].image,
        tokens(items[i].price),
        items[i].rating,
        items[i].stock
      );

    await transaction.wait();

    console.log(`Listed item ${items[i].id}: ${items[i].name}`);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
