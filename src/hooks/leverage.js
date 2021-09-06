import { ref } from "vue";
import { ethers, Contract } from "ethers";
import leveragerAbi from './leverager-abi.json'

export function useLeverage({ account, getProvider, getSigner }) {
  let usdcContract = null;
  let leveragerContract = null;
  function getUsdcContract() {
    if (!usdcContract) {
      usdcContract = new Contract(
        "0x04068da6c83afcfa0e13ba15a6696662335d5b75",
        ["function balanceOf(address owner) view returns (uint balance)"],
        getProvider()
      );
    }
    return usdcContract;
  }

  function getLeveragerContract() {
    if (!leveragerContract) {
      leveragerContract = new Contract(
        "0x8Cb11D692bdC1720B3e346c856BA74201bAb38Bc",
        leveragerAbi,
        getSigner()
      );
    }
    return leveragerContract;
  }

  // optimistically load saved position
  const positionAddress = ref(localStorage.getItem("position"));

  async function initialisePosition() {
    await getLeveragerContract().initialisePosition();

    // get usdc balance
    // usdcBalance.value = Number(await usdcContract.balanceOf(account.value)) / 1e6;
    // console.log({ usdcBalance: usdcBalance.value });
    try {
      positionAddress.value = await getLeveragerContract().getPositionAddress(
        account.value
      );
    } catch {
      positionAddress.value = await getLeveragerContract().getPositionAddress(
        account.value
      );
    }
    localStorage.setItem("position", positionAddress.value);
  }

  async function getPositionAddress() {
    positionAddress.value = await getLeveragerContract().getPositionAddress(
      account.value
    );
    localStorage.setItem("position", positionAddress.value);
  }

  async function getPositionInfo(loops, slippage = 1, collatRatio = 70) {
    console.log({
      loops: loops.toString(),
      slippage: (slippage * 10 ** 16).toString(),
      collatRatio: (collatRatio * 10 ** 16).toString(),
    });
    return await getLeveragerContract().getPositionInfo(
      loops.toString(),
      (slippage * 10 ** 16).toString(),
      (collatRatio * 10 ** 16).toString()
    );
  }

  return {
    initialisePosition,
    getPositionAddress,
    getPositionInfo,
    positionAddress,
  };
}
