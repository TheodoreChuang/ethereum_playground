import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Card, Grid, Button } from 'semantic-ui-react';

import web3 from '../../ethereum/web3';
import campaign from '../../ethereum/campaign';
import Layout from '../../components/Layout';
import ContributeForm from '../../components/ContributeForm';

const renderCards = ({ minimumContribution, balance, requestsCount, approversCount, manager }) => {
  const items = [
    {
      header: manager,
      meta: 'Address of Manager',
      description: 'The manager created this campaign and can create requests to withdraw funds',
      style: { overflowWrap: 'break-word' },
    },
    {
      header: minimumContribution,
      meta: 'Minimum Contribution (wei)',
      description: 'You must contribute at least this much wei to become an approver',
    },
    {
      header: requestsCount,
      meta: 'Number of Requests',
      description:
        'A request tries to withdraw funds from the contract and transfer it to the specified address. Requests must be approved by approvers',
    },
    {
      header: approversCount,
      meta: 'Number of Approvers',
      description: 'Number of people who have already donated to this campaign',
    },
    {
      header: balance ? web3.utils.fromWei(balance, 'ether') : '0',
      meta: 'Campaign Balance (ether)',
      description: 'The balance is how much funds this campaign has left to spend.',
    },
  ];

  return <Card.Group items={items} />;
};

const CampaignShow = (props) => {
  return (
    <Layout>
      <h3>Campaign Details</h3>
      <Grid>
        <Grid.Row>
          <Grid.Column width={10}>{renderCards(props)}</Grid.Column>
          <Grid.Column width={6}>
            <ContributeForm address={props.address} />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column>
            <Link href="/campaigns/[campaign]/requests" as={`/campaigns/${props.address}/requests`}>
              <a>
                <Button primary>View Requests</Button>
              </a>
            </Link>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Layout>
  );
};

export const getServerSideProps = async (ctx) => {
  const campaignInstance = campaign(ctx.params.campaign);
  const summary = await campaignInstance.methods.getSummary().call();

  return {
    props: {
      address: ctx.params.campaign,
      minimumContribution: summary[0],
      balance: summary[1],
      requestsCount: summary[2],
      approversCount: summary[3],
      manager: summary[4],
    },
  };
};

export default CampaignShow;

renderCards.propTypes = {
  minimumContribution: PropTypes.string,
  balance: PropTypes.string,
  requestsCount: PropTypes.string,
  approversCount: PropTypes.string,
  manager: PropTypes.string,
};

CampaignShow.propTypes = {
  address: PropTypes.string,
};
