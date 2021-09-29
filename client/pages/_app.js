import 'bootstrap/dist/css/bootstrap.css'
import buildClient from '../api/build-client';
import Header from '../components/header';

const AppComponent = ({ Component, pageProps, currentUser })=>{
  console.log(currentUser);
  return (<div>
    <Header currentUser={currentUser}/>
    <Component {...pageProps} />
  </div>)
};
// App context differs from regular context 
// appcontext = { ctx: { req }, componenet: {}, ...} 
AppComponent.getInitialProps = async (appContext)=>{
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');
  let pageProps;
  if(appContext.Component.getInitialProps){
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }
  
  return {
    pageProps,
    ...data
  }
}

export default AppComponent;