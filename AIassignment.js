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




// Teachable Machine
const noLabelIndex=-1;
const noiseLabelIndex=3;
let useLabelIndex;

function processSelect(){
    if(GameFlag){
        clearGame();
        MainGame();
    }else{
        Level_now=0;
        init();
    }
}
function clearGame(){
    const TeacherFrame=document.getElementById("TeacherIconFrame");
    const JudgeFrame = document.getElementById("JudgeIconFrame");
    [TeacherFrame,JudgeFrame].forEach(function(frame){
        frame.innerHTML="";
    })
}

function setSize(useFrame,useWidth){
    useFrame.style.width=`${useWidth*100}px`;
    useFrame.style.height="100px";
    
}
function MainGame(){
    // Levelごとの設定
    let IconTime=LevelSetting[Level_now]["time"];
    let IconNumber=LevelSetting[Level_now]["number"];

    let IconList=[];
    for(let i=0;i<IconNumber;i++){// アイコンをランダム生成
        IconList.push(Math.floor(Math.random()*IconClassRef.length))
    }

    IconFlow(IconList,IconTime);
}
function IconFlow(useIconList, IconTime){// when button is clicked
    const TeacherFrame=document.getElementById("TeacherIconFrame");
    const JudgeFrame = document.getElementById("JudgeIconFrame");
    // const StudentFrame = document.getElementById("StudentIconFrame");

    // スライドバーの追加
    const BarElement = document.createElement("div");
    BarElement.classList.add("SlideBar");
    TeacherFrame.appendChild(BarElement);

    // Draw
    setSize(JudgeFrame,useIconList.length);
    setSize(TeacherFrame,useIconList.length);
    for(let i=0;i<useIconList.length;i++){
        addIcon(TeacherFrame,IconClassRef[useIconList[i]]);// TeacherFrameにアイコンを追加
    }

    // 開始まで3秒間待機する
    let waitInterval=setInterval(function(){
        clearInterval(waitInterval);

        let iCounter=0;
        let isJudged=false;
        let iTemp = setInterval(function(){
            iCounter+=1;

            slideBar(BarElement,iMovingInterval*iCounter/(10*IconTime));// スライドバーを動かす

            // 求められている
            let RequiredIconIndex = useIconList[Math.floor(iMovingInterval*iCounter/(1000*IconTime))];

            // 現在の入力アイコン
            let ListenedIconIndex = useLabelIndex;

            // アイコンが終わってしまったか
            if(iCounter*iMovingInterval%(IconTime*1000)==0){// Icon End
                console.log("Icon End Judge:"+isJudged);// ass
                if(!isJudged){// Bad
                    console.log("Bad...!")// ass
                    if(WholeMiss==Life_Max){
                        clearInterval(iTemp);
                        GameResult();
                        return;
                    }
                    LevelMiss++;
                    WholeMiss++;

                    addIcon(JudgeFrame,IconClass_Bad);
                }
                isJudged=false;
            }

            // 求められているアイコンと入力アイコンが等しいかどうか
            if(RequiredIconIndex==ListenedIconIndex && isJudged==false){// Good and haven't been judged
                addIcon(JudgeFrame,IconClass_Good);
                isJudged=true;
            }


            if(iCounter*iMovingInterval /(1000*IconTime) >= useIconList.length){// Frame End
                clearInterval(iTemp);
                let waitInterval=setInterval(function(){
                    clearInterval(waitInterval);
                    // Levelをあげるかどうか
                    if(LevelMiss==0){
                        if(Level_now==3){
                            GameFinish();
                            return;
                        }else{
                            Level_now++;

                            let LevelSuccessMusic = new Audio('./audio/LevelSuccess.mp3');
                            LevelSuccessMusic.play();  // 再生
                        }
                    }else{
                        let LevelSuccessMusic = new Audio('./audio/LevelFailure.mp3');
                        LevelSuccessMusic.play();  // 再生
                    }
                    LevelMiss=0;

                    processSelect();
                },1000)// 終わってから次のゲームまでのインターバル
            }
        },iMovingInterval)
    },3000)
}

function addIcon(useFrame, useIconClass){
    let TempIcon = useFrame.appendChild(document.createElement("div"));
    TempIcon.classList.add(useIconClass,"Icon");
}
function slideBar(useElement,usePosition){
    useElement.style.left=`${usePosition}px`;
}

function GameResult(){
    let LevelSuccessMusic = new Audio(`./audio/Level${Level_now+1}.mp3`);
    LevelSuccessMusic.play();  // 再生
    showResult(`Achieved Level:${Level_now}<br>${compliment[Level_now]}!`);
}
function GameFinish(){
    let LevelSuccessMusic = new Audio(`./audio/GameFinish.mp3`);
    LevelSuccessMusic.play();  // 再生
    let stars="";
    let starnumber=0;
    if(WholeMiss==0){
        starnumber=3;
    }else if(WholeMiss<5){
        starnumber=2;
    }else if(WholeMiss<8){
        starnumber=2;
    }else{
        starnumber=0;
    }
    for(let star_i=0;star_i<starnumber;star_i++){
        stars+="★"
    }
    showResult(`Achieved Level:${4}<br>${compliment[4]}!<br>${stars}`);
}
function showResult(useText){
    let ResultDisplayElem=document.getElementById("ResultDisplay")
    ResultDisplayElem.classList.add("ResultShow");
    ResultDisplayElem.style.opacity=1;
    ResultDisplayElem.insertAdjacentHTML(`beforeend`,useText);
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
    // ボタンを無効化
    document.getElementById("buttonWrapper").style.visibility="hidden";


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
            if(result.scores[i].toFixed(2)>0.9){
                useLabelIndex=i;
                break;
            }
            // const classPrediction = classLabels[i] + ": " + result.scores[i].toFixed(2);
            // console.log(classPrediction);
        }
        drawData(useContext,100*result.scores[0],100*result.scores[1],100*result.scores[2],Level_now,Life_Max-WholeMiss);
        if(!GameFlag){
            GameFlag=!GameFlag;
            // ゲーム開始
            MainGame();
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
