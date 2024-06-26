import path, { resolve } from 'node:path'
import url from 'node:url'
import { defineConfig } from 'vite'
import viteBabel from 'vite-plugin-babel'
import viteMultipage from 'vite-plugin-multipage'
import vitePug from 'vite-plugin-pug-transformer'
import viteStylelint from 'vite-plugin-stylelint'
import viteSassGlob from 'vite-plugin-sass-glob-import'
import viteImagemin from 'vite-plugin-imagemin'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'


const root = resolve(path.dirname(url.fileURLToPath(import.meta.url)), 'src')
const outDir = resolve(path.dirname(url.fileURLToPath(import.meta.url)), 'dist')

export default defineConfig(({mode}) => {
  if (mode === 'scripts') {
    return {
      root,
      base: './',
      clearScreen: false,
      build: {
        outDir,
        emptyOutDir: true,
        chunkSizeWarningLimit: '1024',
        rollupOptions: {
          output: {
            assetFileNames: (assetInfo) => {
              let extType = assetInfo.name.split('.')[1]
              if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
                extType = 'images'
              } else if (extType === 'css') {
                extType = 'styles'
              } 

              return `${extType}/[name][extname]`
            },
            entryFileNames: 'assets/index.js'
          }
        }
      },
      plugins: [
        viteBabel({
          presets: ['@babel/preset-env']
        }),
        viteMultipage({
          mimeCheck: true,
          open: '/',
          pageDir: 'pages',
          purgeDir: 'pages',
          removePageDirs: true,
          rootPage: 'index.html'
        }),
        viteStylelint(),
        viteSassGlob(),
        createSvgIconsPlugin({
          iconDirs: [resolve(process.cwd(), 'src/images')],
          symbolId: '[name]',
          inject: 'body-last',
          customDomId: '__svg__icons__dom__'
        })
      ]
    }
  }
  return {
    root,
    base: './',
    clearScreen: false,
    build: {
      outDir,
      emptyOutDir: true,
      chunkSizeWarningLimit: '1024',
      rollupOptions: {
        output: {
          assetFileNames: (assetInfo) => {
            let extType = assetInfo.name.split('.')[1]
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
              extType = 'images'
            } else if (extType === 'css') {
              extType = 'styles'
            } 

            return `${extType}/[name][extname]`
          },
          entryFileNames: 'assets/index.js'
        }
      }
    },
    plugins: [
      viteBabel({
        presets: ['@babel/preset-env']
      }),
      viteMultipage({
        mimeCheck: true,
        open: '/',
        pageDir: 'pages',
        purgeDir: 'pages',
        removePageDirs: true,
        rootPage: 'index.html'
      }),
      vitePug({
        pugOptions: {
          pretty: true,
          basedir: path.resolve(__dirname, 'src/blocks')
        }
      }),
      viteStylelint(),
      viteSassGlob(),
      viteImagemin({
        gifsicle: {
          optimizationLevel: 7,
          interlaced: false
        },
        optipng: {
          optimizationLevel: 7
        },
        mozjpeg: {
          quality: 75
        },
        pngquant: {
          quality: [0.7, 0.7],
          speed: 4
        },
        svgo: {
          plugins: [
            {
              name: 'removeViewBox'
            },
            {
              name: 'removeEmptyAttrs',
              active: false
            }
          ]
        }
      }),
      createSvgIconsPlugin({
        iconDirs: [resolve(process.cwd(), 'src/images')],
        symbolId: '[name]',
        inject: 'body-last',
        customDomId: '__svg__icons__dom__'
      })
    ]
  }
})