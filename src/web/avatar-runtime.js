/**
 * @license AGPL-3.0-only
 * Bible Strong Avatar Lab (@bible-strong/avatar-core, @bible-strong/avatar-web)
 * Copyright (c) 2024 Stéphane Montlouis-Calixte
 * https://github.com/smontlouis/bible-strong-avatar-lab
 * Bundled as standalone ES module for browser procedural SVG rendering.
 */
// scratch/avatar-core/dist/ambientMotion.js
var e = [
  "none",
  "microSaccades",
  "shake"
];
var t = [
  "none",
  "slowDrift",
  "shake"
];
var n = new Set(e);
var r = new Set(t);
var o = (e3) => e3 * e3 * (3 - 2 * e3);
var s = (e3) => {
  let t3 = Math.sin(e3 * 127.1 + 311.7) * 43758.5453;
  return (t3 - Math.floor(t3)) * 2 - 1;
};
var c = (e3) => e3.headX * 0.71 + e3.headY * 1.13 + e3.headZ * 1.37;
var l = 17.29;
var u = (e3, t3, n4, r4) => {
  let i5 = e3 / r4, a4 = Math.floor(i5), c5 = o(i5 - a4), l5 = s(a4 * 3 + t3 + n4);
  return l5 + (s((a4 + 1) * 3 + t3 + n4) - l5) * c5;
};
var d = (e3, t3, n4) => {
  let r4 = 1100;
  if (e3 <= 0) return 0;
  let i5 = Math.floor(e3 / r4), a4 = (e3 - i5 * r4) / 140, c5 = o(Math.min(a4, 1)), l5 = i5 === 0 ? 0 : s((i5 - 1) * 2 + t3 + n4);
  return l5 + (s(i5 * 2 + t3 + n4) - l5) * c5;
};
var m = (e3, t3, n4 = 1) => {
  if (e3.eyeMotion === "microSaccades") return {
    x: d(t3, 0, l) * 1.5 * n4,
    y: d(t3, 1, l) * 0.9 * n4
  };
  if (e3.eyeMotion === "shake") {
    let e4 = t3 / 1e3;
    return {
      x: (Math.sin(e4 * 47) + Math.sin(e4 * 71) * 0.45) * 1.2 * n4,
      y: (Math.sin(e4 * 59) + Math.sin(e4 * 83) * 0.4) * 0.8 * n4
    };
  }
  return {
    x: 0,
    y: 0
  };
};
var h = (e3, t3, n4 = 1) => {
  let r4 = { ...e3 }, i5 = c(e3);
  if (e3.bodyMotion === "slowDrift") r4.headX += u(t3, 0, i5, 2600) * 0.8 * n4, r4.headY += u(t3, 1, i5, 3300) * 1.15 * n4, r4.headZ += u(t3, 2, i5, 4100) * 0.45 * n4;
  else if (e3.bodyMotion === "shake") {
    let e4 = t3 / 1e3;
    r4.headX += (Math.sin(e4 * 31) + Math.sin(e4 * 53) * 0.45) * 1.15 * n4, r4.headY += (Math.sin(e4 * 37) + Math.sin(e4 * 61) * 0.4) * 1.35 * n4, r4.headZ += Math.sin(e4 * 43) * 0.7 * n4;
  }
  return r4;
};
var g = (e3, t3, n4 = 1) => {
  let r4 = h(e3, t3, n4), i5 = m(e3, t3, n4);
  return r4.positionXLeft += i5.x, r4.positionXRight += i5.x, r4.positionYLeft += i5.y, r4.positionYRight += i5.y, r4;
};

// scratch/avatar-core/dist/surfaces.js
var e2 = {
  sphere: {
    type: "sphere",
    width: 240,
    height: 240,
    depth: 240,
    roundness: 1
  },
  mickey: {
    type: "mickey",
    width: 220,
    height: 210,
    depth: 145,
    roundness: 1
  },
  cursor: {
    type: "cursor",
    width: 175,
    height: 260,
    depth: 145,
    roundness: 0
  },
  cube: {
    type: "cube",
    width: 245,
    height: 245,
    depth: 220,
    roundness: 0
  },
  capsule: {
    type: "capsule",
    width: 205,
    height: 270,
    depth: 205,
    roundness: 1
  },
  cylinder: {
    type: "cylinder",
    width: 235,
    height: 250,
    depth: 215,
    roundness: 0.45,
    morphRoundness: 0
  },
  cone: {
    type: "cone",
    width: 250,
    height: 265,
    depth: 225,
    roundness: 0,
    morphRoundness: 0,
    tipRoundness: 0.55,
    baseRoundness: 0.45
  },
  diamond: {
    type: "diamond",
    width: 235,
    height: 260,
    depth: 215,
    roundness: 0
  }
};
var n2 = (e3, t3) => Math.sign(e3) * Math.abs(e3) ** t3;
var r2 = (e3, t3, r4, i5, a4, o4, s5) => {
  let c5 = n2(Math.cos(t3), o4);
  return [
    r4 / 2 * c5 * n2(Math.sin(e3), s5),
    i5 / 2 * n2(Math.sin(t3), o4),
    a4 / 2 * c5 * n2(Math.cos(e3), s5)
  ];
};
var i = (e3, t3, n4) => {
  let r4 = e3.width / 2, i5 = e3.depth / 2, a4 = Math.min(r4, e3.height / 2), o4 = Math.max(0, (e3.height - a4 * 2) / 2), s5 = o4 * 2 + Math.PI * a4, c5 = (n4 + Math.PI / 2) / Math.PI * s5, l5 = r4, u5 = 0;
  if (c5 < Math.PI * a4 / 2) {
    let e4 = -Math.PI / 2 + c5 / a4;
    l5 = r4 * Math.cos(e4), u5 = -o4 + a4 * Math.sin(e4);
  } else if (c5 <= Math.PI * a4 / 2 + o4 * 2) u5 = -o4 + c5 - Math.PI * a4 / 2;
  else {
    let e4 = (c5 - Math.PI * a4 / 2 - o4 * 2) / a4;
    l5 = r4 * Math.cos(e4), u5 = o4 + a4 * Math.sin(e4);
  }
  let d4 = r4 ? i5 / r4 : 1;
  return [
    l5 * Math.sin(t3),
    u5,
    l5 * d4 * Math.cos(t3)
  ];
};
var a = (e3) => Math.max(0, Math.min(2, e3 ?? 0));
var o2 = (e3) => 1 + a(e3.roundness) / 2;
var s2 = 0.04;
var c2 = (e3) => e3.roundness <= 0 ? Infinity : 2 / (s2 + a(e3.roundness) / 2 * 0.96);
var l2 = (e3, t3, n4, r4) => {
  let i5 = Math.cos(n4) * Math.sin(t3), a4 = Math.sin(n4), o4 = Math.cos(n4) * Math.cos(t3), s5 = Number.isFinite(r4) ? (Math.abs(i5) ** r4 + Math.abs(a4) ** r4 + Math.abs(o4) ** r4) ** (1 / r4) || 1 : Math.max(Math.abs(i5), Math.abs(a4), Math.abs(o4)) || 1;
  return [
    e3.width / 2 * (i5 / s5),
    e3.height / 2 * (a4 / s5),
    e3.depth / 2 * (o4 / s5)
  ];
};
var u2 = (e3, t3, n4) => l2(e3, t3, n4, o2(e3));
var d2 = (e3, t3, n4) => l2(e3, t3, n4, c2(e3));
var f = 0.24;
var p = 0.2;
var m2 = 0.22;
var h2 = (e3) => a(e3.morphRoundness) / 2;
var g2 = (e3, t3, n4) => {
  let r4 = h2(e3), i5 = Math.max(0, Math.min(1, t3)), a4 = Math.sin(i5 * Math.PI), o4 = (1 - Math.cos(i5 * Math.PI)) / 2;
  return {
    radiusScale: n4.radiusScale + (a4 - n4.radiusScale) * r4,
    verticalProgress: n4.verticalProgress + (o4 - n4.verticalProgress) * r4
  };
};
var _ = (e3, t3, n4, r4, i5) => {
  let a4 = 1 - i5;
  return a4 ** 3 * e3 + 3 * a4 * a4 * i5 * t3 + 3 * a4 * i5 * i5 * n4 + i5 ** 3 * r4;
};
var v = (e3) => ({
  tipFraction: (e3.tipRoundness ?? 0) * f,
  baseFraction: (e3.baseRoundness ?? 0) * p
});
var y = (e3, t3) => {
  let n4 = Math.max(0, Math.min(1, t3)), r4 = e3.roundness * m2;
  if (r4 <= 0) return {
    radiusScale: 1,
    verticalProgress: (Math.sin((n4 - 0.5) * Math.PI) + 1) / 2
  };
  if (n4 < r4) {
    let e4 = -Math.PI / 2 + n4 / r4 * (Math.PI / 2);
    return {
      radiusScale: 1 - r4 + r4 * Math.cos(e4),
      verticalProgress: (r4 + r4 * Math.sin(e4)) / 2
    };
  }
  if (n4 > 1 - r4) {
    let e4 = (n4 - (1 - r4)) / r4 * (Math.PI / 2);
    return {
      radiusScale: 1 - r4 + r4 * Math.cos(e4),
      verticalProgress: 1 - r4 / 2 + r4 * Math.sin(e4) / 2
    };
  }
  let i5 = (n4 - r4) / (1 - r4 * 2);
  return {
    radiusScale: 1,
    verticalProgress: r4 / 2 + i5 * (1 - r4)
  };
};
var b = (e3, t3) => g2(e3, t3, y(e3, t3));
var x = (e3, t3, n4) => {
  let r4 = Math.max(0, Math.min(1, t3)), i5 = 0, a4 = 1;
  for (let t4 = 0; t4 < 14; t4 += 1) {
    let t5 = (i5 + a4) / 2;
    n4(e3, t5).verticalProgress < r4 ? i5 = t5 : a4 = t5;
  }
  return n4(e3, (i5 + a4) / 2).radiusScale;
};
var S = (e3, t3) => {
  let n4 = Math.max(0, Math.min(1, t3)), { tipFraction: r4, baseFraction: i5 } = v(e3);
  if (i5 > 0 && n4 < i5) {
    let e4 = n4 / i5;
    return {
      radiusScale: _(1 - i5, 1, 1 - i5 / 2, 1 - i5, e4),
      verticalProgress: _(0, 0, i5 / 2, i5, e4)
    };
  }
  if (r4 > 0 && n4 > 1 - r4) {
    let e4 = (n4 - (1 - r4)) / r4;
    return {
      radiusScale: _(r4, r4 / 2, r4 / 4, 0, e4),
      verticalProgress: _(1 - r4, 1 - r4 / 2, 1, 1, e4)
    };
  }
  return {
    radiusScale: 1 - n4,
    verticalProgress: n4
  };
};
var C = (e3, t3) => g2(e3, t3, S(e3, t3));
var w = (e3) => {
  let t3 = e3.height * 0.36, n4 = e3.height - t3;
  return {
    coneApexY: -e3.height / 2,
    coneBaseY: -e3.height / 2 + t3,
    bodyHeight: n4,
    bodyCenterY: e3.height / 2 - n4 / 2,
    bodyWidth: e3.width * 0.54,
    bodyDepth: e3.depth * 0.62
  };
};
var T = (e3, t3, n4) => {
  let { width: a4, height: o4, depth: s5 } = e3;
  switch (e3.type) {
    case "sphere":
    case "mickey":
      return r2(t3, n4, a4, o4, s5, 1, 1);
    case "cube":
      return d2(e3, t3, n4);
    case "cylinder": {
      let r4 = b(e3, (n4 + Math.PI / 2) / Math.PI);
      return [
        a4 / 2 * r4.radiusScale * Math.sin(t3),
        -o4 / 2 + o4 * r4.verticalProgress,
        s5 / 2 * r4.radiusScale * Math.cos(t3)
      ];
    }
    case "cursor": {
      let r4 = w(e3), i5 = (n4 + Math.PI / 2) / Math.PI, a5 = y({
        ...e3,
        width: r4.bodyWidth,
        height: r4.bodyHeight,
        depth: r4.bodyDepth
      }, i5);
      return [
        r4.bodyWidth / 2 * a5.radiusScale * Math.sin(t3),
        r4.bodyCenterY - r4.bodyHeight / 2 + r4.bodyHeight * a5.verticalProgress,
        r4.bodyDepth / 2 * a5.radiusScale * Math.cos(t3)
      ];
    }
    case "diamond":
      return u2(e3, t3, n4);
    case "capsule":
      return i(e3, t3, n4);
    case "cone": {
      let r4 = C(e3, (n4 + Math.PI / 2) / Math.PI);
      return [
        a4 / 2 * r4.radiusScale * Math.sin(t3),
        o4 / 2 - o4 * r4.verticalProgress,
        s5 / 2 * r4.radiusScale * Math.cos(t3)
      ];
    }
  }
};
var E = (e3, t3) => [
  e3[0] - t3[0],
  e3[1] - t3[1],
  e3[2] - t3[2]
];
var D = ([e3, t3, n4]) => {
  let r4 = Math.hypot(e3, t3, n4) || 1;
  return [
    e3 / r4,
    t3 / r4,
    n4 / r4
  ];
};
var O = (e3, t3, n4) => {
  let r4 = e3.type === "cone" ? -1 : 1;
  return D([
    r4 * (t3[1] * n4[2] - t3[2] * n4[1]),
    r4 * (t3[2] * n4[0] - t3[0] * n4[2]),
    r4 * (t3[0] * n4[1] - t3[1] * n4[0])
  ]);
};
var k = (e3, t3, n4) => {
  let r4 = 5e-4;
  if (e3.type === "cone" && n4 >= Math.PI / 2 - r4) return [
    0,
    -1,
    0
  ];
  let i5 = T(e3, t3 - r4, n4), a4 = T(e3, t3 + r4, n4), o4 = T(e3, t3, Math.max(-Math.PI / 2, n4 - r4)), s5 = T(e3, t3, Math.min(Math.PI / 2, n4 + r4));
  return O(e3, E(a4, i5), E(s5, o4));
};
var A = (e3, t3) => Math.sign(e3) * Math.abs(e3) ** t3;
var j = (e3, t3, n4) => {
  let r4 = e3.width / 2 || 1, i5 = e3.height / 2 || 1, a4 = e3.depth / 2 || 1;
  return D([
    A(t3[0] / r4, n4 - 1) / r4,
    A(t3[1] / i5, n4 - 1) / i5,
    A(t3[2] / a4, n4 - 1) / a4
  ]);
};
var M = (e3, t3) => j(e3, t3, o2(e3));
var N = (e3, t3) => {
  let n4 = c2(e3);
  if (Number.isFinite(n4)) return j(e3, t3, n4);
  let r4 = [
    t3[0] / (e3.width / 2 || 1),
    t3[1] / (e3.height / 2 || 1),
    t3[2] / (e3.depth / 2 || 1)
  ], i5 = r4.reduce((e4, t4, n5) => Math.abs(t4) > Math.abs(r4[e4]) ? n5 : e4, 0);
  return [
    i5 === 0 ? Math.sign(r4[0]) : 0,
    i5 === 1 ? Math.sign(r4[1]) : 0,
    i5 === 2 ? Math.sign(r4[2]) : 0
  ];
};
var P = (e3, t3, n4, r4, i5) => {
  let a4 = e3.width / 2 || 1, o4 = e3.height / 2 || 1, s5 = e3.depth / 2 || 1;
  if (!Number.isFinite(r4)) {
    let r5 = [
      Math.max(-a4, Math.min(a4, t3)),
      Math.max(-o4, Math.min(o4, n4)),
      s5
    ];
    return {
      point: r5,
      normal: i5(e3, r5)
    };
  }
  let c5 = Math.max(-1, Math.min(1, n4 / o4)), l5 = Math.max(0, 1 - Math.abs(c5) ** r4) ** (1 / r4), u5 = Math.max(-a4 * l5, Math.min(a4 * l5, t3)), d4 = u5 / a4, f5 = Math.max(0, 1 - Math.abs(d4) ** r4 - Math.abs(c5) ** r4) ** (1 / r4), p5 = [
    u5,
    c5 * o4,
    s5 * f5
  ];
  return {
    point: p5,
    normal: i5(e3, p5)
  };
};
var F = (e3, t3, n4, r4, i5, a4 = 0) => {
  let o4 = t3 - a4, s5 = Math.max(0, 1 - (e3 / (n4 || 1)) ** 2 - (o4 / (r4 || 1)) ** 2), c5 = i5 * Math.sqrt(s5);
  return {
    point: [
      e3,
      t3,
      c5
    ],
    normal: D([
      e3 / (n4 * n4 || 1),
      o4 / (r4 * r4 || 1),
      c5 / (i5 * i5 || 1)
    ])
  };
};
var I = (e3, t3, n4, r4, i5) => {
  let a4 = e3.width / 2 || 1, o4 = e3.depth / 2 || 1, s5 = Math.max(0, Math.min(1, 0.5 + i5 * (n4 / e3.height))), c5 = x(e3, s5, r4), l5 = a4 * c5, u5 = o4 * c5, d4 = Math.max(-l5, Math.min(l5, t3)), f5 = l5 > 0 ? Math.max(0, 1 - (d4 / l5) ** 2) : 0, p5 = u5 * Math.sqrt(f5), m5 = 1e-4, h5 = Math.max(0, s5 - m5), g5 = Math.min(1, s5 + m5), _4 = x(e3, h5, r4), v4 = (x(e3, g5, r4) - _4) / (g5 - h5 || 1), y3 = Math.max(Math.sqrt(f5), 1e-4), b3 = -(o4 / a4) * d4 / (l5 * y3 || 1), S3 = i5 * o4 * v4 / (e3.height * y3 || 1);
  return {
    point: [
      d4,
      n4,
      p5
    ],
    normal: D([
      -b3,
      -S3,
      1
    ])
  };
};
var L = (e3, t3, n4) => {
  let r4 = e3.width / 2 || 1, i5 = e3.height / 2 || 1, a4 = e3.depth / 2 || 1;
  switch (e3.type) {
    case "sphere":
    case "mickey":
      return F(t3, n4, r4, i5, a4);
    case "cube":
      return P(e3, t3, n4, c2(e3), N);
    case "capsule": {
      let e4 = Math.min(r4, i5), o4 = Math.max(0, i5 - e4);
      return F(t3, n4, r4, e4, a4, n4 < -o4 ? -o4 : n4 > o4 ? o4 : n4);
    }
    case "cylinder":
      return I(e3, t3, n4, b, 1);
    case "cursor": {
      let r5 = w(e3), i6 = I({
        ...e3,
        width: r5.bodyWidth,
        height: r5.bodyHeight,
        depth: r5.bodyDepth
      }, t3, n4 - r5.bodyCenterY, y, 1);
      return {
        point: [
          i6.point[0],
          i6.point[1] + r5.bodyCenterY,
          i6.point[2]
        ],
        normal: i6.normal
      };
    }
    case "cone":
      return I(e3, t3, n4, C, -1);
    case "diamond":
      return P(e3, t3, n4, o2(e3), M);
  }
};
var z = (e3, t3, n4) => {
  let r4 = T(e3, t3, n4);
  if (e3.type === "sphere" || e3.type === "mickey") {
    let t4 = e3.width / 2 || 1, n5 = e3.height / 2 || 1, i5 = e3.depth / 2 || 1;
    return {
      point: r4,
      normal: D([
        r4[0] / (t4 * t4),
        r4[1] / (n5 * n5),
        r4[2] / (i5 * i5)
      ])
    };
  }
  return e3.type === "cylinder" && e3.roundness <= 0 && (e3.morphRoundness ?? 0) <= 0 ? {
    point: r4,
    normal: D([
      Math.sin(t3) / (e3.width / 2 || 1),
      0,
      Math.cos(t3) / (e3.depth / 2 || 1)
    ])
  } : e3.type === "diamond" ? {
    point: r4,
    normal: M(e3, r4)
  } : e3.type === "cube" ? {
    point: r4,
    normal: N(e3, r4)
  } : {
    point: r4,
    normal: k(e3, t3, n4)
  };
};

// scratch/avatar-core/dist/body.js
var r3 = 16;
var i2 = Object.keys(e2);

// scratch/avatar-core/dist/geometry.js
var a2 = 620;
var o3 = 14;
var s3 = [
  "headX",
  "headY",
  "headZ",
  "widthLeft",
  "widthRight",
  "heightLeft",
  "heightRight",
  "spacing",
  "positionXLeft",
  "positionXRight",
  "positionYLeft",
  "positionYRight",
  "leftAngle",
  "rightAngle",
  "perspective"
];
var c3 = (e3, t3, n4) => Math.max(t3, Math.min(n4, e3));
var l3 = (e3) => e3 * Math.PI / 180;
var u3 = ([e3, t3, n4, r4]) => {
  let i5 = Math.hypot(e3, t3, n4, r4) || 1;
  return [
    e3 / i5,
    t3 / i5,
    n4 / i5,
    r4 / i5
  ];
};
var d3 = ([e3, t3, n4, r4], [i5, a4, o4, s5]) => u3([
  e3 * i5 - t3 * a4 - n4 * o4 - r4 * s5,
  e3 * a4 + t3 * i5 + n4 * s5 - r4 * o4,
  e3 * o4 - t3 * s5 + n4 * i5 + r4 * a4,
  e3 * s5 + t3 * o4 - n4 * a4 + r4 * i5
]);
var f2 = ([e3, t3, n4], r4) => {
  let i5 = r4 / 2, a4 = Math.sin(i5);
  return u3([
    Math.cos(i5),
    e3 * a4,
    t3 * a4,
    n4 * a4
  ]);
};
var p2 = (e3, t3, n4) => {
  let r4 = f2([
    1,
    0,
    0
  ], e3), i5 = f2([
    0,
    1,
    0
  ], t3);
  return d3(d3(f2([
    0,
    0,
    1
  ], n4), r4), i5);
};
var g3 = (e3, t3) => {
  let n4 = e3;
  for (; n4 - t3 > 180; ) n4 -= 360;
  for (; n4 - t3 < -180; ) n4 += 360;
  return c3(n4, -365, 365);
};
var y2 = ([e3, t3, n4, r4], [i5, a4, o4]) => {
  let s5 = 2 * (n4 * o4 - r4 * a4), c5 = 2 * (r4 * i5 - t3 * o4), l5 = 2 * (t3 * a4 - n4 * i5);
  return [
    i5 + e3 * s5 + (n4 * l5 - r4 * c5),
    a4 + e3 * c5 + (r4 * s5 - t3 * l5),
    o4 + e3 * l5 + (t3 * c5 - n4 * s5)
  ];
};
var b2 = (e3, t3) => {
  let n4 = e3 / 2, r4 = t3 / 2, i5 = Math.min(r4, n4), a4 = [], s5 = (e4, t4) => {
    let n5 = Math.max(2, Math.ceil(Math.hypot(t4[0] - e4[0], t4[1] - e4[1]) / 1.5));
    for (let r5 = 0; r5 < n5; r5 += 1) {
      let i6 = r5 / n5;
      a4.push([e4[0] + (t4[0] - e4[0]) * i6, e4[1] + (t4[1] - e4[1]) * i6]);
    }
  }, c5 = (e4, t4, n5) => {
    for (let r5 = 0; r5 < o3; r5 += 1) {
      let s6 = n5 + r5 / o3 * (Math.PI / 2);
      a4.push([e4 + Math.cos(s6) * i5, t4 + Math.sin(s6) * i5]);
    }
  };
  return s5([-n4 + i5, -r4], [n4 - i5, -r4]), c5(n4 - i5, -r4 + i5, -Math.PI / 2), s5([n4, -r4 + i5], [n4, r4 - i5]), c5(n4 - i5, r4 - i5, 0), s5([n4 - i5, r4], [-n4 + i5, r4]), c5(-n4 + i5, r4 - i5, Math.PI / 2), s5([-n4, r4 - i5], [-n4, -r4 + i5]), c5(-n4 + i5, -r4 + i5, Math.PI), a4;
};
var x2 = (e3, t3) => {
  let n4 = a2 - e3[2] * t3, r4 = Math.abs(n4) < 1e-4 ? a2 / 1e-4 : a2 / n4;
  return [
    e3[0] * r4,
    e3[1] * r4,
    e3[2]
  ];
};
var D2 = (e3, t3 = true) => e3.length ? `M${e3[0][0].toFixed(2)} ${e3[0][1].toFixed(2)}${e3.slice(1).map((e4) => `L${e4[0].toFixed(2)} ${e4[1].toFixed(2)}`).join("")}${t3 ? "Z" : ""}` : "";
var O2 = (e3) => ({
  expression: e3,
  orientation: p2(l3(e3.headX), l3(e3.headY), l3(e3.headZ))
});
var ae = (e3, t3, n4) => {
  let r4 = { ...e3.expression };
  return s3.forEach((i5) => {
    let a4 = t3.expression[i5];
    (i5 === "headX" || i5 === "headY" || i5 === "headZ" || i5 === "leftAngle" || i5 === "rightAngle") && (a4 = g3(a4, e3.expression[i5])), r4[i5] = e3.expression[i5] + (a4 - e3.expression[i5]) * n4;
  }), {
    expression: r4,
    orientation: O2(r4).orientation
  };
};
var oe = 24;
var se = 25;
var ce = 73;
var k2 = 144;
var le = 33;
var ue = 73;
var A2 = /* @__PURE__ */ new Map();
var j2 = /* @__PURE__ */ new Map();
var M2 = /* @__PURE__ */ new Map();
var N2 = (e3) => JSON.stringify([
  e3.type,
  e3.width,
  e3.height,
  e3.depth,
  e3.roundness,
  e3.morphRoundness,
  e3.tipRoundness,
  e3.baseRoundness
]);
var P2 = (e3, t3, n4) => (e3.size >= oe && e3.delete(e3.keys().next().value), e3.set(t3, n4), n4);
var F2 = (e3, t3, n4) => z(e3, t3, n4);
var I2 = (e3, t3) => ({
  point: x2(y2(e3.orientation, t3.point), e3.expression.perspective),
  normal: y2(e3.orientation, t3.normal)
});
var de = (e3, t3) => {
  let n4 = e3 / 120, r4 = t3 / 120;
  return [120 * Math.cos(r4) * Math.sin(n4), 120 * Math.sin(r4)];
};
var L2 = (e3, n4, r4, i5) => {
  let [a4, o4] = de(r4, i5);
  return I2(e3, L(n4, a4, o4));
};
var R = (e3, t3, n4, r4, i5 = {
  x: 0,
  y: 0
}) => {
  let a4 = e3.expression, o4 = n4 < 0 ? "Left" : "Right", s5 = a4[`width${o4}`], c5 = 5 + (a4[`height${o4}`] - 5) * r4, u5 = n4 * a4.spacing / 2 + a4[`positionX${o4}`] + i5.x, d4 = a4[`positionY${o4}`] + i5.y, f5 = l3(n4 < 0 ? a4.leftAngle : a4.rightAngle);
  return b2(s5, c5).map(([n5, r5]) => {
    let i6 = n5 * Math.cos(f5) - r5 * Math.sin(f5), a5 = n5 * Math.sin(f5) + r5 * Math.cos(f5);
    return L2(e3, t3, u5 + i6, d4 + a5);
  });
};
var z2 = (e3) => {
  let t3 = [], n4 = [];
  return e3.forEach(({ point: e4, normal: r4 }) => {
    r4[2] > 0 ? n4.push(e4) : n4.length && (t3.push(n4), n4 = []);
  }), n4.length && t3.push(n4), t3.filter((e4) => e4.length > 1).map((e4) => D2(e4, false)).join("");
};
var B = (e3, t3) => {
  let n4 = N2(t3), r4 = M2.get(n4);
  if (!r4) {
    let e4 = [
      -60,
      -30,
      0,
      30,
      60
    ].map((e5) => Array.from({ length: 73 }, (n5, r5) => F2(t3, l3(-180 + r5 * 5), l3(e5)))), i5 = Array.from({ length: 12 }, (e5, t4) => -150 + t4 * 30).map((e5) => Array.from({ length: 37 }, (n5, r5) => F2(t3, l3(e5), l3(-90 + r5 * 5))));
    r4 = P2(M2, n4, [...e4, ...i5]);
  }
  return r4.map((t4) => z2(t4.map((t5) => I2(e3, t5))));
};
var U = (e3) => {
  let t3 = [...e3].sort((e4, t4) => e4[0] - t4[0] || e4[1] - t4[1]), n4 = (e4, t4, n5) => (t4[0] - e4[0]) * (n5[1] - e4[1]) - (t4[1] - e4[1]) * (n5[0] - e4[0]), r4 = (e4) => {
    let t4 = [];
    return e4.forEach((e5) => {
      for (; t4.length >= 2 && n4(t4.at(-2), t4.at(-1), e5) <= 0; ) t4.pop();
      t4.push(e5);
    }), t4;
  };
  return [...r4(t3).slice(0, -1), ...r4(t3.reverse()).slice(0, -1)];
};
var W = (e3) => {
  if (e3.length < 3) return D2(e3);
  let t3 = (t4) => e3[(t4 + e3.length) % e3.length];
  return `M${e3[0][0].toFixed(2)} ${e3[0][1].toFixed(2)}${e3.map((e4, n4) => {
    let r4 = t3(n4 - 1), i5 = t3(n4 + 1), a4 = t3(n4 + 2), o4 = [
      e4[0] + (i5[0] - r4[0]) / 6,
      e4[1] + (i5[1] - r4[1]) / 6,
      e4[2]
    ], s5 = [
      i5[0] - (a4[0] - e4[0]) / 6,
      i5[1] - (a4[1] - e4[1]) / 6,
      i5[2]
    ];
    return `C${o4[0].toFixed(2)} ${o4[1].toFixed(2)} ${s5[0].toFixed(2)} ${s5[1].toFixed(2)} ${i5[0].toFixed(2)} ${i5[1].toFixed(2)}`;
  }).join("")}Z`;
};
var G = (e3, t3 = 7) => e3.flatMap((n4, r4) => {
  let i5 = e3[(r4 + 1) % e3.length], a4 = Math.max(1, Math.ceil(Math.hypot(i5[0] - n4[0], i5[1] - n4[1]) / t3));
  return Array.from({ length: a4 }, (e4, t4) => {
    let r5 = t4 / a4;
    return [
      n4[0] + (i5[0] - n4[0]) * r5,
      n4[1] + (i5[1] - n4[1]) * r5,
      n4[2] + (i5[2] - n4[2]) * r5
    ];
  });
});
var fe = (e3) => e3.length ? e3.length === 1 ? `${e3[0][0].toFixed(2)} ${e3[0][1].toFixed(2)}` : e3.slice(0, -1).map((t3, n4) => {
  let r4 = e3[Math.max(0, n4 - 1)], i5 = e3[n4 + 1], a4 = e3[Math.min(e3.length - 1, n4 + 2)], o4 = t3[0] + (i5[0] - r4[0]) / 6, s5 = t3[1] + (i5[1] - r4[1]) / 6, c5 = i5[0] - (a4[0] - t3[0]) / 6, l5 = i5[1] - (a4[1] - t3[1]) / 6;
  return `C${o4.toFixed(2)} ${s5.toFixed(2)} ${c5.toFixed(2)} ${l5.toFixed(2)} ${i5[0].toFixed(2)} ${i5[1].toFixed(2)}`;
}).join("") : "";
var K = (e3, t3) => x2(y2(e3.orientation, t3), e3.expression.perspective);
var q = (e3, t3, n4) => Array.from({ length: 145 }, (r4, i5) => {
  let a4 = i5 / k2 * Math.PI * 2;
  return [
    e3 / 2 * Math.sin(a4),
    n4,
    t3 / 2 * Math.cos(a4)
  ];
});
var J = (e3, t3) => {
  let r4 = N2(t3), i5 = A2.get(r4);
  return i5 || (i5 = Array.from({ length: le }, (e4, r5) => {
    let i6 = -Math.PI / 2 + r5 / 32 * Math.PI;
    return Array.from({ length: ue }, (e5, r6) => {
      let a4 = -Math.PI + r6 / 72 * Math.PI * 2;
      return T(t3, a4, i6);
    });
  }).flat(), P2(A2, r4, i5)), W(G(U(i5.map((t4) => K(e3, t4)))));
};
var pe = (e3, t3) => {
  if (t3.roundness > 0 || (t3.morphRoundness ?? 0) > 0) return J(e3, t3);
  let n4 = t3.height / 2;
  return W(G(U([...q(t3.width, t3.depth, -n4), ...q(t3.width, t3.depth, n4)].map((t4) => K(e3, t4)))));
};
var me = (t3, n4) => {
  let r4 = w(n4), i5 = r4.bodyHeight / 2;
  return W(G(U([...q(r4.bodyWidth, r4.bodyDepth, r4.bodyCenterY - i5), ...q(r4.bodyWidth, r4.bodyDepth, r4.bodyCenterY + i5)].map((e3) => K(t3, e3)))));
};
var he = (t3, n4) => {
  let r4 = w(n4), i5 = K(t3, [
    0,
    r4.coneApexY,
    0
  ]);
  return W(G(U([...q(n4.width, n4.depth, r4.coneBaseY).map((e3) => K(t3, e3)), i5])));
};
var ge = (e3, t3) => {
  if ((t3.morphRoundness ?? 0) > 0 || (t3.tipRoundness ?? 0) > 0 || (t3.baseRoundness ?? 0) > 0) return J(e3, t3);
  let n4 = K(e3, [
    0,
    -t3.height / 2,
    0
  ]), r4 = U([...q(t3.width, t3.depth, t3.height / 2).map((t4) => K(e3, t4)), n4]), i5 = r4.findIndex((e4) => Math.hypot(e4[0] - n4[0], e4[1] - n4[1]) < 0.01);
  if (i5 < 0) return W(r4);
  let a4 = [...r4.slice(i5), ...r4.slice(0, i5)].slice(1);
  return a4.length < 2 ? D2(r4) : `M${n4[0].toFixed(2)} ${n4[1].toFixed(2)}L${a4[0][0].toFixed(2)} ${a4[0][1].toFixed(2)}${fe(a4)}L${n4[0].toFixed(2)} ${n4[1].toFixed(2)}Z`;
};
var _e = (e3, t3) => {
  if (t3.roundness > 0) return J(e3, t3);
  let n4 = t3.width / 2, r4 = t3.height / 2, i5 = t3.depth / 2;
  return D2(U([-1, 1].flatMap((e4) => [-1, 1].flatMap((t4) => [-1, 1].map((a4) => [
    e4 * n4,
    t4 * r4,
    a4 * i5
  ]))).map((t4) => K(e3, t4))));
};
var ve = (e3, t3) => {
  if (t3.roundness > 0) return J(e3, t3);
  let n4 = t3.width / 2, r4 = t3.height / 2, i5 = t3.depth / 2;
  return D2(U([
    [
      -n4,
      0,
      0
    ],
    [
      n4,
      0,
      0
    ],
    [
      0,
      -r4,
      0
    ],
    [
      0,
      r4,
      0
    ],
    [
      0,
      0,
      -i5
    ],
    [
      0,
      0,
      i5
    ]
  ].map((t4) => K(e3, t4))));
};
var Y = (e3, t3, n4, r4, i5) => {
  let a4 = n4 + i5, o4 = Math.hypot(n4 - i5, r4 * 2), s5 = (a4 + o4) / 2, c5 = (a4 - o4) / 2;
  return s5 <= 0 || c5 <= 0 ? null : {
    centerX: e3,
    centerY: t3,
    majorRadius: Math.sqrt(s5),
    minorRadius: Math.sqrt(c5),
    rotation: Math.atan2(r4 * 2, n4 - i5) / 2
  };
};
var X = ({ centerX: e3, centerY: t3, majorRadius: n4, minorRadius: r4, rotation: i5 }) => {
  let a4 = i5 * 180 / Math.PI, o4 = Math.cos(i5) * n4, s5 = Math.sin(i5) * n4, c5 = e3 + o4, l5 = t3 + s5, u5 = e3 - o4, d4 = t3 - s5;
  return `M${c5.toFixed(2)} ${l5.toFixed(2)}A${n4.toFixed(2)} ${r4.toFixed(2)} ${a4.toFixed(2)} 0 1 ${u5.toFixed(2)} ${d4.toFixed(2)}A${n4.toFixed(2)} ${r4.toFixed(2)} ${a4.toFixed(2)} 0 1 ${c5.toFixed(2)} ${l5.toFixed(2)}Z`;
};
var Z = (e3, t3, n4 = [
  0,
  0,
  0
]) => {
  let r4 = [
    y2(e3.orientation, [
      1,
      0,
      0
    ]),
    y2(e3.orientation, [
      0,
      1,
      0
    ]),
    y2(e3.orientation, [
      0,
      0,
      1
    ])
  ], i5 = y2(e3.orientation, n4);
  if (Math.abs(e3.expression.perspective) < 1e-4) {
    let e4 = r4.reduce((e5, n6, r5) => e5 + n6[0] * n6[0] * t3[r5] * t3[r5], 0), n5 = r4.reduce((e5, n6, r5) => e5 + n6[0] * n6[1] * t3[r5] * t3[r5], 0), a4 = r4.reduce((e5, n6, r5) => e5 + n6[1] * n6[1] * t3[r5] * t3[r5], 0);
    return Y(i5[0], i5[1], e4, n5, a4);
  }
  let o4 = t3.map((e4) => 1 / (e4 * e4)), s5 = Array.from({ length: 3 }, (e4, t4) => Array.from({ length: 3 }, (e5, n5) => r4.reduce((e6, r5, i6) => e6 + r5[t4] * o4[i6] * r5[n5], 0))), c5 = a2 / e3.expression.perspective, l5 = [
    -i5[0],
    -i5[1],
    c5 - i5[2]
  ], u5 = [
    s5[0][0] * l5[0] + s5[0][1] * l5[1] + s5[0][2] * l5[2],
    s5[1][0] * l5[0] + s5[1][1] * l5[1] + s5[1][2] * l5[2],
    s5[2][0] * l5[0] + s5[2][1] * l5[1] + s5[2][2] * l5[2]
  ], d4 = l5[0] * u5[0] + l5[1] * u5[1] + l5[2] * u5[2] - 1, f5 = [
    u5[0],
    u5[1],
    -c5 * u5[2]
  ], p5 = [
    [
      s5[0][0],
      s5[0][1],
      -c5 * s5[0][2]
    ],
    [
      s5[1][0],
      s5[1][1],
      -c5 * s5[1][2]
    ],
    [
      -c5 * s5[2][0],
      -c5 * s5[2][1],
      c5 * c5 * s5[2][2]
    ]
  ], m5 = Array.from({ length: 3 }, (e4, t4) => Array.from({ length: 3 }, (e5, n5) => f5[t4] * f5[n5] - d4 * p5[t4][n5])), h5 = m5[0][0] * m5[1][1] - m5[0][1] * m5[0][1];
  if (Math.abs(h5) < 1e-12) return null;
  let g5 = -(m5[1][1] * m5[0][2] - m5[0][1] * m5[1][2]) / h5, _4 = (m5[0][1] * m5[0][2] - m5[0][0] * m5[1][2]) / h5, v4 = -(m5[2][2] + m5[0][2] * g5 + m5[1][2] * _4);
  if (Math.abs(v4) < 1e-12) return null;
  let b3 = m5[0][0] / v4, x3 = m5[0][1] / v4, S3 = m5[1][1] / v4, C3 = b3 * S3 - x3 * x3;
  return C3 <= 0 ? null : Y(g5, _4, S3 / C3, -x3 / C3, b3 / C3);
};
var ye = (e3, t3) => {
  let n4 = Z(e3, [
    t3.width / 2,
    t3.height / 2,
    t3.depth / 2
  ]), r4 = t3.width === t3.height && t3.height === t3.depth;
  if (n4 && r4) {
    let e4 = (n4.majorRadius + n4.minorRadius) / 2;
    return X({
      centerX: 0,
      centerY: 0,
      majorRadius: e4,
      minorRadius: e4,
      rotation: 0
    });
  }
  return n4 ? X(n4) : null;
};
var be = (e3, t3) => {
  if (t3.type !== "mickey") return [];
  let n4 = Math.min(t3.width, t3.height) * 0.23, r4 = Math.min(n4, t3.depth * 0.29), i5 = t3.width * 0.37, a4 = -t3.height * 0.39, o4 = -t3.depth * 0.12, s5 = [
    n4,
    n4,
    r4
  ];
  return [-1, 1].map((t4) => Z(e3, s5, [
    t4 * i5,
    a4,
    o4
  ])).filter((e4) => e4 !== null).map(X);
};
var xe = (e3, t3) => t3.type === "mickey" ? be(e3, t3) : t3.type === "cursor" ? [he(e3, t3)] : [];
var Q = (e3) => Array.from({ length: k2 }, (t3, n4) => {
  let r4 = n4 / k2 * Math.PI * 2, i5 = Math.cos(r4) * e3.majorRadius, a4 = Math.sin(r4) * e3.minorRadius;
  return [
    e3.centerX + i5 * Math.cos(e3.rotation) - a4 * Math.sin(e3.rotation),
    e3.centerY + i5 * Math.sin(e3.rotation) + a4 * Math.cos(e3.rotation),
    0
  ];
});
var Se = (e3) => {
  if (e3.length < 3) return D2(e3);
  let t3 = e3.map((t4, n5) => {
    let r5 = e3[(n5 + 1) % e3.length];
    return Math.hypot(r5[0] - t4[0], r5[1] - t4[1]);
  }), n4 = [...t3].sort((e4, t4) => e4 - t4), r4 = n4[Math.floor(n4.length / 2)] || 1, i5 = Math.max(8, r4 * 3.5), a4 = t3.map((e4) => e4 > i5);
  return `M${e3[0][0].toFixed(2)} ${e3[0][1].toFixed(2)}${e3.map((t4, n5) => {
    let r5 = (n5 + 1) % e3.length, i6 = e3[r5];
    if (a4[n5]) return `L${i6[0].toFixed(2)} ${i6[1].toFixed(2)}`;
    let o4 = a4[(n5 - 1 + e3.length) % e3.length] ? t4 : e3[(n5 - 1 + e3.length) % e3.length], s5 = a4[r5] ? i6 : e3[(n5 + 2) % e3.length], c5 = t4[0] + (i6[0] - o4[0]) / 6, l5 = t4[1] + (i6[1] - o4[1]) / 6, u5 = i6[0] - (s5[0] - t4[0]) / 6, d4 = i6[1] - (s5[1] - t4[1]) / 6;
    return `C${c5.toFixed(2)} ${l5.toFixed(2)} ${u5.toFixed(2)} ${d4.toFixed(2)} ${i6[0].toFixed(2)} ${i6[1].toFixed(2)}`;
  }).join("")}Z`;
};
var Ce = (e3, t3) => {
  let n4 = t3.width / 2, r4 = Math.min(n4, t3.height / 2), i5 = t3.depth / 2, a4 = Math.max(0, (t3.height - r4 * 2) / 2), o4 = [
    n4,
    r4,
    i5
  ], s5 = Z(e3, o4, [
    0,
    a4,
    0
  ]), c5 = Z(e3, o4, [
    0,
    -a4,
    0
  ]);
  return !s5 || !c5 ? null : Se(U([...Q(s5), ...Q(c5)]));
};
var $ = (e3, t3) => {
  if (t3.type === "sphere" || t3.type === "mickey") {
    let n4 = ye(e3, t3);
    if (n4) return n4;
  }
  if (t3.type === "capsule") {
    let n4 = Ce(e3, t3);
    if (n4) return n4;
  }
  if (t3.type === "cylinder") return pe(e3, t3);
  if (t3.type === "cursor") return me(e3, t3);
  if (t3.type === "cone") return ge(e3, t3);
  if (t3.type === "cube") return _e(e3, t3);
  if (t3.type === "diamond") return ve(e3, t3);
  let r4 = N2(t3), i5 = A2.get(r4);
  return i5 || (i5 = Array.from({ length: se }, (e4, r5) => {
    let i6 = -Math.PI / 2 + r5 / 24 * Math.PI;
    return Array.from({ length: ce }, (e5, r6) => {
      let a4 = -Math.PI + r6 / 72 * Math.PI * 2;
      return T(t3, a4, i6);
    });
  }).flat(), P2(A2, r4, i5)), D2(U(i5.map((t4) => x2(y2(e3.orientation, t4), e3.expression.perspective))));
};
var we = (e3, t3) => {
  let r4 = N2(t3.surface), i5 = j2.get(r4);
  i5 || (i5 = Array.from({ length: 17 }, (e4, r5) => {
    let i6 = -Math.PI / 2 + r5 / 16 * Math.PI;
    return Array.from({ length: 49 }, (e5, r6) => {
      let a5 = -Math.PI + r6 / 48 * Math.PI * 2;
      return T(t3.surface, a5, i6);
    });
  }).flat(), P2(j2, r4, i5));
  let a4 = p2(l3(t3.rotation[0]), l3(t3.rotation[1]), l3(t3.rotation[2])), o4 = U(i5.map((n4) => {
    let r5 = y2(a4, n4), i6 = [
      r5[0] + t3.position[0],
      r5[1] + t3.position[1],
      r5[2] + t3.position[2]
    ];
    return x2(y2(e3.orientation, i6), e3.expression.perspective);
  }));
  return (t3.surface.type === "cube" || t3.surface.type === "diamond") && t3.surface.roundness <= 0 ? D2(o4) : W(G(o4));
};
var Te = 0.1;
var Ee = (e3, t3) => {
  let n4 = p2(l3(t3.rotation[0]), l3(t3.rotation[1]), l3(t3.rotation[2])), r4 = [
    [
      1,
      0,
      0
    ],
    [
      0,
      1,
      0
    ],
    [
      0,
      0,
      1
    ]
  ].map((t4) => y2(e3.orientation, y2(n4, t4))[2]);
  return Math.hypot(r4[0] * (t3.surface.width / 2), r4[1] * (t3.surface.height / 2), r4[2] * (t3.surface.depth / 2));
};
var De = (e3, t3) => {
  let n4 = t3.map((t4) => {
    let n5 = y2(e3.orientation, t4.position)[2];
    return {
      id: t4.id,
      path: we(e3, t4),
      depth: n5,
      front: n5 > Ee(e3, t4) * Te
    };
  }).sort((e4, t4) => e4.depth - t4.depth);
  return {
    backPaths: n4.filter((e4) => !e4.front).map((e4) => e4.path),
    frontPaths: n4.filter((e4) => e4.front).map((e4) => e4.path),
    backNodeIds: n4.filter((e4) => !e4.front).map((e4) => e4.id),
    frontNodeIds: n4.filter((e4) => e4.front).map((e4) => e4.id)
  };
};
var Oe = (e3, t3, n4 = 1, r4 = {}) => {
  let i5 = R(e3, t3, -1, n4, r4.eyeOffset), a4 = R(e3, t3, 1, n4, r4.eyeOffset), o4 = i5.map((e4) => e4.point), s5 = a4.map((e4) => e4.point), c5 = De(e3, r4.bodyNodes ?? []), l5 = xe(e3, t3);
  return {
    backPaths: [...l5, ...c5.backPaths],
    frontPaths: c5.frontPaths,
    backNodeIds: [...l5.map(() => null), ...c5.backNodeIds],
    frontNodeIds: c5.frontNodeIds,
    headPath: $(e3, t3),
    leftPath: D2(o4),
    rightPath: D2(s5),
    leftVisible: i5.reduce((e4, t4) => e4 + t4.normal[2], 0) > 0,
    rightVisible: a4.reduce((e4, t4) => e4 + t4.normal[2], 0) > 0,
    wirePaths: r4.includeWire === false ? [] : B(e3, t3)
  };
};

// scratch/avatar-core/dist/ajv-stub.js
var Ajv = class {
  compile() {
    return () => true;
  }
};

// scratch/avatar-core/dist/index.js
var k3 = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://avatars.bible-strong.app/schemas/avatar-definition-v1.json",
  title: "Bible Strong Avatar Definition v1",
  type: "object",
  additionalProperties: false,
  required: [
    "schema",
    "schemaVersion",
    "body",
    "colors",
    "expressions",
    "expressionOrder",
    "animations",
    "animationOrder"
  ],
  properties: {
    schema: { const: "bible-strong/avatar-definition" },
    schemaVersion: { const: 1 },
    name: {
      type: "string",
      maxLength: 120
    },
    body: { $ref: "#/$defs/body" },
    colors: { $ref: "#/$defs/colors" },
    expressions: {
      type: "object",
      minProperties: 1,
      maxProperties: 128,
      required: ["neutral"],
      propertyNames: { $ref: "#/$defs/semanticKey" },
      properties: { neutral: { $ref: "#/$defs/expression" } },
      additionalProperties: { $ref: "#/$defs/expression" }
    },
    expressionOrder: {
      type: "array",
      minItems: 1,
      maxItems: 128,
      uniqueItems: true,
      items: { $ref: "#/$defs/semanticKey" }
    },
    animations: {
      type: "object",
      maxProperties: 64,
      propertyNames: { $ref: "#/$defs/semanticKey" },
      additionalProperties: { $ref: "#/$defs/animation" }
    },
    animationOrder: {
      type: "array",
      maxItems: 64,
      uniqueItems: true,
      items: { $ref: "#/$defs/semanticKey" }
    },
    standardAnimationSet: {
      const: 1,
      deprecated: true
    }
  },
  $defs: {
    semanticKey: {
      type: "string",
      maxLength: 64,
      pattern: "^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$"
    },
    hexColor: {
      type: "string",
      pattern: "^#[0-9a-f]{6}$"
    },
    boundedNumber: {
      type: "number",
      minimum: -1e4,
      maximum: 1e4
    },
    dimension: {
      type: "number",
      minimum: 1e-3,
      maximum: 1e4
    },
    roundness: {
      type: "number",
      minimum: 0,
      maximum: 1
    },
    surface: {
      type: "object",
      additionalProperties: false,
      required: [
        "type",
        "width",
        "height",
        "depth",
        "roundness"
      ],
      properties: {
        type: { enum: [
          "sphere",
          "mickey",
          "cursor",
          "cube",
          "capsule",
          "cylinder",
          "cone",
          "diamond"
        ] },
        width: { $ref: "#/$defs/dimension" },
        height: { $ref: "#/$defs/dimension" },
        depth: { $ref: "#/$defs/dimension" },
        roundness: { $ref: "#/$defs/roundness" },
        morphRoundness: { $ref: "#/$defs/roundness" },
        tipRoundness: { $ref: "#/$defs/roundness" },
        baseRoundness: { $ref: "#/$defs/roundness" }
      }
    },
    nodeSurface: { allOf: [{ $ref: "#/$defs/surface" }, {
      type: "object",
      properties: { type: { enum: [
        "sphere",
        "cube",
        "capsule",
        "cylinder",
        "cone",
        "diamond"
      ] } }
    }] },
    position: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      prefixItems: [
        { $ref: "#/$defs/boundedNumber" },
        { $ref: "#/$defs/boundedNumber" },
        { $ref: "#/$defs/boundedNumber" }
      ]
    },
    rotation: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      prefixItems: [
        {
          type: "number",
          minimum: -360,
          maximum: 360
        },
        {
          type: "number",
          minimum: -360,
          maximum: 360
        },
        {
          type: "number",
          minimum: -360,
          maximum: 360
        }
      ]
    },
    body: {
      type: "object",
      additionalProperties: false,
      required: ["primary", "nodes"],
      properties: {
        primary: { $ref: "#/$defs/surface" },
        nodes: {
          type: "array",
          maxItems: 16,
          items: {
            type: "object",
            additionalProperties: false,
            required: [
              "surface",
              "position",
              "rotation"
            ],
            properties: {
              surface: { $ref: "#/$defs/nodeSurface" },
              position: { $ref: "#/$defs/position" },
              rotation: { $ref: "#/$defs/rotation" }
            }
          }
        }
      }
    },
    colors: {
      type: "object",
      additionalProperties: false,
      required: ["body", "eyes"],
      properties: {
        body: { $ref: "#/$defs/hexColor" },
        eyes: { $ref: "#/$defs/hexColor" }
      }
    },
    eye: {
      type: "object",
      additionalProperties: false,
      required: [
        "width",
        "height",
        "x",
        "y",
        "angle"
      ],
      properties: {
        width: { $ref: "#/$defs/boundedNumber" },
        height: { $ref: "#/$defs/boundedNumber" },
        x: { $ref: "#/$defs/boundedNumber" },
        y: { $ref: "#/$defs/boundedNumber" },
        angle: { $ref: "#/$defs/boundedNumber" }
      }
    },
    expression: {
      type: "object",
      additionalProperties: false,
      required: [
        "head",
        "eyes",
        "perspective",
        "motion"
      ],
      properties: {
        head: {
          type: "object",
          additionalProperties: false,
          required: [
            "x",
            "y",
            "z"
          ],
          properties: {
            x: { $ref: "#/$defs/boundedNumber" },
            y: { $ref: "#/$defs/boundedNumber" },
            z: { $ref: "#/$defs/boundedNumber" }
          }
        },
        eyes: {
          type: "object",
          additionalProperties: false,
          required: [
            "left",
            "right",
            "spacing"
          ],
          properties: {
            left: { $ref: "#/$defs/eye" },
            right: { $ref: "#/$defs/eye" },
            spacing: { $ref: "#/$defs/boundedNumber" }
          }
        },
        perspective: {
          type: "number",
          minimum: 0.1,
          maximum: 10
        },
        motion: {
          type: "object",
          additionalProperties: false,
          required: ["eyes", "body"],
          properties: {
            eyes: { enum: [
              "none",
              "microSaccades",
              "shake"
            ] },
            body: { enum: [
              "none",
              "slowDrift",
              "shake"
            ] }
          }
        },
        colors: {
          type: "object",
          additionalProperties: false,
          minProperties: 1,
          properties: {
            body: { $ref: "#/$defs/hexColor" },
            eyes: { $ref: "#/$defs/hexColor" }
          }
        }
      }
    },
    blink: {
      type: "object",
      additionalProperties: false,
      required: [
        "enabled",
        "initialDelayMs",
        "minIntervalMs",
        "maxIntervalMs",
        "durationMs"
      ],
      properties: {
        enabled: { type: "boolean" },
        initialDelayMs: {
          type: "number",
          minimum: 0,
          maximum: 6e4
        },
        minIntervalMs: {
          type: "number",
          minimum: 250,
          maximum: 12e4
        },
        maxIntervalMs: {
          type: "number",
          minimum: 250,
          maximum: 12e4
        },
        durationMs: {
          type: "number",
          minimum: 50,
          maximum: 2e3
        }
      }
    },
    animation: {
      type: "object",
      additionalProperties: false,
      required: [
        "playbackMode",
        "steps",
        "blink"
      ],
      properties: {
        playbackMode: { enum: [
          "loop",
          "once",
          "pingPong"
        ] },
        steps: {
          type: "array",
          minItems: 1,
          maxItems: 128,
          items: {
            type: "object",
            additionalProperties: false,
            required: [
              "expression",
              "holdMs",
              "transitionMs",
              "transition"
            ],
            properties: {
              expression: { $ref: "#/$defs/semanticKey" },
              holdMs: {
                type: "number",
                minimum: 100,
                maximum: 6e4
              },
              transitionMs: {
                type: "number",
                minimum: 0,
                maximum: 5e3
              },
              transition: { enum: [
                "spring",
                "smooth",
                "snappy"
              ] }
            }
          }
        },
        blink: { $ref: "#/$defs/blink" },
        metadata: {
          type: "object",
          additionalProperties: false,
          minProperties: 1,
          properties: {
            label: {
              type: "string",
              maxLength: 120
            },
            description: {
              type: "string",
              maxLength: 512
            },
            group: {
              type: "string",
              maxLength: 64
            }
          }
        }
      }
    }
  }
};
var F3 = new Ajv({
  allErrors: true,
  strict: true
}).compile(k3);
var I3 = (e3) => e3.replaceAll("~", "~0").replaceAll("/", "~1");
var L3 = (e3, t3) => `${e3}/${I3(String(t3))}`;
var xe2 = (e3) => {
  let t3 = e3.propertyName;
  return t3 === void 0 ? e3.keyword === "required" ? L3(e3.instancePath, String(e3.params.missingProperty)) : e3.keyword === "additionalProperties" ? L3(e3.instancePath, String(e3.params.additionalProperty)) : e3.keyword === "propertyNames" ? L3(e3.instancePath, String(e3.params.propertyName)) : e3.instancePath : L3(e3.instancePath, t3);
};
var Se2 = (e3) => e3.instancePath === "/schemaVersion" && e3.keyword === "const" ? "unsupported_version" : e3.keyword;
var Ce2 = (e3) => (e3 ?? []).map((e4) => ({
  path: xe2(e4),
  code: Se2(e4),
  message: e4.message ?? "Invalid avatar definition"
}));
var we2 = (e3) => {
  let t3 = [], n4 = /* @__PURE__ */ new WeakSet(), r4 = (e4, i5) => {
    if (typeof e4 == "number" && !Number.isFinite(e4)) {
      t3.push({
        path: i5,
        code: "non_finite_number",
        message: "Number must be finite"
      });
      return;
    }
    if (!(typeof e4 != "object" || !e4)) {
      if (n4.has(e4)) {
        t3.push({
          path: i5,
          code: "cyclic_value",
          message: "Avatar definition must not be cyclic"
        });
        return;
      }
      if (n4.add(e4), !Array.isArray(e4)) {
        let r5 = Object.getPrototypeOf(e4);
        if (r5 !== Object.prototype && r5 !== null) {
          t3.push({
            path: i5,
            code: "non_plain_object",
            message: "Expected a plain object"
          }), n4.delete(e4);
          return;
        }
      }
      Object.entries(e4).forEach(([e5, t4]) => r4(t4, L3(i5, e5))), n4.delete(e4);
    }
  };
  return r4(e3, ""), t3;
};
var Te2 = (e3) => {
  let t3 = [], n4 = Object.keys(e3.expressions), r4 = Object.keys(e3.animations), i5 = (e4, n5, r5) => {
    let i6 = new Set(e4), a4 = new Set(n5);
    n5.forEach((e5) => {
      i6.has(e5) || t3.push({
        path: r5,
        code: "incomplete_order",
        message: `Order is missing key '${e5}'`
      });
    }), e4.forEach((e5, n6) => {
      a4.has(e5) || t3.push({
        path: L3(r5, n6),
        code: "unknown_order_key",
        message: `Unknown key '${e5}'`
      });
    });
  };
  return i5(e3.expressionOrder, n4, "/expressionOrder"), i5(e3.animationOrder, r4, "/animationOrder"), e3.expressionOrder[0] !== "neutral" && t3.push({
    path: "/expressionOrder/0",
    code: "neutral_not_first",
    message: "'neutral' must be the first expression-order entry"
  }), Object.entries(e3.animations).forEach(([n5, r5]) => {
    r5.blink.minIntervalMs > r5.blink.maxIntervalMs && t3.push({
      path: `/animations/${I3(n5)}/blink/minIntervalMs`,
      code: "invalid_interval_range",
      message: "minIntervalMs must be less than or equal to maxIntervalMs"
    }), r5.steps.forEach((r6, i6) => {
      r6.expression in e3.expressions || t3.push({
        path: `/animations/${I3(n5)}/steps/${i6}/expression`,
        code: "unknown_expression",
        message: `Unknown expression '${r6.expression}'`
      });
    });
  }), t3;
};
var z3 = (e3) => {
  if (typeof e3 != "object" || !e3) return e3;
  let t3 = Array.isArray(e3) ? e3.map((e4) => z3(e4)) : Object.fromEntries(Object.entries(e3).map(([e4, t4]) => [e4, z3(t4)]));
  return Object.freeze(t3);
};
var B2 = (e3) => {
  let t3 = we2(e3);
  if (t3.length) return {
    ok: false,
    errors: t3
  };
  if (!F3(e3)) return {
    ok: false,
    errors: Ce2(F3.errors)
  };
  let n4 = Te2(e3);
  return n4.length ? {
    ok: false,
    errors: n4
  } : {
    ok: true,
    value: z3(e3)
  };
};
var H2 = (e3, t3) => ({
  id: e3,
  semanticKey: e3,
  headX: t3.head.x,
  headY: t3.head.y,
  headZ: t3.head.z,
  widthLeft: t3.eyes.left.width,
  widthRight: t3.eyes.right.width,
  heightLeft: t3.eyes.left.height,
  heightRight: t3.eyes.right.height,
  spacing: t3.eyes.spacing,
  positionXLeft: t3.eyes.left.x,
  positionXRight: t3.eyes.right.x,
  positionYLeft: t3.eyes.left.y,
  positionYRight: t3.eyes.right.y,
  leftAngle: t3.eyes.left.angle,
  rightAngle: t3.eyes.right.angle,
  perspective: t3.perspective,
  eyeMotion: t3.motion.eyes,
  bodyMotion: t3.motion.body,
  ...t3.colors?.body ? { bodyColor: t3.colors.body } : {},
  ...t3.colors?.eyes ? { eyeColor: t3.colors.eyes } : {}
});
var U2 = (e3) => ({
  primary: { ...e3.primary },
  nodes: e3.nodes.map((e4, t3) => ({
    id: `runtime-node-${t3}`,
    name: `Runtime node ${t3 + 1}`,
    surface: { ...e4.surface },
    position: [...e4.position],
    rotation: [...e4.rotation]
  }))
});
var W2 = (e3, t3, n4 = {}, r4 = 1) => {
  let i5 = U2(e3.body);
  return {
    geometry: Oe(O2(t3), i5.primary, r4, { bodyNodes: i5.nodes }),
    colors: {
      body: n4.body ?? t3.bodyColor ?? e3.colors.body,
      eyes: n4.eyes ?? t3.eyeColor ?? e3.colors.eyes
    }
  };
};
var ke = (e3, t3 = "neutral") => {
  let n4 = e3.expressions[t3];
  if (!n4) throw Error(`Unknown expression '${t3}'`);
  return W2(e3, H2(t3, n4), n4.colors);
};
var Ae = (e3, t3) => {
  let n4 = e3.expressions[t3];
  return n4 ? {
    ok: true,
    value: n4
  } : {
    ok: false,
    error: {
      code: "unknown_expression",
      key: t3,
      message: `Unknown expression '${t3}'`
    }
  };
};
var G2 = (e3, t3) => {
  let n4 = e3.animations[t3];
  return n4 ? {
    ok: true,
    value: n4
  } : {
    ok: false,
    error: {
      code: "unknown_animation",
      key: t3,
      message: `Unknown animation '${t3}'`
    }
  };
};
var K2 = () => ({
  activeExpression: "neutral",
  status: "stopped",
  stepIndex: 0,
  direction: 1,
  phase: "transition",
  phaseStartedAt: 0,
  transitionFrom: "neutral"
});
var je = (e3, t3, n4, r4) => {
  let i5 = G2(e3, t3);
  return i5.ok ? {
    ok: true,
    value: {
      activeAnimation: t3,
      activeExpression: i5.value.steps[0]?.expression ?? "neutral",
      status: "playing",
      stepIndex: 0,
      direction: 1,
      phase: "transition",
      phaseStartedAt: n4,
      transitionFrom: "neutral",
      ...r4 ? { transitionSnapshot: r4 } : {},
      blinkDueAt: n4 + i5.value.blink.initialDelayMs
    }
  } : i5;
};
var q2 = (e3, t3) => {
  let n4 = e3.steps.length - 1;
  if (t3.stepIndex < n4 && t3.direction === 1) return {
    stepIndex: t3.stepIndex + 1,
    direction: t3.direction,
    complete: false
  };
  if (t3.stepIndex > 0 && t3.direction === -1) return {
    stepIndex: t3.stepIndex - 1,
    direction: t3.direction,
    complete: false
  };
  if (e3.playbackMode === "once") return {
    stepIndex: t3.stepIndex,
    direction: t3.direction,
    complete: true
  };
  if (e3.playbackMode === "pingPong" && n4 > 0) {
    let e4 = t3.direction === 1 ? -1 : 1;
    return {
      stepIndex: t3.stepIndex + e4,
      direction: e4,
      complete: false
    };
  }
  return {
    stepIndex: 0,
    direction: 1,
    complete: false
  };
};
var Me = (e3, t3, n4, r4) => {
  if (t3.directTransition) {
    if (n4 < t3.directTransition.startedAt + t3.directTransition.durationMs) return { ...t3 };
    let { directTransition: e4, ...r5 } = t3;
    return {
      ...r5,
      status: "stopped"
    };
  }
  if (t3.status !== "playing" || !t3.activeAnimation) return { ...t3 };
  let i5 = G2(e3, t3.activeAnimation);
  if (!i5.ok || !i5.value.steps.length) return { ...K2() };
  let a4 = i5.value, o4 = { ...t3 };
  if (a4.blink.enabled && o4.blinkDueAt !== void 0 && n4 >= o4.blinkDueAt) {
    let e4 = o4.blinkDueAt, t4 = a4.blink.minIntervalMs + Math.max(0, Math.min(1, r4.random())) * (a4.blink.maxIntervalMs - a4.blink.minIntervalMs);
    o4.blinkStartedAt = e4, o4.blinkDueAt = e4 + a4.blink.durationMs + t4;
  }
  let s5 = a4.steps.length * 4 + 4;
  for (; s5-- > 0; ) {
    let e4 = a4.steps[o4.stepIndex], t4 = o4.phase === "transition" ? e4.transitionMs : e4.holdMs;
    if (n4 < o4.phaseStartedAt + t4) break;
    if (o4.phaseStartedAt += t4, o4.phase === "transition") {
      o4.phase = "hold", o4.activeExpression = e4.expression;
      continue;
    }
    let r5 = q2(a4, o4);
    if (r5.complete) {
      o4.status = "stopped", delete o4.activeAnimation;
      break;
    }
    o4.stepIndex = r5.stepIndex, o4.direction = r5.direction, o4.phase = "transition", o4.transitionFrom = o4.activeExpression, delete o4.transitionSnapshot, o4.activeExpression = a4.steps[r5.stepIndex].expression;
  }
  return o4;
};
var Ne = (e3, t3) => e3.status === "playing" ? {
  ...e3,
  status: "paused",
  pausedAt: t3
} : { ...e3 };
var Pe = (e3, t3) => {
  if (e3.status !== "paused" || e3.pausedAt === void 0) return { ...e3 };
  let n4 = t3 - e3.pausedAt;
  return {
    ...e3,
    status: "playing",
    phaseStartedAt: e3.phaseStartedAt + n4,
    ...e3.directTransition ? { directTransition: {
      ...e3.directTransition,
      startedAt: e3.directTransition.startedAt + n4
    } } : {},
    ...e3.blinkDueAt === void 0 ? {} : { blinkDueAt: e3.blinkDueAt + n4 },
    ...e3.blinkStartedAt === void 0 ? {} : { blinkStartedAt: e3.blinkStartedAt + n4 },
    pausedAt: void 0
  };
};
var J2 = (e3, t3) => {
  let n4 = Math.max(0, Math.min(1, t3));
  if (e3 === "smooth") return n4 * n4 * (3 - 2 * n4);
  if (e3 === "snappy") return 1 - (1 - n4) ** 3;
  let r4 = 1 - Math.exp(-6) * Math.cos(8);
  return Math.max(0, Math.min(1, (1 - Math.exp(-6 * n4) * Math.cos(8 * n4)) / r4));
};
var Y2 = (e3, t3) => ({
  body: t3.colors?.body ?? e3.colors.body,
  eyes: t3.colors?.eyes ?? e3.colors.eyes
});
var X2 = (e3, t3, n4) => {
  let r4 = (e4) => {
    let t4 = e4.slice(1), n5 = t4.length === 3 ? [...t4].map((e5) => `${e5}${e5}`).join("") : t4;
    return [
      0,
      2,
      4
    ].map((e5) => Number.parseInt(n5.slice(e5, e5 + 2), 16));
  }, i5 = r4(e3), a4 = r4(t3);
  return i5.some(Number.isNaN) || a4.some(Number.isNaN) ? n4 < 1 ? e3 : t3 : `#${i5.map((e4, t4) => Math.round(e4 + (a4[t4] - e4) * n4)).map((e4) => e4.toString(16).padStart(2, "0")).join("")}`;
};
var Z2 = (e3, t3, n4) => ({
  body: X2(e3.body, t3.body, n4),
  eyes: X2(e3.eyes, t3.eyes, n4)
});
var Q2 = (e3, t3, n4) => {
  if (!e3.blink.enabled || t3.blinkStartedAt === void 0) return 1;
  let r4 = (n4 - t3.blinkStartedAt) / e3.blink.durationMs;
  return r4 < 0 || r4 >= 1 ? 1 : Math.abs(r4 * 2 - 1);
};
var $2 = (e3, t3, n4, r4) => {
  let i5 = t3.status === "paused" && t3.pausedAt !== void 0 ? t3.pausedAt : n4, a4 = e3.expressions[t3.activeExpression];
  if (!a4) {
    let t4 = e3.expressions.neutral;
    return {
      expression: H2("neutral", t4),
      colors: Y2(e3, t4),
      blink: 1,
      sampledAt: i5
    };
  }
  let o4 = H2(t3.activeExpression, a4), s5 = Y2(e3, a4), c5 = 1;
  if (t3.directTransition && !r4.reduceMotion) {
    let e4 = J2(t3.directTransition.transition, (i5 - t3.directTransition.startedAt) / Math.max(t3.directTransition.durationMs, 1));
    o4 = ae(O2(t3.directTransition.from.expression), O2(o4), e4).expression, s5 = Z2(t3.directTransition.from.colors, s5, e4);
  } else if (t3.activeAnimation) {
    let n5 = G2(e3, t3.activeAnimation);
    if (n5.ok) {
      let a5 = n5.value.steps[t3.stepIndex];
      if (t3.phase === "transition" && a5 && !r4.reduceMotion) {
        let n6 = e3.expressions[t3.transitionFrom], r5 = t3.transitionSnapshot?.expression ?? (n6 ? H2(t3.transitionFrom, n6) : void 0), c6 = t3.transitionSnapshot?.colors ?? (n6 ? Y2(e3, n6) : void 0);
        if (r5 && c6) {
          let e4 = Math.max(a5.transitionMs, 1), n7 = J2(a5.transition, (i5 - t3.phaseStartedAt) / e4);
          o4 = ae(O2(r5), O2(o4), n7).expression, s5 = Z2(c6, s5, n7);
        }
      }
      c5 = Q2(n5.value, t3, i5);
    }
  }
  return {
    expression: o4,
    colors: s5,
    blink: c5,
    sampledAt: i5
  };
};
var Fe = (e3, t3, n4, i5) => {
  let a4 = $2(e3, t3, n4, i5);
  return W2(e3, i5.reduceMotion ? a4.expression : g(a4.expression, a4.sampledAt), a4.colors, a4.blink);
};

// scratch/avatar-web/dist/index.js
var f4 = "http://www.w3.org/2000/svg";
var ee2 = 420;
var p4 = r3 + 2;
var te2 = 0;
var m4 = (e3) => typeof e3 == "number" ? `${e3}px` : e3;
var ne2 = (e3) => {
  let t3 = e3[0];
  return /* @__PURE__ */ Error(t3 ? `Invalid avatar definition${t3.path ? ` at ${t3.path}` : ""}: ${t3.message}` : "Invalid avatar definition.");
};
var re2 = (e3) => {
  let t3 = typeof e3 == "string" ? document.querySelector(e3) : e3;
  if (!t3) throw Error(`Avatar target '${e3}' was not found.`);
  return t3;
};
var h4 = (e3) => document.createElementNS(f4, e3);
var g4 = (e3) => ({
  ...e3.activeAnimation ? { activeAnimation: e3.activeAnimation } : {},
  activeExpression: e3.activeExpression,
  status: e3.status
});
var _3 = () => ({
  random: Math.random,
  reduceMotion: window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false
});
function v3(e3, { definition: f5, defaultAnimation: v4, defaultExpression: y3, autoplay: b3 = true, size: x3 = 240, ariaLabel: ie2 = "Procedural avatar", className: ae2, onError: S3, onAnimationEnd: C3, onExpressionChange: w3 }) {
  if (v4 !== void 0 && y3 !== void 0) throw Error("Choose either defaultAnimation or defaultExpression, not both.");
  let T2 = B2(f5);
  if (!T2.ok) throw ne2(T2.errors);
  let E3 = T2.value, D3 = re2(e3), O3 = document.createElement("span");
  O3.className = ["bs-avatar", ae2 ?? ""].filter(Boolean).join(" "), O3.style.display = "inline-block", O3.style.width = m4(x3), O3.style.height = m4(x3), O3.setAttribute("role", "img"), O3.setAttribute("aria-label", ie2);
  let k4 = h4("svg");
  k4.setAttribute("viewBox", "-150 -150 300 300"), k4.setAttribute("aria-hidden", "true"), k4.style.display = "block", k4.style.width = "100%", k4.style.height = "100%";
  let A3 = h4("defs"), j3 = h4("clipPath"), M3 = `bs-avatar-web-${++te2}`;
  j3.id = M3;
  let N3 = h4("path");
  j3.append(N3), A3.append(j3), k4.append(A3);
  let P3 = ke(E3), F4 = Array.from({ length: p4 }, () => h4("path")), I4 = h4("path"), L4 = h4("g");
  L4.setAttribute("clip-path", `url(#${M3})`);
  let R2 = h4("path"), z4 = h4("path");
  L4.append(R2, z4);
  let B3 = Array.from({ length: p4 }, () => h4("path"));
  k4.append(...F4, I4, L4, ...B3), O3.append(k4), D3.append(O3);
  let V = (e4) => {
    S3 ? S3(e4) : console.error(`[Avatar] ${e4.message}`);
  }, H3 = (e4) => {
    N3.setAttribute("d", e4.geometry.headPath), I4.setAttribute("d", e4.geometry.headPath), I4.setAttribute("fill", e4.colors.body), R2.setAttribute("d", e4.geometry.leftPath), R2.setAttribute("fill", e4.colors.eyes), R2.setAttribute("opacity", e4.geometry.leftVisible ? "1" : "0"), z4.setAttribute("d", e4.geometry.rightPath), z4.setAttribute("fill", e4.colors.eyes), z4.setAttribute("opacity", e4.geometry.rightVisible ? "1" : "0"), F4.forEach((t3, n4) => {
      t3.setAttribute("d", e4.geometry.backPaths[n4] ?? ""), t3.setAttribute("fill", e4.colors.body);
    }), B3.forEach((t3, n4) => {
      t3.setAttribute("d", e4.geometry.frontPaths[n4] ?? ""), t3.setAttribute("fill", e4.colors.body);
    });
  }, U3 = K2(), W3 = null, G3 = false, K3, q3, J3, Y3 = () => {
    q3 !== U3.activeExpression && (q3 = U3.activeExpression, w3?.(U3.activeExpression));
  }, X3 = (e4) => {
    let t3 = _3();
    J3 = $2(E3, U3, e4, t3), H3(Fe(E3, U3, e4, t3)), Y3();
  }, Z3 = (e4) => {
    if (W3 = null, G3) return;
    let n4 = U3.activeAnimation, r4 = U3.status === "playing";
    U3 = Me(E3, U3, e4, {
      random: Math.random,
      reduceMotion: window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false
    }), X3(e4), r4 && U3.status === "stopped" && n4 && (K3 !== n4 && C3?.(n4), K3 = n4), U3.status === "playing" && (W3 = requestAnimationFrame(Z3));
  }, Q3 = () => {
    W3 === null && !G3 && (W3 = requestAnimationFrame(Z3));
  }, $3 = {
    play(e4) {
      if (U3.status === "paused" && U3.activeAnimation === e4 && U3.pausedAt !== void 0) return U3 = Pe(U3, performance.now()), Q3(), { ok: true };
      let t3 = performance.now(), n4 = J3 ?? $2(E3, U3, t3, _3()), r4 = je(E3, e4, t3, n4);
      return r4.ok ? (K3 = void 0, U3 = r4.value, X3(performance.now()), Q3(), { ok: true }) : {
        ok: false,
        error: r4.error
      };
    },
    setExpression(e4) {
      let t3 = Ae(E3, e4);
      if (!t3.ok) return {
        ok: false,
        error: t3.error
      };
      let r4 = performance.now(), i5 = J3 ?? $2(E3, U3, r4, _3());
      return U3 = {
        ...K2(),
        activeExpression: e4,
        ...U3.activeExpression === e4 ? {} : {
          status: "playing",
          directTransition: {
            from: i5,
            startedAt: r4,
            durationMs: ee2,
            transition: "smooth"
          }
        }
      }, X3(performance.now()), U3.status === "playing" && Q3(), { ok: true };
    },
    pause() {
      U3.status === "playing" && (U3 = Ne(U3, performance.now()), W3 !== null && cancelAnimationFrame(W3), W3 = null);
    },
    stop() {
      U3 = K2(), W3 !== null && cancelAnimationFrame(W3), W3 = null, H3(ke(E3)), Y3();
    },
    getState() {
      return g4(U3);
    },
    destroy() {
      G3 = true, W3 !== null && cancelAnimationFrame(W3), W3 = null, O3.remove();
    }
  };
  if (v4 !== void 0) {
    let e4 = G2(E3, v4);
    e4.ok ? b3 ? $3.play(v4) : (U3 = {
      ...K2(),
      activeExpression: e4.value.steps[0]?.expression ?? "neutral"
    }, X3(performance.now())) : V(e4.error);
  } else if (y3 !== void 0) {
    let e4 = Ae(E3, y3);
    e4.ok ? (U3 = {
      ...K2(),
      activeExpression: y3
    }, X3(performance.now())) : V(e4.error);
  } else H3(P3), J3 = $2(E3, U3, performance.now(), _3()), Y3();
  return $3;
}
export {
  v3 as createAvatar
};
