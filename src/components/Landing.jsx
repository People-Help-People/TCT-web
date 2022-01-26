import React, { useState } from "react";
import { Input, Button, Select, Image, List } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";

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
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}nft/metadata?address=${values.address}&chain=${values.chain}&token_id=${values.token_id}`
      )
      .then((res) => {
        setNftData(res.data);
      })
      .catch((err) => {
        console.log();
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
          src={nftData?.data?.items[0]?.nft_data[0]?.external_data?.image}
          style={{ height: "450px", width: "500px" }}
        />
        <List title="NFT info">
          <List.Item label="Name">
            <b>Name:</b>{" "}
            {nftData?.data?.items[0]?.nft_data[0]?.external_data?.name}
          </List.Item>
          <List.Item label="Symbol">
            <b>Symbol:</b> {nftData?.data?.items[0]?.contract_ticker_symbol}
          </List.Item>
          <List.Item label="Block Height">
            <b>Block Height:</b> {nftData?.block_number}
          </List.Item>
          <List.Item label="Creator">
            <b>Creator:</b> <a href="/">{nftData?.owner_of}</a>
          </List.Item>
          <List.Item label="Report">
            <Button type="danger">Report</Button>
          </List.Item>
        </List>
      </div>
    </div>
  );
}
