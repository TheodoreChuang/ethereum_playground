import React, { Component } from "react";
import { getWeb3 } from "./utils";
import Escrow from "./contracts/Escrow.json";

class App extends Component {
  state = {
    web3: undefined,
    accounts: [],
    currentAccount: undefined,
    contract: undefined,
    balance: undefined,
    amount: undefined,
    lawyer: undefined,
    payer: undefined,
    payee: undefined,
  };

  async componentDidMount() {
    const web3 = await getWeb3();
    const accounts = await web3.eth.getAccounts();

    const networkId = await web3.eth.net.getId();
    const deployedNetwork = Escrow.networks[networkId];
    const contract = new web3.eth.Contract(Escrow.abi, deployedNetwork.address);

    const [amount, lawyer, payer, payee] = await Promise.all([
      contract.methods.amount().call(),
      contract.methods.lawyer().call(),
      contract.methods.payer().call(),
      contract.methods.payee().call(),
    ]);

    this.setState(
      {
        web3,
        accounts,
        contract,
        amount,
        lawyer,
        payer,
        payee,
      },
      this.updateBalance
    );
  }

  async updateBalance() {
    const { contract } = this.state;
    const balance = await contract.methods.balanceOf().call();
    this.setState({ balance });
  }

  async deposit(e) {
    e.preventDefault();
    const { contract, accounts } = this.state;
    await contract.methods.deposit().send({ from: accounts[0], value: e.target.elements[0].value });
    this.updateBalance();
  }

  async release(e) {
    e.preventDefault();
    const { contract, accounts } = this.state;
    await contract.methods.release().send({ from: accounts[0] });
    this.updateBalance();
  }

  render() {
    const { web3, amount, lawyer, payer, payee, balance } = this.state;

    if (!web3) return <div>Loading</div>;

    return (
      <div className="container">
        <h1 className="text-center">Escrow</h1>

        <div className="row">
          <div className="col-sm-12">
            <p>
              Balance:{" "}
              <b>
                {balance}/{amount}
              </b>{" "}
              wei
            </p>
            <p>Lawyer: {lawyer}</p>
            <p>Payer: {payer}</p>
            <p>Payee: {payee}</p>
          </div>
        </div>

        <br />

        <div className="row">
          <div className="col-sm-12">
            <form onSubmit={e => this.deposit(e)}>
              <div className="form-group">
                <label htmlFor="deposit">Deposit</label>
                <input type="number" className="form-control" id="deposit" />
              </div>
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </form>
          </div>
        </div>

        <br />

        <div className="row">
          <div className="col-sm-12">
            <button onClick={e => this.release(e)} type="submit" className="btn btn-primary">
              Release
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
