import React, { useState, useEffect } from 'react'
import factory from '../ethereum/factory'

const CampaignIndex = () => {
  const [campaigns, setCampaigns] = useState([])

  const getCampaigns = async () => {
    const campaigns = await factory.methods.getDeployedCampaigns().call()
    setCampaigns(campaigns)
  }

  useEffect(() => {
    getCampaigns()
  }, [])

  return <div>CampaignIndex {campaigns}</div>
}

export default CampaignIndex
