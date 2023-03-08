import React from 'react';
import { Cookies } from 'meteor/ostrio:cookies';
import { Auth } from './Auth';
import { Space } from './Space';

const cookie = new Cookies();

export const App = () => {
  this.state = {
    login: false
  }
  if(cookie.has('user') || cookie.has('admin')) {
    return <Space/>
  } else {
    return <Auth/>
  }
};

