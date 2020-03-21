export default class RecordingCanvas {
    constructor(canvas, data, bgcolor) {
        if (!canvas || !data || !data.length) {
            return;
        };
        this.canvas = document.querySelector(canvas);
        this.data = data;
        this.allChunks = [];
        this.recorder = null;
        this.bgcolor = bgcolor;
    }
    //画出弹幕
    canvasBarrage(size) {
        let _this = this;
        let canvas = this.canvas;
        var context = canvas.getContext('2d');
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        // 存储实例
        var store = {};

        // 字号大小
        var fontSize = size || 28;

        // 实例方法
        var Barrage = function (obj, index) {
            // 随机x坐标也就是横坐标，对于y纵坐标，以及变化量moveX
            this.x = (1 + index * 0.1 / Math.random()) * canvas.width;
            this.y = obj.range[0] * canvas.height + (obj.range[1] - obj.range[0]) * canvas.height * Math.random() + 36;
            if (this.y < fontSize) {
                this.y = fontSize;
            } else if (this.y > canvas.height - fontSize) {
                this.y = canvas.height - fontSize;
            }
            this.moveX = 1 + Math.random() * 3;

            this.opacity = 0.8 + 0.2 * Math.random();
            this.params = obj;

            this.draw = function () {
                var params = this.params;
                // 根据此时x位置绘制文本
                context.strokeStyle = params.color;
                context.font = 'bold ' + fontSize + 'px "microsoft yahei", sans-serif';
                context.fillStyle = 'rgba(255,255,255,' + this.opacity + ')';
                context.fillText(params.value, this.x, this.y);
                context.strokeText(params.value, this.x, this.y);
            };
        };

        this.data.forEach(function (obj, index) {
            store[index] = new Barrage(obj, index);
        });

        // 绘制弹幕文本
        var draw = function () {
            for (var index in store) {
                var barrage = store[index];
                // 位置变化
                barrage.x -= barrage.moveX;
                if (barrage.x < -1 * canvas.width * 1.5) {
                    // 移动到画布外部时候从左侧开始继续位移
                    barrage.x = (1 + index * 0.1 / Math.random()) * canvas.width;
                    barrage.y = (barrage.params.range[0] + (barrage.params.range[1] - barrage.params.range[0]) * Math.random()) * canvas.height;
                    if (barrage.y < fontSize) {
                        barrage.y = fontSize;
                    } else if (barrage.y > canvas.height - fontSize) {
                        barrage.y = canvas.height - fontSize;
                    }
                    barrage.moveX = 1 + Math.random() * 3;
                }
                // 根据新位置绘制圆圈圈
                store[index].draw();
            }
        };
        // 绘制背景
        function background() {
            // var gradient = context.createLinearGradient(0, 0, canvas.width, 0);
            // gradient.addColorStop("0", "green");
            // gradient.addColorStop("0.3", "yellow");
            // gradient.addColorStop("0.5", "orange");
            // gradient.addColorStop("0.7", "yellow");
            // gradient.addColorStop("1.0", "green");
            context.fillStyle = _this.bgcolor;
            context.fillRect(0, 0, canvas.width, canvas.height);
        }
        // 画布渲染
        var render = function () {
            // 清除画布
            context.clearRect(0, 0, canvas.width, canvas.height);
            // 画上背景
            background();
            // 绘制画布上所有的圆圈圈
            draw();

            // 继续渲染
            requestAnimationFrame(render);
        };

        render();
    }
    // 开始录制
    startRecording(num) {
        this.allChunks = [];
        const stream2 = this.canvas.captureStream(60); // 60 FPS recording
        this.recorder = new MediaRecorder(stream2, {
            mimeType: 'video/webm;codecs=vp9'
        });
        this.recorder.ondataavailable = e => {
                // console.log("TCL: e", e)
                this.allChunks.push(
                    e.data
                );
            },
            this.recorder.start(num); //mun是每段数据多少秒
    }
    // 停止录制
    stopRecording() {
        if (!this.recorder) {
            return
        }
        this.recorder.stop();
        this.recorder = null;
    }
    // 下载
    blobDownload() {
        const link = document.createElement('a');
        link.style.display = 'none';
        const fullBlob = new Blob(this.allChunks);
        const downloadUrl = window.URL.createObjectURL(fullBlob);
        link.href = downloadUrl;
        link.download = `test${Math.random()}.webm`;
        document.body.appendChild(link);
        link.click();
        link.remove();
    }
}