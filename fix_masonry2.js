const fs = require('fs');

const path = './components/InvitationContent.tsx';
let content = fs.readFileSync(path, 'utf8');

const updates = {
  "z879v00iyj": { top: 7875, left: 238, width: 224, height: 337 } // Same aspect ratio as Photo 2 (224x337)
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
console.log("Updated shape z879v00iyj successfully!");
