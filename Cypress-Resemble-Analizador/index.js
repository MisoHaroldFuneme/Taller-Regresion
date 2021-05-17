const playwright = require('playwright');
const compareImages = require("resemblejs/compareImages")
const config = require("./config.json");
const fs = require('fs');

var caso1 = 'caso1';
var caso2 = 'caso2';
TotalCasos = 3;
dataArray = [];
numberStep = 0;

const { viewportHeight, viewportWidth, browsers, options } = config;

async function executeTest(){
    // se crea la carpeta results que es donde se guardara los resultados de las comparaciones
    fs.mkdirSync(`results`, { recursive: true });
    if(browsers.length === 0){
      return;
    }
    let resultInfo = {}
    let datetime = new Date().toISOString().replace(/:/g,".");
    for(browserSelected of browsers){
        if(!browserSelected in ['chromium']){
            return;
        }

        // generar scrinshoot de diferntes paginas para prueba
        if (!fs.existsSync(`./results/${datetime}`)){
            fs.mkdirSync(`./results/${datetime}`, { recursive: true });
        }

        for (let index = 1; index < TotalCasos; index++) {
            const data = await compareImages(
                fs.readFileSync(`${caso1}/Step-After-${index}.png`),
                fs.readFileSync(`${caso2}/Step-Before-${index}.png`),
                options
            );

            resultInfo[index] = {
                isSameDimensions: data.isSameDimensions,
                dimensionDifference: data.dimensionDifference,
                rawMisMatchPercentage: data.rawMisMatchPercentage,
                misMatchPercentage: data.misMatchPercentage,
                diffBounds: data.diffBounds,
                analysisTime: data.analysisTime,
                browser: browserSelected
            }

            fs.copyFileSync(`${caso1}/Step-After-${index}.png`, `results/${datetime}/Step-After-${index}.png`);
            fs.copyFileSync(`${caso2}/Step-Before-${index}.png`, `results/${datetime}/Step-Before-${index}.png`);
            fs.writeFileSync(`results/${datetime}/compare-${index}.png`, data.getBuffer());
            dataArray.push(resultInfo[index]);
        }

        // generar reporte 
            fs.writeFileSync(`results/${datetime}/report.html`, createReport(browserSelected, dataArray, datetime));
            fs.copyFileSync('index.css', `results/${datetime}/index.css`);
        
     
        console.log('------------------------------------------------------------------------------------')
        console.log("Execution finished. Check the report under the results folder")
        return resultInfo;  
        
    }

  }
(async ()=>console.log(await executeTest()))();


// generar reporte de las comparaciones 

function browser(browserSelected, datetime){
  // <p>Data: ${dataCompare.misMatchPercentage}</p>
    numberStep = numberStep + 1;
  return `<div class=" browser" id="test0">
  <div class=" btitle">
      <h2>Browser: ${browserSelected}</h2>
      <p>Test Data: ${datetime}</p>
  </div>
  <div class="imgline">
    <div class="imgcontainer">
      <span class="imgname">Reference</span>
      <img class="img2"  src="./Step-After-${numberStep}.png" id="refImage" label="Reference">
    </div>
    <div class="imgcontainer">
      <span class="imgname">Test</span>
      <img class="img2" src="./Step-Before-${numberStep}.png" id="testImage" label="Test">
    </div>
  </div>
  <div class="imgline">
    <div class="imgcontainer">
      <span class="imgname">Diff</span>
      <img class="imgfull" src="./compare-${numberStep}.png" id="diffImage" label="Diff">
    </div>
  </div>
</div>`
}

function createReport(browserSelected, resInfo, datetime){
  numberStep = 0;
    return `
    <html>
        <head>
            <title> VRT Report </title>
            <link href="index.css" type="text/css" rel="stylesheet">
        </head>
        <body>
            <h1>Report for 
                 <a href="${config.url}"> ${config.url}</a>
            </h1>
            <p>Executed: ${datetime}</p>
            <div id="visualizer">
                ${resInfo.map(dataCompare => browser(browserSelected, dataCompare, datetime))}
            </div>
        </body>
    </html>`
}