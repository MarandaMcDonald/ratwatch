


/*let colors = [
    "Red", "Green", "Blue", "Yellow", "BlueViolet", "DeepPink",
    "DodgerBlue", "DarkTurquoise",
    "Fuchsia", "Gold", "HotPink", "LimeGreen", "GoldenRod",
    "Magenta", "MediumBlue", "MediumVioletRed", "Orange", "OrangeRed"
];*/

let colors =  ["#5F5449","#9B6A6C","#B09398","#9EBC9E","#9AD1D4", "#DCC48E","#EAEFD3","#B3C0A4","#505168","#27233A"];

// all variables for marquee title
let titleA = 'Taj Weir - Randomizer - ';
let titleB = 'Taj Weir * RANDOMIZER * ';
let titleC = 'Taj Weir + Я4Иd0M1z3Я + ';
let titleD = '                          ';
let marqueeCount = 0;
let marqueeTimerA = 0;
let marqueeTimerB = 0;

let randomP = [0, 0, 0, 0];          // variables store random numbers for three different random projects
let randomSelect;                 // random project selected amongst the three
let selectedProject;              // random selected project amongst all projects
let randomURL;                    // stores URL of random project
let eImg1, eImg2, eImg3, eRndText;   // element id's
let rndTextWidth, rndTextHeight, textCenterY;   // width and height of random text; y-center position
let w, h, ratio, fontSize;                          // width and height of viewport
let startTime, time;              // animation timers
let randomTextTimer = -1;
let initialAngle1, initialAngle2, initialAngle3; //initial angle of images flying in
let rndTextA, rndTextB, rndTextC, rndTextMask;   // initial rndText, target rndText, composit rndText, Mask;
let dataOut;
let verbose = 0;
let borderWidth = 5;

///////////////////////////////////////////////////////////////////-------------------------- DISPLAY ANIMATION

function drawAnimation() {
    //calculate width and height of viewport
    w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    h = window.innerHeight
        || document.documentElement.clientHeight
        || document.body.clientHeight;
    window.scrollTo(0, 0);
    displayImg1();
    displayImg2();
    displayImg3();
    displayRandomText();
    displayData();
}
///////////////////////////////////////////////////////////////////--------------------------DISPLAY IMAGE 1
function displayImg1() {
    let aBegin = 1;
    let aEnd = 19;

    // calculate timers
    let aTime = (time - aBegin) / (aEnd - aBegin); //aTime = animation time; goes from 0 to 1; or just to .5 if pic is selected rnd project
    if (aTime < 0) { aTime = 0; }
    if (aTime > 1) { aTime = 1; }
    let sTime = 0;                           //sTime = timer for selected project
    if (randomSelect == 1) {
        sTime = Math.max(aTime - .5, 0);
        aTime = Math.min(aTime, .5);
    }
    aTime = (Math.cos(aTime * Math.PI * 2)) / -2 + .5;
    sTime = (Math.cos(sTime * Math.PI * 2)) / -2 + .5;

    // in/out animation
    let image = eImg1;
    let surfaceArea = w * h / 3 * 2;
    let imageArea = image.naturalWidth * image.naturalHeight;
    let scaleFactor = Math.sqrt(surfaceArea) / Math.sqrt(imageArea);
    let sizeX = (image.naturalWidth * scaleFactor + (Math.sin(time * 1.3) * w / 50)) * aTime;
    let sizeY;
    let posX = (20) * aTime + (1 - aTime) * w / 2 + (w / 50 * Math.sin(time * .4)) * aTime;
    let posY = (20) * aTime + (1 - aTime) * textCenterY + (w / 50 * Math.cos(time * .4)) * aTime;
    let spinZ = 'rotate(' + ((1 - aTime) * initialAngle1) + 'deg)';

    // final positions for selected project
    let sizeXS = w - 70;
    let sizeYS = sizeXS / image.naturalWidth * image.naturalHeight;
    if (sizeYS > h - 70) {
        sizeYS = h - 70;
        sizeXS = sizeYS / image.naturalHeight * image.naturalWidth;
    }
    let posXS = (w / 2) - (sizeXS / 2) - 5;
    let posYS = 30;

    // merge animation with final move for selected project
    sizeX = sizeX * (1 - sTime) + sizeXS * sTime;
    sizeY = sizeY * (1 - sTime) + sizeYS * sTime;
    posX = posX * (1 - sTime) + posXS * sTime;
    posY = posY * (1 - sTime) + posYS * sTime;

    //let alpha=1;
    //apply styles
    image.style.left = posX + 'px';
    image.style.top = posY + 'px';
    image.style.width = sizeX + 'px';
    image.style.border = `solid ${borderWidth}px white`;
    image.style.visibility = 'visible';
    image.style.transform = spinZ;
    image.style.webkitTransform = spinZ;
    image.style.mozTransform = spinZ;
    image.style.msTransform = spinZ;
    //animEle.style.opacity = alpha;
}
///////////////////////////////////////////////////////////////////--------------------------DISPLAY IMAGE 2
function displayImg2() {
    let aBegin = 3;
    let aEnd = 19;

    // calculate timers
    let aTime = (time - aBegin) / (aEnd - aBegin); //aTime = animation time; goes from 0 to 1; or just to .5 if pic is selected rnd project
    if (aTime < 0) { aTime = 0; }
    if (aTime > 1) { aTime = 1; }
    let sTime = 0;                           //sTime = timer for selected project
    if (randomSelect == 2) {
        sTime = Math.max(aTime - .5, 0);
        aTime = Math.min(aTime, .5);
    }
    aTime = (Math.cos(aTime * Math.PI * 2)) / -2 + .5;
    sTime = (Math.cos(sTime * Math.PI * 2)) / -2 + .5;

    // in/out animation
    let image = eImg2;
    let surfaceArea = w * h / 3;
    let imageArea = image.naturalWidth * image.naturalHeight;
    let scaleFactor = Math.sqrt(surfaceArea) / Math.sqrt(imageArea);
    let sizeX = (image.naturalWidth * scaleFactor + (Math.sin(time * 1.1) * w / 50)) * aTime;
    let sizeY = sizeX / image.naturalWidth * image.naturalHeight;
    let posX = (w - 30 - sizeX) * aTime + (1 - aTime) * w / 2 + (h / 40 * Math.cos(time)) * aTime;
    let posY = (h / 2 - sizeY / 2 - 80) * aTime + (1 - aTime) * textCenterY + (h / 40 * Math.sin(time)) * aTime;
    let spinZ = 'rotate(' + ((1 - aTime) * initialAngle2) + 'deg)';

    // final positions for selected project
    let sizeXS = w - 70;
    let sizeYS = sizeXS / image.naturalWidth * image.naturalHeight;
    if (sizeYS > h - 70) {
        sizeYS = h - 70;
        sizeXS = sizeYS / image.naturalHeight * image.naturalWidth;
    }
    let posXS = (w / 2) - (sizeXS / 2) - 5;
    let posYS = 30;

    // merge animation with final move for selected project
    sizeX = sizeX * (1 - sTime) + sizeXS * sTime;
    sizeY = sizeY * (1 - sTime) + sizeYS * sTime;
    posX = posX * (1 - sTime) + posXS * sTime;
    posY = posY * (1 - sTime) + posYS * sTime;

    //apply styles
    image.style.left = posX + 'px';
    image.style.top = posY + 'px';
    image.style.height = sizeY + 'px';
    image.style.border = `solid ${borderWidth}px white`;
    image.style.visibility = 'visible';
    image.style.transform = spinZ;
    image.style.webkitTransform = spinZ;
    image.style.mozTransform = spinZ;
    image.style.msTransform = spinZ;
    //animEle.style.opacity = alpha;
}
///////////////////////////////////////////////////////////////////--------------------------DISPLAY IMAGE 3
function displayImg3() {
    let aBegin = 6;
    let aEnd = 19;
    let endOfAnimation = 0; // will be set to true after 20 seconds -> then new page loads

    // calculate timers
    let aTime = (time - aBegin) / (aEnd - aBegin); //aTime = animation time; goes from 0 to 1; or just to .5 if pic is selected rnd project
    if (aTime < 0) { aTime = 0; }
    if (aTime > 1) { aTime = 1; }
    let sTime = 0;                           //sTime = timer for selected project
    if (randomSelect == 3) {
        sTime = Math.max(aTime - .5, 0);
        aTime = Math.min(aTime, .5);
    }
    aTime = (Math.cos(aTime * Math.PI * 2)) / -2 + .5;
    sTime = (Math.cos(sTime * Math.PI * 2)) / -2 + .5;

    // in/out animation
    let image = eImg3;
    let surfaceArea = w * h / 6;
    let imageArea = image.naturalWidth * image.naturalHeight;
    let scaleFactor = Math.sqrt(surfaceArea) / Math.sqrt(imageArea);
    let sizeX = (image.naturalWidth * scaleFactor + (Math.sin(time * .8) * w / 50)) * aTime;
    let sizeY = sizeX / image.naturalWidth * image.naturalHeight;
    let posX = (50) * aTime + (1 - aTime) * w / 2 + (w / 80 * Math.cos(time * 1.3)) * aTime;
    let posY = (h - 30 - sizeY) * aTime + (1 - aTime) * textCenterY + (w / 80 * Math.sin(time * 1.3)) * aTime;
    let spinZ = 'rotate(' + ((1 - aTime) * initialAngle3) + 'deg)';

    // final positions for selected project
    let sizeXS = w - 70;
    let sizeYS = sizeXS / image.naturalWidth * image.naturalHeight;
    if (sizeYS > h - 70) {
        sizeYS = h - 70;
        sizeXS = sizeYS / image.naturalHeight * image.naturalWidth;
    }
    let posXS = (w / 2) - (sizeXS / 2) - 5;
    let posYS = 30;

    // merge animation with final move for selected project
    sizeX = sizeX * (1 - sTime) + sizeXS * sTime;
    sizeY = sizeY * (1 - sTime) + sizeYS * sTime;
    posX = posX * (1 - sTime) + posXS * sTime;
    posY = posY * (1 - sTime) + posYS * sTime;

    //apply styles
    image.style.left = posX + 'px';
    image.style.top = posY + 'px';
    image.style.height = sizeY + 'px';
    image.style.border = `solid ${borderWidth}px white`;
    image.style.visibility = 'visible';
    image.style.transform = spinZ;
    image.style.webkitTransform = spinZ;
    image.style.mozTransform = spinZ;
    image.style.msTransform = spinZ;
    //animEle.style.opacity = alpha;
}
///////////////////////////////////////////////////////////////////--------------------------DISPLAY RANDOM TEXT
function displayRandomText() {


    let aBegin = 6;
    let aEnd = 16;
    //calculate timer for color change and character replacement
    let aTime = (time - aBegin) / (aEnd - aBegin);
    if (aTime < 0) { aTime = 0; }
    if (aTime > 1) { aTime = 1; }

    if (time > randomTextTimer) {
        //update timer (for blinking intervall)
        randomTextTimer = time + 0.15;
        //define variables for this scope
        let char = '';
        let textLength = Math.max(rndTextA.length, rndTextB.length);
        //update Mask
        if (aTime > 0) {
            let tempMask = '';
            for (let i = 0; i < textLength; i++) {
                char = rndTextMask.substring(i, i + 1);
                if (char == '0') {
                    if (Math.random() < aTime * aTime * aTime) {
                        char = '1';
                    }
                }
                tempMask = tempMask + char;
            }
            rndTextMask = tempMask;
        }
        //composit text from textA & textB according to mask
        let rndText = '';
        for (let i = 0; i < textLength; i++) {
            char = '';
            if (rndTextMask.substring(i, i + 1) == '0') {
                if (i < rndTextA.length) { char = rndTextA.substring(i, i + 1); }
            } else {
                if (i < rndTextB.length) { char = rndTextB.substring(i, i + 1); }
            }
            rndText = rndText + char;
        }

        //build html text
        let rndNumber = 0;
        eRndText.innerHTML = '';
        for (let i = 0; i < rndText.length; i++) {
            rndNumber = (rndNumber + Math.floor(Math.random() * 6) + 1) % colors.length;
            char = rndText.substring(i, i + 1);
            if (char == '%') {
                eRndText.innerHTML += '<br />';
            } else {

                if (rndTextMask.substring(i, i + 1) == '0') {
                    //eRndText.innerHTML += '<font color="' + colors[rndNumber] + '">' + char + '</font>';

                    eRndText.innerHTML += `<span style="color:${colors[rndNumber]};  letter-spacing:${fontSize * .1}rem">${char}</span>`;

                } else {
                    //  eRndText.innerHTML += '<font color="white">' + char + '</font>';
                    eRndText.innerHTML += `<span style="color:white;  letter-spacing:${fontSize * .1}rem">${char}</span>`;
                }
            }
        }


        if (Math.random() > aTime * aTime * aTime) {
            eRndText.style.background = "white";
        } else {
            eRndText.style.background = "#0af";
        }
        if (Math.random() > aTime * aTime * aTime) {
            rndNumber = (rndNumber + Math.floor(Math.random() * 6) + 1) % colors.length;
            eRndText.style.borderColor = colors[rndNumber];

        } else {
            eRndText.style.borderColor = "white";

        }
        // random background color
        if (Math.random() > aTime * aTime * aTime) {
            rndNumber = (rndNumber + Math.floor(Math.random() * 6) + 1) % colors.length;
            document.body.style.background = colors[rndNumber];
        } else {
            document.body.style.background = "#ccc";
        }
    }

    // calculate timer for slide down animation
    let eTime = (time - 8) / (18 - 8); //(time-aBegin)/(aEnd-aBegin)
    if (eTime < 0) { eTime = 0; }
    if (eTime > 1) { eTime = 1; }
    eTime = .5 + (Math.cos(eTime * Math.PI) / -2);
    dataOut = eTime;

    // calculate size of random text box
    rndTextWidth = eRndText.offsetWidth;
    rndTextHeight = eRndText.offsetHeight;

    // position random text
    let yPosA = Math.floor(h / 2 - rndTextHeight / 2) - 10;
    let yPosB = h / 4 * 3;
    let yPosE = yPosA * (1 - eTime) + yPosB * eTime;

    textCenterY = rndTextHeight / 2 + yPosE;

   // eRndText.style.left = Math.floor(w / 2 - rndTextWidth / 2) + 'px';
    eRndText.style.top = yPosE + 'px';


}

///////////////////////////////////////////////////////////////////--------------------------RANDOMIZE TITLE OF THE WEBPAGE
function marqueeTitle() {

    let updateTitle = 0;

    if (time > marqueeTimerA) { // moves the title
        //update timer
        marqueeTimerA = time + 0.15;
        marqueeCount++;
        updateTitle = 1;
    }

    if (time > marqueeTimerB) { // changes characters in the title
        //update timer
        marqueeTimerB = time + 0.05;
        titleD = '';
        for (let i = 0; i < titleA.length; i++) {
            let j = i + marqueeCount;
            j = j % titleA.length;
            let char = '';
            let rndNum = Math.floor(Math.random() * 3);
            if (rndNum == 0) { char = titleA.substring(j, j + 1); }
            if (rndNum == 1) { char = titleB.substring(j, j + 1); }
            if (rndNum == 2) { char = titleC.substring(j, j + 1); }

            titleD = titleD + char;
        }
        updateTitle = 1;
    }

    if (updateTitle == 1) {
        document.title = titleD;
    }
}
///////////////////////////////////////////////////////////////////--------------------------ANIMATION STARTER (CALLED ONCE AT BEGINNING)
function pageLoad() {
    console.log("Royrobotiks Randomizer V3.1 (Object Version)");

    // calculate width and height of viewport
    w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    h = window.innerHeight
        || document.documentElement.clientHeight
        || document.body.clientHeight;

    // get element id's
    eImg1 = document.getElementById("image1");
    eImg2 = document.getElementById("image2");
    eImg3 = document.getElementById("image3");
    eRndText = document.getElementById("random-text");

    // set font size
    ratio = w / h;

    if (ratio > .75) { // landscape-ish
        fontSize = w / 750;
        borderWidth = getRemInPx() * w / 7000;

    } else { // portrait-ish
        fontSize = w / 250;
        borderWidth = getRemInPx() * w / 2000;
    }


    fontSize = Math.max(fontSize, .8); // ............ set minimum font sizes (bottom clamp) 
    eRndText.style.fontSize = `${fontSize}rem`;
    eRndText.style.letterSpacing = `${fontSize * 2}rem`;
    eRndText.style.border = `${borderWidth}px solid white`;

    // calculate number of elements in array
    let numberOfElements = contentObject.length;

    // find 3 different random numbers within the array-range
    randomP[1] = Math.floor(Math.random() * numberOfElements);
    randomP[2] = Math.floor(Math.random() * numberOfElements);
    while (randomP[2] == randomP[1]) {
        randomP[2] = Math.floor(Math.random() * numberOfElements);
    }
    randomP[3] = Math.floor(Math.random() * numberOfElements);
    while (randomP[3] == randomP[1] || randomP[3] == randomP[2]) {
        randomP[3] = Math.floor(Math.random() * numberOfElements);
    }

    // load 3 images
    loadImage(contentObject[randomP[1]], eImg1);
    loadImage(contentObject[randomP[2]], eImg2);
    loadImage(contentObject[randomP[3]], eImg3);

    // find 3 random initial angles for images flying in
    initialAngle1 = Math.floor(Math.random() * 200) + 100;
    if (Math.random() < .5) { initialAngle1 = -initialAngle1; }
    initialAngle2 = Math.floor(Math.random() * 200) + 100;
    if (Math.random() < .5) { initialAngle2 = -initialAngle2; }
    initialAngle3 = Math.floor(Math.random() * 200) + 100;
    if (Math.random() < .5) { initialAngle3 = -initialAngle3; }

    // select random project amongst the three
    randomSelect = Math.ceil(Math.random() * 3);
    // number of selected Project
    selectedProject = randomP[randomSelect];
    // URL of the random project
    randomURL = contentObject[selectedProject].url;

    // build random text with random colored letters
    rndTextA = "RANDOMIZING " + numberOfElements + " PROJECTS...";
    rndTextB = "COMING UP:%" + contentObject[selectedProject].title; // '%'=new line
    rndTextMask = "0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";

    // reset animation timer
    startTime = new Date().getTime();
    // start animation timer
    animationTimer();
}

function getRemInPx() { // helper function, calculates the px / rem ratio
    const el = document.createElement("div");
    el.style.width = "10rem";  // measure a bigger chunk
    el.style.height = "0";
    el.style.opacity = "0";
    el.style.position = "absolute";
    el.style.pointerEvents = "none";
    document.body.appendChild(el);

    const width = el.getBoundingClientRect().width;
    document.body.removeChild(el);

    return width / 10; // average out rounding
}

///////////////////////////////////////////////////////////////////--------------------------ANIMATION TIMER (LOOPS)
const animationTimer = () => {
    time = (new Date().getTime() - startTime) / 1000;
    drawAnimation();
    marqueeTitle();
    if (time < 20) {
        requestAnimationFrame(animationTimer);
    } else {
        location.href = randomURL;
    }
}
///////////////////////////////////////////////////////////////////--------------------------IMAGE LOADER

function loadImage(projectObj, eImg) {
    let img = new Image();
    img.onload = function () {
        eImg.src = img.src;

        // optional: store coordinates or metadata on the element
        eImg.dataset.xPos = projectObj.xPos;
        eImg.dataset.yPos = projectObj.yPos;
        eImg.dataset.title = projectObj.title;
        eImg.dataset.url = projectObj.url;
    };
    img.src = `images/${projectObj.image}`;
}


///////////////////////////////////////////////////////////////////--------------------------DATA OVERLAY
function displayData() {
    if (verbose != 0) {
        // display data
        let aspectD = eImg3.naturalWidth / eImg3.naturalHeight;
        document.getElementById("data").innerHTML = "width: " + w + " height: " + h +
            //  "<br/>Random Text Width: "+rndTextWidth+
            //  "<br/>Random Text Height: "+rndTextHeight+
            "<br/>random numbers: " + randomP[1] + ", " + randomP[2] + ", " + randomP[3] +
            "<br/>selected project: " + selectedProject +
            "<br/>time: " + time +
            "<br/>dataOut: " + dataOut +
            "<br/>URL: " + randomURL +
            //  "<br/>w: "+eImg3.naturalWidth+" h:"+eImg3.naturalHeight+" aspect: "+aspectD
            "";
    }
}
