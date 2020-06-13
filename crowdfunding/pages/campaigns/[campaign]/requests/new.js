import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Router from 'next/router';
import { Form, Button, Message, Input } from 'semantic-ui-react';

import web3 from '../../../../ethereum/web3';
import campaign from '../../../../ethereum/campaign';
import Layout from '../../../../components/Layout';

const RequestNew = ({ address }) => {
  const [newRequest, setNewRequest] = useState({ description: '', value: '', recipient: '' });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setLoading(true);

    const campaignInstance = campaign(address);
    const { description, value, recipient } = newRequest;

    try {
      const accounts = await web3.eth.getAccounts();
      await campaignInstance.methods
        .createRequest(description, web3.utils.toWei(value, 'ether'), recipient)
        .send({ from: accounts[0] });

      Router.push('/campaigns/[campaign]/requests', `/campaigns/${address}/requests`);
    } catch (err) {
      setErrorMessage(err.message);
    }
    setLoading(false);
  };

  return (
    <Layout>
      <Link href="/campaigns/[campaign]/requests" as={`/campaigns/${address}/requests`}>
        <a>Back</a>
      </Link>
      <h3>Create a Request</h3>
      <Form onSubmit={onSubmit} error={!!errorMessage}>
        <Form.Field>
          <label>Description</label>
          <Input
            value={newRequest.description}
            onChange={(event) => setNewRequest({ ...newRequest, description: event.target.value })}
          />
        </Form.Field>

        <Form.Field>
          <label>Value in Ether</label>
          <Input
            value={newRequest.value}
            onChange={(event) => setNewRequest({ ...newRequest, value: event.target.value })}
          />
        </Form.Field>

        <Form.Field>
          <label>Recipient</label>
          <Input
            value={newRequest.recipient}
            onChange={(event) => setNewRequest({ ...newRequest, recipient: event.target.value })}
          />
        </Form.Field>

        <Message error header="Oops!" content={errorMessage} />
        <Button primary loading={loading}>
          Create!
        </Button>
      </Form>
    </Layout>
  );
};

export const getServerSideProps = async (ctx) => {
  return {
    props: { address: ctx.params.campaign },
  };
};

export default RequestNew;

RequestNew.propTypes = {
  address: PropTypes.string,
};
