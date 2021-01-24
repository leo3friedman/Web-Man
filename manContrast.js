function toStandardRgb(rgb) {
  return rgb.map((colorChannel) => colorChannel / 255);
}
function toLinearRgb(standardRgb) {
  return standardRgb.map((colorChannel) =>
    colorChannel <= 0.03928
      ? colorChannel / 12.92
      : Math.pow((colorChannel + 0.55) / 1.055, 2.4)
  );
}
function sum(arr) {
  return arr.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );
}
function luminance(rgb) {
  const [red, green, blue] = toLinearRgb(toStandardRgb(rgb));
  return sum([red * 0.2126, green * 0.7152, blue * 0.0722]);
}
const contrast = (lum1, lum2) =>
  lum1 > lum2 ? (lum2 + 0.05) / (lum1 + 0.05) : (lum1 + 0.05) / (lum2 + 0.05);
const contrastElement = document.getElementById("contrast");
const appleImage = document.getElementById("appleImage");
const canvas = document.getElementById("canvas");
const overlay = document.getElementById("overlay");
const previous = document.getElementById("previous");
const current = document.getElementById("current");
let prevRgb = [255, 255, 255];
let context = canvas.getContext("2d");
let overlayContext = overlay.getContext("2d");
let imageData = [];
let overlayImageData = [];
function pixelBelowIndex(pixelIndex, imageData) {
  return pixelIndex + canvas.width * 4;
}
function indexToCoord(pixelIndex, width, height) {
  const yCoord = Math.floor(pixelIndex / (width * 4));
  const xCoord = (pixelIndex - yCoord * (width * 4)) / 4;

  return { x: xCoord, y: yCoord };
}
function coordToIndex({ x, y }, width, height) {
  const pixelIndex = y * width * 4 + x * 4;
  return pixelIndex;
}
console.log(indexToCoord(coordToIndex({ x: 100, y: 54 }, 300), 300));
function contrastBelow(pixelIndex) {
  const RGBA_SIZE = 4;
  const aboveRgba = imageData.slice(pixelIndex, pixelIndex + RGBA_SIZE);
  let belowIndex = pixelBelowIndex(pixelIndex, imageData);
  const belowRgba = imageData.slice(belowIndex, belowIndex + RGBA_SIZE);
  const aboveLuminance = luminance(aboveRgba);
  const belowLuminance = luminance(belowRgba);
  const c = contrast(aboveLuminance, belowLuminance);
  return c;
}
function colorBelow(pixelIndex, data) {
  let belowIndex = pixelBelowIndex(pixelIndex, data);
  return data[belowIndex];
}

let handleImageLoad = () => {
  console.log("something");
  canvas.width = appleImage.width;
  canvas.height = appleImage.height;
  overlay.width = appleImage.width;
  overlay.height = appleImage.height;
  context.drawImage(appleImage, 0, 0);
  imageData = context.getImageData(0, 0, canvas.width, canvas.height).data;
  for (
    let pixelIndex = 0;
    pixelIndex < imageData.length - canvas.width * 4;
    pixelIndex += 4
  ) {
    // console.log(canvas.width);
    // console.log(pixelIndex);
    const c = contrastBelow(pixelIndex);
    const pixelCoord = indexToCoord(pixelIndex, canvas.width, canvas.height);
    // console.log(pixelCoord);
    // ctx.fillStyle = `rgba(255,0,0,1)`;
    if (c < 1) {
      overlayContext.fillStyle = `rgba(255,0,0,1)`;
      overlayContext.fillRect(pixelCoord.x, pixelCoord.y, 1, 1);
    }
    // ctx.putImageData([255, 0, 0, 1 - c], pixelCoord.x, pixelCoord.y);
  }
  overlayImageData = overlayContext.getImageData(
    0,
    0,
    canvas.width,
    canvas.height
  ).data;
  // .drawImage(appleImage, 0, 0, canvas.width, canvas.height);
};
appleImage.addEventListener("load", handleImageLoad);

// canvas.addEventListener("mousemove", (event) => {
//   // console.log(event);
//   const x = event.layerX;
//   const y = event.layerY;
//   const data = context.getImageData(x, y, 1, 1).data;
//   let rgbString = (rgb) => `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
//   console.log(rgbString(data));
//   previous.style.background = rgbString(prevRgb);
//   current.style.background = rgbString(data);
//   const currentLuminance = luminance(data);
//   const previousLuminance = luminance(prevRgb);
//   contrastElement.innerText = contrast(
//     currentLuminance,
//     previousLuminance
//   );
//   prevRgb = data;
// });
let platform = document.createElement("div");
let man = document.createElement("div");
man.id = "man";
man.style.width = "25px";
man.style.height = "87.5px";
man.style.backgroundColor = "black";
man.style.position = "absolute";
man.style.zIndex = "999";
platform.id = "platform";
platform.style.cssText =
  "position: absolute; border-radius:6px; border: 6px solid rgba(72, 207, 82, 0.3); z-index:998";
document.body.appendChild(man);
document.body.appendChild(platform);
man = document.getElementById("man");
let pageBottom = window.innerHeight + window.scrollY;
let pageWidth = document.body.clientWidth;
let manHeight = 87.5;
let manWidth = 25;
// ^^ figure out how to get manHeight = man.style.height
let fallHeight = pageBottom - manHeight;
let vel = 0;
let time = 0;
let pos = pageBottom - manHeight;
let keys = {};
let manLoc = {
  x: 0, //pageWidth / 2,
  y: -87.5, //pageBottom - manHeight,
  width: manWidth,
  height: manHeight,
};
let elementDims;
function isOver(loc, dim) {
  if (
    loc.y <= dim.top - manHeight &&
    loc.x + manWidth > dim.left &&
    loc.x < dim.right &&
    loc.y < pageBottom - manHeight &&
    manHeight <= dim.top - window.scrollY
  ) {
    return true;
  } else {
    return false;
  }
}
const speed = 1;
function moveUp() {
  // if (vel == 0 && manLoc.y == fallHeight) {
  //   manLoc.y -= 1;
  //   time = 0;
  //   vel = 1000;
  // }
  manLoc.y -= speed;
}
function moveRight() {
  if (manLoc.x < pageWidth - manWidth) {
    manLoc.x = manLoc.x + speed;
  }
}
function moveLeft() {
  if (manLoc.x > 0) {
    manLoc.x = manLoc.x - speed;
  }
}
function moveDown() {
  if (manLoc.y < pageBottom - manHeight) {
    manLoc.y = manLoc.y + speed;
    // manLoc.y = manLoc.y + 0.0000000001;
  }
}
window.addEventListener("keydown", function (event) {
  keys[event.key] = true;
});
window.addEventListener("keyup", function (event) {
  keys[event.key] = false;
});
function didHit(rect) {
  const bottomLeft = { x: rect.x, y: rect.y + rect.height };
  const index = coordToIndex(bottomLeft, canvas.width);
  const c = contrastBelow(index);
  // console.log(c);
  return c < 1;
}
function didHitRed(rect) {
  const bottomLeft = { x: rect.x, y: rect.y + rect.height };
  document.getElementById("man-bottom-label").innerText = JSON.stringify(
    bottomLeft
  );
  const index = coordToIndex(bottomLeft, canvas.width);
  document.getElementById("bottom-index").innerText = JSON.stringify(index);
  const color = colorBelow(index, overlayImageData);
  document.getElementById("red-below").innerText = JSON.stringify(color);
  return color && color[0] === 255;
}

function applyForce(loc, ground) {
  if (loc.y < ground) {
    time += 0.01;
    loc.y = Math.min(ground, pos - (vel * time - 800 * time * time));
  }
}

function update() {
  // getElementDims()
  pageBottom = window.innerHeight + window.scrollY;
  pageWidth = document.body.clientWidth;
  if (manLoc.y < window.scrollY && vel > 0) {
    window.scroll(0, manLoc.y);
  }
  if (manLoc.y > pageBottom - manHeight) {
    manLoc.y = pageBottom - manHeight;
  }
  if (manLoc.y < 0) {
    pos = 0;
    vel = 0;
    time = 0;
  }
  let landingPlatform;
  // let landingPlatform = elementDims.find(
  //   (elementAndDim) =>
  //     isOver(manLoc, elementAndDim.dim) && isLandable(elementAndDim.element)
  // );
  if (didHitRed(manLoc)) {
    console.log("hit!");
    fallHeight = manLoc.y;
  } else {
    fallHeight = pageBottom - manHeight;
  }
  // applyForce(manLoc, fallHeight);
  if (manLoc.y === fallHeight) {
    vel = 0;
    time = 0;
    pos = manLoc.y;
    const ctx = overlay.getContext("2d");
    ctx.fillStyle = `rgba(0,0,255,1)`;
    ctx.fillRect(manLoc.x, manLoc.y + manLoc.height, 1, 1);
  }

  if (keys.ArrowDown || keys.s) moveDown();
  if (keys.ArrowUp || keys.w) {
    moveUp();
  }
  if (keys.ArrowRight || keys.d) moveRight();
  if (keys.ArrowLeft || keys.a) moveLeft();
  man.style.left = manLoc.x + "px";
  man.style.top = manLoc.y + "px";
}
setInterval(update, 100);
