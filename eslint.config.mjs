// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    'operator-linebreak': ['error', 'after'],
    '@stylistic/operator-linebreak': ['error', 'after'],
    'vue/singleline-html-element-content-newline': 'off',
    'vue/html-self-closing': 'off'
  }
})
