function getAPIAddress() {
  if (process.env.NODE_ENV === 'production') {
    return '';
  } else {
    return 'http://0.0.0.0:3000';
  }
}

const api = getAPIAddress();

export {api};