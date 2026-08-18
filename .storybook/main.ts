import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  staticDirs: ['../public'],
  stories: [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-mcp"
  ],
  framework: "@storybook/react-vite",
  async viteFinal(viteConfig) {
    return {
      ...viteConfig,
      plugins: viteConfig.plugins && stripStartPlugins(viteConfig.plugins),
    };
  },
};

/**
 * Storybook hérite des plugins du vite.config.ts racine (React, Tailwind,
 * tsconfig paths…), nécessaires ici, mais aussi de la chaîne TanStack Start /
 * nitro (pensée pour le build SSR à point d'entrée client unique de l'appli) :
 * son plugin "tanstack-react-start:config" injecte dynamiquement, lors de la
 * résolution Vite, un plugin de capture de manifeste qui casse le build
 * multi-entrées de Storybook ("multiple entries detected"). Aucun de ces
 * plugins ne sert à un preview statique de composants, donc on les retire.
 */
const shouldDropStartPlugin = (name: unknown): boolean =>
  typeof name === "string" &&
  (name.startsWith("tanstack-start:") ||
    name.startsWith("tanstack-react-start:") ||
    name.startsWith("nitro:"));

const stripStartPlugins = (plugins: unknown[]): unknown[] =>
  plugins
    .map((plugin) => (Array.isArray(plugin) ? stripStartPlugins(plugin) : plugin))
    .filter((plugin) => {
      if (Array.isArray(plugin)) return plugin.length > 0;
      const name = (plugin as { name?: unknown } | null | undefined)?.name;
      return !shouldDropStartPlugin(name);
    });

export default config;