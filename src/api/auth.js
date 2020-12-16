import API from './api';

export async function signIn(username, password) {
  return (
    API.post('/login', { username, password })
       .then((response) => {
          const { token, token_type, expires_in } = response.data;

          const user = {
            isOk: true,
            data: { email: '', avatarUrl: '' },
            token,
            token_type,
            expires_in
          }

          localStorage.setItem('user', JSON.stringify(user));
        
          return user;
       },
        () => {
          return {
            isOk: false,
            message: "Authentication failed"
          };
       })
  )
}

export async function getUser() {
  const user = JSON.parse(localStorage.getItem('user'));

  if(user && user.token) {
    return user;
  }
  else {
    return {
      isOk: false
    };
  }
}

export async function createAccount(email, password) {
  try {
    // Send request
    console.log(email, password);

    return {
      isOk: true
    };
  }
  catch {
    return {
      isOk: false,
      message: "Failed to create account"
    };
  }
}

export async function changePassword(email, recoveryCode) {
  try {
    // Send request
    console.log(email, recoveryCode);

    return {
      isOk: true
    };
  }
  catch {
    return {
      isOk: false,
      message: "Failed to change password"
    }
  }
}

export async function resetPassword(email) {
  try {
    // Send request
    console.log(email);

    return {
      isOk: true
    };
  }
  catch {
    return {
      isOk: false,
      message: "Failed to reset password"
    };
  }
}
