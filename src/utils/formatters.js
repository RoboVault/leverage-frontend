const _currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
const _numberFormatter = new Intl.NumberFormat("en-US", {
  maximumSignificantDigits: 4,
  minimumSignificantDigits: 2,
});

export const currency = (num) => _currencyFormatter.format(num);
export const number = (num) => _numberFormatter.format(num);
