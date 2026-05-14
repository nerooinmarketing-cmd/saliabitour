import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'

// Özel İndirme Eklentisi (Tarayıcı Kısıtlamalarını Aşmak İçin)
const downloadPlugin = () => {
  return {
    name: 'force-download-plugin',
    configureServer(server) {
      server.middlewares.use('/api/download-tour-template', (req, res) => {
        const filePath = path.resolve(__dirname, 'public/ByTour_Tur_Yukleme_Sablonu.xlsx');
        
        if (fs.existsSync(filePath)) {
          const stat = fs.statSync(filePath);
          res.writeHead(200, {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Length': stat.size,
            // Bu başlık, tarayıcının ismini değiştirmesini KESİN OLARAK engeller
            'Content-Disposition': 'attachment; filename="ByTour_Tur_Yukleme_Sablonu.xlsx"'
          });
          const readStream = fs.createReadStream(filePath);
          readStream.pipe(res);
        } else {
          res.statusCode = 404;
          res.end('Sablon bulunamadi.');
        }
      });
      
      server.middlewares.use('/api/download-hotel-template', (req, res) => {
        const filePath = path.resolve(__dirname, 'public/ByTour_Otel_Yukleme_Sablonu.xlsx');
        
        if (fs.existsSync(filePath)) {
          const stat = fs.statSync(filePath);
          res.writeHead(200, {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Length': stat.size,
            'Content-Disposition': 'attachment; filename="ByTour_Otel_Yukleme_Sablonu.xlsx"'
          });
          const readStream = fs.createReadStream(filePath);
          readStream.pipe(res);
        } else {
          res.statusCode = 404;
          res.end('Sablon bulunamadi.');
        }
      });
    }
  };
};

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    downloadPlugin(), // Eklentiyi aktifleştir
  ],
  server: {
    port: 5173,
    open: true,
  },
})

