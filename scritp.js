"use strict";
      var animator = (() => {
        var C = Object.defineProperty;
        var ue = Object.getOwnPropertyDescriptor;
        var de = Object.getOwnPropertyNames;
        var xe = Object.prototype.hasOwnProperty;
        var ye = (e, t) => {
            for (var r in t) C(e, r, { get: t[r], enumerable: !0 });
          },
          ge = (e, t, r, o) => {
            if ((t && typeof t == "object") || typeof t == "function")
              for (let i of de(t))
                !xe.call(e, i) &&
                  i !== r &&
                  C(e, i, {
                    get: () => t[i],
                    enumerable: !(o = ue(t, i)) || o.enumerable,
                  });
            return e;
          };
        var Ae = (e) => ge(C({}, "__esModule", { value: !0 }), e);
        var Le = {};
        ye(Le, {
          animateAppearEffects: () => me,
          getActiveVariantHash: () => ce,
          spring: () => M,
          startOptimizedAppearAnimation: () => Y,
        });
        var G = (e) => e.replace(/([a-z])([A-Z])/gu, "$1-$2").toLowerCase();
        var E = "framerAppearId",
          Fe = "data-" + G(E);
        var he = [
            "transformPerspective",
            "x",
            "y",
            "z",
            "translateX",
            "translateY",
            "translateZ",
            "scale",
            "scaleX",
            "scaleY",
            "rotate",
            "rotateX",
            "rotateY",
            "rotateZ",
            "skew",
            "skewX",
            "skewY",
          ],
          Z = new Set(he);
        var z = (e, t, r) => (r > t ? t : r < e ? e : r);
        var V = (e) => e;
        var B = (e) => e * 1e3,
          O = (e) => e / 1e3;
        var q = V;
        function U(e, t) {
          return t ? e * (1e3 / t) : 0;
        }
        var Te = 5;
        function W(e, t, r) {
          let o = Math.max(t - Te, 0);
          return U(r - e(o), t - o);
        }
        var $ = 0.001,
          be = 0.01,
          _ = 10,
          we = 0.05,
          ve = 1;
        function Q({
          duration: e = 800,
          bounce: t = 0.25,
          velocity: r = 0,
          mass: o = 1,
        }) {
          let i, a;
          q(e <= B(_), "Spring duration must be 10 seconds or less");
          let n = 1 - t;
          (n = z(we, ve, n)),
            (e = z(be, _, O(e))),
            n < 1
              ? ((i = (s) => {
                  let p = s * n,
                    c = p * e,
                    l = p - r,
                    d = D(s, n),
                    u = Math.exp(-c);
                  return $ - (l / d) * u;
                }),
                (a = (s) => {
                  let c = s * n * e,
                    l = c * r + r,
                    d = Math.pow(n, 2) * Math.pow(s, 2) * e,
                    u = Math.exp(-c),
                    x = D(Math.pow(s, 2), n);
                  return ((-i(s) + $ > 0 ? -1 : 1) * ((l - d) * u)) / x;
                }))
              : ((i = (s) => {
                  let p = Math.exp(-s * e),
                    c = (s - r) * e + 1;
                  return -$ + p * c;
                }),
                (a = (s) => {
                  let p = Math.exp(-s * e),
                    c = (r - s) * (e * e);
                  return p * c;
                }));
          let m = 5 / e,
            f = Me(i, a, m);
          if (((e = B(e)), isNaN(f)))
            return { stiffness: 100, damping: 10, duration: e };
          {
            let s = Math.pow(f, 2) * o;
            return {
              stiffness: s,
              damping: n * 2 * Math.sqrt(o * s),
              duration: e,
            };
          }
        }
        var Oe = 12;
        function Me(e, t, r) {
          let o = r;
          for (let i = 1; i < Oe; i++) o = o - e(o) / t(o);
          return o;
        }
        function D(e, t) {
          return e * Math.sqrt(1 - t * t);
        }
        var Se = ["duration", "bounce"],
          Pe = ["stiffness", "damping", "mass"];
        function J(e, t) {
          return t.some((r) => e[r] !== void 0);
        }
        function ke(e) {
          let t = {
            velocity: 0,
            stiffness: 100,
            damping: 10,
            mass: 1,
            isResolvedFromDuration: !1,
            ...e,
          };
          if (!J(e, Pe) && J(e, Se)) {
            let r = Q(e);
            (t = { ...t, ...r, mass: 1 }), (t.isResolvedFromDuration = !0);
          }
          return t;
        }
        function M({ keyframes: e, restDelta: t, restSpeed: r, ...o }) {
          let i = e[0],
            a = e[e.length - 1],
            n = { done: !1, value: i },
            {
              stiffness: m,
              damping: f,
              mass: s,
              duration: p,
              velocity: c,
              isResolvedFromDuration: l,
            } = ke({ ...o, velocity: -O(o.velocity || 0) }),
            d = c || 0,
            u = f / (2 * Math.sqrt(m * s)),
            x = a - i,
            g = O(Math.sqrt(m / s)),
            v = Math.abs(x) < 5;
          r || (r = v ? 0.01 : 2), t || (t = v ? 0.005 : 0.5);
          let h;
          if (u < 1) {
            let y = D(g, u);
            h = (A) => {
              let b = Math.exp(-u * g * A);
              return (
                a -
                b *
                  (((d + u * g * x) / y) * Math.sin(y * A) +
                    x * Math.cos(y * A))
              );
            };
          } else if (u === 1)
            h = (y) => a - Math.exp(-g * y) * (x + (d + g * x) * y);
          else {
            let y = g * Math.sqrt(u * u - 1);
            h = (A) => {
              let b = Math.exp(-u * g * A),
                k = Math.min(y * A, 300);
              return (
                a -
                (b * ((d + u * g * x) * Math.sinh(k) + y * x * Math.cosh(k))) /
                  y
              );
            };
          }
          return {
            calculatedDuration: (l && p) || null,
            next: (y) => {
              let A = h(y);
              if (l) n.done = y >= p;
              else {
                let b = d;
                y !== 0 && (u < 1 ? (b = W(h, y, A)) : (b = 0));
                let k = Math.abs(b) <= r,
                  le = Math.abs(a - A) <= t;
                n.done = k && le;
              }
              return (n.value = n.done ? a : A), n;
            },
          };
        }
        var ee = (e) => Array.isArray(e) && typeof e[0] == "number";
        var S = ([e, t, r, o]) => `cubic-bezier(${e}, ${t}, ${r}, ${o})`,
          te = {
            linear: "linear",
            ease: "ease",
            easeIn: "ease-in",
            easeOut: "ease-out",
            easeInOut: "ease-in-out",
            circIn: S([0, 0.65, 0.55, 1]),
            circOut: S([0.55, 0, 1, 0.45]),
            backIn: S([0.31, 0.01, 0.66, -0.59]),
            backOut: S([0.33, 1.53, 0.69, 0.99]),
          };
        function Ve(e) {
          return N(e) || te.easeOut;
        }
        function N(e) {
          if (e) return ee(e) ? S(e) : Array.isArray(e) ? e.map(Ve) : te[e];
        }
        function L(
          e,
          t,
          r,
          {
            delay: o = 0,
            duration: i = 300,
            repeat: a = 0,
            repeatType: n = "loop",
            ease: m,
            times: f,
          } = {}
        ) {
          let s = { [t]: r };
          f && (s.offset = f);
          let p = N(m);
          return (
            Array.isArray(p) && (s.easing = p),
            e.animate(s, {
              delay: o,
              duration: i,
              easing: Array.isArray(p) ? "linear" : p,
              fill: "both",
              iterations: a + 1,
              direction: n === "reverse" ? "alternate" : "normal",
            })
          );
        }
        var K = (e, t) => `${e}: ${t}`;
        var T = new Map();
        var X;
        function re(e, t, r, o) {
          let i = Z.has(t) ? "transform" : t,
            a = K(e, i),
            n = T.get(a);
          if (!n) return null;
          let { animation: m, startTime: f } = n,
            s = () => {
              if ((T.delete(a), o))
                o.render(() =>
                  o.render(() => {
                    try {
                      m.cancel();
                    } catch {}
                  })
                );
              else
                try {
                  m.cancel();
                } catch {}
            };
          return f === null || window.HandoffComplete
            ? (s(), null)
            : (X === void 0 && (X = performance.now()), X - f || 0);
        }
        var I, w;
        function Y(e, t, r, o, i) {
          if (window.HandoffComplete) {
            window.HandoffAppearAnimations = void 0;
            return;
          }
          let a = e.dataset[E];
          if (!a) return;
          window.HandoffAppearAnimations = re;
          let n = K(a, t);
          w ||
            ((w = L(e, t, [r[0], r[0]], { duration: 1e4, ease: "linear" })),
            T.set(n, { animation: w, startTime: null }),
            window.HandoffCancelAllAnimations ||
              (window.HandoffCancelAllAnimations = () => {
                T.forEach(({ animation: f }) => {
                  f.cancel();
                }),
                  T.clear(),
                  (window.HandoffCancelAllAnimations = void 0);
              }));
          let m = () => {
            w.cancel();
            let f = L(e, t, r, o);
            I === void 0 && (I = performance.now()),
              (f.startTime = I),
              T.set(n, { animation: f, startTime: I }),
              i && i(f);
          };
          w.ready ? w.ready.then(m).catch(V) : m();
        }
        var R = [
            "transformPerspective",
            "x",
            "y",
            "z",
            "translateX",
            "translateY",
            "translateZ",
            "scale",
            "scaleX",
            "scaleY",
            "rotate",
            "rotateX",
            "rotateY",
            "rotateZ",
            "skew",
            "skewX",
            "skewY",
          ],
          De = {
            x: "translateX",
            y: "translateY",
            z: "translateZ",
            transformPerspective: "perspective",
          },
          Ke = {
            translateX: "px",
            translateY: "px",
            translateZ: "px",
            x: "px",
            y: "px",
            z: "px",
            perspective: "px",
            transformPerspective: "px",
            rotate: "deg",
            rotateX: "deg",
            rotateY: "deg",
          };
        function oe(e, t) {
          let r = Ke[e];
          return !r || (typeof t == "string" && t.endsWith(r)) ? t : `${t}${r}`;
        }
        function F(e) {
          return R.includes(e);
        }
        var Ie = (e, t) => R.indexOf(e) - R.indexOf(t);
        function ne(
          { transform: e, transformKeys: t },
          { enableHardwareAcceleration: r = !0, allowTransformNone: o = !0 },
          i,
          a
        ) {
          let n = "";
          t.sort(Ie);
          for (let m of t) n += `${De[m] || m}(${e[m]}) `;
          return (
            r && !e.z && (n += "translateZ(0)"),
            (n = n.trim()),
            a ? (n = a(e, n)) : o && i && (n = "none"),
            n
          );
        }
        function j(e, t) {
          let r = new Set(Object.keys(e));
          for (let o in t) r.add(o);
          return Array.from(r);
        }
        function H(e, t) {
          let r = t - e.length;
          if (r <= 0) return e;
          let o = new Array(r).fill(e[e.length - 1]);
          return e.concat(o);
        }
        var se = { duration: 0.001 },
          P = {
            opacity: 1,
            scale: 1,
            translateX: 0,
            translateY: 0,
            translateZ: 0,
            x: 0,
            y: 0,
            z: 0,
            rotate: 0,
            rotateX: 0,
            rotateY: 0,
          };
        function pe(e, t, r, o, i) {
          return (
            r.delay && (r.delay *= 1e3),
            r.type === "spring" ? Ee(e, t, r, o, i) : Be(e, t, r, o, i)
          );
        }
        function Ce(e, t, r) {
          let o = {},
            i = 0,
            a = 0;
          for (let n of j(e, t)) {
            let m = e[n] ?? P[n],
              f = t[n] ?? P[n];
            if (
              m === void 0 ||
              f === void 0 ||
              (n !== "transformPerspective" && m === f)
            )
              continue;
            n === "transformPerspective" && (o[n] = [m, f]);
            let s = $e(m, f, r),
              { duration: p, keyframes: c } = s;
            p === void 0 ||
              c === void 0 ||
              (p > i && ((i = p), (a = c.length)), (o[n] = c));
          }
          return {
            keyframeValuesByProps: o,
            longestDuration: i,
            longestLength: a,
          };
        }
        function Ee(e, t, r, o, i) {
          let a = {},
            {
              keyframeValuesByProps: n,
              longestDuration: m,
              longestLength: f,
            } = Ce(e, t, r);
          if (!f) return a;
          let s = { ease: "linear", duration: m, delay: r.delay },
            p = i ? se : s,
            c = {};
          for (let [d, u] of Object.entries(n))
            F(d)
              ? (c[d] = H(u, f))
              : (a[d] = {
                  keyframes: H(u, f),
                  options: d === "opacity" ? s : p,
                });
          let l = fe(c, o);
          return l && (a.transform = { keyframes: l, options: p }), a;
        }
        function ze(e) {
          let { type: t, duration: r, ...o } = e;
          return { duration: r * 1e3, ...o };
        }
        function Be(e, t, r, o, i) {
          let a = ze(r);
          if (!a) return;
          let n = {},
            m = i ? se : a,
            f = {};
          for (let p of j(e, t)) {
            let c = e[p] ?? P[p],
              l = t[p] ?? P[p];
            c === void 0 ||
              l === void 0 ||
              (p !== "transformPerspective" && c === l) ||
              (F(p)
                ? (f[p] = [c, l])
                : (n[p] = {
                    keyframes: [c, l],
                    options: p === "opacity" ? a : m,
                  }));
          }
          let s = fe(f, o);
          return s && (n.transform = { keyframes: s, options: m }), n;
        }
        var ie = new Map(),
          ae = 10;
        function $e(e, t, r) {
          let { damping: o, stiffness: i, mass: a } = r,
            n = `${e}-${t}-${o}-${i}-${a}`,
            m = ie.get(n);
          if (m) return m;
          let f = [e, t],
            s = M({ ...r, keyframes: f }),
            p = { done: !1, value: f[0] },
            c = [],
            l = 0;
          for (; !p.done && l < 1e4; )
            (p = s.next(l)), c.push(p.value), (l += ae);
          f = c;
          let d = l - ae,
            x = { keyframes: f, duration: d, ease: "linear" };
          return ie.set(n, x), x;
        }
        function fe(e, t) {
          let r = [],
            o = Object.values(e)[0]?.length;
          if (!o) return;
          let i = Object.keys(e);
          for (let a = 0; a < o; a++) {
            let n = {},
              m = !0;
            for (let [s, p] of Object.entries(e)) {
              let c = p[a];
              m && (m = c === void 0 || c === P[s]),
                c !== void 0 && (n[s] = oe(s, c));
            }
            let f = ne({ transform: n, transformKeys: i }, {}, m, t);
            r.push(f);
          }
          return r;
        }
        function me(e, t, r, o, i, a) {
          for (let [n, m] of Object.entries(e)) {
            let {
              initial: f,
              animate: s,
              transformTemplate: p,
              variantHash: c,
            } = m;
            if (!f || !s || (c && a && c !== a)) continue;
            let { transition: l, ...d } = s,
              u = pe(f, d, l, Ne(p, o), i);
            if (!u) continue;
            let x = {},
              g = {};
            for (let [v, h] of Object.entries(u))
              (x[v] = h.keyframes), (g[v] = h.options);
            t(`[${r}="${n}"]`, x, g);
          }
        }
        function Ne(e, t) {
          if (!(!e || !t)) return (r, o) => e.replace(t, o);
        }
        function ce(e) {
          return e
            ? e.find((r) =>
                r.mediaQuery
                  ? window.matchMedia(r.mediaQuery).matches === !0
                  : !1
              )?.hash
            : void 0;
        }
        return Ae(Le);
      })();
    </script>
    <script data-framer-appear-animation="no-preference">
      requestAnimationFrame(() => {
        if (
          window.__framer_disable_appear_effects_optimization__ !== true &&
          animator
        ) {
          performance.mark("framer-appear-start");
          const respectReducedMotion = false;
          const reducedMotion =
            respectReducedMotion &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches ===
              true;
          const breakpoints = [
            { hash: "72rtr7", mediaQuery: "(min-width: 1280px)" },
            {
              hash: "1g6n99x",
              mediaQuery: "(min-width: 810px) and (max-width: 1279px)",
            },
            { hash: "1vb5nd8", mediaQuery: "(max-width: 809px)" },
          ];
          const appearAnimations = {
            "10djq69": {
              animate: {
                opacity: 1,
                rotate: 0,
                rotateX: 0,
                rotateY: 0,
                scale: 1,
                transition: {
                  delay: 0,
                  duration: 1,
                  ease: [0.5, 1, 0.89, 1],
                  type: "tween",
                },
                x: 0,
                y: 0,
              },
              variantHash: "1vb5nd8",
              initial: { opacity: 0.001, rotate: 0, scale: 1, x: 0, y: 20 },
              transformTemplate:
                "perspective(1200px) __Appear_Animation_Transform__",
            },
            ko1x69: {
              animate: {
                opacity: 1,
                rotate: 0,
                rotateX: 0,
                rotateY: 0,
                scale: 1,
                transition: {
                  delay: 0,
                  duration: 1,
                  ease: [0.5, 1, 0.89, 1],
                  type: "tween",
                },
                x: 0,
                y: 0,
              },
              variantHash: "1g6n99x",
              initial: { opacity: 0.001, rotate: 0, scale: 1, x: 0, y: 20 },
              transformTemplate:
                "perspective(1200px) __Appear_Animation_Transform__",
            },
            "1rjq8p6": {
              animate: {
                opacity: 1,
                rotate: 0,
                rotateX: 0,
                rotateY: 0,
                scale: 1,
                transition: {
                  delay: 0,
                  duration: 1,
                  ease: [0.5, 1, 0.89, 1],
                  type: "tween",
                },
                x: 0,
                y: 0,
              },
              variantHash: "72rtr7",
              initial: { opacity: 0.001, rotate: 0, scale: 1, x: 0, y: 20 },
              transformTemplate:
                "perspective(1200px) __Appear_Animation_Transform__",
            },
            s9aopy: {
              animate: {
                opacity: 1,
                rotate: 0,
                rotateX: 0,
                rotateY: 0,
                scale: 1,
                transition: {
                  delay: 0,
                  duration: 1,
                  ease: [0.5, 1, 0.89, 1],
                  type: "tween",
                },
                x: 0,
                y: 0,
              },
              variantHash: "1vb5nd8",
              initial: { opacity: 0.001, rotate: 0, scale: 1, x: 0, y: 20 },
              transformTemplate:
                "perspective(1200px) __Appear_Animation_Transform__",
            },
            "80icig": {
              animate: {
                opacity: 1,
                rotate: 0,
                rotateX: 0,
                rotateY: 0,
                scale: 1,
                transition: {
                  delay: 0,
                  duration: 1,
                  ease: [0.5, 1, 0.89, 1],
                  type: "tween",
                },
                x: 0,
                y: 0,
              },
              variantHash: "1g6n99x",
              initial: { opacity: 0.001, rotate: 0, scale: 1, x: 0, y: 20 },
              transformTemplate:
                "perspective(1200px) __Appear_Animation_Transform__",
            },
            wodzzf: {
              animate: {
                opacity: 1,
                rotate: 0,
                rotateX: 0,
                rotateY: 0,
                scale: 1,
                transition: {
                  delay: 0,
                  duration: 1,
                  ease: [0.5, 1, 0.89, 1],
                  type: "tween",
                },
                x: 0,
                y: 0,
              },
              variantHash: "72rtr7",
              initial: { opacity: 0.001, rotate: 0, scale: 1, x: 0, y: 20 },
              transformTemplate:
                "perspective(1200px) __Appear_Animation_Transform__",
            },
            "13ro4ce": {
              animate: {
                opacity: 1,
                rotate: 0,
                rotateX: 0,
                rotateY: 0,
                scale: 1,
                transition: {
                  delay: 0,
                  duration: 1,
                  ease: [0.5, 1, 0.89, 1],
                  type: "tween",
                },
                x: 0,
                y: 0,
              },
              variantHash: "1vb5nd8",
              initial: { opacity: 0.001, rotate: 0, scale: 1, x: 0, y: 20 },
              transformTemplate:
                "perspective(1200px) __Appear_Animation_Transform__",
            },
            "1plaa4": {
              animate: {
                opacity: 1,
                rotate: 0,
                rotateX: 0,
                rotateY: 0,
                scale: 1,
                transition: {
                  delay: 0,
                  duration: 1,
                  ease: [0.5, 1, 0.89, 1],
                  type: "tween",
                },
                x: 0,
                y: 0,
              },
              variantHash: "1g6n99x",
              initial: { opacity: 0.001, rotate: 0, scale: 1, x: 0, y: 20 },
              transformTemplate:
                "perspective(1200px) __Appear_Animation_Transform__",
            },
            "16yijrp": {
              animate: {
                opacity: 1,
                rotate: 0,
                rotateX: 0,
                rotateY: 0,
                scale: 1,
                transition: {
                  delay: 0,
                  duration: 1,
                  ease: [0.5, 1, 0.89, 1],
                  type: "tween",
                },
                x: 0,
                y: 0,
              },
              variantHash: "72rtr7",
              initial: { opacity: 0.001, rotate: 0, scale: 1, x: 0, y: 20 },
              transformTemplate:
                "perspective(1200px) __Appear_Animation_Transform__",
            },
            "87ol98": {
              animate: {
                opacity: 1,
                rotate: 0,
                rotateX: 0,
                rotateY: 0,
                scale: 1,
                transition: {
                  delay: 0,
                  duration: 1,
                  ease: [0.5, 1, 0.89, 1],
                  type: "tween",
                },
                x: 0,
                y: 0,
              },
              variantHash: "1vb5nd8",
              initial: { opacity: 0.001, rotate: 0, scale: 1, x: 0, y: 20 },
              transformTemplate:
                "perspective(1200px) __Appear_Animation_Transform__",
            },
            e68ogl: {
              animate: {
                opacity: 1,
                rotate: 0,
                rotateX: 0,
                rotateY: 0,
                scale: 1,
                transition: {
                  delay: 0,
                  duration: 1,
                  ease: [0.5, 1, 0.89, 1],
                  type: "tween",
                },
                x: 0,
                y: 0,
              },
              variantHash: "1g6n99x",
              initial: { opacity: 0.001, rotate: 0, scale: 1, x: 0, y: 20 },
              transformTemplate:
                "perspective(1200px) __Appear_Animation_Transform__",
            },
            ot3e0t: {
              animate: {
                opacity: 1,
                rotate: 0,
                rotateX: 0,
                rotateY: 0,
                scale: 1,
                transition: {
                  delay: 0,
                  duration: 1,
                  ease: [0.5, 1, 0.89, 1],
                  type: "tween",
                },
                x: 0,
                y: 0,
              },
              variantHash: "72rtr7",
              initial: { opacity: 0.001, rotate: 0, scale: 1, x: 0, y: 20 },
              transformTemplate:
                "perspective(1200px) __Appear_Animation_Transform__",
            },
            "7hxr8b": {
              animate: {
                opacity: 1,
                rotate: 0,
                rotateX: 0,
                rotateY: 0,
                scale: 1,
                transition: {
                  delay: 1,
                  duration: 0.4,
                  ease: [0.44, 0, 0.56, 1],
                  type: "tween",
                },
                x: 0,
                y: 0,
              },
              variantHash: "1vb5nd8",
              initial: { opacity: 0.001, rotate: 0, scale: 1, x: 0, y: 10 },
              transformTemplate:
                "perspective(1200px) __Appear_Animation_Transform__",
            },
            qkux5y: {
              animate: {
                opacity: 1,
                rotate: 0,
                rotateX: 0,
                rotateY: 0,
                scale: 1,
                transition: {
                  delay: 1,
                  duration: 0.4,
                  ease: [0.44, 0, 0.56, 1],
                  type: "tween",
                },
                x: 0,
                y: 0,
              },
              variantHash: "1g6n99x",
              initial: { opacity: 0.001, rotate: 0, scale: 1, x: 0, y: 10 },
              transformTemplate:
                "perspective(1200px) __Appear_Animation_Transform__",
            },
            "1dlvjhv": {
              animate: {
                opacity: 1,
                rotate: 0,
                rotateX: 0,
                rotateY: 0,
                scale: 1,
                transition: {
                  delay: 1,
                  duration: 0.4,
                  ease: [0.44, 0, 0.56, 1],
                  type: "tween",
                },
                x: 0,
                y: 0,
              },
              variantHash: "72rtr7",
              initial: { opacity: 0.001, rotate: 0, scale: 1, x: 0, y: 10 },
              transformTemplate:
                "perspective(1200px) __Appear_Animation_Transform__",
            },
          };
          const activeVariantHash = animator.getActiveVariantHash(breakpoints);
          const animate = (selector, keyframesByProps, optionsByProps) => {
            for (const [name, keyframes] of Object.entries(keyframesByProps)) {
              const options = optionsByProps[name];
              const element = document.querySelector(selector);
              if (!element) continue;
              const animation = animator.startOptimizedAppearAnimation(
                element,
                name,
                keyframes,
                options
              );
            }
          };
          animator.animateAppearEffects(
            appearAnimations,
            animate,
            "data-framer-appear-id",
            "__Appear_Animation_Transform__",
            reducedMotion,
            activeVariantHash
          );
          performance.mark("framer-appear-end");
          performance.measure(
            "framer-appear",
            "framer-appear-start",
            "framer-appear-end"
          );
        }
      });