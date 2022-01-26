import { useEffect } from "react";
import { useMoralis } from "react-moralis";
import { BrowserRouter as Router, Switch, Route,  Link , Redirect} from "react-router-dom";
import Account from "components/Account/Account";
import Chains from "components/Chains";
import Profile from "components/Profile";
import Explore from "components/Explore";
import NFTBalance from "components/NFTBalance";
import { Layout } from "antd";
import "antd/dist/antd.css";
import "./style.css";
import Contract from "components/Contract/Contract";
import Text from "antd/lib/typography/Text";
import MenuItems from "./components/MenuItems";
import TCTlogo from "./logo.png";
const { Header, Footer } = Layout;

const styles = {
  content: {
    display: "flex",
    justifyContent: "center",
    fontFamily: "Roboto, sans-serif",
    color: "#041836",
    marginTop: "130px",
    padding: "10px",
    width: "100%",
  },
  header: {
    position: "fixed",
    zIndex: 1,
    width: "100%",
    background: "#000",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontFamily: "Roboto, sans-serif",
    borderBottom: "2px solid rgba(0, 0, 0, 0.06)",
    padding: "0 10px",
    boxShadow: "0 1px 10px rgb(151 164 175 / 10%)",
  },
  headerRight: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
    fontSize: "15px",
    fontWeight: "600",
  },
};
const App = ({ isServerInfo }) => {
  const { isWeb3Enabled, enableWeb3, isAuthenticated, isWeb3EnableLoading } =
    useMoralis();

  useEffect(() => {
    const connectorId = window.localStorage.getItem("connectorId");
    if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading)
      enableWeb3({ provider: connectorId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isWeb3Enabled]);

  return (
    <Layout style={{ height: "100vh", overflow: "auto" }}>
      <Router>
        <Header style={styles.header}>
          <Logo />
          <MenuItems />
          <div style={styles.headerRight}>
            <Chains />
            <Account />
          </div>
        </Header>

        <div style={styles.content}>
          <Switch>
            <Route exact path="/">
              <Redirect to="/explore" />
            </Route>
            <Route exact path="/explore">
              <Explore isServerInfo={isServerInfo} />
            </Route>
            <Route path="/nftBalance">
              <NFTBalance />
            </Route>
            <Route path="/contract">
              <Contract />
            </Route>
            <Route path="/profile/:address" exact>
              <Profile />
            </Route>              
            {/* <Route path="/wallet">
              <Wallet />
            </Route>
            <Route path="/1inch">
              <Tabs defaultActiveKey="1" style={{ alignItems: "center" }}>
                <Tabs.TabPane tab={<span>Ethereum</span>} key="1">
                  <DEX chain="eth" />
                </Tabs.TabPane>
                <Tabs.TabPane tab={<span>Binance Smart Chain</span>} key="2">
                  <DEX chain="bsc" />
                </Tabs.TabPane>
                <Tabs.TabPane tab={<span>Polygon</span>} key="3">
                  <DEX chain="polygon" />
                </Tabs.TabPane>
              </Tabs>
            </Route>
            <Route path="/erc20balance">
              <ERC20Balance />
            </Route>
            <Route path="/onramp">
              <Ramper />
            </Route>
            <Route path="/erc20transfers">
              <ERC20Transfers />
            </Route>            
            <Route path="/">
              <Redirect to="/quickstart" />
            </Route> 
            <Route path="/ethereum-boilerplate">
              <Redirect to="/quickstart" />
            </Route> */}
            <Route path="/nonauthenticated">
              <>Please login using the "Authenticate" button</>
            </Route>
          </Switch>
        </div>
      </Router>
      <Footer style={{ textAlign: "center" }}>
        <Text style={{ display: "block" }}>
          Thanks to Moralis for this awesome{" "}
          <a
            href="https://github.com/ethereum-boilerplate/ethereum-boilerplate/"
            target="_blank"
            rel="noopener noreferrer"
          >
            boilerplate ⭐️
          </a>
        </Text>
      </Footer>
    </Layout>
  );
};

export const Logo = () => (
  <div style={{ display: "flex" }}>
    <Link to="/">
      <img src={TCTlogo} alt="TCT Logo " />
    </Link>
  </div>
);

export default App;
