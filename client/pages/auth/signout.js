import Router from 'next/router';
import { useEffect } from 'react';
import useRequest from '../../hooks/use-request'

export default ()=> {
  
  const {doRequest, errors} = useRequest({
    url: '/api/users/signout',
    method: 'post',
    onSuccess: ()=> {
      setTimeout(()=>Router.push('/') , 1000)
      
    }
  })

  useEffect(async ()=>{
    await doRequest();
  },[])

  return (
    <div>
      Signed out successfully
    </div>
  );
}