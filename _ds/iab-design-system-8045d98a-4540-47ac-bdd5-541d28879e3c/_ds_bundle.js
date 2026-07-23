/* @ds-bundle: {"format":4,"namespace":"IABDesignSystem_8045d9","components":[{"name":"Button","sourcePath":"components/actions/Button.jsx"},{"name":"IconButton","sourcePath":"components/actions/IconButton.jsx"},{"name":"GoldRule","sourcePath":"components/brand/GoldRule.jsx"},{"name":"Logo","sourcePath":"components/brand/Logo.jsx"},{"name":"Avatar","sourcePath":"components/data-display/Avatar.jsx"},{"name":"Badge","sourcePath":"components/data-display/Badge.jsx"},{"name":"Card","sourcePath":"components/data-display/Card.jsx"},{"name":"StatBlock","sourcePath":"components/data-display/StatBlock.jsx"},{"name":"Table","sourcePath":"components/data-display/Table.jsx"},{"name":"Tag","sourcePath":"components/data-display/Tag.jsx"},{"name":"Alert","sourcePath":"components/feedback/Alert.jsx"},{"name":"ProgressBar","sourcePath":"components/feedback/ProgressBar.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Field","sourcePath":"components/forms/Field.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Radio","sourcePath":"components/forms/Radio.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Textarea","sourcePath":"components/forms/Textarea.jsx"},{"name":"Accordion","sourcePath":"components/navigation/Accordion.jsx"},{"name":"Breadcrumb","sourcePath":"components/navigation/Breadcrumb.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"components/actions/Button.jsx":"16c2641fe626","components/actions/IconButton.jsx":"b2ea6f271872","components/brand/GoldRule.jsx":"acc9994e75d2","components/brand/Logo.jsx":"90d2433f6d03","components/data-display/Avatar.jsx":"28d5a5037fee","components/data-display/Badge.jsx":"b873459d7c7e","components/data-display/Card.jsx":"a2e91dd2853b","components/data-display/StatBlock.jsx":"ca06ec9ba2e9","components/data-display/Table.jsx":"326a6008e2e4","components/data-display/Tag.jsx":"bef066049d63","components/feedback/Alert.jsx":"ab99af973389","components/feedback/ProgressBar.jsx":"12b1cf5efa4e","components/forms/Checkbox.jsx":"b21fa8c5aac5","components/forms/Field.jsx":"dc478f5cea21","components/forms/Input.jsx":"f27a230f1ab2","components/forms/Radio.jsx":"edfe91648654","components/forms/Select.jsx":"7b27b77b926d","components/forms/Switch.jsx":"a94841f7b12f","components/forms/Textarea.jsx":"b25ec8a26f97","components/navigation/Accordion.jsx":"57c50c82911f","components/navigation/Breadcrumb.jsx":"23f042b886bb","components/navigation/Tabs.jsx":"15c9e05faa13","ui_kits/portal/PortalShell.jsx":"ea003ef17262","ui_kits/portal/Screens.jsx":"451e24d6e84a","ui_kits/website/Sections.jsx":"5c7f05c4a83f","ui_kits/website/SiteChrome.jsx":"628ed8c81e34","ui_kits/website/pages.jsx":"66b84d8923a0"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.IABDesignSystem_8045d9 = window.IABDesignSystem_8045d9 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/actions/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const sizes = {
  sm: {
    padding: "6px 14px",
    fontSize: "13px",
    height: "32px"
  },
  md: {
    padding: "9px 20px",
    fontSize: "14px",
    height: "42px"
  },
  lg: {
    padding: "13px 28px",
    fontSize: "16px",
    height: "52px"
  }
};
function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  fullWidth = false,
  iconLeft = null,
  iconRight = null,
  type = "button",
  onClick,
  style = {},
  ...rest
}) {
  const s = sizes[size] || sizes.md;
  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontFamily: "var(--font-sans)",
    fontWeight: 600,
    fontSize: s.fontSize,
    padding: s.padding,
    minHeight: s.height,
    borderRadius: "var(--radius-md)",
    cursor: disabled ? "not-allowed" : "pointer",
    border: "1px solid transparent",
    letterSpacing: "0.01em",
    lineHeight: 1,
    width: fullWidth ? "100%" : "auto",
    opacity: disabled ? 0.5 : 1,
    transition: "background var(--dur-fast) var(--ease-standard), border-color var(--dur-fast) var(--ease-standard), transform var(--dur-fast) var(--ease-standard), color var(--dur-fast)",
    WebkitFontSmoothing: "antialiased",
    textAlign: "center",
    ...style
  };
  const variants = {
    primary: {
      background: "var(--iab-navy)",
      color: "#fff",
      borderColor: "var(--iab-navy)"
    },
    gold: {
      background: "var(--iab-gold-print)",
      color: "var(--iab-navy)",
      borderColor: "var(--iab-gold-print)"
    },
    secondary: {
      background: "#fff",
      color: "var(--iab-navy)",
      borderColor: "var(--border-strong)"
    },
    ghost: {
      background: "transparent",
      color: "var(--iab-navy)",
      borderColor: "transparent"
    },
    "on-navy": {
      background: "#fff",
      color: "var(--iab-navy)",
      borderColor: "#fff"
    }
  };
  const [hover, setHover] = React.useState(false);
  const hoverStyles = {
    primary: {
      background: "var(--iab-navy-700)",
      borderColor: "var(--iab-navy-700)"
    },
    gold: {
      background: "var(--iab-gold-deep)",
      borderColor: "var(--iab-gold-deep)"
    },
    secondary: {
      background: "var(--iab-ivory)",
      borderColor: "var(--iab-navy)"
    },
    ghost: {
      background: "var(--iab-gold-050)"
    },
    "on-navy": {
      background: "var(--iab-ivory)"
    }
  };
  const st = {
    ...base,
    ...variants[variant],
    ...(hover && !disabled ? hoverStyles[variant] : {})
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onClick: onClick,
    style: st,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false)
  }, rest), iconLeft, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/Button.jsx", error: String((e && e.message) || e) }); }

// components/actions/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const dims = {
  sm: 32,
  md: 40,
  lg: 48
};
function IconButton({
  children,
  label,
  variant = "ghost",
  size = "md",
  disabled = false,
  onClick,
  style = {},
  ...rest
}) {
  const d = dims[size] || dims.md;
  const [hover, setHover] = React.useState(false);
  const variants = {
    ghost: {
      background: hover ? "var(--iab-gold-050)" : "transparent",
      color: "var(--iab-navy)",
      border: "1px solid transparent"
    },
    solid: {
      background: hover ? "var(--iab-navy-700)" : "var(--iab-navy)",
      color: "#fff",
      border: "1px solid var(--iab-navy)"
    },
    outline: {
      background: hover ? "var(--iab-ivory)" : "#fff",
      color: "var(--iab-navy)",
      border: "1px solid var(--border-strong)"
    }
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": label,
    title: label,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      width: d,
      height: d,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "var(--radius-md)",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
      transition: "background var(--dur-fast) var(--ease-standard)",
      ...variants[variant],
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/brand/GoldRule.jsx
try { (() => {
/* The gold rule motif — a fine metallic line that separates and dignifies. */
function GoldRule({
  width = "100%",
  thickness = 2,
  soft = false,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("hr", {
    style: {
      border: 0,
      height: thickness,
      width,
      margin: 0,
      borderRadius: thickness,
      background: soft ? "linear-gradient(90deg, transparent, var(--iab-gold-print) 20%, var(--iab-gold) 50%, var(--iab-gold-print) 80%, transparent)" : "linear-gradient(90deg, var(--iab-gold-print), var(--iab-gold) 50%, var(--iab-gold-print))",
      ...style
    }
  });
}
Object.assign(__ds_scope, { GoldRule });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/GoldRule.jsx", error: String((e && e.message) || e) }); }

// components/brand/Logo.jsx
try { (() => {
/* Renders the real iAB mark from copied assets. Never redraw the mark.
   Point assetBase at wherever the /assets/logos folder lives relative to the page. */
const FILES = {
  "horizontal-white": "iab_horizontal_white.png",
  "horizontal-navy": "iab_horizontal_white_alt.png",
  "stacked-white": "iab_stacked_white.png",
  "stacked-navy": "iab_stacked_navy.png",
  "icon-white": "iab_icon_white.png",
  "icon-navy": "iab_icon_navy.png",
  "mono-navy": "iab_mono_navy.png",
  "favicon": "iab_favicon.png",
  /* transparent marks — work on any background */
  "on-navy": "iab_icon_transparent.png",
  /* metallic iAB icon, transparent */
  "on-navy-stacked": "iab_stacked_transparent.png",
  /* full stacked lockup, transparent */
  "on-light": "iab_mono_transparent.png" /* flat navy iAB, transparent */
};
function Logo({
  variant = "horizontal-navy",
  height = 48,
  assetBase = "assets/logos",
  style = {},
  alt = "iAB — Insurance Academy of Botswana"
}) {
  const file = FILES[variant] || FILES["horizontal-navy"];
  return /*#__PURE__*/React.createElement("img", {
    src: assetBase.replace(/\/$/, "") + "/" + file,
    alt: alt,
    style: {
      height,
      width: "auto",
      objectFit: "contain",
      display: "block",
      ...style
    }
  });
}
Object.assign(__ds_scope, { Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Logo.jsx", error: String((e && e.message) || e) }); }

// components/data-display/Avatar.jsx
try { (() => {
const sizes = {
  sm: 32,
  md: 40,
  lg: 56
};
function Avatar({
  name = "",
  src,
  size = "md",
  style = {}
}) {
  const d = sizes[size] || sizes.md;
  const initials = name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
  return /*#__PURE__*/React.createElement("span", {
    style: {
      width: d,
      height: d,
      borderRadius: "50%",
      flexShrink: 0,
      overflow: "hidden",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--iab-navy)",
      color: "#fff",
      fontFamily: "var(--font-sans)",
      fontWeight: 600,
      fontSize: d * 0.36,
      border: "1px solid var(--iab-navy-700)",
      ...style
    }
  }, src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name,
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
  }) : initials);
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/data-display/Badge.jsx
try { (() => {
function Badge({
  children,
  tone = "neutral",
  style = {}
}) {
  const tones = {
    neutral: {
      bg: "var(--iab-mist)",
      fg: "var(--iab-graphite)"
    },
    navy: {
      bg: "var(--iab-navy)",
      fg: "#fff"
    },
    gold: {
      bg: "var(--iab-gold-100)",
      fg: "var(--iab-gold-deep)"
    },
    success: {
      bg: "var(--iab-success-bg)",
      fg: "var(--iab-success)"
    },
    warning: {
      bg: "var(--iab-warning-bg)",
      fg: "var(--iab-warning)"
    },
    error: {
      bg: "var(--iab-error-bg)",
      fg: "var(--iab-error)"
    },
    info: {
      bg: "var(--iab-info-bg)",
      fg: "var(--iab-info)"
    }
  };
  const t = tones[tone] || tones.neutral;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "5px",
      fontFamily: "var(--font-sans)",
      fontSize: "11px",
      fontWeight: 600,
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      padding: "3px 9px",
      borderRadius: "var(--radius-sm)",
      background: t.bg,
      color: t.fg,
      lineHeight: 1.4,
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/Badge.jsx", error: String((e && e.message) || e) }); }

// components/data-display/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Card({
  children,
  variant = "default",
  padding = "var(--sp-3)",
  hoverable = false,
  style = {},
  onClick,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const variants = {
    default: {
      background: "#fff",
      border: "1px solid var(--iab-mist)",
      color: "var(--text-body)"
    },
    navy: {
      background: "var(--iab-navy)",
      border: "1px solid var(--iab-navy-700)",
      color: "var(--text-on-navy)"
    },
    ivory: {
      background: "var(--iab-ivory)",
      border: "1px solid var(--iab-mist)",
      color: "var(--text-body)"
    }
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      borderRadius: "var(--radius-lg)",
      padding,
      boxShadow: hoverable && hover ? "var(--shadow-md)" : "var(--shadow-sm)",
      transform: hoverable && hover ? "translateY(-2px)" : "none",
      transition: "box-shadow var(--dur-base) var(--ease-standard), transform var(--dur-base) var(--ease-standard)",
      cursor: onClick ? "pointer" : "default",
      ...variants[variant],
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/Card.jsx", error: String((e && e.message) || e) }); }

// components/data-display/StatBlock.jsx
try { (() => {
function StatBlock({
  value,
  label,
  onNavy = false,
  accent = false,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "4px",
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: "2.75rem",
      lineHeight: 1,
      fontWeight: 500,
      letterSpacing: "-0.02em",
      color: accent ? "var(--iab-gold)" : onNavy ? "#fff" : "var(--iab-navy)"
    }
  }, value), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "12px",
      fontWeight: 600,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: onNavy ? "var(--text-on-navy-muted)" : "var(--text-muted)"
    }
  }, label));
}
Object.assign(__ds_scope, { StatBlock });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/StatBlock.jsx", error: String((e && e.message) || e) }); }

// components/data-display/Table.jsx
try { (() => {
function Table({
  columns = [],
  rows = [],
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: "auto",
      border: "1px solid var(--iab-mist)",
      borderRadius: "var(--radius-lg)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: "100%",
      borderCollapse: "collapse",
      fontFamily: "var(--font-sans)",
      fontSize: "14px"
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, columns.map((c, i) => /*#__PURE__*/React.createElement("th", {
    key: i,
    style: {
      textAlign: c.align || "left",
      padding: "12px 16px",
      background: "var(--iab-ivory)",
      color: "var(--text-muted)",
      fontSize: "11px",
      fontWeight: 700,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      borderBottom: "1px solid var(--iab-mist)",
      whiteSpace: "nowrap"
    }
  }, c.header)))), /*#__PURE__*/React.createElement("tbody", null, rows.map((r, ri) => /*#__PURE__*/React.createElement("tr", {
    key: ri,
    style: {
      background: ri % 2 ? "var(--iab-ivory)" : "#fff"
    }
  }, columns.map((c, ci) => /*#__PURE__*/React.createElement("td", {
    key: ci,
    style: {
      textAlign: c.align || "left",
      padding: "12px 16px",
      color: "var(--text-body)",
      borderBottom: ri === rows.length - 1 ? "none" : "1px solid var(--iab-mist)"
    }
  }, c.render ? c.render(r) : r[c.key])))))));
}
Object.assign(__ds_scope, { Table });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/Table.jsx", error: String((e && e.message) || e) }); }

// components/data-display/Tag.jsx
try { (() => {
function Tag({
  children,
  onRemove,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      fontFamily: "var(--font-sans)",
      fontSize: "13px",
      fontWeight: 500,
      color: "var(--iab-navy)",
      padding: "4px 12px",
      borderRadius: "var(--radius-pill)",
      background: "#fff",
      border: "1px solid var(--border-strong)",
      lineHeight: 1.4,
      ...style
    }
  }, children, onRemove && /*#__PURE__*/React.createElement("button", {
    onClick: onRemove,
    "aria-label": "Remove",
    style: {
      border: 0,
      background: "none",
      cursor: "pointer",
      padding: 0,
      display: "inline-flex",
      color: "var(--iab-slate)"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M18 6 6 18M6 6l12 12"
  }))));
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/Tag.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Alert.jsx
try { (() => {
const icons = {
  info: /*#__PURE__*/React.createElement("path", {
    d: "M12 16v-4M12 8h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z"
  }),
  success: /*#__PURE__*/React.createElement("path", {
    d: "M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3"
  }),
  warning: /*#__PURE__*/React.createElement("path", {
    d: "M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0ZM12 9v4M12 17h.01"
  }),
  error: /*#__PURE__*/React.createElement("path", {
    d: "M12 8v4M12 16h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z"
  })
};
function Alert({
  tone = "info",
  title,
  children,
  onClose,
  style = {}
}) {
  const map = {
    info: {
      fg: "var(--iab-info)",
      bg: "var(--iab-info-bg)"
    },
    success: {
      fg: "var(--iab-success)",
      bg: "var(--iab-success-bg)"
    },
    warning: {
      fg: "var(--iab-warning)",
      bg: "var(--iab-warning-bg)"
    },
    error: {
      fg: "var(--iab-error)",
      bg: "var(--iab-error-bg)"
    }
  };
  const t = map[tone] || map.info;
  return /*#__PURE__*/React.createElement("div", {
    role: "alert",
    style: {
      display: "flex",
      gap: "12px",
      padding: "14px 16px",
      borderRadius: "var(--radius-md)",
      background: t.bg,
      border: "1px solid " + t.fg + "33",
      fontFamily: "var(--font-sans)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: t.fg,
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      flexShrink: 0,
      marginTop: 1
    }
  }, icons[tone]), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, title && /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      fontSize: "14px",
      color: "var(--text-strong)",
      marginBottom: children ? 3 : 0
    }
  }, title), children && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "13px",
      color: "var(--text-body)",
      lineHeight: 1.5
    }
  }, children)), onClose && /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "Dismiss",
    style: {
      border: 0,
      background: "none",
      cursor: "pointer",
      color: "var(--text-muted)",
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M18 6 6 18M6 6l12 12"
  }))));
}
Object.assign(__ds_scope, { Alert });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Alert.jsx", error: String((e && e.message) || e) }); }

// components/feedback/ProgressBar.jsx
try { (() => {
function ProgressBar({
  value = 0,
  max = 100,
  label,
  accent = false,
  showValue = true,
  style = {}
}) {
  const pct = Math.max(0, Math.min(100, value / max * 100));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      ...style
    }
  }, (label || showValue) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: 6,
      fontSize: "13px"
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-body)",
      fontWeight: 500
    }
  }, label), showValue && /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-muted)",
      fontVariantNumeric: "tabular-nums"
    }
  }, Math.round(pct), "%")), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 8,
      borderRadius: 999,
      background: "var(--iab-mist)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: pct + "%",
      height: "100%",
      borderRadius: 999,
      background: accent ? "var(--iab-gold-print)" : "var(--iab-navy)",
      transition: "width var(--dur-slow) var(--ease-entrance)"
    }
  })));
}
Object.assign(__ds_scope, { ProgressBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/ProgressBar.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function Checkbox({
  checked = false,
  onChange,
  label,
  disabled = false,
  id,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: id,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "10px",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
      fontFamily: "var(--font-sans)",
      fontSize: "14px",
      color: "var(--text-body)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 18,
      height: 18,
      borderRadius: "var(--radius-xs)",
      flexShrink: 0,
      border: "1px solid " + (checked ? "var(--iab-navy)" : "var(--border-strong)"),
      background: checked ? "var(--iab-navy)" : "#fff",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "background var(--dur-fast), border-color var(--dur-fast)"
    }
  }, checked && /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "3",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20 6 9 17l-5-5"
  }))), /*#__PURE__*/React.createElement("input", {
    id: id,
    type: "checkbox",
    checked: checked,
    disabled: disabled,
    onChange: onChange,
    style: {
      position: "absolute",
      opacity: 0,
      width: 0,
      height: 0
    }
  }), label);
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Field.jsx
try { (() => {
function Field({
  label,
  htmlFor,
  hint,
  error,
  required = false,
  children,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: htmlFor,
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "13px",
      fontWeight: 600,
      color: "var(--text-strong)",
      letterSpacing: "0.01em"
    }
  }, label, required && /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--iab-error)",
      marginLeft: 3
    }
  }, "*")), children, error ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "12px",
      color: "var(--iab-error)",
      fontFamily: "var(--font-sans)"
    }
  }, error) : hint ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "12px",
      color: "var(--text-muted)",
      fontFamily: "var(--font-sans)"
    }
  }, hint) : null);
}
Object.assign(__ds_scope, { Field });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Field.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Input({
  invalid = false,
  disabled = false,
  size = "md",
  style = {},
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const pad = size === "sm" ? "7px 11px" : size === "lg" ? "13px 15px" : "10px 13px";
  const fs = size === "sm" ? "13px" : "14px";
  const border = invalid ? "var(--iab-error)" : focus ? "var(--iab-navy)" : "var(--border-strong)";
  return /*#__PURE__*/React.createElement("input", _extends({
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: fs,
      padding: pad,
      color: "var(--text-strong)",
      background: disabled ? "var(--iab-mist)" : "#fff",
      border: "1px solid " + border,
      borderRadius: "var(--radius-md)",
      outline: "none",
      width: "100%",
      boxShadow: focus && !invalid ? "0 0 0 3px rgba(46,107,214,0.15)" : "none",
      transition: "border-color var(--dur-fast), box-shadow var(--dur-fast)",
      opacity: disabled ? 0.7 : 1,
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Radio.jsx
try { (() => {
function Radio({
  checked = false,
  onChange,
  label,
  name,
  value,
  disabled = false,
  id,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: id,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "10px",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
      fontFamily: "var(--font-sans)",
      fontSize: "14px",
      color: "var(--text-body)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 18,
      height: 18,
      borderRadius: "50%",
      flexShrink: 0,
      border: "1px solid " + (checked ? "var(--iab-navy)" : "var(--border-strong)"),
      background: "#fff",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "border-color var(--dur-fast)"
    }
  }, checked && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 9,
      height: 9,
      borderRadius: "50%",
      background: "var(--iab-navy)"
    }
  })), /*#__PURE__*/React.createElement("input", {
    id: id,
    type: "radio",
    name: name,
    value: value,
    checked: checked,
    disabled: disabled,
    onChange: onChange,
    style: {
      position: "absolute",
      opacity: 0,
      width: 0,
      height: 0
    }
  }), label);
}
Object.assign(__ds_scope, { Radio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Radio.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Select({
  invalid = false,
  disabled = false,
  children,
  style = {},
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const border = invalid ? "var(--iab-error)" : focus ? "var(--iab-navy)" : "var(--border-strong)";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: "100%"
    }
  }, /*#__PURE__*/React.createElement("select", _extends({
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "14px",
      padding: "10px 38px 10px 13px",
      color: "var(--text-strong)",
      background: disabled ? "var(--iab-mist)" : "#fff",
      border: "1px solid " + border,
      borderRadius: "var(--radius-md)",
      outline: "none",
      width: "100%",
      appearance: "none",
      cursor: disabled ? "not-allowed" : "pointer",
      boxShadow: focus && !invalid ? "0 0 0 3px rgba(46,107,214,0.15)" : "none",
      transition: "border-color var(--dur-fast), box-shadow var(--dur-fast)",
      ...style
    }
  }, rest), children), /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--iab-slate)",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      position: "absolute",
      right: 13,
      top: "50%",
      transform: "translateY(-50%)",
      pointerEvents: "none"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "m6 9 6 6 6-6"
  })));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function Switch({
  checked = false,
  onChange,
  label,
  disabled = false,
  id,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: id,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "10px",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
      fontFamily: "var(--font-sans)",
      fontSize: "14px",
      color: "var(--text-body)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 38,
      height: 22,
      borderRadius: 999,
      flexShrink: 0,
      position: "relative",
      background: checked ? "var(--iab-navy)" : "var(--border-strong)",
      transition: "background var(--dur-base) var(--ease-standard)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: 2,
      left: checked ? 18 : 2,
      width: 18,
      height: 18,
      borderRadius: "50%",
      background: "#fff",
      boxShadow: "var(--shadow-sm)",
      transition: "left var(--dur-base) var(--ease-standard)"
    }
  })), /*#__PURE__*/React.createElement("input", {
    id: id,
    type: "checkbox",
    role: "switch",
    checked: checked,
    disabled: disabled,
    onChange: onChange,
    style: {
      position: "absolute",
      opacity: 0,
      width: 0,
      height: 0
    }
  }), label);
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/forms/Textarea.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Textarea({
  invalid = false,
  disabled = false,
  rows = 4,
  style = {},
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const border = invalid ? "var(--iab-error)" : focus ? "var(--iab-navy)" : "var(--border-strong)";
  return /*#__PURE__*/React.createElement("textarea", _extends({
    rows: rows,
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "14px",
      padding: "10px 13px",
      color: "var(--text-strong)",
      background: disabled ? "var(--iab-mist)" : "#fff",
      border: "1px solid " + border,
      borderRadius: "var(--radius-md)",
      outline: "none",
      width: "100%",
      resize: "vertical",
      lineHeight: 1.5,
      boxShadow: focus && !invalid ? "0 0 0 3px rgba(46,107,214,0.15)" : "none",
      transition: "border-color var(--dur-fast), box-shadow var(--dur-fast)",
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Textarea });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Textarea.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Accordion.jsx
try { (() => {
function Accordion({
  items = [],
  style = {}
}) {
  const [open, setOpen] = React.useState(null);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      border: "1px solid var(--iab-mist)",
      borderRadius: "var(--radius-lg)",
      overflow: "hidden",
      ...style
    }
  }, items.map((it, i) => {
    const on = open === i;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        borderTop: i ? "1px solid var(--iab-mist)" : "none"
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => setOpen(on ? null : i),
      "aria-expanded": on,
      style: {
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        padding: "16px 20px",
        background: on ? "var(--iab-ivory)" : "#fff",
        border: 0,
        cursor: "pointer",
        fontFamily: "var(--font-sans)",
        fontSize: "15px",
        fontWeight: 600,
        color: "var(--text-strong)",
        textAlign: "left"
      }
    }, it.title, /*#__PURE__*/React.createElement("svg", {
      width: "18",
      height: "18",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "var(--iab-gold-deep)",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      style: {
        flexShrink: 0,
        transform: on ? "rotate(180deg)" : "none",
        transition: "transform var(--dur-base) var(--ease-standard)"
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: "m6 9 6 6 6-6"
    }))), on && /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "0 20px 18px",
        fontFamily: "var(--font-sans)",
        fontSize: "14px",
        color: "var(--text-body)",
        lineHeight: 1.6
      }
    }, it.content));
  }));
}
Object.assign(__ds_scope, { Accordion });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Accordion.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Breadcrumb.jsx
try { (() => {
function Breadcrumb({
  items = [],
  style = {}
}) {
  return /*#__PURE__*/React.createElement("nav", {
    "aria-label": "Breadcrumb",
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "13px",
      ...style
    }
  }, /*#__PURE__*/React.createElement("ol", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      listStyle: "none",
      margin: 0,
      padding: 0,
      flexWrap: "wrap"
    }
  }, items.map((it, i) => {
    const last = i === items.length - 1;
    return /*#__PURE__*/React.createElement("li", {
      key: i,
      style: {
        display: "flex",
        alignItems: "center",
        gap: "8px"
      }
    }, it.href && !last ? /*#__PURE__*/React.createElement("a", {
      href: it.href,
      style: {
        color: "var(--text-muted)",
        textDecoration: "none",
        borderBottom: "none"
      }
    }, it.label) : /*#__PURE__*/React.createElement("span", {
      style: {
        color: last ? "var(--text-strong)" : "var(--text-muted)",
        fontWeight: last ? 600 : 400
      }
    }, it.label), !last && /*#__PURE__*/React.createElement("span", {
      style: {
        width: 4,
        height: 4,
        borderRadius: "50%",
        background: "var(--iab-gold-print)",
        display: "inline-block"
      }
    }));
  })));
}
Object.assign(__ds_scope, { Breadcrumb });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Breadcrumb.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
function Tabs({
  tabs = [],
  value,
  onChange,
  style = {}
}) {
  const [internal, setInternal] = React.useState(tabs[0] && tabs[0].id);
  const active = value !== undefined ? value : internal;
  const set = id => {
    if (onChange) onChange(id);else setInternal(id);
  };
  return /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    style: {
      display: "flex",
      gap: "4px",
      borderBottom: "1px solid var(--iab-mist)",
      ...style
    }
  }, tabs.map(t => {
    const on = t.id === active;
    return /*#__PURE__*/React.createElement("button", {
      key: t.id,
      role: "tab",
      "aria-selected": on,
      onClick: () => set(t.id),
      style: {
        fontFamily: "var(--font-sans)",
        fontSize: "14px",
        fontWeight: on ? 600 : 500,
        color: on ? "var(--iab-navy)" : "var(--text-muted)",
        background: "none",
        border: 0,
        cursor: "pointer",
        padding: "11px 16px",
        position: "relative",
        transition: "color var(--dur-fast)"
      }
    }, t.label, /*#__PURE__*/React.createElement("span", {
      style: {
        position: "absolute",
        left: 12,
        right: 12,
        bottom: -1,
        height: 2,
        borderRadius: 2,
        background: "var(--iab-gold-print)",
        opacity: on ? 1 : 0,
        transition: "opacity var(--dur-fast)"
      }
    }));
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portal/PortalShell.jsx
try { (() => {
/* iAB student portal — shell (sidebar + topbar) + screens. Exports to window. */
const PDS = window.IABDesignSystem_8045d9;
function Icon({
  d,
  size = 20,
  stroke = "currentColor",
  sw = 1.5
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: stroke,
    strokeWidth: sw,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    dangerouslySetInnerHTML: {
      __html: d
    }
  });
}
const ICONS = {
  dash: '<rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/>',
  book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
  cert: '<circle cx="12" cy="8" r="6"/><path d="M15.5 13.5 17 22l-5-3-5 3 1.5-8.5"/>',
  cal: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  play: '<polygon points="6 3 20 12 6 21 6 3"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/>'
};
function PortalShell({
  page,
  onNav,
  children
}) {
  const items = [["dashboard", "Dashboard", ICONS.dash], ["courses", "My courses", ICONS.book], ["certificates", "Certificates", ICONS.cert], ["calendar", "Calendar", ICONS.cal]];
  const {
    Avatar
  } = PDS;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "252px 1fr",
      minHeight: "100vh",
      background: "var(--surface-page)"
    }
  }, /*#__PURE__*/React.createElement("aside", {
    style: {
      background: "var(--iab-navy)",
      color: "#fff",
      display: "flex",
      flexDirection: "column",
      padding: "24px 16px",
      position: "sticky",
      top: 0,
      height: "100vh"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logos/iab_icon_transparent.png",
    alt: "iAB",
    style: {
      height: 40,
      width: "auto",
      objectFit: "contain",
      alignSelf: "flex-start",
      margin: "4px 10px 30px"
    }
  }), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 4
    }
  }, items.map(([id, label, ic]) => {
    const on = page === id;
    return /*#__PURE__*/React.createElement("button", {
      key: id,
      onClick: () => onNav(id),
      style: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "11px 14px",
        borderRadius: "var(--radius-md)",
        border: 0,
        cursor: "pointer",
        textAlign: "left",
        fontFamily: "var(--font-sans)",
        fontSize: 14,
        fontWeight: on ? 600 : 500,
        color: on ? "#fff" : "var(--text-on-navy-muted)",
        background: on ? "var(--iab-navy-700)" : "transparent"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      d: ic,
      stroke: on ? "var(--iab-gold)" : "currentColor"
    }), label);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "auto",
      padding: "14px",
      borderRadius: "var(--radius-md)",
      background: "var(--iab-navy-800)",
      border: "1px solid var(--iab-navy-700)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: "Kefilwe Moeng",
    size: "sm"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, "Kefilwe Moeng"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--text-on-navy-muted)"
    }
  }, "Cohort 2026"))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("header", {
    style: {
      height: 68,
      borderBottom: "1px solid var(--iab-mist)",
      background: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 32px",
      position: "sticky",
      top: 0,
      zIndex: 5
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "9px 14px",
      borderRadius: "var(--radius-md)",
      background: "var(--iab-ivory)",
      border: "1px solid var(--iab-mist)",
      width: 320
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    d: ICONS.search,
    size: 17,
    stroke: "var(--iab-slate)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: "var(--text-muted)"
    }
  }, "Search courses, modules\u2026")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 18
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    d: ICONS.bell,
    stroke: "var(--iab-slate)"
  }), /*#__PURE__*/React.createElement(Icon, {
    d: ICONS.logout,
    stroke: "var(--iab-slate)"
  }))), /*#__PURE__*/React.createElement("main", {
    style: {
      padding: "32px 40px 56px",
      maxWidth: 1080,
      margin: "0 auto"
    }
  }, children)));
}
Object.assign(window, {
  PortalShell,
  Icon,
  ICONS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portal/PortalShell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portal/Screens.jsx
try { (() => {
/* iAB student portal — screens. Exports to window. */
const SDS = window.IABDesignSystem_8045d9;
const COURSES = [{
  id: "st",
  name: "Short-term Insurance: Personal Lines",
  prog: 62,
  next: "Module 5 · Motor underwriting",
  mode: "Online",
  status: "In progress",
  tone: "warning"
}, {
  id: "ethics",
  name: "Compliance & Ethics",
  prog: 100,
  next: "Completed",
  mode: "Online",
  status: "Completed",
  tone: "success"
}, {
  id: "wm",
  name: "Wealth Management Foundations",
  prog: 24,
  next: "Module 2 · Risk profiling",
  mode: "Classroom",
  status: "In progress",
  tone: "warning"
}];
function Dashboard({
  onOpen
}) {
  const {
    Card,
    StatBlock,
    ProgressBar,
    Badge,
    Button,
    Alert,
    Breadcrumb
  } = SDS;
  const {
    Icon,
    ICONS
  } = window;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 26
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "iab-overline",
    style: {
      marginBottom: 6
    }
  }, "Welcome back"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 34,
      margin: 0,
      color: "var(--text-strong)"
    }
  }, "Dumela, Kefilwe.")), /*#__PURE__*/React.createElement(Alert, {
    tone: "info",
    title: "Live session tomorrow"
  }, "Motor underwriting workshop \xB7 14:00 CAT \xB7 Join from Calendar."), /*#__PURE__*/React.createElement(Card, {
    variant: "navy",
    style: {
      display: "flex",
      justifyContent: "space-between",
      padding: "26px 32px"
    }
  }, /*#__PURE__*/React.createElement(StatBlock, {
    value: "3",
    label: "Active courses",
    onNavy: true
  }), /*#__PURE__*/React.createElement(StatBlock, {
    value: "62%",
    label: "Avg. progress",
    onNavy: true,
    accent: true
  }), /*#__PURE__*/React.createElement(StatBlock, {
    value: "1",
    label: "Certificates",
    onNavy: true
  }), /*#__PURE__*/React.createElement(StatBlock, {
    value: "4",
    label: "Upcoming sessions",
    onNavy: true
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 22,
      margin: 0
    }
  }, "Continue learning"), /*#__PURE__*/React.createElement("button", {
    onClick: () => window.__nav("courses"),
    style: {
      background: "none",
      border: 0,
      color: "var(--iab-gold-deep)",
      fontFamily: "var(--font-sans)",
      fontSize: 13,
      fontWeight: 600,
      cursor: "pointer"
    }
  }, "View all \u2192")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 16
    }
  }, COURSES.map(c => /*#__PURE__*/React.createElement(Card, {
    key: c.id,
    hoverable: true,
    onClick: () => onOpen(c),
    style: {
      display: "grid",
      gridTemplateColumns: "48px 1fr auto",
      gap: 18,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 48,
      height: 48,
      borderRadius: 10,
      background: "var(--iab-navy)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    d: window.ICONS.book,
    stroke: "var(--iab-gold)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontWeight: 600,
      fontSize: 15,
      color: "var(--text-strong)"
    }
  }, c.name), /*#__PURE__*/React.createElement(Badge, {
    tone: c.tone
  }, c.status)), /*#__PURE__*/React.createElement(ProgressBar, {
    value: c.prog,
    showValue: false,
    accent: c.prog === 100
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "var(--text-muted)",
      marginTop: 7
    }
  }, c.next, " \xB7 ", c.mode)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 22,
      color: "var(--iab-navy)",
      fontVariantNumeric: "tabular-nums"
    }
  }, c.prog, "%"))))));
}
function CoursesScreen({
  onOpen
}) {
  const {
    Table,
    Badge,
    Button,
    Tabs
  } = SDS;
  const [tab, setTab] = React.useState("active");
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 30,
      margin: 0
    }
  }, "My courses"), /*#__PURE__*/React.createElement(Tabs, {
    value: tab,
    onChange: setTab,
    tabs: [{
      id: "active",
      label: "Active"
    }, {
      id: "completed",
      label: "Completed"
    }, {
      id: "all",
      label: "All"
    }]
  }), /*#__PURE__*/React.createElement(Table, {
    columns: [{
      header: "Programme",
      key: "name"
    }, {
      header: "Mode",
      key: "mode"
    }, {
      header: "Progress",
      render: r => r.prog + "%",
      align: "right"
    }, {
      header: "Status",
      render: r => /*#__PURE__*/React.createElement(Badge, {
        tone: r.tone
      }, r.status),
      align: "right"
    }, {
      header: "",
      render: r => /*#__PURE__*/React.createElement(Button, {
        size: "sm",
        variant: "secondary",
        onClick: () => onOpen(r)
      }, "Open"),
      align: "right"
    }],
    rows: COURSES
  }));
}
function CourseDetail({
  course,
  onBack
}) {
  const {
    Card,
    ProgressBar,
    Badge,
    Button,
    Breadcrumb,
    Accordion
  } = SDS;
  const {
    Icon,
    ICONS
  } = window;
  const c = course || COURSES[0];
  const modules = [["Module 1 · Insurance principles", true], ["Module 2 · The policy contract", true], ["Module 3 · Personal lines products", true], ["Module 4 · Household & property", true], ["Module 5 · Motor underwriting", false], ["Module 6 · Claims & settlement", false]];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 22
    }
  }, /*#__PURE__*/React.createElement(Breadcrumb, {
    items: [{
      label: "My courses",
      href: "#"
    }, {
      label: c.name
    }]
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 300px",
      gap: 28,
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Badge, {
    tone: c.tone
  }, c.status), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 30,
      margin: "12px 0 6px"
    }
  }, c.name), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-muted)",
      fontSize: 15,
      margin: 0
    }
  }, "Accredited \xB7 BQA ETP0198 \xB7 ", c.mode)), /*#__PURE__*/React.createElement(Card, {
    style: {
      padding: 0,
      overflow: "hidden"
    }
  }, modules.map(([m, done], i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "15px 20px",
      borderTop: i ? "1px solid var(--iab-mist)" : "none"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 26,
      height: 26,
      borderRadius: "50%",
      flexShrink: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: done ? "var(--iab-success)" : "#fff",
      border: done ? "none" : "1px solid var(--border-strong)"
    }
  }, done ? /*#__PURE__*/React.createElement(Icon, {
    d: ICONS.check,
    size: 14,
    stroke: "#fff",
    sw: 2.5
  }) : /*#__PURE__*/React.createElement(Icon, {
    d: ICONS.play,
    size: 11,
    stroke: "var(--iab-slate)"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontSize: 14,
      fontWeight: done ? 500 : 600,
      color: done ? "var(--text-muted)" : "var(--text-strong)"
    }
  }, m), !done && /*#__PURE__*/React.createElement(Button, {
    size: "sm"
  }, "Start"))))), /*#__PURE__*/React.createElement(Card, {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 16,
      position: "sticky",
      top: 92
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: "var(--text-muted)",
      marginBottom: 10
    }
  }, "Your progress"), /*#__PURE__*/React.createElement(ProgressBar, {
    value: c.prog,
    accent: c.prog === 100
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: "var(--iab-mist)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--text-body)",
      lineHeight: 1.6
    }
  }, "Next: ", /*#__PURE__*/React.createElement("strong", null, c.next)), /*#__PURE__*/React.createElement(Button, {
    variant: "gold",
    fullWidth: true
  }, "Resume course"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    fullWidth: true,
    onClick: onBack
  }, "Back to dashboard"))));
}
Object.assign(window, {
  Dashboard,
  CoursesScreen,
  CourseDetail
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portal/Screens.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Sections.jsx
try { (() => {
/* iAB website — page bodies. Composes DS components. Exports to window. */
const DS = window.IABDesignSystem_8045d9;
function Hero({
  onNav
}) {
  const {
    Button,
    Badge,
    StatBlock,
    GoldRule
  } = DS;
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--iab-navy)",
      color: "#fff",
      position: "relative",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "radial-gradient(60% 80% at 78% 20%, rgba(212,175,55,0.12), transparent 60%)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: "0 auto",
      padding: "96px 40px 104px",
      position: "relative",
      display: "grid",
      gridTemplateColumns: "1.15fr 0.85fr",
      gap: 56,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      color: "var(--iab-gold)",
      marginBottom: 22
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: 999,
      background: "var(--iab-gold)"
    }
  }), "Accredited \xB7 BQA \xB7 TVET \xB7 HRDC"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 60,
      lineHeight: 1.04,
      letterSpacing: "-0.02em",
      color: "#fff",
      margin: "0 0 20px",
      fontWeight: 500
    }
  }, "Build a career in insurance & financial services."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 18,
      color: "#C6CEDA",
      maxWidth: 520,
      lineHeight: 1.6,
      margin: "0 0 32px"
    }
  }, "Practical, accredited learning grounded in Botswana's legislation and market \u2014 turning study into competence, and competence into a career."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 14,
      marginBottom: 48
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "gold",
    size: "lg",
    onClick: () => onNav("programmes")
  }, "Explore programmes"), /*#__PURE__*/React.createElement(Button, {
    variant: "on-navy",
    size: "lg",
    onClick: () => onNav("employers")
  }, "For employers")), /*#__PURE__*/React.createElement(GoldRule, {
    width: 220
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 44,
      marginTop: 28
    }
  }, /*#__PURE__*/React.createElement(StatBlock, {
    value: "10,000+",
    label: "Trained",
    onNavy: true
  }), /*#__PURE__*/React.createElement(StatBlock, {
    value: "10+",
    label: "Years",
    onNavy: true
  }), /*#__PURE__*/React.createElement(StatBlock, {
    value: "20+",
    label: "Corporate clients",
    onNavy: true,
    accent: true
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: "4/5",
      borderRadius: 14,
      background: "linear-gradient(160deg, #14233A, #0A1628)",
      border: "1px solid var(--iab-navy-600)",
      boxShadow: "var(--shadow-lg)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 18,
      position: "relative"
    },
    className: "iab-keylines"
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logos/iab_icon_transparent.png",
    alt: "iAB",
    style: {
      height: 96,
      width: "auto",
      objectFit: "contain"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 26,
      color: "#fff"
    }
  }, "Study. ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--iab-gold)"
    }
  }, "Learn."), " Earn."), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      color: "var(--text-on-navy-muted)"
    }
  }, "Insurance Academy of Botswana")))));
}
const PROGRAMMES = [{
  t: "Short-term Insurance",
  d: "Personal &amp; commercial lines fundamentals for industry-ready practitioners.",
  dur: "6 months",
  mode: "Online · Classroom",
  tag: "Most popular"
}, {
  t: "Long-term Insurance",
  d: "Life, funeral and investment-linked products, compliance and advice.",
  dur: "6 months",
  mode: "Distance",
  tag: null
}, {
  t: "Wealth Management",
  d: "Financial planning, portfolio principles and client advisory skills.",
  dur: "9 months",
  mode: "Classroom",
  tag: null
}, {
  t: "Healthcare Benefits",
  d: "Medical schemes administration, regulation and member servicing.",
  dur: "4 months",
  mode: "Online",
  tag: null
}, {
  t: "Compliance & Ethics",
  d: "NBFIRA-aligned fit-and-proper standards and market conduct.",
  dur: "3 months",
  mode: "Online",
  tag: "New"
}, {
  t: "Corporate Training",
  d: "Bespoke, levy-claimable programmes for your whole team.",
  dur: "Flexible",
  mode: "On-site",
  tag: null
}];
function ProgrammeGrid({
  onNav
}) {
  const {
    Card,
    Badge,
    Button
  } = DS;
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--surface-page)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: "0 auto",
      padding: "84px 40px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      marginBottom: 48
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "iab-overline"
  }, "Executive Education"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 40,
      margin: "10px 0 0",
      color: "var(--text-strong)"
    }
  }, "Programmes built for the sector")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      gap: 22
    }
  }, PROGRAMMES.map(p => /*#__PURE__*/React.createElement(Card, {
    key: p.t,
    hoverable: true,
    onClick: () => onNav("apply"),
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 40,
      borderRadius: 8,
      background: "var(--iab-gold-050)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--iab-gold-deep)",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M22 10v6M2 10l10-5 10 5-10 5z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M6 12v5c3 3 9 3 12 0v-5"
  }))), p.tag && /*#__PURE__*/React.createElement(Badge, {
    tone: "gold"
  }, p.tag)), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 21,
      margin: 0,
      color: "var(--text-strong)"
    }
  }, p.t), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 14,
      color: "var(--text-muted)",
      lineHeight: 1.55,
      flex: 1
    },
    dangerouslySetInnerHTML: {
      __html: p.d
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      fontSize: 12,
      color: "var(--text-muted)",
      paddingTop: 8,
      borderTop: "1px solid var(--iab-mist)"
    }
  }, /*#__PURE__*/React.createElement("span", null, p.dur), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--iab-gold-print)"
    }
  }, "\xB7"), /*#__PURE__*/React.createElement("span", null, p.mode)))))));
}
function EmployerBand({
  onNav
}) {
  const {
    Button,
    StatBlock
  } = DS;
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--iab-navy)",
      color: "#fff"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: "0 auto",
      padding: "80px 40px",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 56,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "iab-overline"
  }, "For employers"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 38,
      margin: "10px 0 16px",
      color: "#fff"
    }
  }, "Levy-claimable training that builds capable teams."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 16,
      color: "#C6CEDA",
      lineHeight: 1.65,
      maxWidth: 480,
      marginBottom: 28
    }
  }, "Develop compliant, capable and future-ready workforces. Meet NBFIRA licensing and fit-and-proper standards with accredited programmes delivered nationwide."), /*#__PURE__*/React.createElement(Button, {
    variant: "gold",
    size: "lg",
    onClick: () => onNav("apply")
  }, "Partner with iAB")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 28,
      padding: 36,
      borderRadius: 14,
      background: "var(--iab-navy-800)",
      border: "1px solid var(--iab-navy-700)"
    }
  }, /*#__PURE__*/React.createElement(StatBlock, {
    value: "HRDC",
    label: "Levy-claimable",
    onNavy: true,
    accent: true
  }), /*#__PURE__*/React.createElement(StatBlock, {
    value: "NBFIRA",
    label: "Aligned",
    onNavy: true
  }), /*#__PURE__*/React.createElement(StatBlock, {
    value: "20+",
    label: "Corporate clients",
    onNavy: true
  }), /*#__PURE__*/React.createElement(StatBlock, {
    value: "National",
    label: "Delivery reach",
    onNavy: true
  }))));
}
Object.assign(window, {
  Hero,
  ProgrammeGrid,
  EmployerBand
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Sections.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/SiteChrome.jsx
try { (() => {
/* iAB marketing website — shared chrome (top nav + footer). Exports to window. */
function SiteNav({
  page,
  onNav
}) {
  const links = [["home", "Home"], ["programmes", "Programmes"], ["employers", "Employers"], ["about", "About"]];
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: "sticky",
      top: 0,
      zIndex: 10,
      background: "rgba(10,22,40,0.92)",
      backdropFilter: "blur(8px)",
      borderBottom: "1px solid var(--iab-navy-700)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: "0 auto",
      padding: "0 40px",
      height: 74,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logos/iab_icon_transparent.png",
    alt: "iAB",
    style: {
      height: 40,
      width: "auto",
      objectFit: "contain",
      cursor: "pointer"
    },
    onClick: () => onNav("home")
  }), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, links.map(([id, label]) => /*#__PURE__*/React.createElement("button", {
    key: id,
    onClick: () => onNav(id),
    style: {
      background: "none",
      border: 0,
      cursor: "pointer",
      fontFamily: "var(--font-sans)",
      fontSize: 14,
      fontWeight: page === id ? 600 : 500,
      color: page === id ? "#fff" : "var(--text-on-navy-muted)",
      padding: "8px 14px",
      position: "relative"
    }
  }, label, page === id && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: 14,
      right: 14,
      bottom: 2,
      height: 2,
      background: "var(--iab-gold)",
      borderRadius: 2
    }
  }))), /*#__PURE__*/React.createElement("button", {
    onClick: () => onNav("apply"),
    style: {
      marginLeft: 10,
      background: "var(--iab-gold-print)",
      color: "var(--iab-navy)",
      border: 0,
      borderRadius: "var(--radius-md)",
      fontFamily: "var(--font-sans)",
      fontWeight: 600,
      fontSize: 14,
      padding: "10px 20px",
      cursor: "pointer"
    }
  }, "Apply now"))));
}
function SiteFooter() {
  const col = (title, items) => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: "var(--iab-gold)",
      marginBottom: 14
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 9
    }
  }, items.map(i => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      fontSize: 14,
      color: "var(--text-on-navy-muted)"
    }
  }, i))));
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: "var(--iab-navy)",
      borderTop: "1px solid var(--iab-navy-700)",
      color: "#fff"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: "0 auto",
      padding: "56px 40px 32px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1.6fr 1fr 1fr 1fr",
      gap: 40,
      paddingBottom: 40,
      borderBottom: "1px solid var(--iab-navy-700)"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logos/iab_icon_transparent.png",
    alt: "iAB",
    style: {
      height: 44,
      width: "auto",
      objectFit: "contain",
      marginBottom: 18
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      color: "var(--text-on-navy-muted)",
      maxWidth: 320,
      lineHeight: 1.6
    }
  }, "Botswana's leading specialist provider of insurance and financial-services training. Study. Learn. Earn.")), col("Programmes", ["Short-term Insurance", "Long-term Insurance", "Wealth Management", "Healthcare"]), col("Institution", ["About iAB", "Accreditation", "For employers", "Contact"]), col("Contact", ["+267 311 7200", "info@iab.co.bw", "Commerce Park, Gaborone"])), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: 24,
      flexWrap: "wrap",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: "var(--text-on-navy-muted)"
    }
  }, "BQA ETP0198 \xB7 TVET 000700 \xB7 HRDC Accredited \xB7 Reg. BW0000132853"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: "var(--text-on-navy-muted)"
    }
  }, "\xA9 2026 Insurance Academy of Botswana"))));
}
Object.assign(window, {
  SiteNav,
  SiteFooter
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/SiteChrome.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/pages.jsx
try { (() => {
/* iAB website — full pages. Exports to window. */
const _DS = window.IABDesignSystem_8045d9;
function HomePage({
  onNav
}) {
  const {
    Hero,
    ProgrammeGrid,
    EmployerBand
  } = window;
  const {
    Card,
    Badge
  } = _DS;
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement(Hero, {
    onNav: onNav
  }), /*#__PURE__*/React.createElement(ProgrammeGrid, {
    onNav: onNav
  }), /*#__PURE__*/React.createElement(EmployerBand, {
    onNav: onNav
  }), /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--iab-ivory)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 860,
      margin: "0 auto",
      padding: "84px 40px",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logos/iab_mono_transparent.png",
    alt: "iAB",
    style: {
      height: 40,
      width: "auto",
      objectFit: "contain",
      marginBottom: 24
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 30,
      lineHeight: 1.4,
      color: "var(--text-strong)",
      margin: "0 0 24px"
    }
  }, "\"Study. Learn. Earn. Three words that describe a journey \u2014 and a promise that education here leads somewhere.\""), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: "var(--text-muted)"
    }
  }, "The iAB brand idea"))));
}
function PageHeader({
  overline,
  title,
  sub
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--iab-navy)",
      color: "#fff"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: "0 auto",
      padding: "72px 40px 64px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "iab-overline"
  }, overline), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 46,
      margin: "10px 0 14px",
      color: "#fff",
      maxWidth: 720
    }
  }, title), sub && /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 17,
      color: "#C6CEDA",
      maxWidth: 560,
      lineHeight: 1.6
    }
  }, sub)));
}
function ProgrammesPage({
  onNav
}) {
  const {
    ProgrammeGrid
  } = window;
  const {
    Tabs
  } = _DS;
  const [tab, setTab] = React.useState("all");
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement(PageHeader, {
    overline: "Programmes",
    title: "Accredited programmes for every stage of a career.",
    sub: "From entry-level fundamentals to advanced specialist qualifications \u2014 all NBFIRA-aligned and industry-recognised."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: "0 auto",
      padding: "32px 40px 0"
    }
  }, /*#__PURE__*/React.createElement(Tabs, {
    value: tab,
    onChange: setTab,
    tabs: [{
      id: "all",
      label: "All"
    }, {
      id: "st",
      label: "Short-term"
    }, {
      id: "lt",
      label: "Long-term"
    }, {
      id: "wm",
      label: "Wealth"
    }, {
      id: "corp",
      label: "Corporate"
    }]
  })), /*#__PURE__*/React.createElement(ProgrammeGrid, {
    onNav: onNav
  }));
}
function EmployersPage({
  onNav
}) {
  const {
    EmployerBand
  } = window;
  const {
    Card,
    Accordion,
    Button
  } = _DS;
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement(PageHeader, {
    overline: "For employers",
    title: "Develop compliant, capable, future-ready teams.",
    sub: "Levy-claimable training aligned to NBFIRA licensing and fit-and-proper standards."
  }), /*#__PURE__*/React.createElement(EmployerBand, {
    onNav: onNav
  }), /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--surface-page)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 860,
      margin: "0 auto",
      padding: "72px 40px"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 32,
      textAlign: "center",
      marginBottom: 32
    }
  }, "Common questions"), /*#__PURE__*/React.createElement(Accordion, {
    items: [{
      title: "Is iAB training levy-claimable?",
      content: "Yes. iAB is HRDC accredited and our programmes are levy-claimable for registered Botswana employers."
    }, {
      title: "Can you deliver on-site?",
      content: "Yes — corporate training is delivered on-site, online or blended, tailored to your team's schedule."
    }, {
      title: "How do we get started?",
      content: "Contact our corporate team on +267 311 7200 or info@iab.co.bw to design a programme."
    }]
  }))));
}
function AboutPage() {
  const {
    StatBlock,
    Card
  } = _DS;
  const pillars = [["Industry Experience", "Built on a decade of real-world sector expertise and leadership."], ["Academic Excellence", "Accredited programmes designed to meet recognised standards."], ["People Focused", "Empowering the next generation of insurance professionals."], ["Future Driven", "Committed to innovation, compliance and community impact."]];
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement(PageHeader, {
    overline: "About iAB",
    title: "Built in Botswana to raise the standard of an entire profession.",
    sub: "Established 2015 \u2014 Botswana's leading specialist provider of insurance and financial-services training."
  }), /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--surface-page)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: "0 auto",
      padding: "72px 40px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      gap: 22
    }
  }, pillars.map(([t, d]) => /*#__PURE__*/React.createElement(Card, {
    key: t
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 19,
      margin: "0 0 8px",
      color: "var(--text-strong)"
    }
  }, t), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 14,
      color: "var(--text-muted)",
      lineHeight: 1.55
    }
  }, d)))))));
}
function ApplyPage() {
  const {
    Card,
    Field,
    Input,
    Select,
    Checkbox,
    Button,
    Alert
  } = _DS;
  const [sent, setSent] = React.useState(false);
  const [agree, setAgree] = React.useState(false);
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement(PageHeader, {
    overline: "Apply",
    title: "Start your application.",
    sub: "Enrolment takes a few minutes. Our team will confirm your place within 2 working days."
  }), /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--surface-page)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 640,
      margin: "0 auto",
      padding: "56px 40px 84px"
    }
  }, /*#__PURE__*/React.createElement(Card, {
    style: {
      padding: 36
    }
  }, sent && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement(Alert, {
    tone: "success",
    title: "Application received"
  }, "We will be in touch within 2 working days.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 18
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "First name",
    htmlFor: "fn",
    required: true
  }, /*#__PURE__*/React.createElement(Input, {
    id: "fn",
    placeholder: "Kefilwe"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Surname",
    htmlFor: "sn",
    required: true
  }, /*#__PURE__*/React.createElement(Input, {
    id: "sn",
    placeholder: "Moeng"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Email",
    htmlFor: "em",
    required: true
  }, /*#__PURE__*/React.createElement(Input, {
    id: "em",
    type: "email",
    placeholder: "you@example.com"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Phone",
    htmlFor: "ph"
  }, /*#__PURE__*/React.createElement(Input, {
    id: "ph",
    placeholder: "+267 \u2026"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: "1 / -1"
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Programme",
    htmlFor: "pr",
    required: true
  }, /*#__PURE__*/React.createElement(Select, {
    id: "pr",
    defaultValue: ""
  }, /*#__PURE__*/React.createElement("option", {
    value: "",
    disabled: true
  }, "Choose a programme\u2026"), /*#__PURE__*/React.createElement("option", null, "Short-term Insurance"), /*#__PURE__*/React.createElement("option", null, "Long-term Insurance"), /*#__PURE__*/React.createElement("option", null, "Wealth Management"), /*#__PURE__*/React.createElement("option", null, "Healthcare Benefits")))), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: "1 / -1"
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Study mode",
    htmlFor: "mo"
  }, /*#__PURE__*/React.createElement(Select, {
    id: "mo",
    defaultValue: "Online"
  }, /*#__PURE__*/React.createElement("option", null, "Online"), /*#__PURE__*/React.createElement("option", null, "Classroom"), /*#__PURE__*/React.createElement("option", null, "Distance")))), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: "1 / -1"
    }
  }, /*#__PURE__*/React.createElement(Checkbox, {
    id: "ag",
    checked: agree,
    onChange: e => setAgree(e.target.checked),
    label: "I agree to iAB's terms and privacy policy."
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: "1 / -1"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "gold",
    size: "lg",
    fullWidth: true,
    disabled: !agree,
    onClick: () => setSent(true)
  }, "Submit application")))))));
}
Object.assign(window, {
  HomePage,
  ProgrammesPage,
  EmployersPage,
  AboutPage,
  ApplyPage
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/pages.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.GoldRule = __ds_scope.GoldRule;

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.StatBlock = __ds_scope.StatBlock;

__ds_ns.Table = __ds_scope.Table;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Alert = __ds_scope.Alert;

__ds_ns.ProgressBar = __ds_scope.ProgressBar;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Field = __ds_scope.Field;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Textarea = __ds_scope.Textarea;

__ds_ns.Accordion = __ds_scope.Accordion;

__ds_ns.Breadcrumb = __ds_scope.Breadcrumb;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
