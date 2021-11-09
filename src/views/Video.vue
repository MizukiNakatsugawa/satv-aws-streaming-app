<template>
    <div>
        <VideoPlayer :options="videoOptions"/>
    </div>
</template>

<script>
import VideoPlayer from '../components/player.vue';
import 'video.js/dist/video-js.css';

export default {
  name: 'VideoExample',
  components: {
    VideoPlayer,
  },
  data() {
    return {
      videoOptions: {
        autoplay: true,
        controls: true,
        sources: [
          {
            src: '../src/assets/video.mp4',
            type: 'video/mp4',
          },
        ],
      },
    };
  },
};
