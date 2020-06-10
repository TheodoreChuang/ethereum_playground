// require('dotenv').config()
import web3 from './web3'
import CampaignFactory from './build/CampaignFactory.json'

const instance = new web3.eth.Contract(CampaignFactory.abi, '0xBe2277a1F01F08aA6909B72653aA92d9D80e551f')
// const instance = new web3.eth.Contract(CampaignFactory.abi, process.env.CAMPAIGN_FACTORY_RINKEBY_ADDRESS)

export default instance
