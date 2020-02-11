import React from 'react';
import { GraphQLClient } from 'graphql-request'; 
import { GoogleLogin } from 'react-google-login';
import { withStyles } from '@material-ui/core/styles';
// import Typography from "@material-ui/core/Typography";

const MeQuery = `
{
  me {
    _id
    name
    email
    picture
  }
}`

const Login = ({ classes }) => {
  const onSuccess = async googleUser => {
    const idToken = googleUser.getAuthResponse().id_token;
    const client = new GraphQLClient('http://localhost:4000/graphql', {
      headers: { authorization: idToken }
    })
    const data = await client.request(MeQuery)
    console.log({ data })
  }
  return (
    <GoogleLogin
      clientId='1076782752033-2knkv8b9tk47s5ddobsv8rrdekt4v4fq.apps.googleusercontent.com'
      onSuccess={onSuccess}
      isSignedIn={true}
    />
  );
};

const styles = {
  root: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center'
  }
};

export default withStyles(styles)(Login);
