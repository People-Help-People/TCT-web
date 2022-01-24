import React from "react";
import { Input, Button, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
export default function Landing({ isServerInfo }) {
  const { Option } = Select;
  const menuItems = [
    {
      key: "0x1",
      value: "Ethereum",
    },
    {
      key: "0x3",
      value: "Ropsten Testnet",
    },
    {
      key: "0x4",
      value: "Rinkeby Testnet",
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
      value: "Mumbai",
    },
  ];

  return (
    <div style={{width:"70%" }}>
      <div style={{ display: "flex", gap: "10px"}}>
        <Input.Group compact>
          <Select style={{ width: "20%" }} defaultValue="0x1">
            {menuItems.map((item) => (
              <Option key={item.key} value={item.key}>
                {item.value}  
              </Option>
            ))}
          </Select>
          <Input style={{ width: 'calc(80% - 10vw)' }} placeholder="NFT address here" />
          <Button style={{width:"10vw"}} type="primary">Search <SearchOutlined /> </Button>        
        </Input.Group>
      </div>
      <div>

      </div>
    </div>
  );
}
