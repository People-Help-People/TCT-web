const BASE_URL = process.env.REACT_APP_BASE_URL;
const fetchAll = async (address) => {
  const results = await fetch(`${BASE_URL}nft/mynft?address=${address}`);
  return results;
};
const nft = {
  fetchAll,
};

export default nft;
