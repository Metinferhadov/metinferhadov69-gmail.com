import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

function videoUploadPlugin(): Plugin {
  const uploadDir = path.resolve(process.cwd(), 'public/uploads/videos');
  try {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
  } catch (e) {
    console.warn('Could not create upload directory:', e);
  }

  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname) || '.mp4';
      const cleanBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 30);
      const uniqueName = `video-${Date.now()}-${cleanBase || 'clip'}${ext}`;
      cb(null, uniqueName);
    }
  });

  const upload = multer({
    storage,
    limits: { fileSize: 150 * 1024 * 1024 }
  });

  return {
    name: 'video-upload-handler',
    configureServer(server) {
      server.middlewares.use((req: any, res: any, next: any) => {
        const url = req.url ? req.url.split('?')[0] : '';
        if ((url === '/api/upload-video' || url === '/api/upload') && req.method === 'POST') {
          upload.any()(req, res, (err: any) => {
            if (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message || 'Fayl yüklənərkən xəta' }));
              return;
            }
            const file = req.files && req.files[0];
            if (!file) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Video faylı göndərilməyib' }));
              return;
            }
            const publicUrl = `/uploads/videos/${file.filename}`;
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                success: true,
                url: publicUrl,
                filename: file.filename,
                size: file.size,
                originalName: file.originalname
              })
            );
          });
        } else if (url.startsWith('/uploads/videos/') && (req.method === 'GET' || req.method === 'HEAD')) {
          const fileName = path.basename(url);
          const filePath = path.join(uploadDir, fileName);
          if (fs.existsSync(filePath)) {
            try {
              const stat = fs.statSync(filePath);
              const fileSize = stat.size;
              const range = req.headers.range;

              const ext = path.extname(filePath).toLowerCase();
              const contentType =
                ext === '.mov'
                  ? 'video/quicktime'
                  : ext === '.webm'
                  ? 'video/webm'
                  : 'video/mp4';

              const commonHeaders: Record<string, string | number> = {
                'Content-Type': contentType,
                'Accept-Ranges': 'bytes',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
                'Access-Control-Allow-Headers': 'Range, Content-Type',
                'Cross-Origin-Resource-Policy': 'cross-origin'
              };

              if (req.method === 'HEAD') {
                res.writeHead(200, {
                  ...commonHeaders,
                  'Content-Length': fileSize
                });
                res.end();
                return;
              }

              if (range) {
                const parts = range.replace(/bytes=/, '').split('-');
                const start = parseInt(parts[0], 10) || 0;
                const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

                if (isNaN(start) || isNaN(end) || start >= fileSize || end >= fileSize || start > end) {
                  res.writeHead(416, {
                    ...commonHeaders,
                    'Content-Range': `bytes */${fileSize}`
                  });
                  res.end();
                  return;
                }

                const chunksize = end - start + 1;
                const fileStream = fs.createReadStream(filePath, { start, end });
                
                fileStream.on('error', (streamErr) => {
                  console.warn('Video stream chunk error:', streamErr?.message);
                  if (!res.headersSent) {
                    res.statusCode = 500;
                    res.end();
                  }
                });

                res.on('close', () => {
                  fileStream.destroy();
                });

                res.writeHead(206, {
                  ...commonHeaders,
                  'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                  'Content-Length': chunksize
                });
                fileStream.pipe(res);
                return;
              } else {
                const fileStream = fs.createReadStream(filePath);
                
                fileStream.on('error', (streamErr) => {
                  console.warn('Full video stream error:', streamErr?.message);
                  if (!res.headersSent) {
                    res.statusCode = 500;
                    res.end();
                  }
                });

                res.on('close', () => {
                  fileStream.destroy();
                });

                res.writeHead(200, {
                  ...commonHeaders,
                  'Content-Length': fileSize
                });
                fileStream.pipe(res);
                return;
              }
            } catch (err: any) {
              console.warn('Video file serving exception:', err?.message);
              if (!res.headersSent) {
                res.statusCode = 500;
                res.end();
              }
              return;
            }
          } else {
            next();
          }
        } else {
          next();
        }
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), videoUploadPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      // Also ignore uploaded media files so saving videos never triggers a dev server reload
      watch: process.env.DISABLE_HMR === 'true' ? null : { ignored: ['**/public/uploads/**', '**/node_modules/**'] },
    },
  };
});
