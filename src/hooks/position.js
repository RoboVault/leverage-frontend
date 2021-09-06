import { ethers, Contract, BigNumber } from "ethers";
import positionAbi from './position-abi.json'
export function usePosition({ positionAddress, getProvider, getSigner }) {
  let positionContract = null;
  function getPositionContract() {
    if (!positionContract) {
      positionContract = new Contract(
        positionAddress.value,
        positionAbi,
        getSigner()
      );
    }
    return positionContract;
  }

  async function openLong(quoteAmount, loops, slippage = 1, collatRatio = 70) {
    console.log({
      quoteAmount: (quoteAmount * 1e6).toString(),
      loops: loops.toString(),
      slippage: (slippage * 10 ** 16).toString(),
      collatRatio: (collatRatio * 10 ** 16).toString(),
    });
    return await getPositionContract().openLong(
      (quoteAmount * 1e6).toString(),
      loops.toString(),
      (slippage * 10 ** 16).toString(),
      (collatRatio * 10 ** 16).toString()
    );
  }

  return {
    openLong,
  };
}
