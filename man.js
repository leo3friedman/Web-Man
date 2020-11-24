const platform = document.getElementById("platform");
const man = document.getElementById("man");
let pageBottom = document.body.clientHeight;
let pageWidth = document.body.clientWidth;
let manHeight = 87.5;
let manWidth = 25;
// ^^ figure out how to get manHeight = man.style.height
let fallHeight = pageBottom - manHeight;
let vel = 0;
let time = 0;
let pos = pageBottom - manHeight;
let keys = {};
let loc = {
  x: pageWidth / 2,
  y: pageBottom - manHeight,
};
let elementDims;
function getElementDims() {
  elementDims = Array.from(document.querySelectorAll("main *")).map(
    (element) => ({
      dim: element.getBoundingClientRect(),
      element: element,
    })
  );
  console.log(elementDims);
}
getElementDims();
function isOver(loc, dim) {
  if (
    loc.y <= dim.top - manHeight &&
    loc.x + manWidth > dim.left &&
    loc.x < dim.right
  ) {
    return true;
  } else {
    return false;
  }
}
function isLandable(element) {
  let el = getComputedStyle(element);
  let parent = getComputedStyle(element.parentElement);
  if (
    el.backgroundColor !== parent.backgroundColor ||
    Array.from(element.childNodes).some(
      (child) => child.nodeType === 3 && /\S+/.test(child.textContent)
    )
  ) {
    return true;
  } else {
    return false;
  }
}
const speed = 2;
function moveUp() {
  if (vel == 0 && loc.y == fallHeight) {
    loc.y -= 0.001;
    time = 0;
    vel = 610;
  }
}
function moveRight() {
  if (loc.x < pageWidth - manWidth) {
    loc.x = loc.x + speed;
  }
}
function moveLeft() {
  if (loc.x > 0) {
    loc.x = loc.x - speed;
  }
}
function moveDown() {
  if (loc.y < pageBottom - manHeight) {
    loc.y = loc.y + 0.001;
  }
}

window.addEventListener("keydown", function (event) {
  keys[event.key] = true;
});
window.addEventListener("keyup", function (event) {
  keys[event.key] = false;
});
let newHeight;
let changeHeight;
let oldHeight = document.body.clientHeight;
window.addEventListener("resize", function (event) {
  newHeight = document.body.clientHeight;
  changeHeight = oldHeight - newHeight;
  loc.y -= changeHeight;
  fallHeight -= changeHeight;
  oldHeight = newHeight;
  getElementDims();
});
function update() {
  pageBottom = document.body.clientHeight;
  pageWidth = document.body.clientWidth;
  let landingPlatform = elementDims.find(
    (elementAndDim) =>
      isOver(loc, elementAndDim.dim) && isLandable(elementAndDim.element)
  );
  if (landingPlatform) {
    fallHeight = landingPlatform.dim.top - manHeight;
  } else {
    fallHeight = pageBottom - manHeight;
  }
  if (loc.y < fallHeight) {
    time += 0.01;
    // console.log("time: " + time);
    // console.log("fallHeight: " + fallHeight);
    loc.y = Math.min(fallHeight, pos - (vel * time - 800 * time * time));
    // console.log("location y " + loc.y);
    // console.log("velocity: " + vel);
  }
  if (loc.y == fallHeight) {
    vel = 0;
    time = 0;
    pos = loc.y;
    if (landingPlatform) {
      platform.style.display = "block";
      platform.style.top = landingPlatform.dim.top;
      platform.style.width = landingPlatform.dim.width;
      platform.style.left = landingPlatform.dim.left;
    } else {
      platform.style.display = "none";
    }
  }

  if (keys.ArrowDown || keys.s) moveDown();
  if (keys.ArrowUp || keys.w) {
    moveUp();
  }
  if (keys.ArrowRight || keys.d) moveRight();
  if (keys.ArrowLeft || keys.a) moveLeft();
  man.style.left = loc.x;
  man.style.top = loc.y;
}
setInterval(update, 10);
