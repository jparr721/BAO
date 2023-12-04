export async function runSimulation() {
  console.log("http://" + import.meta.env.VITE_API_HOST + "/sim");
  const response = await fetch(
    "http://" + import.meta.env.VITE_API_HOST + "/sim",
    {
      method: "POST",
    }
  );

  return response.json();
}
