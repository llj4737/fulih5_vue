export const isEmpty = obj => {
  if (typeof obj !== 'object' || obj === null) throw new TypeError('params must be object');
  if (Array.isArray(obj)) return obj.length === 0;
  return Object.keys(obj).length ? true : false;
}

