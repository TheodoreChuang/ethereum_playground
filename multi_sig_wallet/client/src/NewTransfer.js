import { useState } from "react";

const NewTransfer = ({ createTransfer }) => {
  const [transfer, setTransfer] = useState({});

  const submit = (e) => {
    e.preventDefault();
    createTransfer(transfer);
  };

  const updateTransfer = ({ e, field }) => {
    setTransfer({ ...transfer, [field]: e.target.value });
  };

  return (
    <div>
      <h2>Create Transfer</h2>
      <form onSubmit={(e) => submit(e)}>
        <label htmlFor="amount">Amount</label>
        <input
          id="amount"
          type="text"
          onChange={(e) => updateTransfer({ e, field: "amount" })}
        ></input>
        <label htmlFor="to">Recipient Address</label>
        <input
          id="to"
          type="text"
          onChange={(e) => updateTransfer({ e, field: "to" })}
        ></input>
        <button>Submit</button>
      </form>
    </div>
  );
};

export default NewTransfer;
