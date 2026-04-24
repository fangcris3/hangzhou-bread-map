import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { resolve } from 'path'

export default defineConfig({
  server: {
    watch: {
      ignored: ['**/src/data/stores.json'],
    },
  },
  plugins: [
    react(),
    {
      name: 'save-stores',
      configureServer(server) {
        server.middlewares.use('/api/save-photo', (req, res) => {
          if (req.method !== 'POST') { res.statusCode = 405; res.end(); return }
          let body = ''
          req.on('data', (chunk: Buffer) => { body += chunk.toString() })
          req.on('end', () => {
            try {
              const { id, dataUrl } = JSON.parse(body)
              const base64 = dataUrl.split(',')[1]
              const photosDir = resolve(__dirname, 'public/photos')
              if (!existsSync(photosDir)) mkdirSync(photosDir)
              const filename = `${id}.jpg`
              writeFileSync(resolve(photosDir, filename), Buffer.from(base64, 'base64'))
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ ok: true, url: `/photos/${filename}` }))
            } catch {
              res.statusCode = 400
              res.end(JSON.stringify({ ok: false }))
            }
          })
        })

        server.middlewares.use('/api/save-stores', (req, res) => {
          if (req.method !== 'POST') { res.statusCode = 405; res.end(); return }
          let body = ''
          req.on('data', (chunk: Buffer) => { body += chunk.toString() })
          req.on('end', () => {
            try {
              const stores = JSON.parse(body)
              writeFileSync(
                resolve(__dirname, 'src/data/stores.json'),
                JSON.stringify(stores, null, 2),
              )
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ ok: true }))
            } catch {
              res.statusCode = 400
              res.end(JSON.stringify({ ok: false }))
            }
          })
        })
      },
    },
  ],
})
