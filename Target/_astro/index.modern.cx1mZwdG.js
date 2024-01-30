import { e as $ } from "./index.modern.kBZUKyzZ.js";
function y() {
	return (
		(y = Object.assign
			? Object.assign.bind()
			: function (e) {
					for (var t = 1; t < arguments.length; t++) {
						var s = arguments[t];
						for (var r in s)
							Object.prototype.hasOwnProperty.call(s, r) &&
								(e[r] = s[r]);
					}
					return e;
				}),
		y.apply(this, arguments)
	);
}
function A(e) {
	return "title" !== e.localName && !e.matches("[data-swup-theme]");
}
function b(e, t) {
	return e.outerHTML === t.outerHTML;
}
function E(e) {
	return e.matches("link[rel=stylesheet][href]");
}
class M extends $ {
	constructor(e = {}) {
		var t;
		super(),
			(t = this),
			(this.name = "SwupHeadPlugin"),
			(this.requires = { swup: ">=4" }),
			(this.defaults = {
				persistTags: !1,
				persistAssets: !1,
				awaitAssets: !1,
				timeout: 3e3,
			}),
			(this.options = void 0),
			(this.updateHead = async function (e, { page: { html: s } }) {
				const r = new DOMParser().parseFromString(s, "text/html"),
					{ removed: n, added: i } = (function (
						e,
						t,
						{ shouldPersist: s = () => !1 } = {}
					) {
						const r = Array.from(e.children),
							n = Array.from(t.children),
							i =
								((o = r),
								n.reduce(
									(e, t, s) => (
										o.some((e) => b(t, e)) ||
											e.push({ el: t, index: s }),
										e
									),
									[]
								));
						var o;
						const a =
							((l = n),
							r.reduce(
								(e, t) => (
									l.some((e) => b(t, e)) || e.push({ el: t }),
									e
								),
								[]
							));
						var l;
						return (
							a
								.reverse()
								.filter(({ el: e }) => A(e))
								.filter(({ el: e }) => !s(e))
								.forEach(({ el: t }) => e.removeChild(t)),
							i
								.filter(({ el: e }) => A(e))
								.forEach(({ el: t, index: s = 0 }) => {
									e.insertBefore(
										t,
										e.children[s + 1] || null
									);
								}),
							{
								removed: a.map(({ el: e }) => e),
								added: i.map(({ el: e }) => e),
							}
						);
					})(document.head, r.head, {
						shouldPersist: (e) => t.isPersistentTag(e),
					});
				t.swup.log(
					`Removed ${n.length} / added ${i.length} tags in head`
				);
				const o =
					(a = document.documentElement).lang !==
					(l = r.documentElement).lang
						? ((a.lang = l.lang), a.lang)
						: null;
				var a, l;
				if (
					(o && t.swup.log(`Updated lang attribute: ${o}`),
					t.options.awaitAssets)
				) {
					const e = (function (e, t = 0) {
						return e.filter(E).map((e) =>
							(function (e, t = 0) {
								const s = (t) => {
									(({ href: e }) =>
										Array.from(document.styleSheets)
											.map(({ href: e }) => e)
											.includes(e))(e)
										? t()
										: setTimeout(() => s(t), 10);
								};
								return new Promise((e) => {
									s(e), t > 0 && setTimeout(e, t);
								});
							})(e, t)
						);
					})(i, t.options.timeout);
					e.length &&
						(t.swup.log(`Waiting for ${e.length} assets to load`),
						await Promise.all(e));
				}
			}),
			(this.options = y({}, this.defaults, e)),
			this.options.persistAssets &&
				!this.options.persistTags &&
				(this.options.persistTags =
					"link[rel=stylesheet], script[src], style");
	}
	mount() {
		this.before("content:replace", this.updateHead);
	}
	isPersistentTag(e) {
		const { persistTags: t } = this.options;
		return "function" == typeof t
			? t(e)
			: "string" == typeof t
				? e.matches(t)
				: !!t;
	}
}
export { M as default };
