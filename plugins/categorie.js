//Plugin fatto da Axtral_WiZaRd

export const CATEGORIE = [
  { 
    display: "𝐂𝐨𝐥𝐥𝐚𝐛𝐨𝐫𝐚𝐭𝐨𝐫𝐞 🤝🏻",
    variants: ["collaboratore"]
  },
  { 
    display: "𝐕𝐢𝐩 💎",
    variants: ["vip"]
  },
  { 
    display: "𝐕𝐞𝐭𝐞𝐫𝐚𝐧𝐨/𝐚 🎖️",
    variants: ["veterano", "veterana"]
  },
  { 
    display: "𝐋𝐮𝐝𝐨𝐩𝐚𝐭𝐢𝐜𝐨/𝐚 🎰",
    variants: ["ludopatico", "ludopatica"]
  },
  { 
    display: "𝐂𝐚𝐠𝐚𝐜𝐚𝐳𝐳𝐨 🙄",
    variants: ["cagacazzo"]
  },
  { 
    display: "𝐃𝐢𝐬𝐚𝐛𝐢𝐥𝐞 ♿",
    variants: ["disabile"]
  },
  { 
    display: "𝐌𝐨𝐫𝐭𝐨 𝐝𝐢 𝐟𝐢𝐠𝐚 🤤",
    variants: ["morto di figa"]
  },
  { 
    display: "𝐏𝐢𝐜𝐤 𝐦𝐞 💅🏻",
    variants: ["pick me"]
  },
  { 
    display: "𝐁𝐞𝐬𝐭𝐞𝐦𝐦𝐢𝐚𝐭𝐨𝐫𝐞/𝐭𝐫𝐢𝐜𝐞 🤬",
    variants: ["bestemmiatore", "bestemmiatrice"]
  },
  { 
    display: "𝐓𝐫𝐨𝐢𝐚 🥵",
    variants: ["troia"]
  },
  { 
    display: "𝐏𝐮𝐭𝐭𝐚𝐧𝐢𝐞𝐫𝐞 😎",
    variants: ["puttaniere"]
  },
  { 
    display: "𝐍𝐞𝐫𝐝 🤓",
    variants: ["nerd"]
  }
];

export const ROLE_IMPORTANCE = (() => {
  const importance = {};
  const total = CATEGORIE.length;

  CATEGORIE.forEach((cat, index) => {
    const value = total - index;
    cat.variants.forEach(v => importance[v] = value);
  });

  return importance;
})();