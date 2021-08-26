// eslint-disable-next-line @typescript-eslint/no-var-requires
const { join } = require('path')
const BASE_DIR = join(__dirname, 'src')
const VUE_FILE = join('**', '*.vue')

const config = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: {
    // Learn more on https://tailwindcss.com/docs/controlling-file-size/#removing-unused-css
    enabled: process.env.NODE_ENV === 'production',
    content: [join(BASE_DIR, VUE_FILE), join(__dirname, '*.html')],
  },
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [],
}

module.exports = config
