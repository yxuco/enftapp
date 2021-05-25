import React, { useState } from "react";
import "./App.css";

import { Contract } from "@ethersproject/contracts";
import { useQuery } from "@apollo/react-hooks";

import { Body, Button, Header, Image, Link } from "./components";
import logo from "./ethereumLogo.png";
import useWeb3Modal from "./hooks/useWeb3Modal";

import { addresses, abis } from "@project/contracts";
import GET_TRANSFERS from "./graphql/subgraph";

import { ethers } from "ethers";

function WalletButton({ provider, loadWeb3Modal, logoutOfWeb3Modal }) {
  return (
    <Button
      onClick={() => {
        if (!provider) {
          loadWeb3Modal();
        } else {
          logoutOfWeb3Modal();
        }
      }}
    >
      {" "}
      {!provider ? "Connect Wallet" : "Disconnect Wallet"}{" "}
    </Button>
  );
}

function App() {
  const { loading, error, data } = useQuery(GET_TRANSFERS);
  const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();

  React.useEffect(() => {
    if (!loading && !error && data && data.transfers) {
      console.log({
        transfers: data.transfers,
      });
    }
  }, [loading, error, data]);

  const [count, setCount] = useState(0);
  const [balance, setBalance] = useState(0);

  const [recipient, setRecipient] = useState(
    "0x8c8d4fE71396bc8d6a552983d8FCD4E0D489d3E8"
  );
  const [tokenURI, setTokenURI] = useState(
    "https://ipfs.io/ipfs/QmUqfxdhwktSbuz8kc8rVmWDPP6xUgrwaBAEd3KrKtxfkZ"
  );
  const [tokenId, setTokenId] = useState(0);
  const [metadata, setMetadata] = useState("");

  const refreshData = async () => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log({ provider });

      // refresh ENFT token counts
      const rinkenft = new Contract(addresses.rinkenft, abis.enft, provider);
      const currId = await rinkenft.getCount();
      console.log({ count: currId.toString() });
      setCount(currId.toString());

      // refresh account balance
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log({ accounts: accounts });
      provider.getBalance(accounts[0]).then((balance) => {
        let etherString = ethers.utils.formatEther(balance);
        console.log({ balance: etherString });
        setBalance(etherString);
      });
    }
  };

  const mintNFT = async (t) => {
    t.preventDefault();
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log({ provider: provider });
      const signer = provider.getSigner();
      console.log({ signer: signer });

      // use signer to create transaction
      const rinkenft = new Contract(addresses.rinkenft, abis.enft, signer);
      const transaction = await rinkenft.mintNFT(recipient, tokenURI);
      console.log({ transaction: transaction });

      // wait for transaction to complete
      await transaction.wait();
      console.log("Successfully created a new B2B token");
      refreshData();
    }
  };

  const getTokenURI = async (t) => {
    t.preventDefault();
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log({ provider });
      const rinkenft = new Contract(addresses.rinkenft, abis.enft, provider);
      const uri = await rinkenft.getTokenURI(tokenId);
      console.log({
        tokenURI: uri.toString(),
      });
      setMetadata(uri);
    }
  };

  return (
    <div>
      <Header>
        <WalletButton
          provider={provider}
          loadWeb3Modal={loadWeb3Modal}
          logoutOfWeb3Modal={logoutOfWeb3Modal}
        />{" "}
      </Header>{" "}
      <Body>
        <Image src={logo} alt="react-logo" />
        <p>Sample NFT Contract</p>
        <p>
          Total B2B token count: {count}; User account balance: {balance}.
          <Button onClick={() => refreshData()}>Refresh Count</Button>
        </p>
        <div>
          <form onSubmit={mintNFT}>
            <div className="div">
              <label className="label">Recipient:</label>
              <input
                size="45"
                type="text"
                name="recipient"
                value={recipient}
                onChange={(t) => setRecipient(t.target.value)}
              />
            </div>
            <div className="div">
              <label className="label">Token URI:</label>
              <input
                size="65"
                type="text"
                name="tokenURI"
                value={tokenURI}
                onChange={(t) => setTokenURI(t.target.value)}
              />
            </div>
            <div className="div">
              <label className="label"></label>
              <Button type="submit">Mint Token</Button>
            </div>
          </form>
          <br />
          <form className="form" onSubmit={getTokenURI}>
            <div className="div">
              <label className="label">Token URI:</label>
              <input
                size="4"
                type="text"
                name="tokenId"
                onChange={(t) => setTokenId(t.target.value)}
              />
            </div>
            <div className="div">
              <label className="label"></label>
              <Button type="submit">Get Metadata</Button>
            </div>
            <div className="div">
              <label className="label"></label>
              <label className="result">Token metadata URI: {metadata}</label>
            </div>
          </form>
        </div>
        <Link
          href="https://ethereum.org/developers/#getting-started"
          style={{
            marginTop: "8px",
          }}
        >
          Learn Ethereum{" "}
        </Link>{" "}
        <Link href="https://reactjs.org"> Learn React </Link>{" "}
        <Link href="https://thegraph.com/docs/quick-start">
          {" "}
          Learn The Graph{" "}
        </Link>{" "}
      </Body>{" "}
    </div>
  );
}

export default App;
