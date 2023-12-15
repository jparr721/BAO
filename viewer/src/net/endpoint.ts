const endpoint = (...path: string[]) =>
  "http://" + import.meta.env.VITE_API_HOST + "/" + path.join("/");

export default endpoint;
