<template>
  <Layout class="home">
    <Content>
      <Row>
        <i-col class="l-left" span="16">
          <canvas id="singlecanvas" :height="size.height" :width="size.width"></canvas>
          <div class="size">
            <Input v-model="value2" placeholder="宽" style="width: 100px" />
            <Input v-model="value1" placeholder="高" style="width: 100px" />
            <Button type="warning" @click="setSize">确认</Button>
          </div>
          <div class="button">
            <span>{{time}}</span>
            <Button @click="start" type="info">开始录制</Button>
            <Button @click="stop" type="warning">结束录制</Button>
            <Button @click="dowload" type="success">下载</Button>
          </div>
        </i-col>
        <i-col class="l-right" span="8">
          <div>
            <span>请选择颜色</span>
            <ColorPicker v-model="color" alpha />
          </div>
        </i-col>
      </Row>
    </Content>
  </Layout>
</template>

<script>
import RecordingCanvas from "../tool/single";
export default {
  components: {},
  data() {
    return {
      size: {
        height: "480",
        width: "720"
      }, //画布大小
      value1: "", //输入宽高
      value2: "",
      color: "rgba(235,230,138,0.5)", //画布背景色
      dataBarrage: {
        value: "使用的是静态死数据",
        color: "blue",
        range: [0, 0.5]
      }, //模拟数据
      canvas: null, //实例方法
      time: "00:00", //显示时间
      seconds: 0, //录制秒数
      isStart: false, //是否开始录制
      updateTime: null //计时器
    };
  },
  methods: {
    // 调整大小
    setSize() {
      this.$set(this.size, "height", this.value1);
      this.$set(this.size, "width", this.value2);
    },
    // 开始录制
    start() {
      if (this.isStart) {
        return;
      }
      this.isStart = true;
      this.seconds = 0;
      this.startTime();
      this.canvas.startRecording(500);
    },
    // 停止录制
    stop() {
      if (!this.isStart) {
        return;
      }
      this.isStart = false;
      this.clearSet();
      this.canvas.stopRecording();
    },
    // 下载
    dowload() {
      if (this.canvas.allChunks.length == 0) {
        return;
      }
      this.canvas.blobDownload();
    },
    // 计时器控制
    startTime() {
      this.updateTime = setInterval(() => {
        this.seconds++;
      }, 1000);
    },
    clearSet() {
      clearInterval(this.updateTime);
    }
  },
  watch: {
    color() {
      this.canvas.bgcolor = this.color;
    },
    seconds() {
      let ge = this.seconds % 60;
      let shi = (this.seconds - ge) / 60;
      this.time =
        (shi >= 10 ? shi : "0" + shi) + ":" + (ge >= 10 ? ge : "0" + ge);
      if (this.seconds >= 3600) {
        this.stop;
      }
    }
  },
  mounted() {
    this.canvas = new RecordingCanvas(
      "#singlecanvas",
      this.dataBarrage,
      this.color
    );
    this.canvas.canvasBarrage(90);
  }
};
</script>
<style scoped>
.home {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
}
.l-left {
  /* background-color: antiquewhite; */
  height: 100%;
  text-align: center;
}
.l-right {
  height: 100%;
  /* background-color: aquamarine; */
}
#thecanvas {
  /* background: blueviolet; */
}
.size {
  margin-top: 10px;
  margin-bottom: 10px;
}
.button {
  line-height: 30px;
}
</style>