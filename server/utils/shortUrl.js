function hexToBase62(hexString) {
  const base62Chars =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let decimalValue = BigInt("0x" + hexString);
  let base62String = "";

  while (decimalValue > 0) {
    const remainder = decimalValue % 62n;
    base62String = base62Chars[Number(remainder)] + base62String;
    decimalValue = decimalValue / 62n;
  }

  return base62String || "0";
}

module.exports = { hexToBase62 };
