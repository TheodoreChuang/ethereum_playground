import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Button, Table } from 'semantic-ui-react';

import campaign from '../../../../ethereum/campaign';
import Layout from '../../../../components/Layout';
import RequestRow from '../../../../components/RequestRow';

const { Header, HeaderCell, Row, Body } = Table;

const renderRows = (address, requests, approversCount) => {
  return requests.map((request, index) => {
    return <RequestRow key={index} id={index} address={address} request={request} approversCount={approversCount} />;
  });
};

const Requests = ({ address, requests, requestCount, approversCount }) => {
  return (
    <Layout>
      <h3>Requests</h3>
      <Link href="/campaigns/[campaign]/requests/new" as={`/campaigns/${address}/requests/new`}>
        <a>
          <Button primary floated="right" style={{ marginBottom: 10 }}>
            Add Request
          </Button>
        </a>
      </Link>
      <Table>
        <Header>
          <Row>
            <HeaderCell>ID</HeaderCell>
            <HeaderCell>Description</HeaderCell>
            <HeaderCell>Amount</HeaderCell>
            <HeaderCell>Recipient</HeaderCell>
            <HeaderCell>Approval Count</HeaderCell>
            <HeaderCell>Approve</HeaderCell>
            <HeaderCell>Finalize</HeaderCell>
          </Row>
        </Header>
        <Body>{renderRows(address, requests, approversCount)}</Body>
      </Table>
      <div>Found {requestCount} requests.</div>
    </Layout>
  );
};

export const getServerSideProps = async (ctx) => {
  const campaignInstance = campaign(ctx.params.campaign);
  const requestCount = await campaignInstance.methods.getRequestsCount().call();
  const approversCount = await campaignInstance.methods.approversCount().call();

  const requests = await Promise.all(
    Array(parseInt(requestCount))
      .fill()
      .map((element, index) => {
        return campaignInstance.methods.requests(index).call();
      })
  );

  return {
    props: {
      address: ctx.params.campaign,
      // FIXME: works but probably better way..?
      requests: JSON.parse(JSON.stringify(requests)),
      requestCount,
      approversCount,
    },
  };
};

export default Requests;

Requests.propTypes = {
  address: PropTypes.string.isRequired,
  requests: PropTypes.arrayOf(
    PropTypes.shape({
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
    })
  ),
  requestCount: PropTypes.string,
  approversCount: PropTypes.string,
};
