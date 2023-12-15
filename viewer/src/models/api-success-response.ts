export default interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}
