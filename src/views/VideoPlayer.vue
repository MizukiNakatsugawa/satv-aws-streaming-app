<template>
    <v-container>
      <div class="d-flex justify-center ma-10">
        <video id="video-player" width="100%" height="100%" autoplay controls playsinline></video>
      </div>
        <amplify-sign-out @click="toSignin" button-text="サインアウト">
        </amplify-sign-out>
    </v-container>
</template>

<script>
// import { IVSPlayer } from 'amazon-ivs-player';
// import videojs from 'video.js';

export default {
  data() {
    return {
      IVSPlayer: window.IVSPlayer.create(),
      url: 'https://824b8153c02e.us-west-2.playback.live-video.net/api/video/v1/us-west-2.673176866211.channel.Lynro7cjvFO8.m3u8?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzM4NCJ9.eyJhd3M6Y2hhbm5lbC1hcm4iOiJhcm46YXdzOml2czp1cy13ZXN0LTI6NjczMTc2ODY2MjExOmNoYW5uZWwvTHlucm83Y2p2Rk84IiwiYXdzOmFjY2Vzcy1jb250cm9sLWFsbG93LW9yaWdpbiI6Imh0dHA6Ly9zdGF0aWMtd2Vic2l0ZS10ZXN0LTAwMDEuczMtd2Vic2l0ZS1hcC1ub3J0aGVhc3QtMS5hbWF6b25hd3MuY29tIiwiZXhwIjoxNjM2NjcwMjk5fQ.JRguHRlU993MnFWLmIPKCdd6n25OGiqkm8P_DQmmohkdI7KKrnaWugH1MaLK7QYG3rEaJFDBWubCfo4vCJzjkl2mvjMOnWltsLRvuAz8ShkhIsypP3KWMsc6msnSVqRL',
    };
  },
  mounted() {
    const player = this.IVSPlayer;
    player.attachHTMLVideoElement(document.getElementById('video-player'));
    player.load(this.url);
  },
  methods: {
    toSignin() {
      this.$router.push('/');
    },
  },
};
</script>
