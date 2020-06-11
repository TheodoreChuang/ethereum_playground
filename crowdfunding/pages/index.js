import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Card, Button } from 'semantic-ui-react';

import factory from '../ethereum/factory';
import Layout from '../components/Layout';

const renderCampaigns = (campaigns) => {
  const campaignsList = campaigns.map((address) => {
    return {
      header: address,
      description: (
        <Link href="/campaigns/[campaign]" as={`/campaigns/${address}`}>
          <a>View Campaign</a>
        </Link>
      ),
      fluid: true,
      style: {
        marginLeft: '0',
      },
    };
  });
  return <Card.Group items={campaignsList} />;
};

const CampaignIndex = ({ campaigns }) => (
  <Layout>
    <>
      <div>
        <h3>Open Campaigns</h3>
        <Link href="/campaigns/new">
          <a>
            <Button floated="right" content="Create Campaign" icon="add" primary />
          </a>
        </Link>
        {renderCampaigns(campaigns)}
      </div>
    </>
  </Layout>
);

export const getServerSideProps = async () => {
  const campaigns = await factory.methods.getDeployedCampaigns().call();
  return { props: { campaigns } };
};

export default CampaignIndex;

CampaignIndex.propTypes = {
  campaigns: PropTypes.arrayOf(PropTypes.string),
};
