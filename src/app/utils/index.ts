export const calculateNumericValue = (percentValue: number, absoluteValue: number) =>
  percentValue * absoluteValue / 100;

export const calculatePercentValue = (numericValue: number, absoluteValue: number) =>
  numericValue * 100 / absoluteValue;

export const getNumericSize = (size: string) => Number(size.split('px')[0]);

interface fetchParametrs {
  url: string
  method: 'GET' | 'POST' | 'PUT'
  token?: string
  body?: object
}

export const fetchRequest = async ({ url, method, token, body }: fetchParametrs) => {
  const api = process.env.NEXT_PUBLIC_API_URL;
  if (api === undefined) throw Error('Failed to get API URL');
  const response = await fetch(`${api}${url}`, {
    method,
    headers: {
      ...(token !== undefined) && { Authorization: `Bearer ${token}` },
      ...(body !== undefined) && { 'Content-Type': 'application/json; charset=utf-8' },
    },
    ...(body !== undefined) && { body: JSON.stringify(body) },
  });
  return await response.json();
};
