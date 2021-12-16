function setupDetectChart(){
    let canvas = document.getElementById(`DetectChart`);
    let context = canvas.getContext(`2d`);
    return context;
}
const Boundary1X=300;
const Boundary2X=600;
const CanvasWidth=900;
const CanvasHeight=300;
const CanvasPadding=10;
const DataWidth=40;
const IconSize=40;
const ArrowSize=5;
const GraphDataHeight=200;
function drawStructure(useContext){
    drawBoundary(useContext);
    drawGraphStructure(useContext);

}
function drawBoundary(useContext){
    useContext.lineWidth=1;
    useContext.strokeStyle= `rgb(255,255,255)`;

    useContext.beginPath();
    useContext.moveTo(Boundary1X,CanvasPadding);
    useContext.lineTo(Boundary1X,CanvasHeight-CanvasPadding);
    useContext.stroke();

    useContext.beginPath();
    useContext.moveTo(Boundary2X,CanvasPadding);
    useContext.lineTo(Boundary2X,CanvasHeight-CanvasPadding);
    useContext.stroke();
}
function drawGraphStructure(useContext){
    useContext.lineWidth=1;
    useContext.strokeStyle= `rgb(255,255,255)`;
    useContext.fillStyle = `rgb(255,255,255)`;
    // axis_X
    useContext.beginPath();
    useContext.moveTo(CanvasPadding,CanvasHeight-IconSize-CanvasPadding);
    useContext.lineTo(Boundary1X- CanvasPadding,CanvasHeight-IconSize-CanvasPadding);
    useContext.stroke();
    // axis_X_Arrow
    useContext.beginPath();
    useContext.moveTo(Boundary1X- CanvasPadding,CanvasHeight-IconSize-CanvasPadding)
    useContext.lineTo(Boundary1X- CanvasPadding-ArrowSize,CanvasHeight-IconSize-CanvasPadding-ArrowSize);
    useContext.lineTo(Boundary1X- CanvasPadding-ArrowSize,CanvasHeight-IconSize-CanvasPadding+ArrowSize);
    useContext.closePath();
    useContext.fill();

    // ImageTitle
    let CImage = new Image();
    CImage.src = "./img/Icon_c.jpg";
    useContext.drawImage(CImage, CanvasPadding+DataWidth, 3+CanvasHeight-IconSize-CanvasPadding, IconSize,IconSize);
    let WImage = new Image();
    WImage.src = "./img/Icon_w.jpg";
    useContext.drawImage(WImage, CanvasPadding+DataWidth*3, 3+CanvasHeight-IconSize-CanvasPadding, IconSize,IconSize);
    let SImage = new Image();
    SImage.src = "./img/Icon_s.jpg";
    useContext.drawImage(SImage, CanvasPadding+DataWidth*5, 3+CanvasHeight-IconSize-CanvasPadding, IconSize,IconSize);

    // axis_Y
    useContext.beginPath();
    useContext.moveTo(CanvasPadding,CanvasHeight-IconSize-CanvasPadding);
    useContext.lineTo(CanvasPadding,CanvasPadding);
    useContext.stroke();
    // axis_Y_Arrow
    useContext.beginPath();
    useContext.moveTo(CanvasPadding,CanvasPadding);
    useContext.lineTo(CanvasPadding-ArrowSize,CanvasPadding+ArrowSize);
    useContext.lineTo(CanvasPadding+ArrowSize,CanvasPadding+ArrowSize);
    useContext.closePath();
    useContext.fill();

    // Base line
    useContext.lineWidth=1;
    useContext.beginPath();
    useContext.moveTo(CanvasPadding,CanvasHeight-IconSize-CanvasPadding-(GraphDataHeight*0.9));
    useContext.lineTo(Boundary1X- CanvasPadding,CanvasHeight-IconSize-CanvasPadding-(GraphDataHeight*0.9));
    useContext.stroke();
}
function drawData(useContext,p1,p2,p3,level0,life0){
    let Graph_Y = CanvasHeight-IconSize-CanvasPadding;
    let p1_X = CanvasPadding+DataWidth;
    let p2_X = CanvasPadding+DataWidth*3;
    let p3_X = CanvasPadding+DataWidth*5;

    // リセット
    useContext.clearRect(0,0,CanvasWidth,CanvasHeight);
    drawStructure(useContext);

    // draw p1, p2, p3
    useContext.beginPath();
    useContext.rect(p1_X,Graph_Y-p1*2,DataWidth,p1*2);
    useContext.fill();
    useContext.beginPath();
    useContext.rect(p2_X,Graph_Y-p2*2,DataWidth,p2*2);
    useContext.fill();
    useContext.beginPath();
    useContext.rect(p3_X,Graph_Y-p3*2,DataWidth,p3*2);
    useContext.fill();

    // draw level
    const PyramidBottom = CanvasHeight-IconSize-CanvasPadding;
    useContext.font = "30px 'ＭＳ ゴシック'";
    for(let useLevel=0;useLevel<level0+1;useLevel++){

        useContext.fillText(String(useLevel+1), -10+(Boundary1X+Boundary2X)/2,PyramidBottom-(IconSize*(useLevel+1))+30);
        useContext.beginPath();
        useContext.rect(Boundary1X+CanvasPadding+(IconSize*useLevel),PyramidBottom-(IconSize*(useLevel+1)),IconSize*(7-(2*useLevel)),IconSize);
        useContext.stroke();

    }

    // draw LIFE
    const ChartCenterX=Boundary2X+(CanvasWidth-Boundary2X)/2;
    const ChartCenterY=CanvasHeight/2;
    const ChartRadius=(CanvasHeight-(2*CanvasPadding))/2;
    useContext.beginPath();
    useContext.arc(ChartCenterX, ChartCenterY, ChartRadius, -Math.PI/2,3*Math.PI/2);
    useContext.stroke();

    useContext.beginPath();
    useContext.arc(ChartCenterX, ChartCenterY, ChartRadius, -Math.PI/2, -Math.PI/2+2*Math.PI*life0/Life_Max);
    useContext.lineTo(ChartCenterX, ChartCenterY);
    useContext.lineTo(ChartCenterX, ChartCenterY-ChartRadius);
    useContext.fill();
    
}