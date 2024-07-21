import { sendRequest } from "./requestSender";

export const register =async(data)=>{
    const res = await sendRequest({
        endpoint:`user/create-user`,
        method:"POST",
        data
      });
      return res;
}

export const loginUser =async(data)=>{
    const res = await sendRequest({
        endpoint:`user/login-user`,
        method:"POST",
        data
      });
      return res;
}

export const getAllUser =async(data)=>{
    const res = await sendRequest({
        endpoint:`user/get-users`,
      });
      return res;
}