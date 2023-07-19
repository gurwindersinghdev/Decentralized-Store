const { expect } = require("chai");

const tokens = (n) => {
  return ethers.parseUnits(n.toString(), "ether");
};

//GLOBAL  constants for listing an item...

const ID = 1;
const NAME = "Shoes";
const CATEGORY = "Clothing";
const IMAGE = "";
const COST = tokens(1);
const RATING = 4;
const STOCK = 5;

describe("RetailX", () => {
  let retailX;
  let deployer;
  let buyer;

  beforeEach(async () => {
    // Setup Accounts
    [deployer, buyer] = await ethers.getSigners();

    // Deploy the contract
    const RetailX = await ethers.deployContract("RetailX");
    retailX = await RetailX.waitForDeployment();
  });

  describe("Deployment", () => {
    it("it sets the owner", async () => {
      expect(await retailX.owner()).to.equal(deployer.address);
    });
  });

  describe("Listin", () => {
    let transaction;

    beforeEach(async () => {
      transaction = await retailX
        .connect(deployer)
        .list(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK);
      await transaction.wait();
    });

    it("Returns item attributes", async () => {
      const item = await retailX.items(ID);
      expect(item.id).to.equal(ID);
      expect(item.name).to.equal(NAME);
      expect(item.category).to.equal(CATEGORY);
      expect(item.image).to.equal(IMAGE);
      expect(item.cost).to.equal(COST);
      expect(item.rating).to.equal(RATING);
      expect(item.stock).to.equal(STOCK);
    });

    it("Emits List event", () => {
      expect(transaction).to.emit(retailX, "List");
    });
  });

  describe("Listing", () => {
    let transaction;

    beforeEach(async () => {
      transaction = await retailX
        .connect(deployer)
        .list(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK);
      await transaction.wait();

      //Buy a item
      transaction = await retailX.connect(buyer).buy(ID, { value: COST });
    });

    it("Updates the contract balance", async () => {
      const result = await ethers.provider.getBalance(retailX.getAddress());
      console.log(result);
      expect(result).to.equal(COST);
    });

    it("Updates buyer's order count", async () => {
      const result = await retailX.orderCount(buyer.getAddress());
      expect(result).to.equal(1);
    });

    it("Adds the order", async () => {
      const order = await retailX.orders(buyer.getAddress(), 1);

      expect(order.time).to.be.greaterThan(0);
      expect(order.item.name).to.equal(NAME);
    });

    it("Updates the contract balance", async () => {
      const result = await ethers.provider.getBalance(retailX.getAddress());
      console.log(result);
      expect(result).to.equal(COST);
    });

    it("Emits Buy event", () => {
      expect(transaction).to.emit(retailX, "Buy");
    });
  });

  describe("Withdrawing", () => {
    let balanceBefore;

    beforeEach(async () => {
      // List a item
      let transaction = await retailX
        .connect(deployer)
        .list(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK);
      await transaction.wait();

      // Buy a item
      transaction = await retailX.connect(buyer).buy(ID, { value: COST });
      await transaction.wait();

      // Get Deployer balance before
      balanceBefore = await ethers.provider.getBalance(deployer.getAddress());

      // Withdraw
      transaction = await retailX.connect(deployer).withdraw();
      await transaction.wait();
    });

    it("Updates the owner balance", async () => {
      const balanceAfter = await ethers.provider.getBalance(
        deployer.getAddress()
      );
      expect(balanceAfter).to.be.greaterThan(balanceBefore);
    });

    it("Updates the contract balance", async () => {
      const result = await ethers.provider.getBalance(retailX.getAddress());
      expect(result).to.equal(0);
    });
  });
});
