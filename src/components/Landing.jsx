import React, { useState } from "react";
import { Input, Button, Select, Image, List } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import api from "api";

export default function Landing({ isServerInfo }) {
  const { Option } = Select;
  const menuItems = [
    {
      key: "0x1",
      value: "Ethereum",
    },
    {
      key: "0x2a",
      value: "Kovan Testnet",
    },

    {
      key: "0x89",
      value: "Polygon",
    },

    {
      key: "0x13881",
      value: "Matic Mumbai",
    },
    {
      key: "0xa86a",
      value: "Avalanche",
    },
    {
      key: "0xa869",
      value: "Fuji",
    },
  ];

  const initialState = {
    address: "",
    token_id: "",
    chain: "0x1",
  };
  const [values, setValues] = useState(initialState);
  const [nftData, setNftData] = useState();

  const handleSelect = (value) => {
    setValues({ ...values, chain: value });
  };
  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api.nft.get(values.address, values.token_id, values.chain).then((res) => {
      if (res.metadata && typeof(res.metadata) === 'string') {
        res.metadata = JSON.parse(res.metadata);
      }
      console.log(res);
      setNftData(res);
    });
  };

  return (
    <div style={{ width: "70%" }}>
      <div style={{ display: "flex", gap: "10px" }}>
        <Input.Group compact>
          <Select
            style={{ width: "20%" }}
            name="chain"
            value={values.chain}
            onChange={handleSelect}
          >
            {menuItems.map((item) => (
              <Option key={item.key} value={item.key}>
                {item.value}
              </Option>
            ))}
          </Select>
          <Input
            value={values.address}
            style={{ width: "40%" }}
            placeholder="NFT address here"
            name="address"
            onChange={handleChange}
          />
          <Input
            value={values.token_id}
            style={{ width: "calc(40% - 10vw)" }}
            placeholder="Token ID here"
            name="token_id"
            onChange={handleChange}
          />
          <Button
            style={{ width: "10vw" }}
            type="primary"
            onClick={handleSubmit}
          >
            Search <SearchOutlined />{" "}
          </Button>
        </Input.Group>
      </div>
      <div
        style={{
          display: nftData ? "flex" : "none",
          flexDirection: "row",
          gap: "50px",
          marginTop: "40px",
          marginBottom: "10px",
        }}
      >
        <Image
          src={nftData?.metadata?.image}
          style={{ height: "450px", width: "500px" }}
          preview={false}
        />
        <List title="NFT info">
          <List.Item label="Name">
            <b>Name:</b>{" "}
            {nftData?.name}
          </List.Item>
          <List.Item label="Symbol">
            <b>Symbol:</b> {nftData?.symbol}
          </List.Item>
          <List.Item label="Block Height">
            <b>Block Height:</b> {nftData?.block_number}
          </List.Item>
          <List.Item label="Creator">
            <b>Creator:</b> <Link to={"/profile/"+nftData?.owner_of}>{nftData?.owner_of}</Link>
          </List.Item>
          <List.Item label="Report">
            <Button type="danger">Report</Button>
          </List.Item>
        </List>
      </div>
    </div>
  );
}
