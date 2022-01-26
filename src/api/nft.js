const BASE_URL = process.env.REACT_APP_BASE_URL;
const fetchAll = async (address) => {
  const results = await fetch(`${BASE_URL}nft/balance?address=${address}`);
  return results.json();
};

const get = async (address, token_id, chain) => {
  const results = await fetch(`${BASE_URL}nft/metadata?address=${address}&token_id=${token_id}&chain=${chain}`);
  return results.json();
}
const nft = {
  fetchAll,
  get
};

export default nft;
