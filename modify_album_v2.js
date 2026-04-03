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

const SHIFT_AMOUNT = 2100;
const THRESHOLD = 7050; // Shift everything that is positioned below the album

let shiftedLinesCount = 0;

content = content.replace(/top:\s*"([\d.]+)px"/g, (match, val) => {
  let topVal = parseFloat(val);
  // Shift only if below the threshold
  if (topVal >= THRESHOLD) {
    shiftedLinesCount++;
    return `top: "${(topVal + SHIFT_AMOUNT).toFixed(2)}px"`;
  }
  return match;
});

content = content.replace(/height:\s*"([\d.]+)px"/g, (match, val) => {
  let hVal = parseFloat(val);
  if (hVal > 8000) { // match the main wrapper height
    return `height: "${(hVal + SHIFT_AMOUNT).toFixed(2)}px"`;
  }
  return match;
});


let newJSX = '';

function genBg(top) {
  return `
      <div
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
        <div style={{ transform: "none", opacity: "1", width: "100%", height: "100%" }}>
          <div
            className="jsx-1944329802"
            style={{
              position: "relative", width: "100%", height: "100%", display: "flex",
              alignItems: "center", justifyContent: "center", boxSizing: "border-box"
            }}
          >
            <div className="jsx-1944329802 photo-component" style={{ WebkitMaskBoxImageSource: "none", maskImage: "none", maskSize: "100% 100%" }}>
              <div
                className="jsx-1944329802 photo-bg-wrap"
                style={{ backgroundImage: "url('/assets/a4575674-74a4-4283-a7cd-ff2d64f7c490.png')" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
  `;
}

function genPhoto(top, left, w, h, img, z = "60") {
  return `
      <div
        className="jsx-1944329802"
        style={{
          position: "absolute",
          top: "${top}px",
          left: "${left}px",
          width: "${w}px",
          height: "${h}px",
          zIndex: "${z}",
          cursor: "default"
        }}
      >
        <div style={{ opacity: "1", width: "100%", height: "100%" }}>
          <div
            className="jsx-1944329802"
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxSizing: "border-box",
            }}
          >
            <div className="jsx-1944329802 photo-component" style={{ width: "100%", height: "100%" }}>
              <div
                className="jsx-1944329802 photo-bg-wrap"
                style={{
                  width: "100%", height: "100%",
                  backgroundImage: "url('/assets/images/${img}')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: "2px",
                  boxShadow: "1px 2px 4px rgba(0,0,0,0.2)"
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
  `;
}

// Frame 1
let startTop = 7050; // Place right below the existing album
newJSX += genBg(startTop);
newJSX += genPhoto(startTop + 60, 20, 210, 260, newImages[0]);
newJSX += genPhoto(startTop + 60, 245, 210, 260, newImages[1]);
newJSX += genPhoto(startTop + 340, 110, 250, 250, newImages[2]);

// Frame 2
let nextTop = startTop + 670; 
newJSX += genBg(nextTop);
newJSX += genPhoto(nextTop + 60, 20, 210, 260, newImages[3]);
newJSX += genPhoto(nextTop + 60, 245, 210, 260, newImages[4]);
newJSX += genPhoto(nextTop + 340, 110, 250, 250, newImages[5]);

// Frame 3 (only 1 image left)
let finalTop = nextTop + 670;
newJSX += genBg(finalTop);
newJSX += genPhoto(finalTop + 140, 80, 310, 360, newImages[6]);


// Inject
const injectTarget = '<span>\\s*<div\\s*className="workarea-resize-handle"';
const injectRegex = new RegExp(`(${injectTarget})`);

if (injectRegex.test(content)) {
  content = content.replace(injectRegex, newJSX + '\\n$1');
  console.log("Successfully injected new images JSX.");
} else {
  console.log("Failed to find injection point!");
}

fs.writeFileSync(path, content, 'utf8');
console.log("Done modifying InvitationContent.tsx. Shifted " + shiftedLinesCount);
