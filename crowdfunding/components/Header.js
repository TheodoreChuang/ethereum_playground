import React from 'react'
import { Menu } from 'semantic-ui-react'

const Header = () => (
  <Menu style={{ marginTop: '10px' }}>
    <Menu.Item>CrowdCoin</Menu.Item>
    <Menu.Item position="right">
      <Menu.Item>Campaigns</Menu.Item>
      <Menu.Item>+</Menu.Item>
    </Menu.Item>
  </Menu>
)

export default Header
