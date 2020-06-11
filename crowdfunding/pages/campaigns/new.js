import React, { useState } from 'react';
import Router from 'next/router';
import { Form, Button, Input, Message } from 'semantic-ui-react';

import web3 from '../../ethereum/web3';
import factory from '../../ethereum/factory';
import Layout from '../../components/Layout';

const CampaignNew = () => {
  const [minimumContribution, setMinimumContribution] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setLoading(true);
    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods.createCampaign(minimumContribution).send({ from: accounts[0] });

      Router.push('/');
    } catch (err) {
      setErrorMessage(err.message);
    }
    setLoading(false);
  };

  return (
    <Layout>
      <h3>Create a Campaign</h3>
      <Form onSubmit={handleSubmit} error={!!errorMessage}>
        <Form.Field>
          <label>Minimum Contribution</label>
          <Input
            value={minimumContribution}
            onChange={(event) => setMinimumContribution(event.target.value)}
            labelPosition="right"
            label="wei"
          />
        </Form.Field>
        <Message error header="Oops" content={errorMessage} />
        <Button primary loading={loading}>
          Create
        </Button>
      </Form>
    </Layout>
  );
};

export default CampaignNew;
