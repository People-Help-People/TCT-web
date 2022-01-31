import { message,notification, Table, Image, Modal, Button, Statistic, Spin } from "antd";
import { useEffect, useState, useMemo } from "react";
import { useChain, useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import Moralis from "moralis";
import { uid } from "uid";
import { CheckCircleTwoTone, ThunderboltOutlined } from "@ant-design/icons";
import { ImgTwitter } from "assets";
import { useParams } from "react-router";
import { useAPIContract } from "hooks/useAPIContract";
import useMetaTransaction from "hooks/useMetaTransaction";
import useBiconomyContext from "hooks/useBiconomyContext";

import TCTContract from "contracts/TCT.json";
import TCT from "list/TCT.json";


export default function Profile(props) {
  let { address } = useParams();
  const { user, account, isWeb3Enabled, isAuthenticated, isWeb3EnableLoading } = useMoralis();
  const { chainId } = useChain();
  const { isBiconomyInitialized, biconomyProvider } = useBiconomyContext();
  const initialState = { address: "", signatureType: "" };
  const [vouchForm, setVouchForm] = useState(initialState);
  const [username, setUsername] = useState("Unknown");
  const [vouches, setVouches] = useState(0);
  const [updateToggle, setUpdateToggle] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tweetUID, setTweetUID] = useState("");
  const [tweetURL, setTweetURL] = useState("");
  const [twitterProfile, setTwitterProfile] = useState("");
  const [visitor, setVisitor] = useState(true); // to identify if the user is visiting his own profile or not

  const { contracame, abi } = TCTContract;
  const contractAddress = useMemo(() => TCT[chainId], [chainId]);

  const { runContractFunction, contractResponse, isLoading } = useAPIContract();

  const contractProcessor = useWeb3ExecuteFunction();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setLoading(false);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const { isMetatransactionProcessing, onSubmitMetaTransaction } = useMetaTransaction({
    input: vouchForm.address,
    transactionParams: {
      from: account,
      signatureType: biconomyProvider[vouchForm.signatureType],
    },
  });

  const onError = () => {
    notification.error({
      message: "transaction Fail",
      description:
        "Your transaction has failed. Please try again later.",
    });
  }

  const fetchTwitterAccount = async () => {
    runContractFunction({
      params: {
        chain: chainId,
        function_name: "getTwitterVerificationStatus",
        abi,
        address: contractAddress,
        params: {
          _account: address,
        },
      },
      onSuccess: (res) => { setTwitterProfile(res); fetchVouches(); },
      onError,
      onComplete: () => { },
    });
  };

  const verifyTweet = async () => {
    const tweetID = tweetURL.split("/")[5];
    let options = {
      contractAddress: process.env.REACT_APP_TCT_CONTRACT,
      functionName: "requestTwitterVerification",
      abi: [
        {
          inputs: [
            { internalType: "string", name: "_tweet", type: "string" },
            { internalType: "string", name: "_randid", type: "string" },
          ],
          name: "requestTwitterVerification",
          outputs: [
            { internalType: "bytes32", name: "requestId", type: "bytes32" },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      params: {
        _tweet: tweetID,
        _randid: tweetUID,
      },
      msgValue: 0,
    };
    setLoading(true);
    await contractProcessor.fetch({
      params: options,
      onComplete: (res) => {
        console.log("res", res);
        handleOk();
        message.success("Tweet Verification Requested");
      },
      onSuccess: (res) => {
        console.log("res", res);
      },
      onError: (err) => {
        console.log("err", err);
      },
    });
  };  

  const fetchVouches = async () => {    
    runContractFunction({
      params: {
        chain: chainId,
        function_name: "getVouches",
        abi,
        address: contractAddress,
        params: {
          _account: address,
        },
      },
      onSuccess: (res) => { setVouches(res); },
      onError,
      onComplete: () => { },
    });
  }

  // const vouchUserCall = async () => {
  //   onSubmitMetaTransaction({
  //     onConfirmation: (res) => {
  //       console.log(res);
  //     },
  //     onError: (res) => {        
  //       notification.error({
  //         message: "Metatransaction Fail",
  //         description:
  //           "Your metatransaction has failed. Please try again later.",
  //       });
  //     }
  //   });
  // }
  const vouchUserCall = async () => {
    let options = {
      contractAddress: contractAddress,
      functionName: "vouchUser",
      abi: abi,
      params: {
        _account: vouchForm.address,
      },
      msgValue: 0,
    };
    setLoading(true);
    await contractProcessor.fetch({
      params: options,
      onComplete: (res) => {
        console.log("res", res);
        setLoading(false);
        message.success("Vouched Successfully");
      },
      onSuccess: (res) => {
        console.log("res", res);
      },
      onError: (err) => {
        console.log("err", err);
        message.error("Vouch Failed");
      },
    });
  }
  
  const updateUsername = async (username) => {
    user.set("username", username);
    user.save().then(() => {
      message.success("Username updated successfully");
      setUpdateToggle(false);  
    });
  };

  const fetchUsername = async () => {    
    const results = await Moralis.Cloud.run("getUsername");
    const currentUser = results.find((user) => user.get("ethAddress") === address);
    if (currentUser) {
      setUsername(currentUser.get("username") || "Unknown");
    } else {
      message.error("Invalid user address or User Not registered in TCT!");
    }    
  };


  useEffect(() => {
    const checkExistingAccounts = async () => {
      await fetchTwitterAccount();    
      setVisitor(account !== address);
      await fetchUsername();
    };
    if (account && isWeb3Enabled) {      
      checkExistingAccounts();
    }
  }, [account,isWeb3Enabled,address]);

  useEffect(() => {
    // generate uid if not present in localstorage
    if (!localStorage.getItem("uid")) {
      const uidd = uid(20);
      setTweetUID(uidd);
      localStorage.setItem("uid", uidd);
    } else {
      setTweetUID(localStorage.getItem("uid"));
    }    
    setVouchForm({address: window.location.href.split("/").at(-1), signatureType: "PERSONAL_SIGN"});
  }, []);

  return (
    <div style={{ width: "70%" }}>
      <div
        className="header"
        style={{ fontSize: "20px", marginBottom: "40px", textAlign: "center" }}
      >        
        {visitor ? (<>          
          <h1 style={{ display: "inline", marginRight: "10px" }}>
          {username}
          </h1>
          <button onClick={vouchUserCall}>{loading ? <Spin/> :"Vouch"}</button>
        </>
        ) : updateToggle ? (
            <>              
            <h1 style={{ display: "inline", marginRight: "10px" }}>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </h1>
            <button onClick={() => updateUsername(username)}>Update</button>
          </>
        ) : (
          <>
            <h1 style={{ display: "inline", marginRight: "10px" }}>
              {username}
            </h1>
            <button onClick={() => setUpdateToggle(true)}>Edit</button>
          </>
        )}
        <Statistic title="Vouches" value={vouches} prefix={<ThunderboltOutlined />} style={{marginTop:"20px"}} />
      </div>
      <div className="body">
        <Table
          columns={[
            {
              title: "Platform",
              dataIndex: "platform",
              key: "platform",
            },
            {
              title: "Action",
              dataIndex: "action",
              key: "action",
            },
            {
              title: "Status",
              dataIndex: "status",
              key: "status",
            },
            {
              title: "Weightage",
              dataIndex: "weightage",
              key: "weightage",
            },
          ]}
          dataSource={[
            {
              platform: <Image preview={false} height="50px" width="50px" src={ImgTwitter} />,
              action:
                twitterProfile === "" ? (
                  visitor ? <Button disabled>Twitter</Button> : <Button onClick={showModal}>Twitter</Button>
                ) : (
                  <a href={"https://twitter.com/" + twitterProfile}>
                    {twitterProfile}
                  </a>
                ),
              status:
                twitterProfile === "" ? (
                  "Not verified"
                ) : (
                  <p>
                    Verified <CheckCircleTwoTone twoToneColor="#52c41a" />{" "}
                  </p>
                ),
              weightage: "100%",
            },
          ]}
          pagination={false}
        />
        <Modal
          title="Verify Twitter"
          visible={isModalVisible}
          onOk={verifyTweet}
          onCancel={handleCancel}
          okText="Verify"
          confirmLoading={loading}
        >
          <p>Make the following Tweet from your account</p>
          <br></br>
          <p
            style={{
              border: "1px solid gold",
              padding: "10px",
              textAlign: "center",
            }}
          >
            I'm verifying my account {tweetUID} on The Collective Truth.
          </p>
          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <input
              onChange={(e) => setTweetURL(e.target.value)}
              value={tweetURL}
              style={{ width: "80%" }}
              placeholder="Tweet URL goes here"
            />
          </div>
        </Modal>
      </div>
    </div>
  );
}
