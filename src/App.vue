<template>
  <v-app>
    <v-container>
          <amplify-auth-container>
            <amplify-authenticator username-alias="email">
               <amplify-sign-in
                  header-text="サインイン画面"
                  slot="sign-in"
                ></amplify-sign-in>
                <amplify-sign-up
                  header-text="アカウント新規登録"
                  slot="sign-up"
                  username-alias="email"
                  :formFields="formFields"
                ></amplify-sign-up>
            </amplify-authenticator>
          </amplify-auth-container>
    </v-container>
  </v-app>
</template>

<script>
import { onAuthUIStateChange } from '@aws-amplify/ui-components';
// import { Auth } from '@aws-amplify/auth';
// import { AmplifyEventBus } from 'aws-amplify-vue';
import { Auth } from 'aws-amplify';

export default {
  name: 'AuthStateApp',
  created() {
    this.unsubscribeAuth = onAuthUIStateChange((authState, authData) => {
      this.authState = authState;
      this.user = authData;
    });
  },
  // async beforeCreate() {
  //   try {
  //     this.user = await Auth.currentAuthenticatedUser();
  //     this.signedIn = true;
  //   } catch (err) {
  //     this.signedIn = false;
  //   }
  //   // 認証ステータスが変わった時に呼び出されるイベントを登録
  //   AmplifyEventBus.$on('authState', async (info) => {
  //     if (info === 'signedIn') {
  //       this.signedIn = true;
  //       this.user = await Auth.currentAuthenticatedUser();
  //     } else {
  //       this.signedIn = false;
  //       this.user = undefined;
  //     }
  //   });
  // },
  data() {
    return {
      formFields: [
        {
          type: 'email',
          label: 'メールアドレス',
          placeholder: 'Custom email placeholder',
          inputProps: { required: true, autocomplete: 'username' },
        },
        {
          type: 'password',
          label: 'パスワード',
          placeholder: 'Custom password placeholder',
          inputProps: { required: true, autocomplete: 'new-password' },
        },
        {
          type: 'phone_number',
          label: '電話番号',
          placeholder: 'Custom phone placeholder',
        },
      ],
    };
  },
  methods: {
    async signUp(username, password, email) {
      try {
        const user = await Auth.signUp({
          username,
          password,
          attributes: {
            email,
          },
        });

        console.log(user);
      } catch (error) {
        console.log(error);
      }
    },

  },
  beforeDestroy() {
    return onAuthUIStateChange;
  },
};
</script>
