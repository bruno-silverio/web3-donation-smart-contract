import Web3 from "web3";
import ABI from "./ABI.json";

const CONTRACT_ADDRESS = "0x7A2D9023076772A348b7E366Bb7260ad53d58927";

type RequestType = {
  id: number;
  title: string;
  description: string;
  contact: string;
  goal: number;
};

export async function doLogin() {
  if (!window.ethereum) throw new Error("Sem MetaMask instalada!");

  const web3 = new Web3(window.ethereum);
  const accounts = await web3.eth.requestAccounts();
  if (!accounts || !accounts.length) throw new Error("Carteira não permitida!");

  localStorage.setItem("wallet", accounts[0].toLowerCase());
  return accounts[0];
}

function getContract() {
  if (!window.ethereum) throw new Error("Sem MetaMask instalada!");

  const from = localStorage.getItem("wallet");
  if (!from) throw new Error("No wallet found in local storage!");

  const web3 = new Web3(window.ethereum);

  return new web3.eth.Contract(ABI, CONTRACT_ADDRESS, { from });
}

export async function getOpenRequests(lastId = 0): Promise<RequestType[]> {
  const contract = getContract();
  const requests: RequestType[] = await contract.methods.getOpenRequests(lastId + 1, 10).call();

  // Garantir que requests seja um array antes de chamar filter
  return (requests ?? []).filter((rq: RequestType) => rq.title !== "");
}

type OpenRequestParams = {
  title: string;
  description: string;
  contact: string;
  goal: string;
};

export async function openRequest({ title, description, contact, goal }: OpenRequestParams) {
  const contract = getContract();
  return contract.methods.openRequest(title, description, contact, Web3.utils.toWei(goal, "ether")).send();
}

export async function closeRequest(id: number) {
  const contract = getContract();
  return contract.methods.closeRequest(id).send();
}

export async function donate(id: number, donationInBnb: number) {
  const contract = getContract();
  return contract.methods.donate(id).send({
    value: Web3.utils.toWei(donationInBnb, "ether")
  });
}