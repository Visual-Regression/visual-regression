# visual-regression

The home of [visual-regression.dev](https://visual-regression.dev): a vendor-neutral place to learn visual regression testing, compare the tools, and share one run manifest between them.

| Path | What it is |
| --- | --- |
| [`packages/visual-regression-manifest`](packages/visual-regression-manifest) | The `visual-regression-manifest` format: JSON Schema, TypeScript types, reader, writer, merger and converters from other tools' output. |
| `apps/site` | The visual-regression.dev site (Docus, statically generated). |

Maintained by the [pixsame](https://pixsame.com) team. Contributions from every visual regression tool are welcome: see [CONTRIBUTING.md](CONTRIBUTING.md).

## Development

```sh
pnpm install
pnpm build
pnpm test
```

Node 20.9 or newer; the version in `.nvmrc` is what CI uses. pnpm comes from the `packageManager` field (corepack).

## License

[MIT](LICENSE)
