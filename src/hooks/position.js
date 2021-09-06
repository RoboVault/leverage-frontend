import { ethers, Contract, BigNumber } from "ethers";
export function usePosition({ positionAddress, getProvider, getSigner }) {
  let positionContract = null;
  function getPositionContract() {
    if (!positionContract) {
      positionContract = new Contract(
        positionAddress.value,
        [
          "function openLong(uint256 _quoteAmount, uint256 _nLoops, uint256 _slippage, uint256 _collatRatio)",
          // "function close(uint256 _slippage, uint256 _maxLoops)",
          // "function deleverageLoop(uint256 _slippage)",
          // "function depositCollateral(uint256 _quoteAmount, uint256 _slippage)",
          // "function getCollateral() view returns (uint256)",
          // "function getProfit() view returns (int256)",
          // "function closeAndWithdraw(uint256 _slippage, uint256 _maxLoops)",
          // "function closeAndWithdrawBase(uint256 _slippage, uint256 _maxLoops)",
          // "function getPrice() view returns (uint256)",
        ],
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
