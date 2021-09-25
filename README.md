############################################################################################
TODO:
- cookieOptions-secure... na produkci...
- https://admin.ms-strazisko.cz/api/getYearAlbumsInfo?year=undefined ???
- https na produkci
- rel="noreferrer" - je potřeba? a co to je? (ám to v odkazu v galerii)
- Learning - zapat i Linuxové příkazy (velikost paměti, nginx...)
- Úprava hlavičky na všech stránkách!
- Zkontrolovat prepared statements - není někde přiřazováno přímo??
############################################################################################


-----------
Odstranění dev dependencies:
npm prune --production

Dependencies:


"next" - nativní pro next
"react" - nativní pro next
"react-dom" - nativní pro next
"antd" - UI
"better-sqlite3" - SQL lite
"bootstrap" - Bootstrap 
"next-iron-session" - session v /api nextjs aplikace
"sharp" - Manipulace s obrázky na serveru
"formidable"-na nahrávání souborů na server
"image-trace-loader": "^1.0.2",
"imagemin-gifsicle": "^7.0.0",
"imagemin-svgo": "^9.0.0",
"jimp": "^0.16.1",
"lqip-loader": "^2.2.1",
"multer": "^1.4.3",
"next-connect": "^0.10.2",
"next-optimized-images": "^2.6.2",
"react-google-maps": "^9.4.5",
"responsive-loader": "^2.3.0",
"svg-sprite-loader": "^6.0.9"
    

Zaloha deps:

  "dependencies": {
    "antd": "^4.16.13",
    "better-sqlite3": "^7.4.3",
    "bootstrap": "^5.0.2",
    "cross-env": "^7.0.3",
    "formidable": "^1.2.2",
    "google-map-react": "^2.1.10",
    "image-trace-loader": "^1.0.2",
    "imagemin-gifsicle": "^7.0.0",
    "imagemin-svgo": "^9.0.0",
    "jimp": "^0.16.1",
    "lqip-loader": "^2.2.1",
    "multer": "^1.4.3",
    "next": "11.0.1",
    "next-connect": "^0.10.2",
    "next-iron-session": "^4.2.0",
    "next-optimized-images": "^2.6.2",
    "react": "17.0.2",
    "react-dom": "17.0.2",
    "react-google-maps": "^9.4.5",
    "responsive-loader": "^2.3.0",
    "sass": "^1.36.0",
    "sharp": "^0.29.0",
    "svg-sprite-loader": "^6.0.9"
  },
  "devDependencies": {
    "@types/node": "^16.3.2",
    "@types/react": "^17.0.14",
    "eslint": "7.30.0",
    "eslint-config-next": "11.0.1",
    "imagemin-mozjpeg": "^9.0.0",
    "imagemin-optipng": "^8.0.0",
    "next-compose-plugins": "^2.2.1",
    "typescript": "^4.3.5",
    "webp-loader": "^0.6.0"
  }
}