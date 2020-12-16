import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { getUser, signIn as sendSignInRequest } from '../api/auth';
import { getProfile } from '../api/profile';

function AuthProvider(props) {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async function () {
      const result = await getUser();
      if (result.isOk) {
        setUser(result.data);
      }

      setLoading(false);
    })();
  }, []);

  const signIn = useCallback(async (username, password) => {
    const result = await sendSignInRequest(username, password);
    const defaultAvatarUrl = 'https://freesvg.org/img/abstract-user-flat-4.png';
    
    if (result.isOk) {
      getProfile().then((profile) => {
        let user = result;
        let data = profile.user;

        if(!profile.user.avatarUrl) {
          data.avatarUrl = defaultAvatarUrl;
        }

        user.data = data;
        setUser(data);
        localStorage.setItem('user', JSON.stringify(user));
      })
    }

    return result;
  }, []);

  const signOut = useCallback(() => {
    localStorage.clear();
    setUser();
  }, []);


  return (
    <AuthContext.Provider value={{ user, signIn, signOut, loading }} {...props} />
  );
}

const AuthContext = createContext({});
const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth }
