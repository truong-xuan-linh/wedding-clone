const fs = require('fs');

const path = './components/InvitationContent.tsx';
let content = fs.readFileSync(path, 'utf8');

const updates = {
  "10ye040sl3": { top: 7060, left: 9, width: 218, height: 328 },
  "jrnfy3pmtc": { top: 7060, left: 238, width: 224, height: 224 },
  "s18eonx1nj": { top: 7400, left: 9, width: 218, height: 224 },
  "kp3o3tijat": { top: 7295, left: 238, width: 224, height: 328 },
  "vrmnf0k4bm": { top: 7635, left: 9, width: 218, height: 328 },
  "e1vno6g9nk": { top: 7635, left: 238, width: 224, height: 224 },
  "z879v00iyj": { top: 7975, left: 110, width: 250, height: 350 }
};

for (const [id, stats] of Object.entries(updates)) {
  const blockRegex = new RegExp(`(<div\\s+data-node-id="${id}"[\\s\\S]*?style={{[\\s\\S]*?)(top: "[\\d.]+px",[\\s\\S]*?})`, 'g');
  
  content = content.replace(blockRegex, (match, prefix) => {
    // We recreate the style block for positioning
    const newStyle = `top: "${stats.top}px",
                            left: "${stats.left}px",
                            width: "${stats.width}px",
                            height: "${stats.height}px",
                            zIndex: "60",
                            cursor: "default",
                            transform: "rotate(0deg) scale(1, 1)",
                          }}`;
    return prefix + newStyle;
  });
}

fs.writeFileSync(path, content, 'utf8');
console.log("Updated shapes successfully!");
