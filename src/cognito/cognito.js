import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserAttribute,
} from 'amazon-cognito-identity-js';
import { Config, CognitoIdentityCredentials } from 'aws-sdk';
import store from '../store';

export default class Cognito {
  configure(config) {
    if (config.userPool) {
      this.userPool = config.userPool;
    } else {
      this.userPool = new CognitoUserPool({
        UserPoolId: config.UserPoolId,
        ClientId: config.ClientId,
      });
    }
    Config.region = config.region;
    Config.credentials = new CognitoIdentityCredentials({
      IdentityPoolId: config.IdentityPoolId,
    });
    this.options = config;
    this.currentUser = false;
  }

    static install = (Vue, options) => {
      Object.defineProperty(Vue.prototype, '$cognito', {
        // eslint-disable-next-line no-underscore-dangle
        get() { return this.$root._cognito; },
      });

      Vue.mixin({
        beforeCreate() {
          if (this.$options.cognito) {
            // eslint-disable-next-line no-underscore-dangle
            this._cognito = this.$options.cognito;
            // eslint-disable-next-line no-underscore-dangle
            this._cognito.configure(options);
          }
        },
      });
    }

    // サインアップ
    signUp(username, password) {
      const name = { Name: 'name', Value: username };
      const email = { Name: 'email', Value: username };
      const now = Math.floor(new Date().getTime() / 1000);
      const upatedAt = { Name: 'updated_at', Value: String(now) };

      const attributeList = [];
      attributeList.push(new CognitoUserAttribute(name));
      attributeList.push(new CognitoUserAttribute(email));
      attributeList.push(new CognitoUserAttribute(upatedAt));

      return new Promise((resolve, reject) => {
        this.userPool.signUp(username, password, attributeList, null, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    }

    // サインアップ時のコード認証
    confirmation(username, confirmationCode) {
      const userData = { Username: username, Pool: this.userPool };
      const cognitoUser = new CognitoUser(userData);
      return new Promise((resolve, reject) => {
        cognitoUser.confirmRegistration(confirmationCode, true, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    }

    // サインイン
    signin(username, password) {
      const userData = { Username: username, Pool: this.userPool };
      const cognitoUser = new CognitoUser(userData);
      const authenticationData = { Username: username, Password: password };
      const authenticationDetails = new AuthenticationDetails(authenticationData);
      return new Promise((resolve, reject) => {
        cognitoUser.authenticateUser(authenticationDetails, {
          onSuccess: (result) => {
            resolve(result);
          },
          onFailure: (err) => {
            reject(err);
          },
        });
      });
    }

    // サインアウト
    signout() {
      if (this.userPool.getCurrentUser()) {
        this.userPool.getCurrentUser().signOut();
      }
    }

    // 認証ずみかどうか
    isAuthenticated() {
      this.currentUser = this.userPool.getCurrentUser();
      return new Promise((resolve, reject) => {
        if (this.currentUser === null) { reject(this.currentUser); }
        this.currentUser.getSession((err, session) => {
          if (err) {
            reject(err);
          } else if (!session.isValid()) {
            reject(session);
          } else {
            resolve(session);
          }
        });
      });
    }

    // 属性の取得
    getAttribute() {
      return new Promise((resolve, reject) => {
        this.currentUser.getUserAttributes((err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    }

    // コードの再送
    resentCode() {
      return new Promise((resolve, reject) => {
        this.currentUser.getAttributeVerificationCode('email', {
          onSuccess: (result) => {
            console.log('success getAttributeVerificationCode');
            resolve(result);
          },
          onFailure: (err) => {
            console.log(`failed getAttributeVerificationCode: ${JSON.stringify(err)}`);
            reject(err);
          },
        });
      });
    }

    // Eメールアドレス変更後 emailを有効可する
    verifyAttribute(confirmationCode) {
      return new Promise((resolve, reject) => {
        this.currentUser.verifyAttribute('email', confirmationCode, {
          onSuccess: (result) => {
            console.log('email verification success');
            const { user } = store.getters;
            user.email_verified = 'true';
            store.commit('setUser', user);

            resolve(result);
          },
          onFailure: (err) => {
            console.log('email verification failed');
            reject(err);
          },
        });
      });
    }

    // Eメールアドレスの更新
    updateEmailAddress(email) {
      const attributes = {
        email,
        name: email,
      };
      return new Promise((resolve, reject) => {
        this.updateAttributes(attributes)
          .then(result => { // eslint-disable-line
            resolve(result);
            const { user } = store.getters;
            user.email_verified = 'false';
            store.commit('setUser', user);
          })
          .catch((err) => {
            reject(err);
          });
      });
    }

    // パスワード更新
    updatePassword(oldPassword, newPassword) {
      return new Promise((resolve, reject) => {
        this.currentUser.changePassword(oldPassword, newPassword, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    }

    // パスワード忘れメール送信
    forgetPassword(username) {
      const userData = { Username: username, Pool: this.userPool };
      const cognitoUser = new CognitoUser(userData);
      return new Promise((resolve, reject) => {
        cognitoUser.forgotPassword({
          onSuccess: (result) => {
            console.log('email verification success');
            resolve(result);
          },
          onFailure: (err) => {
            console.log('email verification failed');
            reject(err);
          },
        });
      });
    }

    // パスワードリセット
    resetPassword(username, newPassword, code) {
      const userData = { Username: username, Pool: this.userPool };
      const cognitoUser = new CognitoUser(userData);
      return new Promise((resolve, reject) => {
        cognitoUser.confirmPassword(code, newPassword, {
          onSuccess: (result) => {
            console.log('password reset success');
            resolve(result);
          },
          onFailure: (err) => {
            console.log('password reset failed');
            reject(err);
          },
        });
      });
    }

    // プロフィール更新
    updateAttributes(attributes) {
      const attributeList = [];
      for (const key in attributes) {
        const attribute = { Name: key, Value: attributes[key] };
        attributeList.push(new CognitoUserAttribute(attribute));
      }
      return new Promise((resolve, reject) => {
        if (this.currentUser === null) { reject(this.currentUser); }

        // update attributes
        this.currentUser.updateAttributes(attributeList, (err, result) => {
          if (err) {
            reject(err);
          } else {
            const { user } = store.getters;
            for (const key in attributes) {
              user[key] = attributes[key];
            }
            store.commit('setUser', user);
            resolve(result);
          }
        });
      });
    }
}
