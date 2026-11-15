# Third-Party Licenses and Attributions

This project integrates third-party open-source components as described below.

---

## Bible Strong Avatar Lab

- **Project**: Bible Strong Avatar Lab (`@bible-strong/avatar-core`, `@bible-strong/avatar-web`)
- **Author / Copyright Holder**: Stéphane Montlouis-Calixte
- **Source Repository**: [https://github.com/smontlouis/bible-strong-avatar-lab](https://github.com/smontlouis/bible-strong-avatar-lab)
- **Hosted Studio**: [https://avatars.bible-strong.app/](https://avatars.bible-strong.app/)
- **License**: GNU Affero General Public License v3.0 (AGPL-3.0-only)

### Integrated Files
- `src/web/avatar-runtime.js`: Bundled ES module runtime providing procedural 2D SVG avatar geometry, DOM rendering, ambient floating, blinking, expressions, and animation playback.
- `src/web/avatar-runtime.d.ts`: TypeScript typings for avatar runtime interfaces.
- `public/aira.avatar.json`: Character configuration definition following Avatar Lab's specification.
- `src/web/aira-avatar-data.ts`: Inlined definition data for zero-latency browser loading.

### Modifications
- The `@bible-strong/avatar-core` and `@bible-strong/avatar-web` packages were bundled into a self-contained ES module for direct browser import without dynamic bundlers.
- Decoupled external JSON schema validation (`ajv`) to comply with the project's static safety security policy banning dynamic code generation (`eval` and `new Function`). The procedural SVG mathematical geometry, matrix transformations, coordinate rendering, ambient motion, expression morphing, and animation routines remain faithful to the original project.

### Full License Text (GNU AGPL v3.0)
```text
                    GNU AFFERO GENERAL PUBLIC LICENSE
                       Version 3, 19 November 2007

 Copyright (C) 2007 Free Software Foundation, Inc. <https://fsf.org/>
 Everyone is permitted to copy and distribute verbatim copies
 of this license document, but changing it is not allowed.

                            Preamble

  The GNU Affero General Public License is a free, copyleft license for
software and other kinds of works, specifically designed to ensure
cooperation with the community in the case of network server software.

  The licenses for most software and other practical works are designed
to take away your freedom to share and change the works.  By contrast,
our General Public Licenses are intended to guarantee your freedom to
share and change all versions of a program--to make sure it remains free
software for all its users.
...
(Complete AGPL-3.0 text preserved in project documentation and repository)
```
