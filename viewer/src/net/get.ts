const get = <T>(endpoint: string): Promise<T> =>
  fetch(endpoint).then((res) => res.json());
export default get;
