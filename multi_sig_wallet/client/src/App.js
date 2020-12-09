import { useEffect, useState } from "react";
import { getWallet, getWeb3 } from "./utils";
import Header from "./Header";
import NewTransfer from "./NewTransfer";
import TransferList from "./TransferList";

const isLoading = ({ web3, accounts, wallet, approvers, quorum }) =>
  typeof web3 === "undefined" ||
  accounts.length === 0 ||
  typeof wallet === "undefined" ||
  approvers.length === 0 ||
  typeof quorum === "undefined";

const App = () => {
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState([]);
  const [wallet, setWallet] = useState(undefined);
  const [approvers, setApprovers] = useState([]);
  const [quorum, setQuorum] = useState(undefined);
  const [transfers, setTransfers] = useState([]);

  useEffect(() => {
    (async () => {
      const web3 = await getWeb3();
      const [accounts, wallet] = await Promise.all([
        web3.eth.getAccounts(),
        getWallet(web3),
      ]);
      const [approvers, quorum, transfers] = await Promise.all([
        wallet.methods.getApprovers().call(),
        wallet.methods.quorum().call(),
        wallet.methods.getTransfers().call(),
      ]);

      setWeb3(web3);
      setAccounts(accounts);
      setWallet(wallet);
      setApprovers(approvers);
      setQuorum(quorum);
      setTransfers(transfers);
    })();
  }, []);

  /**
   * Create a new transfer
   * @param {Object} transfer
   * @param {string} transfer.amount in wei
   * @param {string} transfer.to wallet recipient address
   */
  const createTransfer = (transfer) => {
    wallet.methods
      .createTransfer(transfer.amount, transfer.to)
      .send({ from: accounts[0] });
  };

  const approveTransfer = (transferId) => {
    wallet.methods.approveTransfer(transferId).send({ from: accounts[0] });
  };

  if (isLoading({ web3, accounts, wallet, approvers, quorum })) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      Multisig Wallet
      <Header approvers={approvers} quorum={quorum} />
      <NewTransfer createTransfer={createTransfer} />
      <TransferList transfers={transfers} approveTransfer={approveTransfer} />
    </div>
  );
};

export default App;
