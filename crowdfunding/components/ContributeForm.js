import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import { Form, Input, Button, Message } from 'semantic-ui-react';

import web3 from '../ethereum/web3';
import campaign from '../ethereum/campaign';

const ContributeForm = ({ address }) => {
  const [contribution, setContribution] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const campaignInstance = campaign(address);
      const accounts = await web3.eth.getAccounts();
      await campaignInstance.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(contribution, 'ether'),
      });

      // 'Refreshes' the page in order to rerun getServerSideProps() and get updated data
      Router.replace('/campaigns/[campaign]', `/campaigns/${address}`);
    } catch (err) {
      setErrorMessage(err.message);
    }
    setLoading(false);
  };

  return (
    <Form onSubmit={onSubmit} error={!!errorMessage}>
      <Form.Field>
        <label>Amount to Contribute</label>
        <Input
          label="ether"
          value={contribution}
          onChange={(event) => setContribution(event.target.value)}
          labelPosition="right"
        />
      </Form.Field>
      <Message error header="Oops" content={errorMessage} />
      <Button primary loading={loading}>
        Contribute!
      </Button>
    </Form>
  );
};

export default ContributeForm;

ContributeForm.propTypes = {
  address: PropTypes.string.isRequired,
};
