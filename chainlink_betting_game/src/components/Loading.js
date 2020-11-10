import React from "react";
import dice_rolling from "../logos/dice_rolling.gif";
import eth from "../logos/eth.png";
import "./App.css";

const Loading = () => {
  return (
    <div className="card-body">
      <div>
        <img src={dice_rolling} width="225" alt="logo" />
      </div>
      &nbsp;
      <p></p>
      <div className="input-group mb-4">
        <input
          id="disabledInput"
          type="text"
          className="form-control form-control-md"
          placeholder="rolling..."
          disabled
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
        className="btn btn-secondary btn-lg"
        onClick={(event) => {}}
      >
        Low
      </button>
      &nbsp;&nbsp;&nbsp;
      <button
        type="submit"
        className="btn btn-secondary btn-lg"
        onClick={(event) => {}}
      >
        High
      </button>
    </div>
  );
};

export default Loading;
