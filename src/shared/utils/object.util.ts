export const deleteKey = (obj: any) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === null || obj[key] === undefined || !obj[key]) {
      delete obj[key];
    }
  });
};

export const sortObject = (obj: any): any => {
  const sorted: Record<string, string> = {};
  const str: string[] = [];
  let key: number | string;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
  }
  return sorted;
};
