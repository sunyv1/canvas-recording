<template>
  <Layout class="home">
    <Content>
      <Row>
        <i-col class="l-left" span="16">
          <canvas id="thecanvas" :height="size.height" :width="size.width"></canvas>
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
import RecordingCanvas from "../tool/recording";
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
      dataBarrage: [
        {
          value: "使用的是静态死数据",
          color: "blue",
          range: [0, 0.5]
        },
        {
          value: "随机循环播放",
          color: "blue",
          range: [0, 0.6]
        },
        {
          value: "可以控制区域和垂直分布范围",
          color: "blue",
          range: [0, 0.5]
        },
        {
          value: "字体大小和速度在方法内设置",
          color: "black",
          range: [0.1, 1]
        },
        {
          value: "适合用在一些静态页面上",
          color: "black",
          range: [0.2, 1]
        },
        {
          value: "基于canvas实现",
          color: "black",
          range: [0.2, 0.9]
        },
        {
          value: "因此IE9+浏览器才支持",
          color: "black",
          range: [0.2, 1]
        },
        {
          value: "可以设置边框颜色",
          color: "black",
          range: [0.2, 1]
        },
        {
          value: "文字颜色默认都是白色",
          color: "black",
          range: [0.2, 0.9]
        },
        {
          value: "若文字颜色不想白色",
          color: "black",
          range: [0.2, 1]
        },
        {
          value: "需要自己调整下JS",
          color: "black",
          range: [0.6, 0.7]
        },
        {
          value: "如果需要的是真实和视频交互的弹幕",
          color: "black",
          range: [0.2, 1]
        },
        {
          value: "可以回到原文",
          color: "black",
          range: [0, 0.9]
        },
        {
          value: "查看另外一个demo",
          color: "black",
          range: [0.7, 1]
        },
        {
          value: "下面就是占位弹幕了",
          color: "black",
          range: [0.7, 0.95]
        },
        {
          value: "前方高能预警！！！",
          color: "orange",
          range: [0.5, 0.8]
        },
        {
          value: "前方高能预警！！！",
          color: "orange",
          range: [0.5, 0.9]
        },
        {
          value: "前方高能预警！！！",
          color: "orange",
          range: [0, 1]
        },
        {
          value: "前方高能预警！！！",
          color: "orange",
          range: [0, 1]
        }
      ], //模拟数据
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
      "#thecanvas",
      this.dataBarrage,
      this.color
    );
    this.canvas.canvasBarrage(40);
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