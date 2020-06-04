// require('dotenv').config()
import web3 from './web3'
import CampaignFactory from './build/CampaignFactory.json'

const instance = new web3.eth.Contract(CampaignFactory.abi, '0x7E8719ccD5cE88fB719A668C1C1Db757E911d60B')
// const instance = new web3.eth.Contract(CampaignFactory.abi, process.env.CAMPAIGN_FACTORY_RINKEBY_ADDRESS)

export default instance
