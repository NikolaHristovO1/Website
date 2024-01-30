var H = {};
const G = function (e) {
		const t = [];
		let r = 0;
		for (let n = 0; n < e.length; n++) {
			let a = e.charCodeAt(n);
			a < 128
				? (t[r++] = a)
				: a < 2048
					? ((t[r++] = (a >> 6) | 192), (t[r++] = (63 & a) | 128))
					: 55296 == (64512 & a) &&
						  n + 1 < e.length &&
						  56320 == (64512 & e.charCodeAt(n + 1))
						? ((a =
								65536 +
								((1023 & a) << 10) +
								(1023 & e.charCodeAt(++n))),
							(t[r++] = (a >> 18) | 240),
							(t[r++] = ((a >> 12) & 63) | 128),
							(t[r++] = ((a >> 6) & 63) | 128),
							(t[r++] = (63 & a) | 128))
						: ((t[r++] = (a >> 12) | 224),
							(t[r++] = ((a >> 6) & 63) | 128),
							(t[r++] = (63 & a) | 128));
		}
		return t;
	},
	re = function (e) {
		const t = [];
		let r = 0,
			n = 0;
		for (; r < e.length; ) {
			const a = e[r++];
			if (a < 128) t[n++] = String.fromCharCode(a);
			else if (a > 191 && a < 224) {
				const i = e[r++];
				t[n++] = String.fromCharCode(((31 & a) << 6) | (63 & i));
			} else if (a > 239 && a < 365) {
				const i =
					(((7 & a) << 18) |
						((63 & e[r++]) << 12) |
						((63 & e[r++]) << 6) |
						(63 & e[r++])) -
					65536;
				(t[n++] = String.fromCharCode(55296 + (i >> 10))),
					(t[n++] = String.fromCharCode(56320 + (1023 & i)));
			} else {
				const i = e[r++],
					s = e[r++];
				t[n++] = String.fromCharCode(
					((15 & a) << 12) | ((63 & i) << 6) | (63 & s)
				);
			}
		}
		return t.join("");
	},
	K = {
		byteToCharMap_: null,
		charToByteMap_: null,
		byteToCharMapWebSafe_: null,
		charToByteMapWebSafe_: null,
		ENCODED_VALS_BASE:
			"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
		get ENCODED_VALS() {
			return this.ENCODED_VALS_BASE + "+/=";
		},
		get ENCODED_VALS_WEBSAFE() {
			return this.ENCODED_VALS_BASE + "-_.";
		},
		HAS_NATIVE_SUPPORT: "function" == typeof atob,
		encodeByteArray(e, t) {
			if (!Array.isArray(e))
				throw Error("encodeByteArray takes an array as a parameter");
			this.init_();
			const r = t ? this.byteToCharMapWebSafe_ : this.byteToCharMap_,
				n = [];
			for (let t = 0; t < e.length; t += 3) {
				const a = e[t],
					i = t + 1 < e.length,
					s = i ? e[t + 1] : 0,
					o = t + 2 < e.length,
					c = o ? e[t + 2] : 0,
					h = a >> 2,
					l = ((3 & a) << 4) | (s >> 4);
				let u = ((15 & s) << 2) | (c >> 6),
					d = 63 & c;
				o || ((d = 64), i || (u = 64)), n.push(r[h], r[l], r[u], r[d]);
			}
			return n.join("");
		},
		encodeString(e, t) {
			return this.HAS_NATIVE_SUPPORT && !t
				? btoa(e)
				: this.encodeByteArray(G(e), t);
		},
		decodeString(e, t) {
			return this.HAS_NATIVE_SUPPORT && !t
				? atob(e)
				: re(this.decodeStringToByteArray(e, t));
		},
		decodeStringToByteArray(e, t) {
			this.init_();
			const r = t ? this.charToByteMapWebSafe_ : this.charToByteMap_,
				n = [];
			for (let t = 0; t < e.length; ) {
				const a = r[e.charAt(t++)],
					i = t < e.length ? r[e.charAt(t)] : 0;
				++t;
				const s = t < e.length ? r[e.charAt(t)] : 64;
				++t;
				const o = t < e.length ? r[e.charAt(t)] : 64;
				if ((++t, null == a || null == i || null == s || null == o))
					throw new se();
				const c = (a << 2) | (i >> 4);
				if ((n.push(c), 64 !== s)) {
					const e = ((i << 4) & 240) | (s >> 2);
					if ((n.push(e), 64 !== o)) {
						const e = ((s << 6) & 192) | o;
						n.push(e);
					}
				}
			}
			return n;
		},
		init_() {
			if (!this.byteToCharMap_) {
				(this.byteToCharMap_ = {}),
					(this.charToByteMap_ = {}),
					(this.byteToCharMapWebSafe_ = {}),
					(this.charToByteMapWebSafe_ = {});
				for (let e = 0; e < this.ENCODED_VALS.length; e++)
					(this.byteToCharMap_[e] = this.ENCODED_VALS.charAt(e)),
						(this.charToByteMap_[this.byteToCharMap_[e]] = e),
						(this.byteToCharMapWebSafe_[e] =
							this.ENCODED_VALS_WEBSAFE.charAt(e)),
						(this.charToByteMapWebSafe_[
							this.byteToCharMapWebSafe_[e]
						] = e),
						e >= this.ENCODED_VALS_BASE.length &&
							((this.charToByteMap_[
								this.ENCODED_VALS_WEBSAFE.charAt(e)
							] = e),
							(this.charToByteMapWebSafe_[
								this.ENCODED_VALS.charAt(e)
							] = e));
			}
		},
	};
class se extends Error {
	constructor() {
		super(...arguments), (this.name = "DecodeBase64StringError");
	}
}
const ae = function (e) {
		const t = G(e);
		return K.encodeByteArray(t, !0);
	},
	J = function (e) {
		return ae(e).replace(/\./g, "");
	},
	ie = function (e) {
		try {
			return K.decodeString(e, !0);
		} catch (e) {
			console.error("base64Decode failed: ", e);
		}
		return null;
	};
function oe() {
	if (typeof self < "u") return self;
	if (typeof window < "u") return window;
	if (typeof global < "u") return global;
	throw new Error("Unable to locate global object.");
}
const ce = () => oe().__FIREBASE_DEFAULTS__,
	le = () => {
		if (typeof process > "u" || typeof H > "u") return;
		const e = H.__FIREBASE_DEFAULTS__;
		return e ? JSON.parse(e) : void 0;
	},
	he = () => {
		if (typeof document > "u") return;
		let e;
		try {
			e = document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/);
		} catch {
			return;
		}
		const t = e && ie(e[1]);
		return t && JSON.parse(t);
	},
	de = () => {
		try {
			return ce() || le() || he();
		} catch (e) {
			return void console.info(
				`Unable to get __FIREBASE_DEFAULTS__ due to: ${e}`
			);
		}
	},
	Y = () => {
		var e;
		return null === (e = de()) || void 0 === e ? void 0 : e.config;
	};
class fe {
	constructor() {
		(this.reject = () => {}),
			(this.resolve = () => {}),
			(this.promise = new Promise((e, t) => {
				(this.resolve = e), (this.reject = t);
			}));
	}
	wrapCallback(e) {
		return (t, r) => {
			t ? this.reject(t) : this.resolve(r),
				"function" == typeof e &&
					(this.promise.catch(() => {}),
					1 === e.length ? e(t) : e(t, r));
		};
	}
}
function ue() {
	try {
		return "object" == typeof indexedDB;
	} catch {
		return !1;
	}
}
function pe() {
	return new Promise((e, t) => {
		try {
			let r = !0;
			const n = "validate-browser-context-for-indexeddb-analytics-module",
				a = self.indexedDB.open(n);
			(a.onsuccess = () => {
				a.result.close(), r || self.indexedDB.deleteDatabase(n), e(!0);
			}),
				(a.onupgradeneeded = () => {
					r = !1;
				}),
				(a.onerror = () => {
					var e;
					t(
						(null === (e = a.error) || void 0 === e
							? void 0
							: e.message) || ""
					);
				});
		} catch (e) {
			t(e);
		}
	});
}
const me = "FirebaseError";
class _ extends Error {
	constructor(e, t, r) {
		super(t),
			(this.code = e),
			(this.customData = r),
			(this.name = me),
			Object.setPrototypeOf(this, _.prototype),
			Error.captureStackTrace &&
				Error.captureStackTrace(this, X.prototype.create);
	}
}
class X {
	constructor(e, t, r) {
		(this.service = e), (this.serviceName = t), (this.errors = r);
	}
	create(e, ...t) {
		const r = t[0] || {},
			n = `${this.service}/${e}`,
			a = this.errors[e],
			i = a ? ge(a, r) : "Error",
			s = `${this.serviceName}: ${i} (${n}).`;
		return new _(n, s, r);
	}
}
function ge(e, t) {
	return e.replace(be, (e, r) => {
		const n = t[r];
		return null != n ? String(n) : `<${r}?>`;
	});
}
const be = /\{\$([^}]+)}/g;
function O(e, t) {
	if (e === t) return !0;
	const r = Object.keys(e),
		n = Object.keys(t);
	for (const a of r) {
		if (!n.includes(a)) return !1;
		const r = e[a],
			i = t[a];
		if (F(r) && F(i)) {
			if (!O(r, i)) return !1;
		} else if (r !== i) return !1;
	}
	for (const e of n) if (!r.includes(e)) return !1;
	return !0;
}
function F(e) {
	return null !== e && "object" == typeof e;
}
class D {
	constructor(e, t, r) {
		(this.name = e),
			(this.instanceFactory = t),
			(this.type = r),
			(this.multipleInstances = !1),
			(this.serviceProps = {}),
			(this.instantiationMode = "LAZY"),
			(this.onInstanceCreated = null);
	}
	setInstantiationMode(e) {
		return (this.instantiationMode = e), this;
	}
	setMultipleInstances(e) {
		return (this.multipleInstances = e), this;
	}
	setServiceProps(e) {
		return (this.serviceProps = e), this;
	}
	setInstanceCreatedCallback(e) {
		return (this.onInstanceCreated = e), this;
	}
}
const u = "[DEFAULT]";
class _e {
	constructor(e, t) {
		(this.name = e),
			(this.container = t),
			(this.component = null),
			(this.instances = new Map()),
			(this.instancesDeferred = new Map()),
			(this.instancesOptions = new Map()),
			(this.onInitCallbacks = new Map());
	}
	get(e) {
		const t = this.normalizeInstanceIdentifier(e);
		if (!this.instancesDeferred.has(t)) {
			const e = new fe();
			if (
				(this.instancesDeferred.set(t, e),
				this.isInitialized(t) || this.shouldAutoInitialize())
			)
				try {
					const r = this.getOrInitializeService({
						instanceIdentifier: t,
					});
					r && e.resolve(r);
				} catch {}
		}
		return this.instancesDeferred.get(t).promise;
	}
	getImmediate(e) {
		var t;
		const r = this.normalizeInstanceIdentifier(e?.identifier),
			n = null !== (t = e?.optional) && void 0 !== t && t;
		if (!this.isInitialized(r) && !this.shouldAutoInitialize()) {
			if (n) return null;
			throw Error(`Service ${this.name} is not available`);
		}
		try {
			return this.getOrInitializeService({ instanceIdentifier: r });
		} catch (e) {
			if (n) return null;
			throw e;
		}
	}
	getComponent() {
		return this.component;
	}
	setComponent(e) {
		if (e.name !== this.name)
			throw Error(
				`Mismatching Component ${e.name} for Provider ${this.name}.`
			);
		if (this.component)
			throw Error(`Component for ${this.name} has already been provided`);
		if (((this.component = e), this.shouldAutoInitialize())) {
			if (ye(e))
				try {
					this.getOrInitializeService({ instanceIdentifier: u });
				} catch {}
			for (const [e, t] of this.instancesDeferred.entries()) {
				const r = this.normalizeInstanceIdentifier(e);
				try {
					const e = this.getOrInitializeService({
						instanceIdentifier: r,
					});
					t.resolve(e);
				} catch {}
			}
		}
	}
	clearInstance(e = u) {
		this.instancesDeferred.delete(e),
			this.instancesOptions.delete(e),
			this.instances.delete(e);
	}
	async delete() {
		const e = Array.from(this.instances.values());
		await Promise.all([
			...e.filter((e) => "INTERNAL" in e).map((e) => e.INTERNAL.delete()),
			...e.filter((e) => "_delete" in e).map((e) => e._delete()),
		]);
	}
	isComponentSet() {
		return null != this.component;
	}
	isInitialized(e = u) {
		return this.instances.has(e);
	}
	getOptions(e = u) {
		return this.instancesOptions.get(e) || {};
	}
	initialize(e = {}) {
		const { options: t = {} } = e,
			r = this.normalizeInstanceIdentifier(e.instanceIdentifier);
		if (this.isInitialized(r))
			throw Error(`${this.name}(${r}) has already been initialized`);
		if (!this.isComponentSet())
			throw Error(`Component ${this.name} has not been registered yet`);
		const n = this.getOrInitializeService({
			instanceIdentifier: r,
			options: t,
		});
		for (const [e, t] of this.instancesDeferred.entries()) {
			r === this.normalizeInstanceIdentifier(e) && t.resolve(n);
		}
		return n;
	}
	onInit(e, t) {
		var r;
		const n = this.normalizeInstanceIdentifier(t),
			a =
				null !== (r = this.onInitCallbacks.get(n)) && void 0 !== r
					? r
					: new Set();
		a.add(e), this.onInitCallbacks.set(n, a);
		const i = this.instances.get(n);
		return (
			i && e(i, n),
			() => {
				a.delete(e);
			}
		);
	}
	invokeOnInitCallbacks(e, t) {
		const r = this.onInitCallbacks.get(t);
		if (r)
			for (const n of r)
				try {
					n(e, t);
				} catch {}
	}
	getOrInitializeService({ instanceIdentifier: e, options: t = {} }) {
		let r = this.instances.get(e);
		if (
			!r &&
			this.component &&
			((r = this.component.instanceFactory(this.container, {
				instanceIdentifier: Ee(e),
				options: t,
			})),
			this.instances.set(e, r),
			this.instancesOptions.set(e, t),
			this.invokeOnInitCallbacks(r, e),
			this.component.onInstanceCreated)
		)
			try {
				this.component.onInstanceCreated(this.container, e, r);
			} catch {}
		return r || null;
	}
	normalizeInstanceIdentifier(e = u) {
		return this.component ? (this.component.multipleInstances ? e : u) : e;
	}
	shouldAutoInitialize() {
		return (
			!!this.component && "EXPLICIT" !== this.component.instantiationMode
		);
	}
}
function Ee(e) {
	return e === u ? void 0 : e;
}
function ye(e) {
	return "EAGER" === e.instantiationMode;
}
class Ie {
	constructor(e) {
		(this.name = e), (this.providers = new Map());
	}
	addComponent(e) {
		const t = this.getProvider(e.name);
		if (t.isComponentSet())
			throw new Error(
				`Component ${e.name} has already been registered with ${this.name}`
			);
		t.setComponent(e);
	}
	addOrOverwriteComponent(e) {
		this.getProvider(e.name).isComponentSet() &&
			this.providers.delete(e.name),
			this.addComponent(e);
	}
	getProvider(e) {
		if (this.providers.has(e)) return this.providers.get(e);
		const t = new _e(e, this);
		return this.providers.set(e, t), t;
	}
	getProviders() {
		return Array.from(this.providers.values());
	}
}
const $ = [];
var l;
!(function (e) {
	(e[(e.DEBUG = 0)] = "DEBUG"),
		(e[(e.VERBOSE = 1)] = "VERBOSE"),
		(e[(e.INFO = 2)] = "INFO"),
		(e[(e.WARN = 3)] = "WARN"),
		(e[(e.ERROR = 4)] = "ERROR"),
		(e[(e.SILENT = 5)] = "SILENT");
})(l || (l = {}));
const Z = {
		debug: l.DEBUG,
		verbose: l.VERBOSE,
		info: l.INFO,
		warn: l.WARN,
		error: l.ERROR,
		silent: l.SILENT,
	},
	De = l.INFO,
	ve = {
		[l.DEBUG]: "log",
		[l.VERBOSE]: "log",
		[l.INFO]: "info",
		[l.WARN]: "warn",
		[l.ERROR]: "error",
	},
	we = (e, t, ...r) => {
		if (t < e.logLevel) return;
		const n = new Date().toISOString(),
			a = ve[t];
		if (!a)
			throw new Error(
				`Attempted to log a message with an invalid logType (value: ${t})`
			);
		console[a](`[${n}]  ${e.name}:`, ...r);
	};
class Se {
	constructor(e) {
		(this.name = e),
			(this._logLevel = De),
			(this._logHandler = we),
			(this._userLogHandler = null),
			$.push(this);
	}
	get logLevel() {
		return this._logLevel;
	}
	set logLevel(e) {
		if (!(e in l))
			throw new TypeError(
				`Invalid value "${e}" assigned to \`logLevel\``
			);
		this._logLevel = e;
	}
	setLogLevel(e) {
		this._logLevel = "string" == typeof e ? Z[e] : e;
	}
	get logHandler() {
		return this._logHandler;
	}
	set logHandler(e) {
		if ("function" != typeof e)
			throw new TypeError(
				"Value assigned to `logHandler` must be a function"
			);
		this._logHandler = e;
	}
	get userLogHandler() {
		return this._userLogHandler;
	}
	set userLogHandler(e) {
		this._userLogHandler = e;
	}
	debug(...e) {
		this._userLogHandler && this._userLogHandler(this, l.DEBUG, ...e),
			this._logHandler(this, l.DEBUG, ...e);
	}
	log(...e) {
		this._userLogHandler && this._userLogHandler(this, l.VERBOSE, ...e),
			this._logHandler(this, l.VERBOSE, ...e);
	}
	info(...e) {
		this._userLogHandler && this._userLogHandler(this, l.INFO, ...e),
			this._logHandler(this, l.INFO, ...e);
	}
	warn(...e) {
		this._userLogHandler && this._userLogHandler(this, l.WARN, ...e),
			this._logHandler(this, l.WARN, ...e);
	}
	error(...e) {
		this._userLogHandler && this._userLogHandler(this, l.ERROR, ...e),
			this._logHandler(this, l.ERROR, ...e);
	}
}
function Ce(e) {
	$.forEach((t) => {
		t.setLogLevel(e);
	});
}
function Ae(e, t) {
	for (const r of $) {
		let n = null;
		t && t.level && (n = Z[t.level]),
			(r.userLogHandler =
				null === e
					? null
					: (t, r, ...a) => {
							const i = a
								.map((e) => {
									if (null == e) return null;
									if ("string" == typeof e) return e;
									if (
										"number" == typeof e ||
										"boolean" == typeof e
									)
										return e.toString();
									if (e instanceof Error) return e.message;
									try {
										return JSON.stringify(e);
									} catch {
										return null;
									}
								})
								.filter((e) => e)
								.join(" ");
							r >= (n ?? t.logLevel) &&
								e({
									level: l[r].toLowerCase(),
									message: i,
									args: a,
									type: t.name,
								});
						});
	}
}
const Be = (e, t) => t.some((t) => e instanceof t);
let x, V;
function Oe() {
	return (
		x ||
		(x = [IDBDatabase, IDBObjectStore, IDBIndex, IDBCursor, IDBTransaction])
	);
}
function Te() {
	return (
		V ||
		(V = [
			IDBCursor.prototype.advance,
			IDBCursor.prototype.continue,
			IDBCursor.prototype.continuePrimaryKey,
		])
	);
}
const Q = new WeakMap(),
	T = new WeakMap(),
	q = new WeakMap(),
	S = new WeakMap(),
	R = new WeakMap();
function Me(e) {
	const t = new Promise((t, r) => {
		const n = () => {
				e.removeEventListener("success", a),
					e.removeEventListener("error", i);
			},
			a = () => {
				t(f(e.result)), n();
			},
			i = () => {
				r(e.error), n();
			};
		e.addEventListener("success", a), e.addEventListener("error", i);
	});
	return (
		t
			.then((t) => {
				t instanceof IDBCursor && Q.set(t, e);
			})
			.catch(() => {}),
		R.set(t, e),
		t
	);
}
function Ne(e) {
	if (T.has(e)) return;
	const t = new Promise((t, r) => {
		const n = () => {
				e.removeEventListener("complete", a),
					e.removeEventListener("error", i),
					e.removeEventListener("abort", i);
			},
			a = () => {
				t(), n();
			},
			i = () => {
				r(e.error || new DOMException("AbortError", "AbortError")), n();
			};
		e.addEventListener("complete", a),
			e.addEventListener("error", i),
			e.addEventListener("abort", i);
	});
	T.set(e, t);
}
let M = {
	get(e, t, r) {
		if (e instanceof IDBTransaction) {
			if ("done" === t) return T.get(e);
			if ("objectStoreNames" === t) return e.objectStoreNames || q.get(e);
			if ("store" === t)
				return r.objectStoreNames[1]
					? void 0
					: r.objectStore(r.objectStoreNames[0]);
		}
		return f(e[t]);
	},
	set: (e, t, r) => ((e[t] = r), !0),
	has: (e, t) =>
		(e instanceof IDBTransaction && ("done" === t || "store" === t)) ||
		t in e,
};
function Le(e) {
	M = e(M);
}
function $e(e) {
	return e !== IDBDatabase.prototype.transaction ||
		"objectStoreNames" in IDBTransaction.prototype
		? Te().includes(e)
			? function (...t) {
					return e.apply(C(this), t), f(Q.get(this));
				}
			: function (...t) {
					return f(e.apply(C(this), t));
				}
		: function (t, ...r) {
				const n = e.call(C(this), t, ...r);
				return q.set(n, t.sort ? t.sort() : [t]), f(n);
			};
}
function Re(e) {
	return "function" == typeof e
		? $e(e)
		: (e instanceof IDBTransaction && Ne(e),
			Be(e, Oe()) ? new Proxy(e, M) : e);
}
function f(e) {
	if (e instanceof IDBRequest) return Me(e);
	if (S.has(e)) return S.get(e);
	const t = Re(e);
	return t !== e && (S.set(e, t), R.set(t, e)), t;
}
const C = (e) => R.get(e);
function Pe(e, t, { blocked: r, upgrade: n, blocking: a, terminated: i } = {}) {
	const s = indexedDB.open(e, t),
		o = f(s);
	return (
		n &&
			s.addEventListener("upgradeneeded", (e) => {
				n(f(s.result), e.oldVersion, e.newVersion, f(s.transaction), e);
			}),
		r &&
			s.addEventListener("blocked", (e) =>
				r(e.oldVersion, e.newVersion, e)
			),
		o
			.then((e) => {
				i && e.addEventListener("close", () => i()),
					a &&
						e.addEventListener("versionchange", (e) =>
							a(e.oldVersion, e.newVersion, e)
						);
			})
			.catch(() => {}),
		o
	);
}
const He = ["get", "getKey", "getAll", "getAllKeys", "count"],
	Fe = ["put", "add", "delete", "clear"],
	A = new Map();
function j(e, t) {
	if (!(e instanceof IDBDatabase) || t in e || "string" != typeof t) return;
	if (A.get(t)) return A.get(t);
	const r = t.replace(/FromIndex$/, ""),
		n = t !== r,
		a = Fe.includes(r);
	if (
		!(r in (n ? IDBIndex : IDBObjectStore).prototype) ||
		(!a && !He.includes(r))
	)
		return;
	const i = async function (e, ...t) {
		const i = this.transaction(e, a ? "readwrite" : "readonly");
		let s = i.store;
		return (
			n && (s = s.index(t.shift())),
			(await Promise.all([s[r](...t), a && i.done]))[0]
		);
	};
	return A.set(t, i), i;
}
Le((e) => ({
	...e,
	get: (t, r, n) => j(t, r) || e.get(t, r, n),
	has: (t, r) => !!j(t, r) || e.has(t, r),
}));
class xe {
	constructor(e) {
		this.container = e;
	}
	getPlatformInfoString() {
		return this.container
			.getProviders()
			.map((e) => {
				if (Ve(e)) {
					const t = e.getImmediate();
					return `${t.library}/${t.version}`;
				}
				return null;
			})
			.filter((e) => e)
			.join(" ");
	}
}
function Ve(e) {
	const t = e.getComponent();
	return "VERSION" === t?.type;
}
const N = "@firebase/app",
	U = "0.9.25",
	p = new Se("@firebase/app"),
	je = "@firebase/app-compat",
	Ue = "@firebase/analytics-compat",
	ke = "@firebase/analytics",
	ze = "@firebase/app-check-compat",
	We = "@firebase/app-check",
	Ge = "@firebase/auth",
	Ke = "@firebase/auth-compat",
	Je = "@firebase/database",
	Ye = "@firebase/database-compat",
	Xe = "@firebase/functions",
	Ze = "@firebase/functions-compat",
	Qe = "@firebase/installations",
	qe = "@firebase/installations-compat",
	et = "@firebase/messaging",
	tt = "@firebase/messaging-compat",
	nt = "@firebase/performance",
	rt = "@firebase/performance-compat",
	st = "@firebase/remote-config",
	at = "@firebase/remote-config-compat",
	it = "@firebase/storage",
	ot = "@firebase/storage-compat",
	ct = "@firebase/firestore",
	lt = "@firebase/firestore-compat",
	ht = "firebase",
	dt = "10.7.1",
	v = "[DEFAULT]",
	ft = {
		[N]: "fire-core",
		[je]: "fire-core-compat",
		[ke]: "fire-analytics",
		[Ue]: "fire-analytics-compat",
		[We]: "fire-app-check",
		[ze]: "fire-app-check-compat",
		[Ge]: "fire-auth",
		[Ke]: "fire-auth-compat",
		[Je]: "fire-rtdb",
		[Ye]: "fire-rtdb-compat",
		[Xe]: "fire-fn",
		[Ze]: "fire-fn-compat",
		[Qe]: "fire-iid",
		[qe]: "fire-iid-compat",
		[et]: "fire-fcm",
		[tt]: "fire-fcm-compat",
		[nt]: "fire-perf",
		[rt]: "fire-perf-compat",
		[st]: "fire-rc",
		[at]: "fire-rc-compat",
		[it]: "fire-gcs",
		[ot]: "fire-gcs-compat",
		[ct]: "fire-fst",
		[lt]: "fire-fst-compat",
		"fire-js": "fire-js",
		[ht]: "fire-js-all",
	},
	m = new Map(),
	w = new Map();
function ut(e, t) {
	try {
		e.container.addComponent(t);
	} catch (r) {
		p.debug(
			`Component ${t.name} failed to register with FirebaseApp ${e.name}`,
			r
		);
	}
}
function Ot(e, t) {
	e.container.addOrOverwriteComponent(t);
}
function L(e) {
	const t = e.name;
	if (w.has(t))
		return (
			p.debug(`There were multiple attempts to register component ${t}.`),
			!1
		);
	w.set(t, e);
	for (const t of m.values()) ut(t, e);
	return !0;
}
function pt(e, t) {
	const r = e.container
		.getProvider("heartbeat")
		.getImmediate({ optional: !0 });
	return r && r.triggerHeartbeat(), e.container.getProvider(t);
}
function Tt(e, t, r = v) {
	pt(e, t).clearInstance(r);
}
function Mt() {
	w.clear();
}
const mt = {
		"no-app":
			"No Firebase App '{$appName}' has been created - call initializeApp() first",
		"bad-app-name": "Illegal App name: '{$appName}",
		"duplicate-app":
			"Firebase App named '{$appName}' already exists with different options or config",
		"app-deleted": "Firebase App named '{$appName}' already deleted",
		"no-options":
			"Need to provide options, when not being deployed to hosting via source.",
		"invalid-app-argument":
			"firebase.{$appName}() takes either no argument or a Firebase App instance.",
		"invalid-log-argument":
			"First argument to `onLog` must be null or a function.",
		"idb-open":
			"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.",
		"idb-get":
			"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.",
		"idb-set":
			"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.",
		"idb-delete":
			"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.",
	},
	d = new X("app", "Firebase", mt);
class gt {
	constructor(e, t, r) {
		(this._isDeleted = !1),
			(this._options = Object.assign({}, e)),
			(this._config = Object.assign({}, t)),
			(this._name = t.name),
			(this._automaticDataCollectionEnabled =
				t.automaticDataCollectionEnabled),
			(this._container = r),
			this.container.addComponent(new D("app", () => this, "PUBLIC"));
	}
	get automaticDataCollectionEnabled() {
		return this.checkDestroyed(), this._automaticDataCollectionEnabled;
	}
	set automaticDataCollectionEnabled(e) {
		this.checkDestroyed(), (this._automaticDataCollectionEnabled = e);
	}
	get name() {
		return this.checkDestroyed(), this._name;
	}
	get options() {
		return this.checkDestroyed(), this._options;
	}
	get config() {
		return this.checkDestroyed(), this._config;
	}
	get container() {
		return this._container;
	}
	get isDeleted() {
		return this._isDeleted;
	}
	set isDeleted(e) {
		this._isDeleted = e;
	}
	checkDestroyed() {
		if (this.isDeleted)
			throw d.create("app-deleted", { appName: this._name });
	}
}
const Nt = dt;
function bt(e, t = {}) {
	let r = e;
	"object" != typeof t && (t = { name: t });
	const n = Object.assign({ name: v, automaticDataCollectionEnabled: !1 }, t),
		a = n.name;
	if ("string" != typeof a || !a)
		throw d.create("bad-app-name", { appName: String(a) });
	if ((r || (r = Y()), !r)) throw d.create("no-options");
	const i = m.get(a);
	if (i) {
		if (O(r, i.options) && O(n, i.config)) return i;
		throw d.create("duplicate-app", { appName: a });
	}
	const s = new Ie(a);
	for (const e of w.values()) s.addComponent(e);
	const o = new gt(r, n, s);
	return m.set(a, o), o;
}
function Lt(e = v) {
	const t = m.get(e);
	if (!t && e === v && Y()) return bt();
	if (!t) throw d.create("no-app", { appName: e });
	return t;
}
function $t() {
	return Array.from(m.values());
}
async function Rt(e) {
	const t = e.name;
	m.has(t) &&
		(m.delete(t),
		await Promise.all(e.container.getProviders().map((e) => e.delete())),
		(e.isDeleted = !0));
}
function I(e, t, r) {
	var n;
	let a = null !== (n = ft[e]) && void 0 !== n ? n : e;
	r && (a += `-${r}`);
	const i = a.match(/\s|\//),
		s = t.match(/\s|\//);
	if (i || s) {
		const e = [`Unable to register library "${a}" with version "${t}":`];
		return (
			i &&
				e.push(
					`library name "${a}" contains illegal characters (whitespace or "/")`
				),
			i && s && e.push("and"),
			s &&
				e.push(
					`version name "${t}" contains illegal characters (whitespace or "/")`
				),
			void p.warn(e.join(" "))
		);
	}
	L(new D(`${a}-version`, () => ({ library: a, version: t }), "VERSION"));
}
function Pt(e, t) {
	if (null !== e && "function" != typeof e)
		throw d.create("invalid-log-argument");
	Ae(e, t);
}
function Ht(e) {
	Ce(e);
}
const _t = "firebase-heartbeat-database",
	Et = 1,
	b = "firebase-heartbeat-store";
let B = null;
function ee() {
	return (
		B ||
			(B = Pe(_t, Et, {
				upgrade: (e, t) => {
					if (0 === t) e.createObjectStore(b);
				},
			}).catch((e) => {
				throw d.create("idb-open", { originalErrorMessage: e.message });
			})),
		B
	);
}
async function yt(e) {
	try {
		return await (await ee()).transaction(b).objectStore(b).get(te(e));
	} catch (e) {
		if (e instanceof _) p.warn(e.message);
		else {
			const t = d.create("idb-get", { originalErrorMessage: e?.message });
			p.warn(t.message);
		}
	}
}
async function k(e, t) {
	try {
		const r = (await ee()).transaction(b, "readwrite");
		await r.objectStore(b).put(t, te(e)), await r.done;
	} catch (e) {
		if (e instanceof _) p.warn(e.message);
		else {
			const t = d.create("idb-set", { originalErrorMessage: e?.message });
			p.warn(t.message);
		}
	}
}
function te(e) {
	return `${e.name}!${e.options.appId}`;
}
const It = 1024,
	Dt = 2592e6;
class vt {
	constructor(e) {
		(this.container = e), (this._heartbeatsCache = null);
		const t = this.container.getProvider("app").getImmediate();
		(this._storage = new St(t)),
			(this._heartbeatsCachePromise = this._storage
				.read()
				.then((e) => ((this._heartbeatsCache = e), e)));
	}
	async triggerHeartbeat() {
		var e, t;
		const r = this.container
				.getProvider("platform-logger")
				.getImmediate()
				.getPlatformInfoString(),
			n = z();
		if (
			(null !=
				(null === (e = this._heartbeatsCache) || void 0 === e
					? void 0
					: e.heartbeats) ||
				((this._heartbeatsCache = await this._heartbeatsCachePromise),
				null !=
					(null === (t = this._heartbeatsCache) || void 0 === t
						? void 0
						: t.heartbeats))) &&
			this._heartbeatsCache.lastSentHeartbeatDate !== n &&
			!this._heartbeatsCache.heartbeats.some((e) => e.date === n)
		)
			return (
				this._heartbeatsCache.heartbeats.push({ date: n, agent: r }),
				(this._heartbeatsCache.heartbeats =
					this._heartbeatsCache.heartbeats.filter((e) => {
						const t = new Date(e.date).valueOf();
						return Date.now() - t <= Dt;
					})),
				this._storage.overwrite(this._heartbeatsCache)
			);
	}
	async getHeartbeatsHeader() {
		var e;
		if (
			(null === this._heartbeatsCache &&
				(await this._heartbeatsCachePromise),
			null ==
				(null === (e = this._heartbeatsCache) || void 0 === e
					? void 0
					: e.heartbeats) ||
				0 === this._heartbeatsCache.heartbeats.length)
		)
			return "";
		const t = z(),
			{ heartbeatsToSend: r, unsentEntries: n } = wt(
				this._heartbeatsCache.heartbeats
			),
			a = J(JSON.stringify({ version: 2, heartbeats: r }));
		return (
			(this._heartbeatsCache.lastSentHeartbeatDate = t),
			n.length > 0
				? ((this._heartbeatsCache.heartbeats = n),
					await this._storage.overwrite(this._heartbeatsCache))
				: ((this._heartbeatsCache.heartbeats = []),
					this._storage.overwrite(this._heartbeatsCache)),
			a
		);
	}
}
function z() {
	return new Date().toISOString().substring(0, 10);
}
function wt(e, t = It) {
	const r = [];
	let n = e.slice();
	for (const a of e) {
		const e = r.find((e) => e.agent === a.agent);
		if (e) {
			if ((e.dates.push(a.date), W(r) > t)) {
				e.dates.pop();
				break;
			}
		} else if ((r.push({ agent: a.agent, dates: [a.date] }), W(r) > t)) {
			r.pop();
			break;
		}
		n = n.slice(1);
	}
	return { heartbeatsToSend: r, unsentEntries: n };
}
class St {
	constructor(e) {
		(this.app = e),
			(this._canUseIndexedDBPromise =
				this.runIndexedDBEnvironmentCheck());
	}
	async runIndexedDBEnvironmentCheck() {
		return (
			!!ue() &&
			pe()
				.then(() => !0)
				.catch(() => !1)
		);
	}
	async read() {
		if (await this._canUseIndexedDBPromise) {
			const e = await yt(this.app);
			return e?.heartbeats ? e : { heartbeats: [] };
		}
		return { heartbeats: [] };
	}
	async overwrite(e) {
		var t;
		if (await this._canUseIndexedDBPromise) {
			const r = await this.read();
			return k(this.app, {
				lastSentHeartbeatDate:
					null !== (t = e.lastSentHeartbeatDate) && void 0 !== t
						? t
						: r.lastSentHeartbeatDate,
				heartbeats: e.heartbeats,
			});
		}
	}
	async add(e) {
		var t;
		if (await this._canUseIndexedDBPromise) {
			const r = await this.read();
			return k(this.app, {
				lastSentHeartbeatDate:
					null !== (t = e.lastSentHeartbeatDate) && void 0 !== t
						? t
						: r.lastSentHeartbeatDate,
				heartbeats: [...r.heartbeats, ...e.heartbeats],
			});
		}
	}
}
function W(e) {
	return J(JSON.stringify({ version: 2, heartbeats: e })).length;
}
function Ct(e) {
	L(new D("platform-logger", (e) => new xe(e), "PRIVATE")),
		L(new D("heartbeat", (e) => new vt(e), "PRIVATE")),
		I(N, U, e),
		I(N, U, "esm2017"),
		I("fire-js", "");
}
Ct("");
var At = "firebase",
	Bt = "10.7.1";
I(At, Bt, "app");
export {
	_ as FirebaseError,
	Nt as SDK_VERSION,
	v as _DEFAULT_ENTRY_NAME,
	ut as _addComponent,
	Ot as _addOrOverwriteComponent,
	m as _apps,
	Mt as _clearComponents,
	w as _components,
	pt as _getProvider,
	L as _registerComponent,
	Tt as _removeServiceInstance,
	Rt as deleteApp,
	Lt as getApp,
	$t as getApps,
	bt as initializeApp,
	Pt as onLog,
	I as registerVersion,
	Ht as setLogLevel,
};
