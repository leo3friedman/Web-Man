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
let loc = {
  x: pageWidth / 2,
  y: pageBottom - manHeight,
};
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
  let style = getComputedStyle(element);
  let parentStyle = getComputedStyle(element.parentElement);
  if (
    style.nodeName === "IMG" ||
    (style.backgroundColor !== "rgba(0, 0, 0, 0)" &&
      style.backgroundColor !== parentStyle.backgroundColor) ||
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
    loc.y = loc.y + 0.0000000001;
  }
}
window.addEventListener("keydown", function (event) {
  keys[event.key] = true;
});
window.addEventListener("keyup", function (event) {
  keys[event.key] = false;
});
function update() {
  // getElementDims()
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
      platform.style.top = landingPlatform.dim.top - 6 + "px";
      platform.style.width = landingPlatform.dim.width + "px";
      platform.style.left = landingPlatform.dim.left - 6 + "px";
      platform.style.height = landingPlatform.dim.height + "px";
    }
  } else {
    platform.style.display = "none";
    // elementDims.forEach((elementAndDim)=>{
    //   elementAndDim.element.style.outline = null
    // })
  }

  if (keys.ArrowDown || keys.s) moveDown();
  if (keys.ArrowUp || keys.w) {
    moveUp();
  }
  if (keys.ArrowRight || keys.d) moveRight();
  if (keys.ArrowLeft || keys.a) moveLeft();
  man.style.left = loc.x + "px";
  man.style.top = loc.y + "px";
}
setInterval(update, 10);
