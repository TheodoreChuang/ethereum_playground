const TransferList = ({ transfers, approveTransfer }) => (
  <div>
    <h2>Transfers</h2>
    <table>
      <thead>
        <tr>
          <th>Id</th>
          <th>Amount (wei)</th>
          <th>To</th>
          <th>Approvals</th>
          <th>Sent?</th>
        </tr>
      </thead>
      <tbody>
        {transfers.map((txn) => (
          <tr key={txn.id}>
            <td>{txn.id}</td>
            <td>{txn.amount}</td>
            <td>{txn.to}</td>
            <td>
              {txn.approvals}
              <button onClick={() => approveTransfer(txn.id)}>Approve</button>
            </td>
            <td>{txn.sent ? "Yes" : "No"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default TransferList;
