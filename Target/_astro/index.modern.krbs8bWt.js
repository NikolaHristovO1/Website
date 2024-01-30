import { e as o } from "./index.modern.kBZUKyzZ.js";
function r() {
	return (
		(r = Object.assign
			? Object.assign.bind()
			: function (s) {
					for (var t = 1; t < arguments.length; t++) {
						var e = arguments[t];
						for (var a in e)
							Object.prototype.hasOwnProperty.call(e, a) &&
								(s[a] = e[a]);
					}
					return s;
				}),
		r.apply(this, arguments)
	);
}
class u extends o {
	constructor(s = {}) {
		super(),
			(this.name = "SwupBodyClassPlugin"),
			(this.requires = { swup: ">=4" }),
			(this.defaults = { prefix: "" }),
			(this.options = void 0),
			(this.updateBodyClass = (s, { page: { html: t } }) => {
				this.updateClassNames(document.body, this.getBodyElement(t));
			}),
			(this.options = r({}, this.defaults, s));
	}
	mount() {
		this.on("content:replace", this.updateBodyClass);
	}
	getBodyElement(s) {
		return new DOMParser()
			.parseFromString(s, "text/html")
			.querySelector("body");
	}
	updateClassNames(s, t) {
		const e = [...s.classList].filter((s) => this.isValidClassName(s)),
			a = [...t.classList].filter((s) => this.isValidClassName(s));
		s.classList.remove(...e), s.classList.add(...a);
	}
	isValidClassName(s) {
		return s && s.startsWith(this.options.prefix);
	}
}
export { u as default };
