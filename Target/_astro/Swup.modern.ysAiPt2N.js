const I = new WeakMap();
function M(t, e, i, n) {
	if (!t && !I.has(e)) return !1;
	const s = I.get(e) ?? new WeakMap();
	I.set(e, s);
	const o = s.get(i) ?? new Set();
	s.set(i, o);
	const r = o.has(n);
	return t ? o.add(n) : o.delete(n), r && t;
}
function J(t, e) {
	let i = t.target;
	if (
		(i instanceof Text && (i = i.parentElement),
		i instanceof Element && t.currentTarget instanceof Element)
	) {
		const n = i.closest(e);
		if (n && t.currentTarget.contains(n)) return n;
	}
}
function X(t, e, i, n = {}) {
	const { signal: s, base: o = document } = n;
	if (s?.aborted) return;
	const { once: r, ...a } = n,
		c = o instanceof Document ? o.documentElement : o,
		l = !!("object" == typeof n ? n.capture : n),
		h = (n) => {
			const s = J(n, t);
			if (s) {
				const t = Object.assign(n, { delegateTarget: s });
				i.call(c, t),
					r && (c.removeEventListener(e, h, a), M(!1, c, i, u));
			}
		},
		u = JSON.stringify({ selector: t, type: e, capture: l });
	M(!0, c, i, u) || c.addEventListener(e, h, a),
		s?.addEventListener("abort", () => {
			M(!1, c, i, u);
		});
}
function Q(t) {
	for (var e = [], i = 0; i < t.length; ) {
		var n = t[i];
		if ("*" !== n && "+" !== n && "?" !== n)
			if ("\\" !== n)
				if ("{" !== n)
					if ("}" !== n)
						if (":" !== n)
							if ("(" !== n)
								e.push({
									type: "CHAR",
									index: i,
									value: t[i++],
								});
							else {
								var s = 1,
									o = "";
								if ("?" === t[(a = i + 1)])
									throw new TypeError(
										'Pattern cannot start with "?" at '.concat(
											a
										)
									);
								for (; a < t.length; )
									if ("\\" !== t[a]) {
										if (")" === t[a]) {
											if (0 === --s) {
												a++;
												break;
											}
										} else if (
											"(" === t[a] &&
											(s++, "?" !== t[a + 1])
										)
											throw new TypeError(
												"Capturing groups are not allowed at ".concat(
													a
												)
											);
										o += t[a++];
									} else o += t[a++] + t[a++];
								if (s)
									throw new TypeError(
										"Unbalanced pattern at ".concat(i)
									);
								if (!o)
									throw new TypeError(
										"Missing pattern at ".concat(i)
									);
								e.push({ type: "PATTERN", index: i, value: o }),
									(i = a);
							}
						else {
							for (var r = "", a = i + 1; a < t.length; ) {
								var c = t.charCodeAt(a);
								if (
									!(
										(c >= 48 && c <= 57) ||
										(c >= 65 && c <= 90) ||
										(c >= 97 && c <= 122) ||
										95 === c
									)
								)
									break;
								r += t[a++];
							}
							if (!r)
								throw new TypeError(
									"Missing parameter name at ".concat(i)
								);
							e.push({ type: "NAME", index: i, value: r }),
								(i = a);
						}
					else e.push({ type: "CLOSE", index: i, value: t[i++] });
				else e.push({ type: "OPEN", index: i, value: t[i++] });
			else e.push({ type: "ESCAPED_CHAR", index: i++, value: t[i++] });
		else e.push({ type: "MODIFIER", index: i, value: t[i++] });
	}
	return e.push({ type: "END", index: i, value: "" }), e;
}
function Y(t, e) {
	void 0 === e && (e = {});
	for (
		var i = Q(t),
			n = e.prefixes,
			s = void 0 === n ? "./" : n,
			o = "[^".concat(R(e.delimiter || "/#?"), "]+?"),
			r = [],
			a = 0,
			c = 0,
			l = "",
			h = function (t) {
				if (c < i.length && i[c].type === t) return i[c++].value;
			},
			u = function (t) {
				var e = h(t);
				if (void 0 !== e) return e;
				var n = i[c],
					s = n.type,
					o = n.index;
				throw new TypeError(
					"Unexpected "
						.concat(s, " at ")
						.concat(o, ", expected ")
						.concat(t)
				);
			},
			d = function () {
				for (var t, e = ""; (t = h("CHAR") || h("ESCAPED_CHAR")); )
					e += t;
				return e;
			};
		c < i.length;

	) {
		var p = h("CHAR"),
			f = h("NAME"),
			m = h("PATTERN");
		if (f || m) {
			var v = p || "";
			-1 === s.indexOf(v) && ((l += v), (v = "")),
				l && (r.push(l), (l = "")),
				r.push({
					name: f || a++,
					prefix: v,
					suffix: "",
					pattern: m || o,
					modifier: h("MODIFIER") || "",
				});
		} else {
			var g = p || h("ESCAPED_CHAR");
			if (g) l += g;
			else if ((l && (r.push(l), (l = "")), h("OPEN"))) {
				v = d();
				var w = h("NAME") || "",
					y = h("PATTERN") || "",
					k = d();
				u("CLOSE"),
					r.push({
						name: w || (y ? a++ : ""),
						pattern: w && !y ? o : y,
						prefix: v,
						suffix: k,
						modifier: h("MODIFIER") || "",
					});
			} else u("END");
		}
	}
	return r;
}
function Z(t, e) {
	var i = [];
	return tt(B(t, i, e), i, e);
}
function tt(t, e, i) {
	void 0 === i && (i = {});
	var n = i.decode,
		s =
			void 0 === n
				? function (t) {
						return t;
					}
				: n;
	return function (i) {
		var n = t.exec(i);
		if (!n) return !1;
		for (
			var o = n[0],
				r = n.index,
				a = Object.create(null),
				c = function (t) {
					if (void 0 === n[t]) return "continue";
					var i = e[t - 1];
					"*" === i.modifier || "+" === i.modifier
						? (a[i.name] = n[t]
								.split(i.prefix + i.suffix)
								.map(function (t) {
									return s(t, i);
								}))
						: (a[i.name] = s(n[t], i));
				},
				l = 1;
			l < n.length;
			l++
		)
			c(l);
		return { path: o, index: r, params: a };
	};
}
function R(t) {
	return t.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
function j(t) {
	return t && t.sensitive ? "" : "i";
}
function et(t, e) {
	if (!e) return t;
	for (var i = /\((?:\?<(.*?)>)?(?!\?)/g, n = 0, s = i.exec(t.source); s; )
		e.push({
			name: s[1] || n++,
			prefix: "",
			suffix: "",
			modifier: "",
			pattern: "",
		}),
			(s = i.exec(t.source));
	return t;
}
function it(t, e, i) {
	var n = t.map(function (t) {
		return B(t, e, i).source;
	});
	return new RegExp("(?:".concat(n.join("|"), ")"), j(i));
}
function nt(t, e, i) {
	return st(Y(t, i), e, i);
}
function st(t, e, i) {
	void 0 === i && (i = {});
	for (
		var n = i.strict,
			s = void 0 !== n && n,
			o = i.start,
			r = void 0 === o || o,
			a = i.end,
			c = void 0 === a || a,
			l = i.encode,
			h =
				void 0 === l
					? function (t) {
							return t;
						}
					: l,
			u = i.delimiter,
			d = void 0 === u ? "/#?" : u,
			p = i.endsWith,
			f = "[".concat(R(void 0 === p ? "" : p), "]|$"),
			m = "[".concat(R(d), "]"),
			v = r ? "^" : "",
			g = 0,
			w = t;
		g < w.length;
		g++
	) {
		var y = w[g];
		if ("string" == typeof y) v += R(h(y));
		else {
			var k = R(h(y.prefix)),
				E = R(h(y.suffix));
			if (y.pattern)
				if ((e && e.push(y), k || E))
					if ("+" === y.modifier || "*" === y.modifier) {
						var S = "*" === y.modifier ? "?" : "";
						v += "(?:"
							.concat(k, "((?:")
							.concat(y.pattern, ")(?:")
							.concat(E)
							.concat(k, "(?:")
							.concat(y.pattern, "))*)")
							.concat(E, ")")
							.concat(S);
					} else
						v += "(?:"
							.concat(k, "(")
							.concat(y.pattern, ")")
							.concat(E, ")")
							.concat(y.modifier);
				else
					"+" === y.modifier || "*" === y.modifier
						? (v += "((?:"
								.concat(y.pattern, ")")
								.concat(y.modifier, ")"))
						: (v += "(".concat(y.pattern, ")").concat(y.modifier));
			else v += "(?:".concat(k).concat(E, ")").concat(y.modifier);
		}
	}
	if (c)
		s || (v += "".concat(m, "?")),
			(v += i.endsWith ? "(?=".concat(f, ")") : "$");
	else {
		var b = t[t.length - 1],
			x =
				"string" == typeof b
					? m.indexOf(b[b.length - 1]) > -1
					: void 0 === b;
		s || (v += "(?:".concat(m, "(?=").concat(f, "))?")),
			x || (v += "(?=".concat(m, "|").concat(f, ")"));
	}
	return new RegExp(v, j(i));
}
function B(t, e, i) {
	return t instanceof RegExp
		? et(t, e)
		: Array.isArray(t)
			? it(t, e, i)
			: nt(t, e, i);
}
function y() {
	return (
		(y = Object.assign
			? Object.assign.bind()
			: function (t) {
					for (var e = 1; e < arguments.length; e++) {
						var i = arguments[e];
						for (var n in i)
							Object.prototype.hasOwnProperty.call(i, n) &&
								(t[n] = i[n]);
					}
					return t;
				}),
		y.apply(this, arguments)
	);
}
const F = (t, e) =>
		String(t)
			.toLowerCase()
			.replace(/[\s/_.]+/g, "-")
			.replace(/[^\w-]+/g, "")
			.replace(/--+/g, "-")
			.replace(/^-+|-+$/g, "") ||
		e ||
		"",
	k = ({ hash: t } = {}) =>
		location.pathname + location.search + (t ? location.hash : ""),
	rt = (t, e = {}) => {
		const i = y(
			{
				url: (t = t || k({ hash: !0 })),
				random: Math.random(),
				source: "swup",
			},
			e
		);
		history.pushState(i, "", t);
	},
	T = (t = null, e = {}) => {
		t = t || k({ hash: !0 });
		const i = y(
			{},
			history.state || {},
			{ url: t, random: Math.random(), source: "swup" },
			e
		);
		history.replaceState(i, "", t);
	},
	ot = (t, e, i, n) => {
		const s = new AbortController();
		return (
			X(t, e, i, (n = y({}, n, { signal: s.signal }))),
			{ destroy: () => s.abort() }
		);
	};
class S extends URL {
	constructor(t, e = document.baseURI) {
		super(t.toString(), e), Object.setPrototypeOf(this, S.prototype);
	}
	get url() {
		return this.pathname + this.search;
	}
	static fromElement(t) {
		const e = t.getAttribute("href") || t.getAttribute("xlink:href") || "";
		return new S(e);
	}
	static fromUrl(t) {
		return new S(t);
	}
}
const Rt = (t, e) => {
	try {
		return Z(t, e);
	} catch (e) {
		throw new Error(
			`[swup] Error parsing path "${String(t)}":\n${String(e)}`
		);
	}
};
class H extends Error {
	constructor(t, e) {
		super(t),
			(this.url = void 0),
			(this.status = void 0),
			(this.aborted = void 0),
			(this.timedOut = void 0),
			(this.name = "FetchError"),
			(this.url = e.url),
			(this.status = e.status),
			(this.aborted = e.aborted || !1),
			(this.timedOut = e.timedOut || !1);
	}
}
async function at(t, e = {}) {
	var i;
	t = S.fromUrl(t).url;
	const { visit: n = this.visit } = e,
		s = y({}, this.options.requestHeaders, e.headers),
		o = null != (i = e.timeout) ? i : this.options.timeout,
		r = new AbortController(),
		{ signal: a } = r;
	e = y({}, e, { headers: s, signal: a });
	let c,
		l = !1,
		h = null;
	o &&
		o > 0 &&
		(h = setTimeout(() => {
			(l = !0), r.abort("timeout");
		}, o));
	try {
		(c = await this.hooks.call(
			"fetch:request",
			n,
			{ url: t, options: e },
			(t, { url: e, options: i }) => fetch(e, i)
		)),
			h && clearTimeout(h);
	} catch (e) {
		throw l
			? (this.hooks.call("fetch:timeout", n, { url: t }),
				new H(`Request timed out: ${t}`, { url: t, timedOut: l }))
			: "AbortError" === e?.name || a.aborted
				? new H(`Request aborted: ${t}`, { url: t, aborted: !0 })
				: e;
	}
	const { status: u, url: d } = c,
		p = await c.text();
	if (500 === u)
		throw (
			(this.hooks.call("fetch:error", n, {
				status: u,
				response: c,
				url: d,
			}),
			new H(`Server error: ${d}`, { status: u, url: d }))
		);
	if (!p) throw new H(`Empty response: ${d}`, { status: u, url: d });
	const { url: f } = S.fromUrl(d),
		m = { url: f, html: p };
	return (
		!n.cache.write ||
			(e.method && "GET" !== e.method) ||
			t !== f ||
			this.cache.set(m.url, m),
		m
	);
}
class ct {
	constructor(t) {
		(this.swup = void 0), (this.pages = new Map()), (this.swup = t);
	}
	get size() {
		return this.pages.size;
	}
	get all() {
		const t = new Map();
		return (
			this.pages.forEach((e, i) => {
				t.set(i, y({}, e));
			}),
			t
		);
	}
	has(t) {
		return this.pages.has(this.resolve(t));
	}
	get(t) {
		const e = this.pages.get(this.resolve(t));
		return e && y({}, e);
	}
	set(t, e) {
		(e = y({}, e, { url: (t = this.resolve(t)) })),
			this.pages.set(t, e),
			this.swup.hooks.callSync("cache:set", void 0, { page: e });
	}
	update(t, e) {
		t = this.resolve(t);
		const i = y({}, this.get(t), e, { url: t });
		this.pages.set(t, i);
	}
	delete(t) {
		this.pages.delete(this.resolve(t));
	}
	clear() {
		this.pages.clear(),
			this.swup.hooks.callSync("cache:clear", void 0, void 0);
	}
	prune(t) {
		this.pages.forEach((e, i) => {
			t(i, e) && this.delete(i);
		});
	}
	resolve(t) {
		const { url: e } = S.fromUrl(t);
		return this.swup.resolveUrl(e);
	}
}
const D = (t, e = document) => e.querySelector(t),
	q = (t, e = document) => Array.from(e.querySelectorAll(t)),
	K = () =>
		new Promise((t) => {
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					t();
				});
			});
		});
function z(t) {
	return (
		!!t &&
		("object" == typeof t || "function" == typeof t) &&
		"function" == typeof t.then
	);
}
function lt(t, e = []) {
	return new Promise((i, n) => {
		const s = t(...e);
		z(s) ? s.then(i, n) : i(s);
	});
}
function Ut(t) {
	var e;
	return null == (e = t = t || document.body) ? void 0 : e.offsetHeight;
}
const V = (t) => (window.CSS && window.CSS.escape ? CSS.escape(t) : t),
	W = (t) => 1e3 * Number(t.slice(0, -1).replace(",", "."));
class ht {
	constructor(t) {
		(this.swup = void 0),
			(this.swupClasses = [
				"to-",
				"is-changing",
				"is-rendering",
				"is-popstate",
				"is-animating",
				"is-leaving",
			]),
			(this.swup = t);
	}
	get selectors() {
		const { scope: t } = this.swup.visit.animation;
		return "containers" === t
			? this.swup.visit.containers
			: "html" === t
				? ["html"]
				: Array.isArray(t)
					? t
					: [];
	}
	get selector() {
		return this.selectors.join(",");
	}
	get targets() {
		return this.selector.trim() ? q(this.selector) : [];
	}
	add(...t) {
		this.targets.forEach((e) => e.classList.add(...t));
	}
	remove(...t) {
		this.targets.forEach((e) => e.classList.remove(...t));
	}
	clear() {
		this.targets.forEach((t) => {
			const e = t.className.split(" ").filter((t) => this.isSwupClass(t));
			t.classList.remove(...e);
		});
	}
	isSwupClass(t) {
		return this.swupClasses.some((e) => t.startsWith(e));
	}
}
class G {
	constructor(t, e) {
		(this.id = void 0),
			(this.state = void 0),
			(this.from = void 0),
			(this.to = void 0),
			(this.containers = void 0),
			(this.animation = void 0),
			(this.trigger = void 0),
			(this.cache = void 0),
			(this.history = void 0),
			(this.scroll = void 0);
		const {
			to: i,
			from: n = t.currentPageUrl,
			hash: s,
			el: o,
			event: r,
		} = e;
		(this.id = Math.random()),
			(this.state = 1),
			(this.from = { url: n }),
			(this.to = { url: i, hash: s }),
			(this.containers = t.options.containers),
			(this.animation = {
				animate: !0,
				wait: !1,
				name: void 0,
				native: t.options.native,
				scope: t.options.animationScope,
				selector: t.options.animationSelector,
			}),
			(this.trigger = { el: o, event: r }),
			(this.cache = { read: t.options.cache, write: t.options.cache }),
			(this.history = {
				action: "push",
				popstate: !1,
				direction: void 0,
			}),
			(this.scroll = { reset: !0, target: void 0 });
	}
	advance(t) {
		this.state < t && (this.state = t);
	}
	abort() {
		this.state = 8;
	}
	get done() {
		return this.state >= 7;
	}
}
function ut(t) {
	return new G(this, t);
}
class dt {
	constructor(t) {
		(this.swup = void 0),
			(this.registry = new Map()),
			(this.hooks = [
				"animation:out:start",
				"animation:out:await",
				"animation:out:end",
				"animation:in:start",
				"animation:in:await",
				"animation:in:end",
				"animation:skip",
				"cache:clear",
				"cache:set",
				"content:replace",
				"content:scroll",
				"enable",
				"disable",
				"fetch:request",
				"fetch:error",
				"fetch:timeout",
				"history:popstate",
				"link:click",
				"link:self",
				"link:anchor",
				"link:newtab",
				"page:load",
				"page:view",
				"scroll:top",
				"scroll:anchor",
				"visit:start",
				"visit:transition",
				"visit:abort",
				"visit:end",
			]),
			(this.swup = t),
			this.init();
	}
	init() {
		this.hooks.forEach((t) => this.create(t));
	}
	create(t) {
		this.registry.has(t) || this.registry.set(t, new Map());
	}
	exists(t) {
		return this.registry.has(t);
	}
	get(t) {
		const e = this.registry.get(t);
		if (e) return e;
		console.error(`Unknown hook '${t}'`);
	}
	clear() {
		this.registry.forEach((t) => t.clear());
	}
	on(t, e, i = {}) {
		const n = this.get(t);
		if (!n) return console.warn(`Hook '${t}' not found.`), () => {};
		const s = y({}, i, { id: n.size + 1, hook: t, handler: e });
		return n.set(e, s), () => this.off(t, e);
	}
	before(t, e, i = {}) {
		return this.on(t, e, y({}, i, { before: !0 }));
	}
	replace(t, e, i = {}) {
		return this.on(t, e, y({}, i, { replace: !0 }));
	}
	once(t, e, i = {}) {
		return this.on(t, e, y({}, i, { once: !0 }));
	}
	off(t, e) {
		const i = this.get(t);
		i && e
			? i.delete(e) || console.warn(`Handler for hook '${t}' not found.`)
			: i && i.clear();
	}
	async call(t, e, i, n) {
		const [s, o, r] = this.parseCallArgs(t, e, i, n),
			{ before: a, handler: c, after: l } = this.getHandlers(t, r);
		await this.run(a, s, o);
		const [h] = await this.run(c, s, o);
		return await this.run(l, s, o), this.dispatchDomEvent(t, s, o), h;
	}
	callSync(t, e, i, n) {
		const [s, o, r] = this.parseCallArgs(t, e, i, n),
			{ before: a, handler: c, after: l } = this.getHandlers(t, r);
		this.runSync(a, s, o);
		const [h] = this.runSync(c, s, o);
		return this.runSync(l, s, o), this.dispatchDomEvent(t, s, o), h;
	}
	parseCallArgs(t, e, i, n) {
		return e instanceof G ||
			("object" != typeof e && "function" != typeof i)
			? [e, i, n]
			: [void 0, e, i];
	}
	async run(t, e, i) {
		const n = [];
		for (const { hook: s, handler: o, defaultHandler: r, once: a } of t) {
			if (null != e && e.done) continue;
			a && this.off(s, o);
			const t = await lt(o, [e || this.swup.visit, i, r]);
			n.push(t);
		}
		return n;
	}
	runSync(t, e, i) {
		const n = [];
		for (const { hook: s, handler: o, defaultHandler: r, once: a } of t) {
			if (null != e && e.done) continue;
			a && this.off(s, o);
			const t = o(e || this.swup.visit, i, r);
			n.push(t),
				z(t) &&
					console.warn(
						`Promise returned from handler for synchronous hook '${s}'.Swup will not wait for it to resolve.`
					);
		}
		return n;
	}
	getHandlers(t, e) {
		const i = this.get(t);
		if (!i)
			return {
				found: !1,
				before: [],
				handler: [],
				after: [],
				replaced: !1,
			};
		const n = Array.from(i.values()),
			s = this.sortRegistrations,
			o = n.filter(({ before: t, replace: e }) => t && !e).sort(s),
			r = n
				.filter(({ replace: t }) => t)
				.filter((t) => !0)
				.sort(s),
			a = n.filter(({ before: t, replace: e }) => !t && !e).sort(s),
			c = r.length > 0;
		let l = [];
		if (e && ((l = [{ id: 0, hook: t, handler: e }]), c)) {
			const i = r.length - 1,
				n = (t) => {
					const i = r[t - 1];
					return i ? (e, s) => i.handler(e, s, n(t - 1)) : e;
				};
			l = [
				{ id: 0, hook: t, handler: r[i].handler, defaultHandler: n(i) },
			];
		}
		return { found: !0, before: o, handler: l, after: a, replaced: c };
	}
	sortRegistrations(t, e) {
		var i, n;
		return (
			(null != (i = t.priority) ? i : 0) -
				(null != (n = e.priority) ? n : 0) ||
			t.id - e.id ||
			0
		);
	}
	dispatchDomEvent(t, e, i) {
		if (null != e && e.done) return;
		const n = { hook: t, args: i, visit: e || this.swup.visit };
		document.dispatchEvent(
			new CustomEvent("swup:any", { detail: n, bubbles: !0 })
		),
			document.dispatchEvent(
				new CustomEvent(`swup:${t}`, { detail: n, bubbles: !0 })
			);
	}
}
const ft = (t) => {
		if ((t && "#" === t.charAt(0) && (t = t.substring(1)), !t)) return null;
		const e = decodeURIComponent(t);
		let i =
			document.getElementById(t) ||
			document.getElementById(e) ||
			D(`a[name='${V(t)}']`) ||
			D(`a[name='${V(e)}']`);
		return i || "top" !== t || (i = document.body), i;
	},
	U = "transition",
	$ = "animation";
async function pt({ elements: t, selector: e }) {
	if (!1 === e && !t) return;
	let i = [];
	if (t) i = Array.from(t);
	else if (e && ((i = q(e, document.body)), !i.length))
		return void console.warn(
			`[swup] No elements found matching animationSelector \`${e}\``
		);
	const n = i.map((t) =>
		(function (t) {
			const {
				type: e,
				timeout: i,
				propCount: n,
			} = (function (t, e) {
				const i = window.getComputedStyle(t),
					n = L(i, `${U}Delay`),
					s = L(i, `${U}Duration`),
					o = _(n, s),
					r = L(i, `${$}Delay`),
					a = L(i, `${$}Duration`),
					c = _(r, a);
				let l = null,
					h = 0,
					u = 0;
				return (
					(h = Math.max(o, c)),
					(l = h > 0 ? (o > c ? U : $) : null),
					(u = l ? (l === U ? s.length : a.length) : 0),
					{ type: l, timeout: h, propCount: u }
				);
			})(t);
			return (
				!(!e || !i) &&
				new Promise((s) => {
					const o = `${e}end`,
						r = performance.now();
					let a = 0;
					const c = () => {
							t.removeEventListener(o, l), s();
						},
						l = (e) => {
							if (e.target === t) {
								if (![`${U}end`, `${$}end`].includes(e.type))
									throw new Error(
										"Not a transition or animation event."
									);
								(performance.now() - r) / 1e3 < e.elapsedTime ||
									(++a >= n && c());
							}
						};
					setTimeout(() => {
						a < n && c();
					}, i + 1),
						t.addEventListener(o, l);
				})
			);
		})(t)
	);
	n.filter(Boolean).length > 0
		? await Promise.all(n)
		: e &&
			console.warn(
				`[swup] No CSS animation duration defined on elements matching \`${e}\``
			);
}
function L(t, e) {
	return (t[e] || "").split(", ");
}
function _(t, e) {
	for (; t.length < e.length; ) t = t.concat(t);
	return Math.max(...e.map((e, i) => W(e) + W(t[i])));
}
function vt(t, e = {}, i = {}) {
	if ("string" != typeof t)
		throw new Error("swup.navigate() requires a URL parameter");
	if (this.shouldIgnoreVisit(t, { el: i.el, event: i.event }))
		return void (window.location.href = t);
	const { url: n, hash: s } = S.fromUrl(t),
		o = this.createVisit(y({}, i, { to: n, hash: s }));
	this.performNavigation(o, e);
}
async function mt(t, e = {}) {
	if (this.navigating) {
		if (this.visit.state >= 6)
			return (
				(t.state = 2),
				void (this.onVisitEnd = () => this.performNavigation(t, e))
			);
		await this.hooks.call("visit:abort", this.visit, void 0),
			(this.visit.state = 8);
	}
	(this.navigating = !0), (this.visit = t);
	const { el: i } = t.trigger;
	(e.referrer = e.referrer || this.currentPageUrl),
		!1 === e.animate && (t.animation.animate = !1),
		t.animation.animate || this.classes.clear();
	const n = e.history || i?.getAttribute("data-swup-history") || void 0;
	n && ["push", "replace"].includes(n) && (t.history.action = n);
	const s = e.animation || i?.getAttribute("data-swup-animation") || void 0;
	var o, r;
	s && (t.animation.name = s),
		"object" == typeof e.cache
			? ((t.cache.read = null != (o = e.cache.read) ? o : t.cache.read),
				(t.cache.write =
					null != (r = e.cache.write) ? r : t.cache.write))
			: void 0 !== e.cache &&
				(t.cache = { read: !!e.cache, write: !!e.cache }),
		delete e.cache;
	try {
		await this.hooks.call("visit:start", t, void 0), (t.state = 3);
		const i = this.hooks.call(
			"page:load",
			t,
			{ options: e },
			async (t, e) => {
				let i;
				return (
					t.cache.read && (i = this.cache.get(t.to.url)),
					(e.page = i || (await this.fetchPage(t.to.url, e.options))),
					(e.cache = !!i),
					e.page
				);
			}
		);
		if (
			(i.then(({ html: e }) => {
				t.advance(5), (t.to.html = e);
			}),
			!t.history.popstate)
		) {
			const e = t.to.url + t.to.hash;
			"replace" === t.history.action || t.to.url === this.currentPageUrl
				? T(e)
				: (this.currentHistoryIndex++,
					rt(e, { index: this.currentHistoryIndex }));
		}
		if (
			((this.currentPageUrl = k()),
			t.history.popstate && this.classes.add("is-popstate"),
			t.animation.name && this.classes.add(`to-${F(t.animation.name)}`),
			t.animation.wait && (await i),
			t.done ||
				(await this.hooks.call(
					"visit:transition",
					t,
					void 0,
					async () => {
						if (!t.animation.animate)
							return (
								await this.hooks.call("animation:skip", void 0),
								void (await this.renderPage(t, await i))
							);
						t.advance(4),
							await this.animatePageOut(t),
							t.animation.native && document.startViewTransition
								? await document.startViewTransition(
										async () =>
											await this.renderPage(t, await i)
									).finished
								: await this.renderPage(t, await i),
							await this.animatePageIn(t);
					}
				),
				t.done))
		)
			return;
		await this.hooks.call("visit:end", t, void 0, () =>
			this.classes.clear()
		),
			(t.state = 7),
			(this.navigating = !1),
			this.onVisitEnd && (this.onVisitEnd(), (this.onVisitEnd = void 0));
	} catch (e) {
		if (!e || (null != e && e.aborted)) return void (t.state = 8);
		(t.state = 9),
			console.error(e),
			(this.options.skipPopStateHandling = () => (
				(window.location.href = t.to.url + t.to.hash), !0
			)),
			window.history.go(-1);
	}
}
const gt = async function (t) {
		await this.hooks.call("animation:out:start", t, void 0, () => {
			this.classes.add("is-changing", "is-animating", "is-leaving");
		}),
			await this.hooks.call(
				"animation:out:await",
				t,
				{ skip: !1 },
				(t, { skip: e }) => {
					if (!e)
						return this.awaitAnimations({
							selector: t.animation.selector,
						});
				}
			),
			await this.hooks.call("animation:out:end", t, void 0);
	},
	wt = function ({ html: t }, { containers: e } = this.options) {
		var i;
		const n = new DOMParser().parseFromString(t, "text/html"),
			s =
				(null == (i = n.querySelector("title"))
					? void 0
					: i.innerText) || "";
		document.title = s;
		const o = q('[data-swup-persist]:not([data-swup-persist=""])'),
			r = e
				.map((t) => {
					const e = document.querySelector(t),
						i = n.querySelector(t);
					return e && i
						? (e.replaceWith(i), !0)
						: (e ||
								console.warn(
									`[swup] Container missing in current document: ${t}`
								),
							i ||
								console.warn(
									`[swup] Container missing in incoming document: ${t}`
								),
							!1);
				})
				.filter(Boolean);
		return (
			o.forEach((t) => {
				const e = t.getAttribute("data-swup-persist"),
					i = D(`[data-swup-persist="${e}"]`);
				i && i !== t && i.replaceWith(t);
			}),
			r.length === e.length
		);
	},
	yt = function (t) {
		const e = { behavior: "auto" },
			{ target: i, reset: n } = t.scroll,
			s = i ?? t.to.hash;
		let o = !1;
		return (
			s &&
				(o = this.hooks.callSync(
					"scroll:anchor",
					t,
					{ hash: s, options: e },
					(t, { hash: e, options: i }) => {
						const n = this.getAnchorElement(e);
						return n && n.scrollIntoView(i), !!n;
					}
				)),
			n &&
				!o &&
				(o = this.hooks.callSync(
					"scroll:top",
					t,
					{ options: e },
					(t, { options: e }) => (
						window.scrollTo(y({ top: 0, left: 0 }, e)), !0
					)
				)),
			o
		);
	},
	Et = async function (t) {
		if (t.done) return;
		const e = this.hooks.call(
			"animation:in:await",
			t,
			{ skip: !1 },
			(t, { skip: e }) => {
				if (!e)
					return this.awaitAnimations({
						selector: t.animation.selector,
					});
			}
		);
		await K(),
			await this.hooks.call("animation:in:start", t, void 0, () => {
				this.classes.remove("is-animating");
			}),
			await e,
			await this.hooks.call("animation:in:end", t, void 0);
	},
	bt = async function (t, e) {
		if (t.done) return;
		t.advance(6);
		const { url: i } = e;
		this.classes.remove("is-leaving"),
			this.isSameResolvedUrl(k(), i) ||
				(T(i),
				(this.currentPageUrl = k()),
				(t.to.url = this.currentPageUrl)),
			t.animation.animate && this.classes.add("is-rendering"),
			await this.hooks.call(
				"content:replace",
				t,
				{ page: e },
				(t, { page: e }) => {
					if (!this.replaceContent(e, { containers: t.containers }))
						throw new Error("[swup] Container mismatch, aborting");
					t.animation.animate &&
						(this.classes.add(
							"is-changing",
							"is-animating",
							"is-rendering"
						),
						t.animation.name &&
							this.classes.add(`to-${F(t.animation.name)}`));
				}
			),
			await this.hooks.call("content:scroll", t, void 0, () =>
				this.scrollToContent(t)
			),
			await this.hooks.call("page:view", t, {
				url: this.currentPageUrl,
				title: document.title,
			});
	},
	St = function (t) {
		var e;
		if (((e = t), e?.isSwupPlugin)) {
			if (
				((t.swup = this),
				!t._checkRequirements || t._checkRequirements())
			)
				return (
					t._beforeMount && t._beforeMount(),
					t.mount(),
					this.plugins.push(t),
					this.plugins
				);
		} else console.error("Not a swup plugin instance", t);
	};
function xt(t) {
	const e = this.findPlugin(t);
	if (e)
		return (
			e.unmount(),
			e._afterUnmount && e._afterUnmount(),
			(this.plugins = this.plugins.filter((t) => t !== e)),
			this.plugins
		);
	console.error("No such plugin", e);
}
function kt(t) {
	return this.plugins.find(
		(e) => e === t || e.name === t || e.name === `Swup${String(t)}`
	);
}
function Pt(t) {
	if ("function" != typeof this.options.resolveUrl)
		return (
			console.warn(
				"[swup] options.resolveUrl expects a callback function."
			),
			t
		);
	const e = this.options.resolveUrl(t);
	return e && "string" == typeof e
		? e.startsWith("//") || e.startsWith("http")
			? (console.warn(
					"[swup] options.resolveUrl needs to return a relative url"
				),
				t)
			: e
		: (console.warn("[swup] options.resolveUrl needs to return a url"), t);
}
function Ct(t, e) {
	return this.resolveUrl(t) === this.resolveUrl(e);
}
const At = {
	animateHistoryBrowsing: !1,
	animationSelector: '[class*="transition-"]',
	animationScope: "html",
	cache: !0,
	containers: ["#swup"],
	ignoreVisit: (t, { el: e } = {}) =>
		!(null == e || !e.closest("[data-no-swup]")),
	linkSelector: "a[href]",
	linkToSelf: "scroll",
	native: !1,
	plugins: [],
	resolveUrl: (t) => t,
	requestHeaders: {
		"X-Requested-With": "swup",
		Accept: "text/html, application/xhtml+xml",
	},
	skipPopStateHandling: (t) => {
		var e;
		return "swup" !== (null == (e = t.state) ? void 0 : e.source);
	},
	timeout: 0,
};
class Tt {
	constructor(t = {}) {
		var e, i;
		(this.version = "4.5.0"),
			(this.options = void 0),
			(this.defaults = At),
			(this.plugins = []),
			(this.visit = void 0),
			(this.cache = void 0),
			(this.hooks = void 0),
			(this.classes = void 0),
			(this.currentPageUrl = k()),
			(this.currentHistoryIndex = void 0),
			(this.clickDelegate = void 0),
			(this.navigating = !1),
			(this.onVisitEnd = void 0),
			(this.use = St),
			(this.unuse = xt),
			(this.findPlugin = kt),
			(this.log = () => {}),
			(this.navigate = vt),
			(this.performNavigation = mt),
			(this.createVisit = ut),
			(this.delegateEvent = ot),
			(this.fetchPage = at),
			(this.awaitAnimations = pt),
			(this.renderPage = bt),
			(this.replaceContent = wt),
			(this.animatePageIn = Et),
			(this.animatePageOut = gt),
			(this.scrollToContent = yt),
			(this.getAnchorElement = ft),
			(this.getCurrentUrl = k),
			(this.resolveUrl = Pt),
			(this.isSameResolvedUrl = Ct),
			(this.options = y({}, this.defaults, t)),
			(this.handleLinkClick = this.handleLinkClick.bind(this)),
			(this.handlePopState = this.handlePopState.bind(this)),
			(this.cache = new ct(this)),
			(this.classes = new ht(this)),
			(this.hooks = new dt(this)),
			(this.visit = this.createVisit({ to: "" })),
			(this.currentHistoryIndex =
				null != (e = null == (i = history.state) ? void 0 : i.index)
					? e
					: 1),
			this.checkRequirements() && this.enable();
	}
	checkRequirements() {
		return (
			typeof Promise < "u" ||
			(console.warn("Promise is not supported"), !1)
		);
	}
	async enable() {
		var t;
		const { linkSelector: e } = this.options;
		(this.clickDelegate = this.delegateEvent(
			e,
			"click",
			this.handleLinkClick
		)),
			window.addEventListener("popstate", this.handlePopState),
			this.options.animateHistoryBrowsing &&
				(window.history.scrollRestoration = "manual"),
			(this.options.native =
				this.options.native && !!document.startViewTransition),
			this.options.plugins.forEach((t) => this.use(t)),
			"swup" !== (null == (t = history.state) ? void 0 : t.source) &&
				T(null, { index: this.currentHistoryIndex }),
			await K(),
			await this.hooks.call("enable", void 0, void 0, () => {
				const t = document.documentElement;
				t.classList.add("swup-enabled"),
					t.classList.toggle("swup-native", this.options.native);
			});
	}
	async destroy() {
		this.clickDelegate.destroy(),
			window.removeEventListener("popstate", this.handlePopState),
			this.cache.clear(),
			this.options.plugins.forEach((t) => this.unuse(t)),
			await this.hooks.call("disable", void 0, void 0, () => {
				const t = document.documentElement;
				t.classList.remove("swup-enabled"),
					t.classList.remove("swup-native");
			}),
			this.hooks.clear();
	}
	shouldIgnoreVisit(t, { el: e, event: i } = {}) {
		const { origin: n, url: s, hash: o } = S.fromUrl(t);
		return (
			n !== window.location.origin ||
			!(!e || !this.triggerWillOpenNewWindow(e)) ||
			!!this.options.ignoreVisit(s + o, { el: e, event: i })
		);
	}
	handleLinkClick(t) {
		const e = t.delegateTarget,
			{ href: i, url: n, hash: s } = S.fromElement(e);
		if (this.shouldIgnoreVisit(i, { el: e, event: t })) return;
		if (this.navigating && n === this.visit.to.url)
			return void t.preventDefault();
		const o = this.createVisit({ to: n, hash: s, el: e, event: t });
		t.metaKey || t.ctrlKey || t.shiftKey || t.altKey
			? this.hooks.callSync("link:newtab", o, { href: i })
			: 0 === t.button &&
				this.hooks.callSync(
					"link:click",
					o,
					{ el: e, event: t },
					() => {
						var e;
						const i = null != (e = o.from.url) ? e : "";
						t.preventDefault(),
							n && n !== i
								? this.isSameResolvedUrl(n, i) ||
									this.performNavigation(o)
								: s
									? this.hooks.callSync(
											"link:anchor",
											o,
											{ hash: s },
											() => {
												T(n + s),
													this.scrollToContent(o);
											}
										)
									: this.hooks.callSync(
											"link:self",
											o,
											void 0,
											() => {
												"navigate" ===
												this.options.linkToSelf
													? this.performNavigation(o)
													: (T(n),
														this.scrollToContent(
															o
														));
											}
										);
					}
				);
	}
	handlePopState(t) {
		var e, i, n, s;
		const o =
			null != (e = null == (i = t.state) ? void 0 : i.url)
				? e
				: location.href;
		if (
			this.options.skipPopStateHandling(t) ||
			this.isSameResolvedUrl(k(), this.currentPageUrl)
		)
			return;
		const { url: r, hash: a } = S.fromUrl(o),
			c = this.createVisit({ to: r, hash: a, event: t });
		c.history.popstate = !0;
		const l =
			null != (n = null == (s = t.state) ? void 0 : s.index) ? n : 0;
		l &&
			l !== this.currentHistoryIndex &&
			((c.history.direction =
				l - this.currentHistoryIndex > 0 ? "forwards" : "backwards"),
			(this.currentHistoryIndex = l)),
			(c.animation.animate = !1),
			(c.scroll.reset = !1),
			(c.scroll.target = !1),
			this.options.animateHistoryBrowsing &&
				((c.animation.animate = !0), (c.scroll.reset = !0)),
			this.hooks.callSync("history:popstate", c, { event: t }, () => {
				this.performNavigation(c);
			});
	}
	triggerWillOpenNewWindow(t) {
		return !!t.matches('[download], [target="_blank"]');
	}
}
export {
	S as Location,
	F as classify,
	rt as createHistoryRecord,
	Tt as default,
	ot as delegateEvent,
	V as escapeCssIdentifier,
	Ut as forceReflow,
	k as getCurrentUrl,
	z as isPromise,
	Rt as matchPath,
	K as nextTick,
	D as query,
	q as queryAll,
	lt as runAsPromise,
	W as toMs,
	T as updateHistoryRecord,
};
