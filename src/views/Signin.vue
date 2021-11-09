<template>
    <v-container>
        <!-- <h3>user : {{ user }}</h3> -->
        <!-- <h3>authState : {{ authState }}</h3> -->

        <div class="d-flex justify-center ma-6" v-if="authState === 'signedin' && user">
          <v-btn
          @click="toVideo"
          >配信画面</v-btn>
        </div>

          <amplify-auth-container v-if="authState !== 'signedin'">
            <amplify-authenticator username-alias="email">

                <!-- <amplify-sign-up
                  header-text="アカウント新規登録"
                  slot="sign-up"
                  username-alias="email"
                  :formFields.prop="formFields"
                ></amplify-sign-up> -->
                <amplify-sign-in
                  header-text="サインイン画面"
                  slot="sign-in"
                  username-alias="email"
                  hide-sign-up
                ></amplify-sign-in>
                <!-- <amplify-confirm-sign-up
                  header-text="My Custom Confirm Sign Up Text"
                  slot="confirm-sign-up"
                ></amplify-confirm-sign-up> -->
            </amplify-authenticator>
          </amplify-auth-container>
          <amplify-sign-out v-if="authState === 'signedin' && user" button-text="サインアウト">
          </amplify-sign-out>
    </v-container>
</template>

<script>
import { onAuthUIStateChange } from '@aws-amplify/ui-components';
// import { Auth } from '@aws-amplify/auth';
// import { AmplifyEventBus } from 'aws-amplify-vue';
// import { Auth } from 'aws-amplify';

export default {
  name: 'AuthStateApp',
  created() {
    this.unsubscribeAuth = onAuthUIStateChange((authState, authData) => {
      this.authState = authState;
      this.user = authData;
      console.log(authData);
    });
  },
  data() {
    return {
      user: undefined,
      authState: undefined,
      unsubscribeAuth: undefined,
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
        // {
        //   type: 'phone_number',
        //   label: '電話番号',
        //   placeholder: 'Custom phone placeholder',
        // },
      ],
    };
  },
  methods: {
    toVideo() {
      this.$router.push({ path: 'video' });
    },
  },
  beforeDestroy() {
    this.unsubscribeAuth();
  },
};
</script>
