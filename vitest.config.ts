import tsconfigPaths from 'vite-tsconfig-paths'
import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  root: `.`,
  test: {
    exclude: [...configDefaults.exclude, `.next`, `.husky`]
  },
  plugins: [tsconfigPaths()],
  clearScreen: true
})
