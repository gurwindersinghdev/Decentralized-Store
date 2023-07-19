"use client";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

//Components
import Navigation from "./Components/Navigation";
import Section from "./Components/Section";
import Product from "./Components/Product";

// ABIs
import RetailX from "./abi/RetailX.json";

//  Config
import config from "./abi/config.json";

export default function Home() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [retailX, setRetailX] = useState(null);

  const [electronics, setElectronics] = useState(null);
  const [clothing, setClothing] = useState(null);
  const [toys, setToys] = useState(null);

  const [item, setItem] = useState({});
  const [toggle, setToggle] = useState(false);

  const togglePop = (item) => {
    setItem(item);
    toggle ? setToggle(false) : setToggle(true);
  };
  const loadBlockchainData = async () => {
    //Connect to blockchain
    const provider = new ethers.BrowserProvider(window.ethereum);
    setProvider(provider);

    const network = await provider.getNetwork();
    console.log(network);

    // Connect to smart contracts
    const retailX = new ethers.Contract(
      config[network.chainId].retailX.address,
      RetailX,
      provider
    );
    setRetailX(retailX);

    // Load products
    const items = [];

    for (let i = 0; i < 9; i++) {
      const item = await retailX.items(i + 1);
      items.push(item);
    }

    const electronics = items.filter((item) => item.category === "electronics");
    const clothing = items.filter((item) => item.category === "clothing");
    const toys = items.filter((item) => item.category === "toys");

    setElectronics(electronics);
    setClothing(clothing);
    setToys(toys);
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />

      <h2>RetailX Best Sellers</h2>

      {electronics && clothing && toys && (
        <>
          <Section
            title={"Clothing & Accessories"}
            items={clothing}
            togglePop={togglePop}
          />
          <Section
            title={"Electronics & Gadgets"}
            items={electronics}
            togglePop={togglePop}
          />
          <Section title={"Toys & Gaming"} items={toys} togglePop={togglePop} />
        </>
      )}

      {toggle && (
        <Product
          item={item}
          provider={provider}
          account={account}
          retailX={retailX}
          togglePop={togglePop}
        />
      )}
    </div>
  );
}
