import React from 'react'
import { Card, Button } from 'semantic-ui-react'

import factory from '../ethereum/factory'
import Layout from '../components/Layout'

const renderCampaigns = (campaigns) => {
  const campaignsList = campaigns.map((address) => {
    return {
      header: address,
      description: <a>View Campaign</a>,
      fluid: true,
    }
  })
  return <Card.Group items={campaignsList} />
}

const CampaignIndex = ({ campaigns }) => (
  <Layout>
    <>
      <div>
        <h3>Open Campaigns</h3>
        <Button floated="right" content="Create Campaign" icon="add" primary />
        {renderCampaigns(campaigns)}
      </div>
    </>
  </Layout>
)

export const getServerSideProps = async () => {
  const campaigns = await factory.methods.getDeployedCampaigns().call()
  return { props: { campaigns } }
}

export default CampaignIndex
