let w, h, ratio,
    borderWidth,
    fontSize,
    lineHeight,
    menuFontSize,
    titleFontSize,
    titleLineHeight,
    smallFontSize, /* image descriptions etc. */
    smallLineHeight,
    articleWidth,
    articlePushDown, /* article is pushed down in landscape to leave a gap abovew title - random button also must be pushed down*/
    textBlockWidth,
    imageWidthLandscape,
    imageWidthPortrait,
    buttonWidth; // globals


let isTouchDevice = false; // set to true at first touch
let isMouseDevice = false; // set to true at first mouse click



//var colors = ["DarkRed","MediumVioletRed","OrangeRed","Gold","RebeccaPurple","DarkMagenta","DarkSlateBlue","SeaGreen","DarkGreen","DarkOliveGreen","Teal","SteelBlue","Navy","SaddleBrown","Maroon","SlateGrey","Black","DimGrey"];
var colors =  ["#5F5449","#9B6A6C","#B09398","#9EBC9E","#9AD1D4", "#DCC48E","#EAEFD3","#B3C0A4","#505168","#27233A"];

const menuItems = [
    { text: "HOME", url: "https://www.tajweird.com/" },
    { text: "DIARY", url: "https://www.tajweird.com/diary" },
    { text: "ABOUT", url: "https://www.tajweird.com/about/" },
    { text: "CONTACT", url: "https://www.tajweird.com/contact/" }
];

// ------------------------------------------------------------------ calculate font sizes etc.
function calculateSizes() {

    w = document.documentElement.clientWidth; // <- client width seems to work more consistent on mobile
    h = window.innerHeight;

   // if (w < 340) { w = 340; }

    ratio = w / h;

    // calculate article width and font size
    if (ratio > .75) { // landscape-ish
        articleWidth = w * .7;
        articlePushDown = 40;
        textBlockWidth = articleWidth * 0.75;
        buttonWidth = articleWidth;
        fontSize = w / 1300;
        lineHeight = w / 900;
        menuFontSize = w / 800;
        titleFontSize = w / 750;
        titleLineHeight = w / 550;
        smallFontSize = w / 1450;
        smallLineHeight = w / 1050;
        borderWidth = getRemInPx() * w / 7000;
        imageWidthLandscape = Math.min((Math.max(h, w / 3)), textBlockWidth+borderWidth*2); // calculate image widths
        imageWidthPortrait = Math.min(((Math.max(h, w / 3)) / 17 * 9), textBlockWidth+borderWidth*2);

    } else { // portrait-ish

        articleWidth = w;
        articlePushDown = 0;
        textBlockWidth = articleWidth * 0.85;
        buttonWidth = articleWidth * .85;
        fontSize = w / 500;
        lineHeight = fontSize * 1.6;
        menuFontSize = w / 300;
        titleFontSize = w / 300;
        titleLineHeight = w / 250;
        smallFontSize = w / 600;
        smallLineHeight = smallFontSize * 1.6;
        borderWidth = getRemInPx() * w / 2000;
        imageWidthLandscape = textBlockWidth+borderWidth*2; // calculate image widths
        imageWidthPortrait = Math.min((h / 17 * 9), textBlockWidth+borderWidth*2);
    }


    console.log(`w:${w} h:${h} ratio:${ratio}`);
    console.log(`fontSize:${fontSize} `);

    document.body.style.fontSize = `${fontSize}rem`;
    document.body.style.lineHeight = `${lineHeight}rem`;
}
 
function getRemInPx() {
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
 


//======================================================================= LAYOUT
function layout() {

    calculateSizes();
    // .................................................................. style (all functions will contain their own setup but can be called repeatedly, e.g. when resizing)

    styleBanner();
    styleMenu();
    styleTitle();
    styleArticle();
    stylePosterImages();
    styleTextBlocks();
    styleImages();
    stylePanoImages(); // e.g. in Maschinenmosaik
    styleVideos();
    styleAudio();      // e.g. in Smart Fairy Tale
    styleRandomButton();
    styleEOF(); // space below article & random button
}


//======================================================================= STYLE FUNCTIONS  

function styleBanner() {
    const banner = document.getElementById("banner");
    if (!banner) return;
    banner.style.display = "none";
    banner.style.height = 0;
}

//------------------------------------------------------------------- menu overlay

const BASE_FONT_SIZE_PX = 20;                                      // 1rem = 20px
const MOBILE_HEIGHT_MULTIPLIER = 1.5;                              // Cover article even when mobile browser hides address bar

let menuOpen = false;                                               // global state
let menuIsSetup = false;                                            // ensures one-time setup
let colorCount = 0;                                                 // random color index
let burgerCanvas = null;                                            // canvas to draw the burger menu button / x button on
let menuBgnd = null;                                                // menu background element
let burgerMenuButtonSize;
let burgerMenuButtonPadding;

// ................................................................. menu functions - defined in global scope for consistent access

function toggleMenu() {
    const menuWrapper = document.getElementById("menu-wrapper");
    if (!menuWrapper) return;

    menuOpen = !menuOpen;

    let fgColor = "#555";
    if (isMouseDevice && !isTouchDevice) {
        fgColor = "#8E8E90";
    }

    if (menuOpen) {
        drawOpenMenu(fgColor);
    } else {
        drawCloseMenu(fgColor);
    }
}

function drawOpenMenu(color) {
    const menuWrapper = document.getElementById("menu-wrapper");
    if (!menuWrapper || !menuBgnd) return;

    menuWrapper.style.opacity = "1";                                // make menu visible
    menuWrapper.style.pointerEvents = "auto";                      // enable interactions
    menuBgnd.style.opacity = "1";                                   // show background
    menuBgnd.style.pointerEvents = "auto";                         // block click-throughs
    drawClose(color);                                                    // draw X button
}

function drawCloseMenu(color) {
    const menuWrapper = document.getElementById("menu-wrapper");
    if (!menuWrapper || !menuBgnd) return;

    menuWrapper.style.opacity = "0";                                // hide menu
    menuWrapper.style.pointerEvents = "none";                      // disable interactions
    menuBgnd.style.opacity = "0";                                   // hide background
    menuBgnd.style.pointerEvents = "none";                         // allow click-throughs
    drawBurger(color);                                                   // draw burger button
}

// ................................................................. draw burger / close on canvas
function drawBurger(color = "#555") {
    if (!burgerCanvas) return;

    const ctx = burgerCanvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, burgerCanvas.width, burgerCanvas.height);   // clear canvas
    ctx.strokeStyle = color;
    ctx.lineWidth = borderWidth / 2;

    const spacing = (burgerMenuButtonSize - (borderWidth / 2) - (burgerMenuButtonPadding * 2)) / 2;

    for (let i = 0; i < 3; i++) {                                   // draw 3 horizontal lines
        const y = burgerMenuButtonPadding + i * spacing;
        ctx.beginPath();
        ctx.moveTo(burgerMenuButtonPadding - 1, y + borderWidth / 4);
        ctx.lineTo(burgerMenuButtonSize - burgerMenuButtonPadding + 1, y + borderWidth / 4);
        ctx.stroke();
    }
}

function drawClose(color = "#555") {
    if (!burgerCanvas) return;

    const ctx = burgerCanvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, burgerCanvas.width, burgerCanvas.height);   // clear canvas
    ctx.strokeStyle = color;
    ctx.lineWidth = borderWidth / 2;

    ctx.beginPath();                                                // draw \ line
    ctx.moveTo(burgerMenuButtonPadding, burgerMenuButtonPadding);
    ctx.lineTo(burgerMenuButtonSize - burgerMenuButtonPadding, burgerMenuButtonSize - burgerMenuButtonPadding);
    ctx.stroke();

    ctx.beginPath();                                                // draw / line
    ctx.moveTo(burgerMenuButtonSize - burgerMenuButtonPadding, burgerMenuButtonPadding);
    ctx.lineTo(burgerMenuButtonPadding, burgerMenuButtonSize - burgerMenuButtonPadding);
    ctx.stroke();
}

// ................................................................. main menu function

function styleMenu() {
    const menuWrapper = document.getElementById("menu-wrapper");
    if (!menuWrapper) return;                                       // stop if wrapper missing

    // ................................................................. one-time setup
    if (!menuIsSetup) {
        const menu = document.getElementById("menu");               // clear existing menu content
        if (menu) menu.innerHTML = "";

        menuWrapper.style.position = "fixed";                      // style wrapper
        menuWrapper.style.top = "0";
        menuWrapper.style.left = "0";

        menuWrapper.style.zIndex = "9998";
        menuWrapper.style.display = "flex";
        menuWrapper.style.flexDirection = "column";
        menuWrapper.style.alignItems = "center";
        menuWrapper.style.justifyContent = "center";

        menuWrapper.style.opacity = "0";
        menuWrapper.style.transition = "opacity 0.3s ease";
        menuWrapper.style.pointerEvents = "none";

        menuBgnd = document.createElement("div");                   // create background
        menuBgnd.style.position = "fixed";
        menuBgnd.style.top = "0";
        menuBgnd.style.left = "0";
        menuBgnd.style.width = `${w}px`;
        menuBgnd.style.height = `${h * MOBILE_HEIGHT_MULTIPLIER}px`;
        menuBgnd.style.background = "#ccc";
        menuBgnd.style.pointerEvents = "none";
        menuBgnd.style.zIndex = "1";                                // behind the buttons
        menuBgnd.style.opacity = "0";
        menuBgnd.style.transition = "opacity 0.3s ease";
        menuBgnd.id = "menu-bgnd";
        document.body.appendChild(menuBgnd);

        menuItems.forEach((item, index) => {                       // create menu buttons
            const menuButton = document.createElement("div");
            menuButton.textContent = item.text;
            menuButton.style.margin = "0";
            menuButton.style.background = "#5b5858ff";
            menuButton.style.color = "#555";
            menuButton.style.textAlign = "center";
            menuButton.style.cursor = "pointer";
            menuButton.style.transition = "background 0.3s ease, color 0.3s ease";
            menuButton.style.boxShadow = "3px 3px 7px rgba(0,0,0,0.1)";
            menuButton.style.userSelect = "none";
            menuButton.classList.add("futura-font", "menu-button");

            menuButton.addEventListener("mouseenter", () => {       // menu button hover effects
                colorCount = (Math.floor(Math.random() * 5) + 1 + colorCount) % colors.length;
                if (isMouseDevice) {
                    const randomColor = colors[colorCount];
                    menuButton.style.background = randomColor;
                    menuButton.style.color = "#8E8E90";
                }
            });
            menuButton.addEventListener("mouseleave", () => {
                menuButton.style.background = "#8E8E90";
                menuButton.style.color = "#555";
            });
            menuButton.addEventListener("click", () => {            // navigation
                window.location.href = item.url;
            });
            menuWrapper.appendChild(menuButton);
        });

        burgerCanvas = document.createElement("canvas");            // create burger canvas
        burgerCanvas.style.position = "fixed";
        burgerCanvas.style.cursor = "pointer";
        burgerCanvas.style.boxShadow = "3px 3px 7px rgba(0, 0, 0, 0.1)";
        burgerCanvas.style.zIndex = "9999";
        burgerCanvas.style.background = "#8E8E90";
        burgerCanvas.style.transition = "background 0.3s ease";

        document.body.appendChild(burgerCanvas);

        burgerCanvas.addEventListener("click", toggleMenu);         // add click handler (only once)

        burgerCanvas.addEventListener("mouseenter", () => {        // hover effects for burger button
            if (isTouchDevice && !isMouseDevice) return; // no hover for touch
            colorCount = (Math.floor(Math.random() * 5) + 1 + colorCount) % colors.length;
            const randomColor = colors[colorCount];
            burgerCanvas.style.background = randomColor;
            if (menuOpen) {
                drawClose("#000000ff");
            } else {
                drawBurger("#363636ff");
            }
        });

        burgerCanvas.addEventListener("mouseleave", () => {
            if (isTouchDevice && !isMouseDevice) return; // no hover for touch
            burgerCanvas.style.background = "#000000ff";
            if (menuOpen) {
                drawClose("#555");
            } else {
                drawBurger("#555");
            }
        });

        requestAnimationFrame(() => {                               // reliable canvas rendering
            requestAnimationFrame(() => {
                drawCloseMenu("#555");
            });
        });

        menuIsSetup = true;                                         // mark setup complete
    }

    // ................................................................. repeated styling (resize, etc.)

    if (burgerCanvas) {                                             // update burger button size and position
        if (ratio > .75) { // landscape-ish

            burgerMenuButtonSize = titleLineHeight * BASE_FONT_SIZE_PX + borderWidth * 2;
            burgerMenuButtonPadding = borderWidth * 2.5;
            burgerCanvas.style.top = `${articlePushDown + borderWidth * 2}px`;

        } else { //portrait-ish

            burgerMenuButtonSize = titleLineHeight * BASE_FONT_SIZE_PX + borderWidth * 2;

            burgerMenuButtonPadding = borderWidth * 3.5;
            burgerCanvas.style.top = `${borderWidth * 2}px`;
        }
        burgerCanvas.width = burgerMenuButtonSize;
        burgerCanvas.height = burgerMenuButtonSize;
        burgerCanvas.style.right = `${borderWidth * 2 + (w - articleWidth) / 10}px`;
    }

    if (menuOpen) {                                                 // redraw appropriate button state
        drawClose();
    } else {
        drawBurger();
    }

    menuWrapper.style.width = `100vw`;  // update wrapper and background dimensions
    menuWrapper.style.height = `95vh`;

    const gapSize = (Math.max(Math.min(1 - ratio, .75), 0) * (h / (menuItems.length + 4))) / 2 + borderWidth * 4; // gap grows when screen becomes more vertical - this calculation is a bit weird, but the "correct" calculation looks worse, then the menu block would be too low

    menuWrapper.style.gap = `${gapSize}px`; // gap between menu buttons


    const menuButtons = document.querySelectorAll(".menu-button");  // update menu button styles
    menuButtons.forEach((menuButton, index) => {
        menuButton.style.fontSize = `${menuFontSize}rem`;
        menuButton.style.letterSpacing = `${menuFontSize * 0.07}rem`;
        menuButton.style.width = `${buttonWidth - 12}px`;
        menuButton.style.lineHeight = `${burgerMenuButtonSize}px`;  // mewnu button height matches burger button height
        menuButton.style.height = `${burgerMenuButtonSize}px`;
    });

    if (menuBgnd) {
        menuBgnd.style.width = `${w}px`;
        menuBgnd.style.height = `${h * MOBILE_HEIGHT_MULTIPLIER}px`;
    }
}



//------------------------------------------------------------------- random button, squares animation

let randomListenerScroll = null;
let randomListenerEnter = null;
let randomListenerLeave = null;
let squaresAnimationFrameId = null;
let progressAnimationFrameId = null;
let startTime = null;
let pScrollY = null;
let progress = 0;
let resetProgress = false;
let squaresRunning = false;
let randomButtonHover = false;
const distanceAboveButton = 60; // distanc between article and random button

//...................................................................  default style

function defaultRandomButtonStyle() {
    const randomButton = document.getElementById("random-button");
    const randomBar = document.getElementById("random-bar");
    if (!randomButton || !randomBar) return;

    const randomButtonHeight = titleLineHeight * BASE_FONT_SIZE_PX + borderWidth * 2; // same logic as for menu item buttons and burger button

    randomBar.style.position = "absolute";                      // progress bar styles
    randomBar.style.top = "0";
    randomBar.style.left = "0";
    randomBar.style.height = "100%";
    randomBar.style.width = "0%";                               // reset
    randomBar.style.pointerEvents = "none";
    randomBar.style.transition = "width 0.3s ease";
    randomBar.style.zIndex = "0";                               // stay behind text 
    randomButton.style.textDecoration = "none";                 // general button styles
    randomButton.style.fontSize = `${menuFontSize}rem`;         // general button styles
    //randomButton.style.lineHeight = `${randomButtonHeight - borderWidth * 4}px`;         // general button styles
    //randomButton.style.height = `${randomButtonHeight - borderWidth * 4}px`;         
    randomButton.style.lineHeight = `${menuFontSize*1.3}rem`;    
    randomButton.style.padding = `${borderWidth}px ${borderWidth*2}px`;    

    randomButton.style.letterSpacing = `${menuFontSize * .07}rem`;
    randomButton.style.padding = `${borderWidth * 2}px ${borderWidth}px`;
    randomButton.style.color = "#7a0069ff";
    randomButton.style.textAlign = "center";
    randomButton.style.background = "#070404ff";
    randomButton.style.boxShadow = "3px 3px 7px rgba(0, 0, 0, 0.1)";
    randomButton.style.width = `${buttonWidth - 12}px`;
    randomButton.style.position = "relative";                   // initialize non-sticky styles
    randomButton.style.left = 0;
    randomButton.style.top = `${distanceAboveButton + articlePushDown}px`;
    randomButton.style.transform = "translate(0,0)";
    randomButton.style.margin = "0 auto";                       // center horizontally
    randomButton.style.zIndex = "1";                            // makes the <a> contents stack above the bar
    randomButton.style.userSelect = "none";
    randomButton.style.webkitUserSelect = "none";               // for Safari
    randomButton.style.msUserSelect = "none";                   // for IE/Edge
    randomButton.style.transition = "background 0.3s ease, color 0.3s ease";
    if (pageLoaded) { randomButton.style.display = "block"; }   // only make button visible if page is fully loaded
}

//------------------------------------------------------------------- style random button: handles default styling, hover effects, progress bar, squares animation, and scroll behavior
function styleRandomButton() {

    //................................................................... remove old listeners and cancel animations
    const randomButton = document.getElementById("random-button");
    const randomBar = document.getElementById("random-bar");
    if (!randomButton || !randomBar) return;

    if (randomListenerScroll) window.removeEventListener('scroll', randomListenerScroll);
    if (randomListenerEnter) randomButton.removeEventListener('mouseenter', randomListenerEnter);
    if (randomListenerLeave) randomButton.removeEventListener('mouseleave', randomListenerLeave);

    if (squaresAnimationFrameId) {
        cancelAnimationFrame(squaresAnimationFrameId);
        squaresAnimationFrameId = null;
        squaresRunning = false;                                 // reset flag
    }

    if (progressAnimationFrameId) {
        cancelAnimationFrame(progressAnimationFrameId);
        progressAnimationFrameId = null;
    }

    startTime = null;

    //................................................................... apply default button style
    defaultRandomButtonStyle();

    //................................................................... progress bar animation
    const duration = 15000; // 15s

    //. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .  start progress bar timer
    function startProgressBarTimer() {
        if (progressAnimationFrameId) return;                       // don't double-start
        randomBar.style.background = colors[Math.floor(Math.random() * colors.length)];
        progressAnimationFrameId = requestAnimationFrame(animateProgress);
    }

    //. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .  animate progress bar
    function animateProgress(timestamp) {

        if (randomButtonHover) {                                     // pause if hovering
            cancelAnimationFrame(progressAnimationFrameId);
            progressAnimationFrameId = null;
            return;
        }

        if (!startTime) startTime = timestamp;                       // initialize start time

        if (resetProgress || menuOpen) {                             // scroll-up bounce case
            progress *= 0.8;
            if (progress < 0.005) {
                progress = 0;
                resetProgress = false;
                startTime = null;
                cancelAnimationFrame(progressAnimationFrameId);
                progressAnimationFrameId = null;
                randomBar.style.width = "0%";
                return;
            }
        } else {                                                      // normal progress case
            const elapsed = timestamp - startTime;
            progress = Math.min(elapsed / duration, 1);
            if (progress >= 1) {
                randomButton.click();                                // auto-click
                cancelAnimationFrame(progressAnimationFrameId);
                progressAnimationFrameId = null;
                return;
            }
        }

        randomBar.style.width = `${Math.min(progress * 105, 100)}%`;
        progressAnimationFrameId = requestAnimationFrame(animateProgress);
    }

    //................................................................... squares animation
    function startSquaresAnimation() {
        if (squaresAnimationFrameId) return;                         // prevent double execution

        let squaresContainer = document.getElementById("square-container");
        const contentWrapper = document.getElementById("content-wrapper");

        if (!squaresContainer) {
            squaresContainer = document.createElement("div");
            squaresContainer.id = "square-container";
            contentWrapper.parentNode.insertBefore(squaresContainer, contentWrapper);
        }

        squaresContainer.style.position = "fixed";                   // fixed relative to viewport
        squaresContainer.style.top = "50%";
        squaresContainer.style.left = "50%";
        squaresContainer.style.width = "0px";
        squaresContainer.style.height = "0px";
        squaresContainer.style.transform = "translate(-50%, -50%)";  // center
        squaresContainer.style.pointerEvents = "none";               // clicks pass through
        squaresContainer.style.zIndex = "-1";                        // behind content
        squaresContainer.innerHTML = "";                              // clear old squares

        const squares = [];
        let colorId = Math.floor(Math.random() * colors.length);
        for (let i = 0; i < 4; i++) {
            const sq = document.createElement("div");
            sq.style.position = "absolute";
            sq.style.border = `${borderWidth}px solid ${colors[colorId]}`;
            colorId = (colorId + 2) % colors.length;
            sq.style.transformOrigin = "center center";
            sq.softSize = 0;
            squaresContainer.appendChild(sq);
            squares.push(sq);
        }

        //. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .  animation loop
        let lastTime = null;
        function animateSquares(timestamp) {
            if (!lastTime) lastTime = timestamp;
            const delta = (timestamp - lastTime) / 1000;
            lastTime = timestamp;

            const normalizedEndScroll = Math.max(h - document.getElementById("article").getBoundingClientRect().bottom + h / 3, 0) / h;

            if (normalizedEndScroll > 0) {
                squaresContainer.style.display = "block";
                squaresContainer.style.opacity = normalizedEndScroll * 2;

                for (let i = 0; i < 4; i++) {
                    squares[i].softSize += (Math.max(0, normalizedEndScroll * 2.8) - squares[i].softSize) * delta * (0.15 * (i + 1));
                    const squSize = squares[i].softSize * ((Math.sin((timestamp / 9345 + i * 1234) / ((i + 4) / 5)) + 1.15) * w / 8);
                    squares[i].style.width = `${squSize}px`;
                    squares[i].style.height = `${squSize}px`;
                    squares[i].style.opacity = Math.max(Math.min(((squSize / w) - 0.05) * 3, 1), 0);
                    const angle = Math.sin((timestamp / 10000) + i) * 90 + i * 20;
                    squares[i].style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
                }
            } else {
                squaresContainer.style.display = "none";
                for (let i = 0; i < 4; i++) squares[i].softSize = 0;
            }

            squaresAnimationFrameId = requestAnimationFrame(animateSquares);
        }

        squaresAnimationFrameId = requestAnimationFrame(animateSquares);
    }

    //................................................................... hover effects
    const mouseEnterListener = () => {
        colorCount = (Math.floor(Math.random() * 5) + 1 + colorCount) % colors.length;
        const randomColor = colors[colorCount];
        randomButton.style.background = randomColor;
        randomButton.style.color = "#8E8E90";

        randomButtonHover = true;
        if (progressAnimationFrameId) {
            cancelAnimationFrame(progressAnimationFrameId);
            progressAnimationFrameId = null;
        }
        randomBar.style.width = "0%";
    };

    const mouseLeaveListener = () => {
        randomButton.style.background = "#8E8E90";
        randomButton.style.color = "#555";

        randomButtonHover = false;
        resetProgress = false;
        startTime = null;
        progress = 0;
        randomBar.style.width = "0%";

        const randomBarTriggerPointY = h * 2 / 3;
        const articleEnd = document.getElementById("article").getBoundingClientRect().bottom;
        if (articleEnd < randomBarTriggerPointY) startProgressBarTimer();
    };

    randomButton.addEventListener('mouseenter', mouseEnterListener);
    randomButton.addEventListener('mouseleave', mouseLeaveListener);

    //................................................................... scroll logic using requestAnimationFrame
    let lastScrollY = window.scrollY;
    let ticking = false;

    randomListenerScroll = () => {
        lastScrollY = window.scrollY;
        if (!ticking) {
            requestAnimationFrame(handleScrollEffects);
            ticking = true;
        }
    };
    window.addEventListener('scroll', randomListenerScroll);

    //. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .  process all scroll-dependent effects
    function handleScrollEffects() {
        const wScrollY = lastScrollY;
        if (pScrollY === null) pScrollY = wScrollY;

        const articleEnd = document.getElementById("article").getBoundingClientRect().bottom;
        const randomButtonHeight = randomButton.getBoundingClientRect().height;
        const viewportCenter = h / 2;

        // stickiness
        if (articleEnd + distanceAboveButton >= viewportCenter - randomButtonHeight / 2) {
            randomButton.style.position = "relative";
            randomButton.style.marginTop = `${distanceAboveButton}px`;
            randomButton.style.left = "0";
            randomButton.style.top = `${articlePushDown}px`;
            randomButton.style.transform = "translate(0,0)";
            randomButton.style.marginLeft = "auto";
            randomButton.style.marginRight = "auto";
        } else {
            randomButton.style.position = "fixed";
            randomButton.style.top = "50%";
            randomButton.style.left = "50%";
            randomButton.style.transform = "translate(-50%, -50%)";
            randomButton.style.marginTop = "0";
        }

        // progress bar trigger
        const randomBarTriggerPointY = h * 3 / 4;
        if (wScrollY < pScrollY) {
            resetProgress = true;
        } else if (wScrollY > pScrollY && pageLoaded) {
            if (articleEnd < randomBarTriggerPointY) startProgressBarTimer();
        }

        // squares animation
        if (articleEnd < h && pageLoaded) {
            if (!squaresRunning) {
                squaresRunning = true;
                startSquaresAnimation();
            }
        }

        pScrollY = wScrollY;
        ticking = false;
    }

    //................................................................... initial run
    handleScrollEffects();
    mouseEnterListener();
    mouseLeaveListener();
}



//------------------------------------------------------------------- style article block
function styleArticle() {
    const article = document.getElementById("article");
    const menuHeight = document.getElementById("menu-wrapper").getBoundingClientRect().bottom;
    article.style.position = "relative";

    article.style.top = `${articlePushDown}px`;

    article.style.padding = `${borderWidth}px 0 ${fontSize * 70}px 0`;
    article.style.margin = `0 auto 0 auto`; // center horizontally
    article.style.width = `${articleWidth}px`; // set width 
    article.style.textAlign = "left"; // keep text left-aligned
    article.style.background = "#8E8E90";
    article.style.boxShadow = "3px 3px 7px rgba(0, 0, 0, 0.1)";
}

//------------------------------------------------------------------- style EOF (end of article)
function styleEOF() {
    const eof = document.getElementById("eof");
    eof.style.position = "relative";
    eof.style.height = `${h + borderWidth + articlePushDown}px`;
}

//------------------------------------------------------------------- style title
function styleTitle() {

    const articleTitle = document.getElementById("article-title");

    if (!articleTitle) { return; }

    articleTitle.style.fontSize = `${titleFontSize}rem`;
    articleTitle.style.lineHeight = `${titleLineHeight}rem`;
    articleTitle.style.letterSpacing = `${titleFontSize * 0.02}rem`;
    articleTitle.style.padding = `${borderWidth * 2}px  ${titleLineHeight * 20 + borderWidth * 6}px`;
    articleTitle.style.margin = `0px ${borderWidth}px 0 ${borderWidth}px`;
    articleTitle.style.textAlign = "center";
    articleTitle.style.fontWeight = "normal";
    articleTitle.style.fontStyle = "italic";
    articleTitle.style.color = "#8E8E90";
    articleTitle.style.overflowWrap = "break-word"; // wrap words only if they are too long
    articleTitle.style.wordWrap = "break-word"; // fallback for older browsers
    articleTitle.style.background = colors[Math.floor(Math.random() * colors.length)]; // pick time-based bgnd color
    articleTitle.style.textShadow = ".3rem .3rem .3em rgba(0, 0, 0, 0.2)";
    articleTitle.style.boxShadow = "3px 3px 5px rgba(0, 0, 0, 0.2)";
    articleTitle.style.transition = "background 0.3s ease";

    // .............................................................. bgnd color gimmick, change color when mouse enters


    if (articleTitle.colorChangeListener) { // remove existing listener if it exists
        articleTitle.removeEventListener('mousemove', articleTitle.colorChangeListener);
    }


    let lastChange = 0;
    articleTitle.colorChangeListener = () => { // create and add new listener
        const now = Date.now();
        if (now - lastChange < 500) return;
        lastChange = now;
        let currentColor = articleTitle.style.background;
        let newColor;
        do {
            let seconds = new Date().getSeconds();
            let randomOffset = Math.floor(Math.random() * 60);
            let colorIndex = Math.floor(((seconds + randomOffset) % 60) / 60 * colors.length);
            newColor = colors[colorIndex];
        } while (newColor === currentColor);
        articleTitle.style.background = newColor;
    };

    articleTitle.addEventListener('mousemove', articleTitle.colorChangeListener);
}


//------------------------------------------------------------------- style poster images

function stylePosterImages() {

    const posterImages = document.querySelectorAll('.poster-image'); // get all elements that have the class "poster-image"
    posterImages.forEach(container => { // loop through each of the found elements
        const posterIMG = container.querySelector('img'); // get the image

        container.style.margin = "0 auto"; // center horizontally
        container.style.width = `${articleWidth}px`; // set width 
        container.style.padding = "0 0 15px 0px";

        posterIMG.style.width = `${articleWidth - borderWidth * 2}px`;
        posterIMG.style.height = "auto";
        posterIMG.style.margin = `0 ${borderWidth}px ${borderWidth}px ${borderWidth}px`;
        posterIMG.style.boxShadow = "3px 3px 5px rgba(0, 0, 0, 0.15)";
    });
}

//------------------------------------------------------------------- style text blocks
function styleTextBlocks() {
    const textBlocks = document.querySelectorAll('.text-block'); // get all elements that have the class "text-block"
    textBlocks.forEach(block => { // loop through each of the found elements
        block.style.width = `${textBlockWidth}px`; // set width
        block.style.padding = `0 ${(articleWidth - textBlockWidth) / 2}px`; // center block
    });
    textBlocks[0].style.paddingTop = "64px"; // additional distance between poster video / image and the first text
}


//------------------------------------------------------------------- style image blocks

function styleImages() {
    if (!imageWidthLandscape || !imageWidthPortrait)  calculateSizes() ;             // if styling was called before image sizes were available -> calculate sizes
    const imageContainer = document.querySelectorAll('.image');
    imageContainer.forEach(container => {
        styleThisImage(container);                                         // style this single image container
    });
}

function styleThisImage(container) { // style one image in a container
    const img = container.querySelector('img');
    const description = container.querySelector('.image-description');
    if (!img || !description) return;

    container.appendChild(description); // reorder the elements in the DOM 
    const imgW = img.naturalWidth;
    const imgH = img.naturalHeight;
    const imageWidth = imgW > imgH ? imageWidthLandscape : imageWidthPortrait;

    container.style.margin = "0 auto"; // center horizontally
    container.style.width = `${imageWidth}px`; // set width 
    container.style.padding = "15px 0px 15px 0px";

    img.style.width = `${imageWidth - borderWidth * 2}px`;
    img.style.height = "auto";
    img.style.border = `${borderWidth}px solid white`;
    img.style.boxShadow = "3px 3px 7px rgba(0, 0, 0, 0.15)";

    description.style.width = `${imageWidth - 64}px`;
    description.style.fontSize = `${smallFontSize}rem`;
    description.style.lineHeight = `${smallLineHeight}rem`;
    description.style.fontStyle = "italic";
    description.style.textAlign = "center";
    description.style.padding = "15px 32px 0px 32px";

}
//------------------------------------------------------------------- style panoramas 
function stylePanoImages() {

    const panoImages = document.querySelectorAll(".pano-image"); // get all elements with the class name "pano-image"

    if (panoImages.length > 0) { // check if any elements with the class name were found
        panoImages.forEach((element) => {
            let panoWidth = articleWidth - borderWidth * 2;
            let panoHeight;
            if (ratio > .75) {
                panoHeight = panoWidth * .5;
            } else {
                panoHeight = panoWidth * .75;
            }
            element.style.width = `${panoWidth}px`;
            element.style.height = `${panoHeight}px`;
            element.style.padding = `0 ${borderWidth}px`;
        });
    }
}

//------------------------------------------------------------------- style audio 
function styleAudio() {
    const audioContainer = document.querySelectorAll('.audio');

    audioContainer.forEach(container => {
        const audio = container.querySelector('audio');
        const description = container.querySelector('.audio-description');

        if (!audio || !description) return;

        container.appendChild(description); // reorder the elements in the DOM 

        container.style.margin = "0 auto"; // center horizontally
        container.style.width = `${imageWidthLandscape}px`; // set width 
        container.style.padding = "15px 0px 15px 0px";

        audio.style.width = `${imageWidthLandscape}px`;
        audio.style.height = "auto";

        description.style.width = `${imageWidthLandscape - 64}px`;
        description.style.fontSize = `${smallFontSize}rem`;
        description.style.lineHeight = `${smallLineHeight}rem`;
        description.style.fontStyle = "italic";
        description.style.textAlign = "center";
        description.style.padding = "15px 32px 0px 32px";

    });
}



function styleVideos() {



    //.............................................................. embedded videos (yt, etc)
    const embedVideoContainers = document.querySelectorAll('.video-container');

    embedVideoContainers.forEach(container => {
        const iframe = container.querySelector('iframe');
        if (!iframe) return;
        const videoWidth = articleWidth - borderWidth * 2; //  
        container.style.margin = "0 auto"; // center the container horizontally
        container.style.width = `${videoWidth}px`; // set the container width
        container.style.padding = 0; // apply padding to the container
        iframe.style.width = `${videoWidth}px`; // set the iframe width
        iframe.style.height = `${videoWidth * 0.5625}px`; // calculate height for 16:9 aspect ratio (56.25%)
        iframe.style.boxShadow = "3px 3px 7px rgba(0, 0, 0, 0.15)";
    });


    const embedVideoContainersSmall = document.querySelectorAll('.video-container-small'); // can (doesn't have to) contain a description
    embedVideoContainersSmall.forEach(container => {
        const iframe = container.querySelector('iframe');
        if (!iframe) return;

        const videoWidth = imageWidthLandscape - borderWidth * 2;
        container.style.margin = "0 auto";
        container.style.width = `${videoWidth}px`;
        container.style.padding = 0;

        iframe.style.width = `${videoWidth}px`;
        iframe.style.height = `${videoWidth * 0.5625}px`; // 16:9
        iframe.style.boxShadow = "3px 3px 7px rgba(0, 0, 0, 0.15)";

        const description = container.querySelector('.video-description');
        if (description) {
            container.appendChild(description); // move description after video
            description.style.width = `${videoWidth - 64}px`;
            description.style.fontSize = `${smallFontSize}rem`;
            description.style.lineHeight = `${smallLineHeight}rem`;
            description.style.fontStyle = "italic";
            description.style.textAlign = "center";
            description.style.padding = "15px 32px 0px 32px";
        }
    });



    const embedVideoContainers4by3 = document.querySelectorAll('.video-container-4by3');

    embedVideoContainers4by3.forEach(container => {
        const iframe = container.querySelector('iframe');
        if (!iframe) return;
        const videoWidth = imageWidthLandscape - borderWidth * 2; //  
        container.style.margin = "0 auto"; // center the container horizontally
        container.style.width = `${videoWidth}px`; // set the container width
        container.style.padding = 0; // apply padding to the container
        iframe.style.width = `${videoWidth}px`; // set the iframe width
        iframe.style.height = `${videoWidth / 4 * 3}px`; //  
        iframe.style.boxShadow = "3px 3px 7px rgba(0, 0, 0, 0.15)";
    });


    const embedVideoContainers4by3small = document.querySelectorAll('.video-container-4by3-small');
    embedVideoContainers4by3small.forEach(container => {
        const iframe = container.querySelector('iframe');
        if (!iframe) return;
        const videoWidth = imageWidthLandscape - borderWidth * 2; //  
        container.style.margin = "0 auto"; // center the container horizontally
        container.style.width = `${videoWidth}px`; // set the container width
        container.style.padding = 0; // apply padding to the container
        iframe.style.width = `${videoWidth}px`; // set the iframe width
        iframe.style.height = `${videoWidth / 4 * 3}px`; //  
        iframe.style.boxShadow = "3px 3px 7px rgba(0, 0, 0, 0.15)";
    });


    //.............................................................. html5 videos
    const html5VideoContainer = document.querySelectorAll('.video');

    html5VideoContainer.forEach(container => {
        const video = container.querySelector('video');
        const description = container.querySelector('.video-description');

        if (video && description) {
            container.appendChild(description); // reorder the elements in the DOM 
            const videoWidth = imageWidthLandscape;
            container.style.margin = "0 auto"; // center horizontally
            container.style.width = `${videoWidth}px`; // set width 
            container.style.padding = "15px 0px 15px 0px";
            video.style.width = `${videoWidth - borderWidth * 2}px`;
            video.style.height = "auto";
            video.style.border = `${borderWidth}px solid white`;
            video.style.boxShadow = "3px 3px 7px rgba(0, 0, 0, 0.15)";
            description.style.width = `${videoWidth - 64}px`;
            description.style.fontSize = `${smallFontSize}rem`;
            description.style.lineHeight = `${smallLineHeight}rem`;
            description.style.fontStyle = "italic";
            description.style.textAlign = "center";
            description.style.padding = "15px 32px 0px 32px";
        }
    });
    //.............................................................. article-wide videos
    const videoArticleWideContainer = document.querySelectorAll('.video_article_wide');

    videoArticleWideContainer.forEach(container => {
        const video = container.querySelector('video');

        if (!video) return;
        const videoWidth = articleWidth;
        container.style.margin = "0 auto"; // center horizontally
        container.style.width = `${videoWidth}px`; // set width 
        container.style.padding = "15px 0px 15px 0px";
        video.style.width = `${videoWidth}px`;
        video.style.height = "auto";
    });
}

//------------------------------------------------------------------- helper: style description blocks
function styleDescription(container, description, contentWidth) {
    if (!description) return;

    container.appendChild(description); // ensure description is after the media
    description.style.width = `${contentWidth - 64}px`;
    description.style.fontSize = `${smallFontSize}rem`;
    description.style.lineHeight = `${smallLineHeight}rem`;
    description.style.fontStyle = "italic";
    description.style.textAlign = "center";
    description.style.padding = "15px 32px 0px 32px";
}

//======================================================================= ONLOAD  

//------------------------------------------------------------------- process html
function processHtml() {

    //------------------------------------------------------------------- find and name article title
    const articleTitle = document.querySelector('h2'); // (first h2 in document is the title - named by PROCESS HTML );
    if (articleTitle) {
        articleTitle.id = "article-title";
    }
    //------------------------------------------------------------------- re-order menu
    const menu = document.getElementById('menu');
    if (menu) { menu.innerHTML = ""; } // hide html menu

    const menuWrapper = document.getElementById("menu-wrapper"); // move menu-wrapper to the end of the document
    if (menuWrapper) {
        document.body.appendChild(menuWrapper); // append menu-wrapper as the last child of body
    }

    //------------------------------------------------------------------- add futura font classes
    const randomButton = document.getElementById("random-button");

    if (randomButton) {
        randomButton.classList.add("futura-font");  // add the font class only once at initialization
    }
    if (menuWrapper) {
        menuWrapper.classList.add("futura-font");  // add the font class only once at initialization
    }
    const banner = document.getElementById("banner");
    if (banner) {
        banner.classList.add("futura-font");  // add the font class only once at initialization
    }
}




//------------------------------------------------------------------- add event listeners (touch / mouse detection, image proportions, media fade-in)

function addGeneralEventListeners() {

    const elementsToFadeIn = document.querySelectorAll('.video, .image, .poster-image, .video-container');

    elementsToFadeIn.forEach((element, index) => {
        let mediaElements = [];

        const video = element.querySelector('video[poster]');
        if (video) {
            const posterImage = new Image();
            posterImage.src = video.poster;
            mediaElements.push(posterImage);
        }

        const otherMedia = element.querySelectorAll('img, video, iframe');
        otherMedia.forEach(media => {
            if (media !== video) {
                mediaElements.push(media);
            }
        });

        if (mediaElements.length === 0) {
            element.classList.add('is-loaded');
            return;
        }

        let mediaLoadedCount = 0;
        let hasFadedIn = false;

        setTimeout(() => {
            if (!hasFadedIn) {
                element.classList.add('is-loaded');
                hasFadedIn = true;
            }
        }, 5000);

        mediaElements.forEach(media => {
            const loadEvent = media.tagName === 'VIDEO' ? 'loadeddata' : 'load';

            const handleLoad = () => {
                // only increment and trigger fade-in if not already done
                if (!media.hasLoaded) {
                    media.hasLoaded = true;
                    mediaLoadedCount++;
                    if (mediaLoadedCount === mediaElements.length && !hasFadedIn) {
                        requestAnimationFrame(() => {
                            element.classList.add('is-loaded');
                            hasFadedIn = true;
                        });
                    }
                }
            };

            media.addEventListener(loadEvent, handleLoad);


            if (media.tagName === 'IMG' && media.complete) { // immediate checks for cached content
                requestAnimationFrame(() => handleLoad());
            } else if (media.tagName === 'VIDEO' && media.readyState >= 3) {
                requestAnimationFrame(() => handleLoad());
            } else if (media.tagName === 'IFRAME') {
                media.addEventListener('load', handleLoad);
                setTimeout(() => {
                    handleLoad();
                }, 2000);
            }
        });
    });

    document.querySelectorAll('.image').forEach(container => {
        const img = container.querySelector('img');
        if (img && img.complete) {
            styleThisImage(container);
        }
    });
}

// detect mouse click
window.addEventListener("mousedown", function onMouseClick() {
    isMouseDevice = true; // set global flag
    window.removeEventListener("mousedown", onMouseClick);
});

// detect touch click
window.addEventListener("touchstart", function onTouchClick() {
    isTouchDevice = true; // set global flag
    window.removeEventListener("touchstart", onTouchClick);
});



//------------------------------------------------------------------- set / overwrite fav icon

function setFavicon(url) {

    const links = document.querySelectorAll("link[rel~='icon']");  // remove any existing favicons
    links.forEach(link => link.parentNode.removeChild(link));

    const link = document.createElement("link"); // create a new link element
    link.rel = "icon";
    link.type = "image/x-icon";
    link.href = url;

    document.head.appendChild(link); // append it to the head
}


//------------------------------------------------------------------- image interaction: click to open in new tab / click to open hires diary pic in new tab 
function makeImagesClickable() {

    // .....  make diary photos clickable -> open hires in new tab when clicked
    function handleHiresClick(event) {
        const clickedImage = event.target; // Get the clicked image
        const newImageUrl = clickedImage.src.replace("_Diary_Lores_", "_Diary_");
        window.open(newImageUrl, '_blank'); // Open the new URL in a new tab
    }

    function handleImageClick(event) {
        const clickedImage = event.target; // Get the clicked image
        const newImageUrl = clickedImage.src;
        window.open(newImageUrl, '_blank'); // Open the new URL in a new tab
    }

    const images = document.querySelectorAll('img'); // get all images (if any exist)

    images.forEach(image => {

        if (image.src.includes("_Diary_Lores_")) { // lores diary images -> open hires
            image.style.cursor = 'zoom-in'; // visually indicate clickability
            image.title = 'Open hires in new tab';
            image.addEventListener('click', handleHiresClick);
        }else{
            image.style.cursor = 'zoom-in'; // visually indicate clickability
            image.title = 'Open in new tab';
            image.addEventListener('click', handleImageClick);
        }
    });

}

//------------------------------------------------------------------- add video controls after loading (this hides the custom browser preloader)
function addVideoControls(){
    
    const controllableVideos = document.querySelectorAll('.add-video-controls-after-loading');

    controllableVideos.forEach(video => {
        video.addEventListener('canplay', () => {
            video.setAttribute('controls', ''); // add native controls once ready
        });
    });

}

//------------------------------------------------------------------- onload

document.addEventListener('DOMContentLoaded', () => { // new onload (when DOM is ready, fires earlier)

    setFavicon("https://tajweird.com/images/favicon.ico");
    processHtml();
    addGeneralEventListeners();
    makeImagesClickable();
    addVideoControls();
    layout();
    document.body.classList.add('is-loaded');
});




//---------------------------------------------------------------------- coming via browser back button
window.addEventListener("pageshow", (event) => {
    if (event.persisted) {   // coming back from bfcache
        const randomBar = document.getElementById("random-bar");
        if (randomBar) {
            randomBar.style.width = "0%";
        }
        //  if (typeof resetTimer === "function") {
        //     resetTimer();
        // }
    }
});


//======================================================================= LEGACY FUNCTIONS TRIGGERED BY HTML

let pageLoaded = false;         // global flag
function pageLoad() {           // onload triggered by html body onload - triggers later than dom content loaded
    console.log("PAGE LOADED");

    console.log("                                                           ");
    console.log("                                __          __  _ __       ");
    console.log("   _________  __  ___________  / /_  ____  / /_(_) /_______");
    console.log("  / ___/ __ \\/ / / / ___/ __ \\/ __ \\/ __ \\/ __/ / //_/ ___/");
    console.log(" / /  / /_/ / /_/ / /  / /_/ / /_/ / /_/ / /_/ / ,< (__  ) ");
    console.log("/_/   \\____/\\__, /_/   \\____/_.___/\\____/\\__/_/_/|_/____/  ");
    console.log("           /____/                                          ");
    console.log("                                                           ");
    console.log("JS V3.0");
    pageLoaded = true;          // set global flag
    defaultRandomButtonStyle(); 
    layout(); // fallback layout - in case images have not been sized properly
}

function pageResize() {
    layout();
}












