"use client";

import { ethers } from "ethers";
import Link from "next/link";

const Navigation = ({ account, setAccount }) => {
  const connectHandler = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const account = ethers.getAddress(accounts[0]);
    setAccount(account);
  };

  return (
    <nav>
      <div className="nav__brand">
        <h1>RetailX</h1>
      </div>
      <input type="text" className="nav__search" />

      {account ? (
        <button type="button" className="nav__connect">
          {account.slice(0, 6) + "..." + account.slice(38, 42)}
        </button>
      ) : (
        <button type="button" className="nav__connect" onClick={connectHandler}>
          Connect
        </button>
      )}
      <ul className="nav__links">
        <li>
          <Link href="#Clothing & Jewelry">Clothing & Jewelry</Link>
        </li>
        <li>
          <Link href="#Electronics & Gadgets">Electronics & Gadgets</Link>
        </li>
        <li>
          <Link href="#Toys & Gaming">Toys & Gaming</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
