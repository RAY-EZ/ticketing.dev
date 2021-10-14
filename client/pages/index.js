import buildClient from '../api/build-client';

const LandingPage = ({ currentUser }) => {
  // console.log(currentUser);
  return (currentUser? <h1>You are signed in</h1>: <h1>Landing Page...</h1>)

}

LandingPage.getInitialProps = async (context)=>{
  const {data } = await buildClient(context).get('/api/users/currentuser');
  // console.log(data);
  return data;
}

export default LandingPage;