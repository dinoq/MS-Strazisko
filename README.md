############################################################################################
TODO:
Prioritně:
-Maže se fotka učitele z disku při smazání v LF? Přijde mi že někdy jo a někdy ne? Pozn: v konzoli byla zvláštní chyba:The requested resource isn't a valid image for /img/albums/other/event-photos/null received text/html; charset=utf-8 (mohlo by souviset)
-Použití nextauth
Další:
-files a další v FileChooserContaineru předělat do reduxu
-multivýběr souborů na nahrátí
-smazání podřízených položek na disku i v databázi při forceDelete
-Patička se při změnšení okna (na telefonu) vykresluje divně (dát ty 3 seznamy nějak pod sebe do středu)
-zrevidovat klíče (attributeKey v LF by možná nemuselo dávat smysl...)
-odstranit atribut editable- needitovatelné jsou pouze primarní klíče v editaci a ty jsou vždy první...
-eval nahradit složitým vyhodnocováním - EVAL je nebezpečný!
-XML vzor (autocomplete+kontrola)
-kontroluje se při štení XML s defaultní definicí (myslím že ne) - možná už není potřeba díky optional a required při čtení XML?
- attributeKey v definici LF - ignorovat (místo toho je přímo hodnota). Pozor v DF je potřeba - je tím řečeno jaký atribut objektu se upravuje
- cookieOptions-secure... na produkci...
- funkce checkClassAttrs - odstranit parametr tolerování chybějícího primary key a místo toho vložit přímo do definic objektů (nikoli formulářů!) required (s tím že defaultně bude true...)
- https://github.com/vvo/iron-session#session-wrappers
- komentář "// check class..." v data.ts v POST 
- ošetřit padavku, když se zadá neplatné jméno třídy jako detail LF
- DBOClass - je potřeba ji posílat z FormFrame do potomků? Není možné ji vždy získat s aktuálního objeku?
- primaryKey není potřeba posílat do data, může se vzít z definice objektu (první atribut)
- definici objektů vytvářet přímo z databáze (bude to chtít nový handler a také tabulku mapování trida.atribut-> nazev atributu s diakritikou).
- práci s databází a doubory do try-catch
- db.close!!!
- https na produkci
- rel="noreferrer" - je potřeba? a co to je? (ám to v odkazu v galerii)
- Learning - zapat i Linuxové příkazy (velikost paměti, nginx...)
- Úprava hlavičky na všech stránkách!
- Zkontrolovat prepared statements - není někde přiřazováno přímo??
- admin - akruální záložka zvýraznit
- Upravit albumPaswords v databázi tak, aby mělo id (číslo)
- js > ts
############################################################################################

Známé chyby:
TypeError: Cannot assign to read only property 'editedAttrs' of object '#<Object>' - při pokusu o změně objektu, který je v redux store. Nutné vždy upravovat pomocí dispatch...

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



TECHNOLOGY STACK
React
Nextjs
SASS (+ modules)
Redux (+Redux Toolkit, Redux Saga)
SQL (SQLite)
Bootstrap
REST
NextAuth?
