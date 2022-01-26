import { useLocation } from "react-router";
import { Menu } from "antd";
import { NavLink } from "react-router-dom";
import {useMoralis} from "react-moralis";

function MenuItems() {
  const { pathname } = useLocation();
  const {account} = useMoralis();

  return (
    <Menu
      theme="light"
      mode="horizontal"
      style={{
        background: "inherit",
        display: "flex",
        fontSize: "17px",
        fontWeight: "500",
        width: "100%",
        justifyContent: "center",
      }}
      defaultSelectedKeys={[pathname]}
    >      
      <Menu.Item key={"/explore/"}>
        <NavLink style={{ color: "white" }} to={"/explore/"}>Explore</NavLink>
      </Menu.Item>
      <Menu.Item key="/nftBalance">
        <NavLink style={{color: "white"}}  to="/nftBalance">My NFTs</NavLink>
      </Menu.Item>                  
      {account && <Menu.Item key={"/profile/" + account}>
        <NavLink style={{ color: "white" }} to={"/profile/" + account}>Profile</NavLink>
      </Menu.Item>}
      {/* <Menu.Item key="/quickstart">
        <NavLink to="/quickstart">🚀 Quick Start</NavLink>
      </Menu.Item>
      <Menu.Item key="/contract">
        <NavLink style={{color: "white"}}  to="/contract">Contract</NavLink>
      </Menu.Item>
      <Menu.Item key="/wallet">
        <NavLink to="/wallet">👛 Wallet</NavLink>
      </Menu.Item>
      <Menu.Item key="/1inch">
        <NavLink to="/1inch">🏦 Dex</NavLink>
      </Menu.Item>
      <Menu.Item key="onramp">
        <NavLink to="/onramp">💵 Fiat</NavLink>
      </Menu.Item>
      <Menu.Item key="/erc20balance">
        <NavLink to="/erc20balance">💰 Balances</NavLink>
      </Menu.Item>
      <Menu.Item key="/erc20transfers">
        <NavLink to="/erc20transfers">💸 Transfers</NavLink>
      </Menu.Item> */}
    </Menu>
  );
}

export default MenuItems;
