const TransferList = ({ transfers, approved, approveTransfer }) => (
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
        {transfers.map((txn, i) => (
          <tr key={txn.id}>
            <td>{txn.id}</td>
            <td>{txn.amount}</td>
            <td>{txn.to}</td>
            <td>
              {txn.approvals}
              <button
                disabled={approved[i]}
                onClick={() => approveTransfer(txn.id)}
              >
                {approved[i] ? "Approved" : "Approve?"}
              </button>
            </td>
            <td>{txn.sent ? "Yes" : "No"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default TransferList;
