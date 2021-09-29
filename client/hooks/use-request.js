import { useState } from "react";
import axios from "axios";

export default ({ url, method, body,onSuccess })=>{
  const [errors, setErrors] = useState(null);

  const doRequest = async()=> {
    try {
      const response = await axios[method](
        url,
        body
      );
      if(onSuccess){
        onSuccess();
      }
      return response.data;
    } catch (error) {
      setErrors(
        <div className="alert alert-danger">
            <h4>oops..</h4>
            <ul className="my-0">
              {error.response?.data.errors.map(err=> (
                <li key={err.message }>{err.message}</li>
              ))}
            </ul>
        </div>
      )
    }
  }
  return { doRequest, errors };
}