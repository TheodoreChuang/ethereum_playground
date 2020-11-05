import React, { useState, useEffect } from "react";
import chart from "../logos/chart.png";
import btc from "../logos/btc.png";
import eth from "../logos/eth.png";
import link from "../logos/link.png";
import ada from "../logos/ada.png";
import xmr from "../logos/xmr.png";
import yfi from "../logos/yfi.png";
import lend from "../logos/lend.png";
import comp from "../logos/comp.png";
import uni from "../logos/uni.png";
import gnt from "../logos/gnt.png";

const myCoins = [
  { name: "Bitcoin", img: btc },
  { name: "Ethereum", img: eth },
  { name: "Chainlink", img: link },
  { name: "Cardano", img: ada },
  { name: "Monero", img: xmr },
  { name: "yearn.finance", img: yfi },
  { name: "Aave", img: lend },
  { name: "Compound", img: comp },
  { name: "Uniswap", img: uni },
  { name: "Golem", img: gnt },
];

function App() {
  const [loadingGlobal, setLoadingGlobal] = useState(true);
  const [loadingCoins, setLoadingCoins] = useState(true);
  const [ccGlobalMcap, setCcGlobalMcap] = useState("");
  const [ccData, setCcData] = useState([]);

  const getMyCoins = async () => {
    try {
      const response = await fetch(
        "https://coinpaprika1.p.rapidapi.com/tickers",
        {
          method: "GET",
          headers: {
            "x-rapidapi-host": "coinpaprika1.p.rapidapi.com",
            "x-rapidapi-key": process.env.REACT_APP_X_RAPIDAPI_KEY,
          },
        }
      );

      const dataCoins = await response.json();

      const dataCoin = dataCoins.reduce((acc, cur) => {
        acc[cur.name] = cur;
        return acc;
      }, {});

      const parseDataCoins = myCoins
        .map((mc) => ({
          ...dataCoin[mc.name],
          img: mc.img,
        }))
        .sort((a, b) => a.rank - b.rank);

      setCcData(parseDataCoins);
    } catch (e) {
      console.warn(`Unable to get data from API. ${e}`);
    } finally {
      setLoadingCoins(false);
    }
  };

  const getGlobalData = async () => {
    try {
      const response = await fetch(
        "https://coinpaprika1.p.rapidapi.com/global",
        {
          method: "GET",
          headers: {
            "x-rapidapi-host": "coinpaprika1.p.rapidapi.com",
            "x-rapidapi-key": process.env.REACT_APP_X_RAPIDAPI_KEY,
          },
        }
      );
      const globalData = await response.json();
      setCcGlobalMcap(globalData.market_cap_usd);
    } catch (e) {
      console.warn(`Unable to get data from API. ${e}`);
    } finally {
      setLoadingGlobal(false);
    }
  };

  useEffect(() => {
    getMyCoins();
    getGlobalData();
  }, []);

  return (
    <div>
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow text-monospace text-white">
        <img
          src={chart}
          width="30"
          height="30"
          className="d-inline-block align-top"
          alt=""
        />
        Crypt0 Track3r
        {loadingGlobal ? (
          <div
            id="loader"
            className="nav-item text-nowrap d-none d-sm-none d-sm-block"
          >
            Loading...
          </div>
        ) : (
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <small>global crypto market:</small>&nbsp;$
            <a
              className="text-white"
              href="https://coinpaprika.com/market-overview/"
              target="_blank"
              rel="noopener noreferrer"
            >
              {ccGlobalMcap.toLocaleString("fr-CH")}
            </a>
            &nbsp;
          </li>
        )}
      </nav>
      &nbsp;
      <div className="container-fluid mt-5 w-50 p-3">
        <div className="row">
          <main role="main" className="col-lg-12 d-flex text-center">
            <table className="table table-striped table-hover table-fixed table-bordered text-monospace">
              <caption>
                Data Source:
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://coinpaprika.com/"
                >
                  coinpaprika
                </a>
              </caption>
              <thead className="thead-dark">
                <tr>
                  <th scope="col">Rank</th>
                  <th scope="col">Logo</th>
                  <th scope="col">Name</th>
                  <th scope="col">Price</th>
                  <th scope="col">Market Cap</th>
                </tr>
              </thead>
              <tbody>
                {loadingCoins ? (
                  <tr>
                    <td colSpan={5}> Loading...</td>
                  </tr>
                ) : (
                  ccData.map((data) => {
                    return (
                      <tr key={data.id}>
                        <td>{data.rank}</td>
                        <td>
                          <img
                            src={data.img}
                            width="25"
                            height="25"
                            className="d-inline-block align-top"
                            alt="coin logo"
                          />
                        </td>
                        <td>
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href={"https://coinpaprika.com/coin/" + data.id}
                          >
                            {data.name}
                          </a>
                        </td>
                        <td>${data.quotes.USD.price.toFixed(2)}</td>
                        <td>
                          ${data.quotes.USD.market_cap.toLocaleString("fr-CH")}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
