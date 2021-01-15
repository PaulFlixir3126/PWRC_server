import { isArray, isNullOrUndefined, isNumber, isObject, isString } from "util";

const checkIsObjectAndNotEmpty = (input: any) => {
  return isObject(input) && Object.keys(input).length > 0
};

const checkIsArrayAndNotEmpty = (input:any) =>{
   return (isArray(input) && input.length > 0)
}
const checkIsSet = (input: any) => {
  return !isNullOrUndefined(input)
};

const checkIsInputObjectContainsUnknownKeys = (arr1:any, arr2:any) => {
  let difference = arr1.filter((x:any) => !arr2.includes(x))
  return (isArray(difference) && difference.length > 0) ? true : false;
}

const includesIn = (value:any, arr:any) => {
  if (arr.includes(value)) {
    return true;
  }
  return false;
};

let checkall = (arr:any, target:any) => target.every((v:any) => arr.includes(v));

export {checkIsObjectAndNotEmpty,checkIsArrayAndNotEmpty, checkIsSet, checkIsInputObjectContainsUnknownKeys,includesIn,checkall};
