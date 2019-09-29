var Canvas = require('canvas');
var fs = require('fs').promises;
var globalConfig = {
    "backgoundImage": null,
    "coverImage": null
}
var skinConfig = {
    "headInfoBgPic": null,
    "giftControlBgPic": null,
    "rankListBgPic": null,
    "mainText": null,
    "normalText": null,
    "highlightContent": null,
    "border": null
}
/**
 * @type {import('canvas').Image}
 */
var headInfoBackgroundImage;
/**
 * @type {import('canvas').Image}
 */
var giftControlBackgroundImage;
/**
 * @type {import('canvas').Image}
 */
var rankListBackgroudImage;
/**
 * @type {import('canvas').Image}
 */
var coverImage;



function loadGlobalConfig() {
    return fs.readFile("./config/config.json", "utf-8").then((configJson) => {
        try {
            globalConfig = JSON.parse(configJson)
            return;
        } catch (error) {
            console.log(error);
            process.exit(-1);
        }
    })
}

function loadGlobalImage() {
    var promises = [];
    if (globalConfig.coverImage !== null && globalConfig.coverImage !== "") {
        promises.push(fs.readFile("./config/" + globalConfig.coverImage).then((data) => {
            return Canvas.loadImage(data).then((image) => {
                coverImage = image;
            });
        }))
    }
    if (globalConfig.backgoundImage !== null && globalConfig.backgoundImage !== "") {
        promises.push(fs.readFile("./config/" + globalConfig.backgoundImage).then((data) => {
            return Canvas.loadImage(data).then((image) => {
                backgoundImage = image;
            });
        }))
    }
    return Promise.all(promises).catch((error) => {
        console.log(error);
        process.exit(-1);
    });
}

function loadSkinConfig() {
    return fs.readFile("./in/config.json", "utf-8").then((configJson) => {
        try {
            skinConfig = JSON.parse(configJson)
        } catch (error) {
            console.log(error);
            process.exit(-1);
        }
    })
}
function loadSkinImage() {
    var promises = [];
    if (skinConfig.headInfoBgPic !== null && skinConfig.headInfoBgPic !== "") {
        promises.push(fs.readFile("./in/" + skinConfig.headInfoBgPic).then((data) => {
            return Canvas.loadImage(data).then((image) => {
                headInfoBackgroundImage = image;
            });
        }))
    }
    if (skinConfig.giftControlBgPic !== null && skinConfig.giftControlBgPic !== "") {
        promises.push(fs.readFile("./in/" + skinConfig.giftControlBgPic).then((data) => {
            return Canvas.loadImage(data).then((image) => {
                giftControlBackgroundImage = image;
            });
        }))
    }
    if (skinConfig.rankListBgPic !== null && skinConfig.rankListBgPic !== "") {
        promises.push(fs.readFile("./in/" + skinConfig.rankListBgPic).then((data) => {
            return Canvas.loadImage(data).then((image) => {
                rankListBackgroudImage = image;
            });
        }))
    }
    return Promise.all(promises).catch((error) => {
        console.log(error);
        process.exit(-1);
    });
}

function render() {
    var player = new Canvas.Canvas(1504, 890);
    var context = player.getContext('2d');
    if (globalConfig.backgoundImage !== null && globalConfig.backgoundImage !== "") {
        context.drawImage(backgoundImage, 0, 0);
    }
    renderBackground(context);
    renderSampleText(context);
    if (globalConfig.coverImage !== null && globalConfig.coverImage !== "") {
        context.drawImage(coverImage, 0, 0);
    }
    return player;
}

function renderSampleText(context) {
    context.save();
    context.fillStyle = skinConfig.highlightContent.replace(/\#..(......)/, "#$1");
    context.font = "30px Arial,Microsoft YaHei,Microsoft Sans Serif,Microsoft SanSerf,\5FAE\8F6F\96C5\9ED1";
    context.fillText("高亮文本示例", 1230, 100);
    context.fillStyle = skinConfig.mainText.replace(/\#..(......)/, "#$1");
    context.fillText("主要文本示例", 1230, 150);
    context.fillStyle = skinConfig.normalText.replace(/\#..(......)/, "#$1");
    context.fillText("一般文本示例", 1230, 200);
    context.restore();
}

function renderBackground(context) {
    context.save();
    roundedRectanglePath(context, 0, 0, 1190, 98, 12, 12);
    context.clip();
    context.drawImage(headInfoBackgroundImage, 0, 0, 1190, 98);
    context.restore();
    context.save();
    roundedRectanglePath(context, 0, 767, 1190, 124, 0, 0, 12, 12);
    context.clip();
    context.drawImage(giftControlBackgroundImage, 0, 767, 1190, 124);
    context.restore();
    context.save();
    roundedRectanglePath(context, 1203, 0, 300, 350, 12, 12, 0, 0);
    context.clip();
    context.drawImage(rankListBackgroudImage, 1203, 0, 300, 350);
    context.restore();
}

/**
 * 
 * @param {import('canvas').CanvasRenderingContext2D} context 
 * @param {number} x 
 * @param {number} y 
 * @param {number} width 
 * @param {number} height 
 * @param {number} topLeft 
 * @param {number} topRight 
 * @param {number} bottomRight 
 * @param {number} bottomLeft 
 */
function roundedRectanglePath(context, x, y, width, height, topLeft = 0, topRight = 0, bottomRight = 0, bottomLeft = 0) {
    context.beginPath();
    if (topLeft > 0) {
        context.moveTo(x, y + topLeft);
        context.arcTo(x, y, x + topLeft, y, topLeft);
    } else {
        context.moveTo(x, y);
    }
    if (topRight > 0) {
        context.lineTo(x + width - topRight, y);
        context.arcTo(x + width, y, x + width, y + topRight, topRight);
    } else {
        context.lineTo(x + width, y);
    }
    if (bottomRight > 0) {
        context.lineTo(x + width, y + height - bottomRight);
        context.arcTo(x + width, y + height, x + width - bottomRight, y + height, bottomRight)
    } else {
        context.lineTo(x + width, y + height)
    }
    if (bottomLeft > 0) {
        context.lineTo(x + bottomLeft, y + height);
        context.arcTo(x, y + height, x, y + height - bottomLeft, bottomLeft);
    } else {
        context.lineTo(x, y + height)
    }
    context.closePath()
}


/**
 * 
 * @param {import('canvas').Canvas} canva
 */
function saveImage(canva) {
    fs.writeFile("./out/out.png", canva.toBuffer("image/png")).then(() => {
        console.log("finish");
        process.exit(0);
    })
}

loadGlobalConfig().then(loadGlobalImage).then(loadSkinConfig).then(loadSkinImage).then(render).then(saveImage);