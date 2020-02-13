import React, { useContext } from 'react';
import { GraphQLClient } from 'graphql-request';
import { GoogleLogin } from 'react-google-login';
import { withStyles } from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";

import Context from '../../context';

const MeQuery = `
{
  me {
    _id
    name
    email
    picture
  }
}`;

const Login = ({ classes }) => {
  const { dispatch } = useContext(Context);
  const onSuccess = async googleUser => {
    try {
    const idToken = googleUser.getAuthResponse().id_token;
    const client = new GraphQLClient('http://localhost:4000/graphql', {
      headers: { authorization: idToken }
    });
    const data = await client.request(MeQuery);
    // console.log({ data });
    dispatch({ type: 'LOGIN_USER', payload: data.me });
  } catch (err) {
    onFailure()
  }
}
  const onFailure = err => {
    console.error("Error logging in ", err);
  }

  return (
    <div className={classes.root}>
      <Typography
        component="h1"
        variant="h3"
        gutterBottom
        noWrap
        style={{ color: "rgb(66, 133, 244)" }}
      >
        Welcome
      </Typography>
    <GoogleLogin
      clientId='1076782752033-2knkv8b9tk47s5ddobsv8rrdekt4v4fq.apps.googleusercontent.com'
      onSuccess={onSuccess}
      isSignedIn={true}
      onFailure={onFailure}
      theme="dark"
    />
    </div>
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
