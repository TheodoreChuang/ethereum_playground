import React from 'react';
import PropTypes from 'prop-types';
import { Table, Button } from 'semantic-ui-react';

import web3 from '../ethereum/web3';
import campaign from '../ethereum/campaign';

const { Row, Cell } = Table;

const onApprove = async (campaignAddress, requestIndex) => {
  const campaignInstance = campaign(campaignAddress);
  const accounts = await web3.eth.getAccounts();
  await campaignInstance.methods.approveRequest(requestIndex).send({ from: accounts[0] });
  // TODO: UX loading/disable, refresh
};

const onFinalize = async (campaignAddress, requestIndex) => {
  const campaignInstance = campaign(campaignAddress);
  const accounts = await web3.eth.getAccounts();
  await campaignInstance.methods.finalizeRequest(requestIndex).send({ from: accounts[0] });
  // TODO: UX loading/disable, refresh
};

const RequestRow = ({ id, address, request, approversCount }) => {
  const readyToFinalize = request.approvalCount > approversCount / 2;

  return (
    <Row disabled={request.complete} positive={!request.complete && readyToFinalize}>
      <Cell>{id}</Cell>
      <Cell>{request.description}</Cell>
      <Cell>{web3.utils.fromWei(request.value, 'ether')}</Cell>
      <Cell>{request.recipient}</Cell>
      <Cell>
        {request.approvalCount}/{approversCount}
      </Cell>
      <Cell>
        {request.complete ? null : (
          <Button color="green" basic onClick={() => onApprove(address, id)}>
            Approve
          </Button>
        )}
      </Cell>
      <Cell>
        {request.complete ? null : (
          <Button color="teal" basic onClick={() => onFinalize(address, id)}>
            Finalize
          </Button>
        )}
      </Cell>
    </Row>
  );
};

export default RequestRow;

RequestRow.propTypes = {
  id: PropTypes.number,
  address: PropTypes.string,
  request: PropTypes.shape({
    '0': PropTypes.string, // description
    '1': PropTypes.string, // value
    '2': PropTypes.string, //recipient address
    '3': PropTypes.bool, // complete
    '4': PropTypes.string, // approvalCount
    description: PropTypes.string,
    value: PropTypes.string,
    recipient: PropTypes.string,
    complete: PropTypes.bool,
    approvalCount: PropTypes.string,
  }),
  approversCount: PropTypes.string,
};
