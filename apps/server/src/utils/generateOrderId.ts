function generateOrderId() {
  const yearMonth =
    (new Date().getFullYear() % 100).toString(36) +
    (new Date().getMonth() + 1).toString(36).padStart(1, '0');

  const hourMinutes = (new Date().getHours() * 100 + new Date().getMinutes())
    .toString(36)
    .padStart(2, '0');

  const msWithinMinute = (Date.now() % 1000).toString(36).padStart(2, '0');

  const randomPart = Math.floor(Math.random() * 36).toString(36);

  const prefix = 'ORD';

  return `${prefix}${yearMonth}${hourMinutes}${msWithinMinute}${randomPart}`.toUpperCase();
}

export default generateOrderId;
