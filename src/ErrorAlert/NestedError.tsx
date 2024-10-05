import get from "lodash/get";

const getNestedError = (errors: unknown, name: string) => {
  return get(errors, name)?.message;
};
export default getNestedError;
