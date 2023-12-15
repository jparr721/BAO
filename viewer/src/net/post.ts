/* eslint-disable @typescript-eslint/no-explicit-any */
const post = async <
  In extends Record<string, any>,
  Out extends Record<string, any>
>(
  endpoint: string,
  body: In
): Promise<Out> => {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
};

export default post;
