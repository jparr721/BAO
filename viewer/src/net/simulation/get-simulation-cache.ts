import ApiSuccessResponse from "../../models/api-success-response";
import GetSimulationCacheResponse from "../../models/simulation/get-simulation-cache-success-response.type";
import endpoint from "../endpoint";
import get from "../get";

const getSimulationCache = (): Promise<
  ApiSuccessResponse<GetSimulationCacheResponse>
> => {
  return get<ApiSuccessResponse<GetSimulationCacheResponse>>(
    endpoint("sim", "simulation-cache")
  );
};
export default getSimulationCache;
