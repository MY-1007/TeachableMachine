const IconClass_Hand="HandIcon";
const IconClass_Whistle = "WhistleIcon";
const IconClass_Sh="ShIcon";
const IconClass_Good="GoodIcon"
const IconClass_Bad="BadIcon"
const IconClassRef=[IconClass_Hand,IconClass_Whistle,IconClass_Sh]
const compliment=["Bad", "OK", "Good", "Excellent","Perfect"]


const iMovingInterval = 50;// x[ms]ごとにバー動く must be able to divide 1000
let GameFlag=false;// Game中か否か
let Life_Max=10;
let LevelSetting = [{time:3, number:4},{time:2, number:6},{time:1.5, number:8},{time:1, number:12}];
// timeはアイコン一個当たりの秒数、numberはアイコンの個数
let WholeMiss=0;
let LevelMiss=0;
let Level_now=0;

let isDemo=false;

// Teachable Machine
const noLabelIndex=-1;
const noiseLabelIndex=3;
let useLabelIndex;

function startDetection(){
    if(!isDemo){
        init();
        isDemo=true;
    }
}
function setupDetectChart(){
    let canvas = document.getElementById(`DetectChart`);
    let context = canvas.getContext(`2d`);
    return context;
}
const Boundary1X_=300;
const Boundary2X_=600;
const CanvasWidth_=900;
const CanvasHeight_=300;
const CanvasPadding_=10;
const DataWidth_=40;
const IconSize_=40;
const ArrowSize=5;
const GraphDataHeight_=200;
function drawStructure(useContext){
    drawBoundary(useContext);
    drawGraphStructure(useContext);

}
function drawBoundary(useContext){
    useContext.lineWidth=1;
    useContext.strokeStyle= `rgb(255,255,255)`;

    useContext.beginPath();
    useContext.moveTo(Boundary1X_,CanvasPadding_);
    useContext.lineTo(Boundary1X_,CanvasHeight_-CanvasPadding_);
    useContext.stroke();

    useContext.beginPath();
    useContext.moveTo(Boundary2X_,CanvasPadding_);
    useContext.lineTo(Boundary2X_,CanvasHeight_-CanvasPadding_);
    useContext.stroke();
}
function drawGraphStructure(useContext){
    useContext.lineWidth=1;
    useContext.strokeStyle= `rgb(255,255,255)`;
    useContext.fillStyle = `rgb(255,255,255)`;
    // axis_X
    useContext.beginPath();
    useContext.moveTo(CanvasPadding_,CanvasHeight_-IconSize_-CanvasPadding_);
    useContext.lineTo(Boundary1X_- CanvasPadding_,CanvasHeight_-IconSize_-CanvasPadding_);
    useContext.stroke();
    // axis_X_Arrow
    useContext.beginPath();
    useContext.moveTo(Boundary1X_- CanvasPadding_,CanvasHeight_-IconSize_-CanvasPadding_)
    useContext.lineTo(Boundary1X_- CanvasPadding_-ArrowSize,CanvasHeight_-IconSize_-CanvasPadding_-ArrowSize);
    useContext.lineTo(Boundary1X_- CanvasPadding_-ArrowSize,CanvasHeight_-IconSize_-CanvasPadding_+ArrowSize);
    useContext.closePath();
    useContext.fill();

    // ImageTitle
    let CImage = new Image();
    CImage.src = "../img/Icon_c.jpg";
    useContext.drawImage(CImage, CanvasPadding_+DataWidth_, 3+CanvasHeight_-IconSize_-CanvasPadding_, IconSize_,IconSize_);
    let WImage = new Image();
    WImage.src = "../img/Icon_w.jpg";
    useContext.drawImage(WImage, CanvasPadding_+DataWidth_*3, 3+CanvasHeight_-IconSize_-CanvasPadding_, IconSize_,IconSize_);
    let SImage = new Image();
    SImage.src = "../img/Icon_s.jpg";
    useContext.drawImage(SImage, CanvasPadding_+DataWidth_*5, 3+CanvasHeight_-IconSize_-CanvasPadding_, IconSize_,IconSize_);

    // axis_Y
    useContext.beginPath();
    useContext.moveTo(CanvasPadding_,CanvasHeight_-IconSize_-CanvasPadding_);
    useContext.lineTo(CanvasPadding_,CanvasPadding_);
    useContext.stroke();
    // axis_Y_Arrow
    useContext.beginPath();
    useContext.moveTo(CanvasPadding_,CanvasPadding_);
    useContext.lineTo(CanvasPadding_-ArrowSize,CanvasPadding_+ArrowSize);
    useContext.lineTo(CanvasPadding_+ArrowSize,CanvasPadding_+ArrowSize);
    useContext.closePath();
    useContext.fill();

    // Base line
    useContext.lineWidth=1;
    useContext.beginPath();
    useContext.moveTo(CanvasPadding_,CanvasHeight_-IconSize_-CanvasPadding_-(GraphDataHeight_*0.9));
    useContext.lineTo(Boundary1X_- CanvasPadding_,CanvasHeight_-IconSize_-CanvasPadding_-(GraphDataHeight_*0.9));
    useContext.stroke();
}
function drawData(useContext,p1,p2,p3,level0,life0){
    let Graph_Y = CanvasHeight_-IconSize_-CanvasPadding_;
    let p1_X = CanvasPadding_+DataWidth_;
    let p2_X = CanvasPadding_+DataWidth_*3;
    let p3_X = CanvasPadding_+DataWidth_*5;

    // リセット
    useContext.clearRect(0,0,CanvasWidth_,CanvasHeight_);
    drawStructure(useContext);

    // draw p1, p2, p3
    useContext.beginPath();
    useContext.rect(p1_X,Graph_Y-p1*2,DataWidth_,p1*2);
    useContext.fill();
    useContext.beginPath();
    useContext.rect(p2_X,Graph_Y-p2*2,DataWidth_,p2*2);
    useContext.fill();
    useContext.beginPath();
    useContext.rect(p3_X,Graph_Y-p3*2,DataWidth_,p3*2);
    useContext.fill();

    // draw level
    const PyramidBottom = CanvasHeight_-IconSize_-CanvasPadding_;
    useContext.font = "30px 'ＭＳ ゴシック'";
    for(let useLevel=0;useLevel<level0+1;useLevel++){

        useContext.fillText(String(useLevel+1), -10+(Boundary1X_+Boundary2X_)/2,PyramidBottom-(IconSize_*(useLevel+1))+30);
        useContext.beginPath();
        useContext.rect(Boundary1X_+CanvasPadding_+(IconSize_*useLevel),PyramidBottom-(IconSize_*(useLevel+1)),IconSize_*(7-(2*useLevel)),IconSize_);
        useContext.stroke();

    }

    // draw LIFE
    const ChartCenterX=Boundary2X_+(CanvasWidth_-Boundary2X_)/2;
    const ChartCenterY=CanvasHeight_/2;
    const ChartRadius=(CanvasHeight_-(2*CanvasPadding_))/2;
    useContext.beginPath();
    useContext.arc(ChartCenterX, ChartCenterY, ChartRadius, -Math.PI/2,3*Math.PI/2);
    useContext.stroke();

    useContext.beginPath();
    useContext.arc(ChartCenterX, ChartCenterY, ChartRadius, -Math.PI/2, -Math.PI/2+2*Math.PI*life0/Life_Max);
    useContext.lineTo(ChartCenterX, ChartCenterY);
    useContext.lineTo(ChartCenterX, ChartCenterY-ChartRadius);
    useContext.fill();
    
}


// more documentation available at
// https://github.com/tensorflow/tfjs-models/tree/master/speech-commands

// the link to your model provided by Teachable Machine export panel
// const URL = "https://teachablemachine.withgoogle.com/models/w6XIHODS2u/";
const URL = "https://teachablemachine.withgoogle.com/models/GJZWLyapj/";
async function createModel() {
    const checkpointURL = URL + "model.json"; // model topology
    const metadataURL = URL + "metadata.json"; // model metadata

    const recognizer = speechCommands.create(
        "BROWSER_FFT", // fourier transform type, not useful to change
        undefined, // speech commands vocabulary feature, not useful for your models
        checkpointURL,
        metadataURL);

    // check that model and metadata are loaded via HTTPS requests.
    await recognizer.ensureModelLoaded();

    return recognizer;
}

async function init() {
    let useContext = setupDetectChart();
    drawStructure(useContext);


    const recognizer = await createModel();
    const classLabels = recognizer.wordLabels(); // get class labels
    // const labelContainer = document.getElementById("label-container");
    // for (let i = 0; i < classLabels.length; i++) {
    //     labelContainer.appendChild(document.createElement("div"));
    // }

    
    // listen() takes two arguments:
    // 1. A callback function that is invoked anytime a word is recognized.
    // 2. A configuration object with adjustable fields
    recognizer.listen(result => {
        const scores = result.scores; // probability of prediction for each class
        // render the probability scores per class
        useLabelIndex=noLabelIndex;
            
        for (let i = 0; i < classLabels.length; i++) {
            console.log(`Level:${Level_now}, Life:${Life_Max-WholeMiss}, LevelMiss:${LevelMiss}`)
            drawData(useContext,100*result.scores[0],100*result.scores[1],100*result.scores[2],Level_now,Life_Max-WholeMiss);
            // const classPrediction = classLabels[i] + ": " + result.scores[i].toFixed(2);
            // console.log(classPrediction);
        }
        // console.log(`${useLabel} is detected`);
    }, {
        includeSpectrogram: true, // in case listen should return result.spectrogram
        probabilityThreshold: 0.75,
        invokeCallbackOnNoiseAndUnknown: true,
        overlapFactor: 0.50 // probably want between 0.5 and 0.75. More info in README
    });

    // Stop the recognition in 5 seconds.
    // setTimeout(() => recognizer.stopListening(), 5000);
}