const fs = require('fs');

const path = './components/InvitationContent.tsx';
let content = fs.readFileSync(path, 'utf8');

const newImages = [
  '102943104078502942116.jpg',
  '193888583255200643410.jpg',
  '20460463570702871779.jpg',
  '36817307803945082541.jpg',
  '36817307803945082542.jpg',
  '387299715805235554815.jpg',
  '4277553449265611778.jpg'
];

const SHIFT_AMOUNT = 1400;
const THRESHOLD = 7050;

let shiftedLinesCount = 0;

content = content.replace(/top:\s*"([\d.]+)px"/g, (match, val) => {
  let topVal = parseFloat(val);
  if (topVal >= THRESHOLD) {
    shiftedLinesCount++;
    return `top: "${(topVal + SHIFT_AMOUNT).toFixed(2)}px"`;
  }
  return match;
});

content = content.replace(/height:\s*"([\d.]+)px"/g, (match, val) => {
  let hVal = parseFloat(val);
  if (hVal > 8000) { 
    return `height: "${(hVal + SHIFT_AMOUNT).toFixed(2)}px"`;
  }
  return match;
});

const generateId = () => Math.random().toString(36).substring(2, 12);

let newJSX = '';

function genBg(top) {
  const id = generateId();
  return `
      <div
        data-node-id="${id}"
        className="jsx-1944329802"
        style={{
          position: "absolute",
          top: "${top}px",
          left: "0.8532px",
          width: "475.327px",
          height: "645.244px",
          zIndex: "0",
          cursor: "default",
          transform: "rotate(0deg) scale(1, 1)",
        }}
      >
        <div data-transition-key="${id}-fade-in-1.6-0-ease-out-false" data-node-id="${id}" style={{ transform: "none", opacity: "1", width: "100%", height: "100%" }}>
          <div
            className="jsx-1944329802"
            style={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box", opacity: "1" }}
          >
            <div className="jsx-1944329802 photo-component" style={{ WebkitMaskBoxImageSource: "none", maskImage: "none", maskSize: "100% 100%" }}>
              <div
                className="jsx-1944329802 photo-bg-wrap"
                style={{ backgroundImage: "url('/assets/a4575674-74a4-4283-a7cd-ff2d64f7c490.png')", borderRadius: "0px" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
  `;
}

function genPhoto(top, left, w, h, img, anim) {
  const id = generateId();
  return `
      <div
        data-node-id="${id}"
        className="jsx-1944329802"
        style={{
          position: "absolute",
          top: "${top}px",
          left: "${left}px",
          width: "${w}px",
          height: "${h}px",
          zIndex: "60",
          cursor: "default",
          transform: "rotate(0deg) scale(1, 1)",
        }}
      >
        <div data-transition-key="${id}-${anim}-1.6-0-ease-out-false" data-node-id="${id}" style={{ transition: "1.6s ease-out", transform: "none", opacity: "1", width: "100%", height: "100%" }}>
          <div
            className="jsx-1944329802"
            style={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box", opacity: "1", border: "0px solid", padding: "0px", backgroundColor: "transparent", textShadow: "rgba(0, 0, 0, 0) 0px 0px 2px", boxShadow: "none", borderRadius: "0px" }}
          >
            <div className="jsx-1944329802 photo-component" style={{ WebkitMaskBoxImageSource: "none", WebkitMaskBoxImageSlice: "0 fill", maskImage: "none", maskSize: "100% 100%", maskRepeat: "no-repeat" }}>
              <div
                className="jsx-1944329802 photo-bg-wrap"
                style={{ backgroundImage: "url('/assets/images/${img}')", borderRadius: "0px" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
  `;
}

// Backgrounds
newJSX += genBg(7000);
newJSX += genBg(7600);
newJSX += genBg(8200);

// Photos - Masonry exact mimic of album love geometry but transposed:
newJSX += genPhoto(7000, 9, 453, 300, newImages[0], "flip-in");
newJSX += genPhoto(7320, 9, 218, 218, newImages[1], "fade-in");
newJSX += genPhoto(7320, 238, 224, 337, newImages[2], "slide-down");
newJSX += genPhoto(7560, 9, 218, 328, newImages[3], "slide-up");
newJSX += genPhoto(7680, 237, 225, 294, newImages[4], "slide-left");
newJSX += genPhoto(7910, 9, 218, 218, newImages[5], "fade-in");
newJSX += genPhoto(8000, 237, 221, 284, newImages[6], "slide-up");

const injectTarget = '<span>\\s*<div\\s*className="workarea-resize-handle"';
const injectRegex = new RegExp(`(${injectTarget})`);

if (injectRegex.test(content)) {
  content = content.replace(injectRegex, newJSX + '\\n$1');
  console.log("Successfully injected masonry images JSX with animations and backgrounds bridged.");
}

fs.writeFileSync(path, content, 'utf8');
console.log("Shifted lines count: " + shiftedLinesCount);
