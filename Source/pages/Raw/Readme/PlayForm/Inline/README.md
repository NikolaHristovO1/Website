# [Inline] 🦔

This **[Astro integration][astro-integration]** brings [`critters`][critters] to
your Astro project.

Critters is a plugin that inlines your app's [critical CSS] and lazy-loads the
rest.

> **Note**
>
> `Inline` will not inline your requests, only your statically generated build
> and pre-rendered routes.

## Installation 🚀

There are two ways to add integrations to your project. Let's try the most
convenient option first!

### `astro add` command

Astro includes a CLI tool for adding first party integrations: `astro add`. This
command will:

1. (Optionally) Install all necessary dependencies and peer dependencies
2. (Also optionally) Update your `astro.config.*` file to apply this integration

To install `Inline`, run the following from your project directory and follow
the prompts:

Using NPM:

```sh
npx astro add @playform/inline
```

Using Yarn:

```sh
yarn astro add @playform/inline
```

Using PNPM:

```sh
pnpx astro add @playform/inline
```

### Install dependencies manually

First, install the `Inline` integration like so:

```sh
npm install -D -E @playform/inline
```

Then, apply this integration to your `astro.config.*` file using the
`integrations` property:

```ts
export default {
	integrations: [(await import("@playform/inline")).default()],
};
```

## Getting started

Critters will now automatically inline the critical CSS of your HTML files.

### Default Inlining

You can override any of the default options from the configuration of:

- [`critters`](HTTPS://GitHub.Com/GoogleChromeLabs/critters#usage)

or disable them entirely:

```ts
export default {
	integrations: [
		(await import("@playform/inline")).default({
			Critters: false,
		}),
	],
};
```

### Add Multiple Paths

You can add multiple paths to inline by specifying an array as the `Path`
variable.

**`astro.config.ts`**

```ts
export default {
	integrations: [
		(await import("@playform/inline")).default({
			Path: ["./Target", "./Build"],
		}),
	],
};
```

### Input-Output Mapping

You can also provide a map of paths for different input output directories.

**`astro.config.ts`**

```ts
export default {
	integrations: [
		(await import("@playform/inline")).default({
			Path: new Map([["./Source", "./Target"]]),
		}),
	],
};
```

Or an array of the two.

**`astro.config.ts`**

```ts
export default {
	integrations: [
		(await import("@playform/inline")).default({
			Path: [
				// Inline Target
				"./Target",
				// Inline Target one more time into a different directory
				new Map([["./Target", "./TargetInline"]]),
			],
		}),
	],
};
```

### File Filtering

You can filter files to exclude specific ones from inlining. A filter can be an
array of regular expressions or a single match. You can also use functions to
match on file names:

**`astro.config.ts`**

```ts
export default {
	integrations: [
		(await import("@playform/inline")).default({
			Exclude: [
				"File.html",
				(File: string) => File === "./Target/index.html",
			],
		}),
	],
};
```

### Controlling Logging

You can control the logging level by setting the `Logger` parameter. The default
value is `2`, but you can set it to `0` if you don't want to see debug messages:

```ts
export default {
	integrations: [
		(await import("@playform/inline")).default({
			Logger: 0,
		}),
	],
};
```

[Inline]: HTTPS://NPMJS.Org/@playform/inline
[critters]: HTTPS://github.com/GoogleChromeLabs/critters
[astro-integration]: HTTPS://docs.astro.build/en/guides/integrations-guide/
[critical CSS]:
	HTTPS://www.smashingmagazine.com/2015/08/understanding-critical-css/

## Changelog

See [`CHANGELOG.md`](CHANGELOG.md) for a history of changes to this integration.
