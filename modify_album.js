const fs = require('fs');

const path = './components/InvitationContent.tsx';
let content = fs.readFileSync(path, 'utf8');

// The 7 unused images to add
const newImages = [
  '102943104078502942116.jpg',
  '193888583255200643410.jpg',
  '20460463570702871779.jpg',
  '36817307803945082541.jpg',
  '36817307803945082542.jpg',
  '387299715805235554815.jpg',
  '4277553449265611778.jpg'
];

// Let's decide where the Album ends.
// From our manual exploration, album pictures are mostly in the 6000-6800 top range.
// The next section might be "LỜI CHÚC" or RSVP which is > 7000.
// Let's shift everything with top >= 6850 down by 1400px.
const SHIFT_AMOUNT = 1400;
const THRESHOLD = 6850;

let shiftedLinesCount = 0;

content = content.replace(/top:\s*"([\d.]+)px"/g, (match, val) => {
  let topVal = parseFloat(val);
  if (topVal >= THRESHOLD) {
    shiftedLinesCount++;
    return `top: "${(topVal + SHIFT_AMOUNT).toFixed(2)}px"`;
  }
  return match;
});

// We must also shift the `height: "8453.42px"` to `9853.42px`.
content = content.replace(/height:\s*"8453.42px"/g, `height: "${(8453.42 + SHIFT_AMOUNT).toFixed(2)}px"`);

console.log(`Shifted ${shiftedLinesCount} position 'top' attributes.`);

// Now we need to append the new image divs right at THRESHOLD (6850).
// We can find a suitable place to inject. Since it's a giant wrapping div `pc-content`, we can inject it right before the last closing tags of `pc-content`.
// Or simply inject it after one of the existing components.
// For instance: `data-node-id="6YpQnb-vcN"`
// Let's just generate the JSX for the 7 new photos.
let newJSX = '';
let currentTop = 6850;
let rowHeight = 320; // 320px height per photo
let gap = 20;

newImages.forEach((img, i) => {
  // zigzag logic
  let left = (i % 2 === 0) ? 20 : 250;
  if (i % 2 === 0 && i !== 0) {
    currentTop += rowHeight + gap;
  }
  
  // if last image and odd, make it full width
  let width, height;
  if (i === newImages.length - 1 && i % 2 === 0) {
    left = 20;
    width = 434;
    height = rowHeight;
  } else {
    width = 200;
    height = rowHeight;
  }

  newJSX += `
      <div
        className="jsx-1944329802"
        style={{
          position: "absolute",
          top: "${currentTop}px",
          left: "${left}px",
          width: "${width}px",
          height: "${height}px",
          zIndex: "60",
          cursor: "default",
          transform: "rotate(0deg) scale(1, 1)",
        }}
      >
        <div style={{ transition: "1.6s ease-out", opacity: "1", width: "100%", height: "100%" }}>
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
              opacity: "1",
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
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
  `;
});

// Let's inject newJSX before the closing of the main wrapper.
// The main wrapper `pc-content` ends here:
/*
                      <div
                        className="__resizable_base__"
                        style={{
*/
// It's part of the pc-content children list.
const injectTarget = '<span>\\s*<div\\s*className="workarea-resize-handle"';
const injectRegex = new RegExp(`(${injectTarget})`);

if (injectRegex.test(content)) {
  content = content.replace(injectRegex, newJSX + '\\n$1');
  console.log("Successfully injected new images JSX.");
} else {
  console.log("Failed to find injection point!");
}

fs.writeFileSync(path, content, 'utf8');
console.log("Done modifying InvitationContent.tsx");
