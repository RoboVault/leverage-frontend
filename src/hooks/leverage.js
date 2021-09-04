import { ref } from "vue";
import { ethers, Contract } from "ethers";

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
        [
          "function initialisePosition() returns (address)",
          "function getPositionAddress(address addr) view returns (address)",
          "function maxLeverageWithLoops(uint256 _nLoops, uint256 _slippage) view returns (uint256)",
          // "function getPositionInfo(uint256 _nLoops, uint256 _slippage, uint256 _collatRatio) view returns (PositionInfo memory)",
        ],
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

  return {
    initialisePosition,
    getPositionAddress,
    positionAddress,
  };
}
