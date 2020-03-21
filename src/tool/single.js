export default class RecordingCanvas {
    constructor(canvas, data, bgcolor) {
        if (!canvas || !data) {
            return;
        };
        this.canvas = document.querySelector(canvas);
        this.data = data;
        this.allChunks = [];
        this.recorder = null;
        this.bgcolor = bgcolor;
    }
    //画出弹幕
    canvasBarrage(size, speed) {
        let _this = this;
        let canvas = this.canvas;
        var x = canvas.width;
        var y = (canvas.height - size) / 2;
        console.log(y)
        var speed = speed || 2;
        let context = canvas.getContext('2d');
        // 回调函数执行次数通常是每秒60次
        window.requestAnimationFrame(draw)

        function draw() {
            //1. 先把画布清空
            context.clearRect(0, 0, canvas.width, canvas.height);
            //2. 画背景
            background();
            //3. 画文字
            context.font = `${size}px Georgia`;
            context.fillStyle = '#1c1';
            context.fillText(_this.data.value, x, y);
            context.strokeStyle = "#c11";
            context.strokeText(_this.data.value, x, y);
            //4. x要移动
            x -= speed;
            if (x < -100) {
                x = canvas.width;
            }
            //被优化过的动画执行方向1.递归调用；2.可以自适应浏览器的刷新的帧率
            window.requestAnimationFrame(draw);
        }

        // 绘制背景
        function background() {
            context.fillStyle = _this.bgcolor;
            context.fillRect(0, 0, canvas.width, canvas.height);
        }
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