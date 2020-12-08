import { useEffect, useState } from "react";
import { getWallet, getWeb3 } from "./utils";

function App() {
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [wallet, setWallet] = useState(undefined);

  useEffect(() => {
    (async () => {
      const web3 = getWeb3();
      const accounts = await web3.eth.getAccounts();
      const wallet = await getWallet(web3);
      setWeb3(web3);
      setAccounts(accounts);
      setWallet(wallet);
    })();
  }, []);

  if (
    typeof web3 === "undefined" ||
    typeof accounts === "undefined" ||
    typeof wallet === "undefined"
  ) {
    return <div>Loading...</div>;
  }

  return <div>Multisig Wallet</div>;
}

export default App;
