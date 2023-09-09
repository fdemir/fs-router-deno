export const paramsToObject = (params: [string, string][]) => {
  const result = {};
  for (const [key, value] of params) {
    // @ts-ignore
    result[key] = value;
  }
  return result;
};
