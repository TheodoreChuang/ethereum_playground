import React from "react";
import dice from "../logos/dice.webp";
import eth from "../logos/eth.png";
import Loading from "./Loading";
import "./App.css";

const Main = ({ loading, amount, balance, makeBet, maxBet, onChange }) => {
  return (
    <div className="container-fluid mt-5 col-m-4" style={{ maxWidth: "550px" }}>
      <div className="col-sm">
        <main
          role="main"
          className="col-lg-12 text-monospace text-center text-white"
        >
          <div className="content mr-auto ml-auto">
            <div id="content" className="mt-3">
              <div className="card mb-4 bg-dark border-danger">
                {loading ? (
                  <Loading />
                ) : (
                  <div className="card-body">
                    <div>
                      <img src={dice} width="225" alt="logo" />
                    </div>
                    &nbsp;
                    <p></p>
                    <div className="input-group mb-4">
                      <input
                        type="number"
                        step="0.01"
                        className="form-control form-control-md"
                        placeholder="bet amount..."
                        onChange={(e) => onChange(e.target.value)}
                        required
                      />
                      <div className="input-group-append">
                        <div className="input-group-text">
                          <img src={eth} height="20" alt="" />
                          &nbsp;<b>ETH</b>
                        </div>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="btn btn-danger btn-lg"
                      onClick={(event) => {
                        event.preventDefault();
                        //start with digit, digit+dot* or single dot*, end with digit.
                        var reg = new RegExp("^[0-9]*.?[0-9]+$");

                        if (reg.test(amount)) {
                          makeBet(
                            0,
                            window.web3.utils.toWei(amount.toString())
                          );
                        } else {
                          window.alert(
                            "Please type positive interger or float numbers"
                          );
                        }
                      }}
                    >
                      Low
                    </button>
                    &nbsp;&nbsp;&nbsp;
                    <button
                      type="submit"
                      className="btn btn-success btn-lg"
                      onClick={(event) => {
                        event.preventDefault();
                        //start with digit, digit+dot* or single dot*, end with digit.
                        var reg = new RegExp("^[0-9]*.?[0-9]+$");

                        if (reg.test(amount)) {
                          makeBet(
                            1,
                            window.web3.utils.toWei(amount.toString())
                          );
                        } else {
                          window.alert(
                            "Please type positive interger or float number"
                          );
                        }
                      }}
                    >
                      High
                    </button>
                  </div>
                )}

                <div>
                  {!balance ? (
                    <div
                      id="loader"
                      className="spinner-border float-right"
                      role="status"
                    ></div>
                  ) : (
                    <div className="float-right">
                      <b>MaxBet:</b>{" "}
                      {Number(
                        window.web3.utils.fromWei(maxBet.toString())
                      ).toFixed(5)}{" "}
                      <b>ETH</b>
                      <br></br>
                      <b>Balance:</b>{" "}
                      {Number(
                        window.web3.utils.fromWei(balance.toString())
                      ).toFixed(5)}{" "}
                      <b>ETH&nbsp;</b>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Main;
