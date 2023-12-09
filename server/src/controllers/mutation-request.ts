import { Request } from "express";

export default interface MutationRequest<Body> extends Request {
  body: Body;
}
