function generateOrderId() {
  const timestamp = Date.now()
    .toString(36)
    .toUpperCase()
    .padStart(6, '0')
    .slice(-6);
  const randomSuffix = String(Math.floor(Math.random() * 1000)).padStart(
    3,
    '0'
  );
  return `ORD${timestamp}${randomSuffix}`;
}

export default generateOrderId;
