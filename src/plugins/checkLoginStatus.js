import { onAuthUIStateChange } from '@aws-amplify/ui-components';

function checkStatus() {
  const state = onAuthUIStateChange((authState, authData) => {
    console.log('checkLoginStatus:', authState);
    console.log('checkLoginStatus:', authData);
    return authState;
  });
  return state;
}

export default { checkStatus };
