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
  "position: absolute; border-top: 10px solid rgba(0, 255, 0, 0.3); z-index:998";
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
let loc = {
  x: pageWidth / 2,
  y: pageBottom - manHeight,
};
console.log(loc);
let elementDims;
function getElementDims() {
  elementDims = Array.from(document.querySelectorAll("body *")).map(
    (element) => {
      let rect = element.getBoundingClientRect();
      return {
        dim: {
          top: rect.top + window.scrollY,
          bottom: rect.bottom + window.scrollY,
          right: rect.right,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        },
        element: element,
      };
    }
  );
}
getElementDims();
console.log(elementDims);
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
function isLandable(element) {
  let el = getComputedStyle(element);
  let parent = getComputedStyle(element.parentElement);
  if (
    el.nodeName === "IMG" ||
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
    vel = 1000;
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
  console.log(loc);
});
window.addEventListener("keyup", function (event) {
  keys[event.key] = false;
});
function update() {
  pageBottom = window.innerHeight + window.scrollY;
  pageWidth = document.body.clientWidth;
  if (loc.y < window.scrollY && vel > 0) {
    window.scroll(0, loc.y);
  }
  if (loc.y > pageBottom - manHeight) {
    loc.y = pageBottom - manHeight;
  }
  if (loc.y < 0) {
    pos = 0;
    vel = 0;
    time = 0;
  }
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
    loc.y = Math.min(fallHeight, pos - (vel * time - 800 * time * time));
  }
  if (loc.y == fallHeight) {
    vel = 0;
    time = 0;
    pos = loc.y;
    if (landingPlatform) {
      platform.style.display = "block";
      platform.style.top = landingPlatform.dim.top + "px";
      platform.style.width = landingPlatform.dim.width + "px";
      platform.style.left = landingPlatform.dim.left + "px";
    } else {
      platform.style.display = "none";
    }
  }

  if (keys.ArrowDown || keys.s) moveDown();
  if (keys.ArrowUp || keys.w) {
    moveUp();
    console.log(loc.y == fallHeight);
    console.log(vel);
    console.log(fallHeight);
    console.log(loc.y);
  }
  if (keys.ArrowRight || keys.d) moveRight();
  if (keys.ArrowLeft || keys.a) moveLeft();
  man.style.left = loc.x + "px";
  man.style.top = loc.y + "px";
}
setInterval(update, 10);
