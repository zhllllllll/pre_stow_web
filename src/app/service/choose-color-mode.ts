const containerTypeStyles: Record<string, { name: string; color: string }> = {
    "22G": { name: "20英尺干货箱", color: "green" },
    "25G": { name: "20英尺干高箱", color: "red" },
    "22V": { name: "20英尺挂衣箱", color: "blue" },
    "22U": { name: "20英尺开顶箱", color: "orange" },
    "22R": { name: "20英尺冷冻箱", color: "yellow" },
    "25R": { name: "20英尺冷高箱", color: "cyan" },
    "22T": { name: "20英尺油罐箱", color: "purple" },
    "22P": { name: "20英尺框架箱", color: "magenta" },
    "42G": { name: "40英尺干货箱", color: "pink" },
    "45G": { name: "40英尺干高箱", color: "limegreen" },
    "42V": { name: "40英尺挂衣箱", color: "teal" },
    "42U": { name: "40英尺开顶箱", color: "lavender" },
    "42R": { name: "40英尺冷冻箱", color: "lightyellow" },
    "45R": { name: "40英尺冷高箱", color: "lightgreen" },
    "42T": { name: "40英尺油罐箱", color: "brown" },
    "42P": { name: "40英尺框架箱", color: "olive" },
    "L2G": { name: "45英尺干货箱", color: "plum" },
    "L5G": { name: "45英尺干高箱", color: "coral" },
    "L2V": { name: "45英尺挂衣箱", color: "sienna" },
    "L2U": { name: "45英尺开顶箱", color: "thistle" },
    "L2R": { name: "45英尺冷冻箱", color: "tomato" },
    "L5R": { name: "45英尺冷高箱", color: "turquoise" },
    "L2T": { name: "45英尺油罐箱", color: "tan" },
    "L2P": { name: "45英尺框架箱", color: "navy" }
};
export default containerTypeStyles

export const generateColor = (pod: string): string => {
  let hash = 0;
  for (let i = 0; i < pod.length; i++) {
    hash = pod.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 60%)`;
};
