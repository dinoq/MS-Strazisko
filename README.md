TODO features and bugs:
- multivýběr souborů na nahrátí
- dokumenty se nemaží (z disku; z databáze nevím, zjistit...)
- Maže se fotka učitele z disku při smazání v LF? Přijde mi že někdy jo a někdy ne? Pozn: v konzoli byla zvláštní chyba:The requested resource isn't a valid image for /img/albums/other/event-photos/null received text/html; charset=utf-8 (mohlo by souviset)
- smazání podřízených položek na disku i v databázi při forceDelete
- Patička se při změnšení okna (na telefonu) vykresluje divně (dát ty 3 seznamy nějak pod sebe do středu)

TODO implementation prioritně
- požadavky na api route předělat na form data? Minimálně POST+PUT z DetailFrame a soubory předávat rovnou v požadavku
-   fs....sync funkce na neblokující await fs.promises...async
-   při editaci dokumentů (změně dokumentu) se ten starý nesmaže...
-   Při nahrávání souborů zkontrolovat jestli soubor ještě neexistuje a pokud ano, tak ten nový přejmenovat? Nebo minimálně varovat uživatele? Vymyslet...
-   https codes (200 -ok, 201 created for post)
- Warningy v konzoli vs code při běžícím dev
- redesign reduxu
- přidat selectory
- Rozdělit soubory, ať v žádném není více komponent současně
-   eslint-disable-next-line @next/next/no-img-element - vyřešit
-   Úprava hlavičky na všech stránkách!
-   Zkontrolovat prepared statements - není někde přiřazováno přímo??
-   eval nahradit složitým vyhodnocováním - EVAL je nebezpečný!
-   files a další v FileChooserContaineru předělat do reduxu
-   práci s databází a doubory do try-catch
-   https na produkci
-   definici objektů vytvářet přímo z databáze (bude to chtít nový handler a také tabulku mapování trida.atribut-> nazev atributu s diakritikou).
-   Upravit albumPaswords v databázi tak, aby mělo id (číslo)
-   Použití nextauth
-   komentář "// check class..." v data.ts v POST
-   primaryKey není potřeba posílat do data, může se vzít z definice objektu (první atribut)
-   ošetřit padavku, když se zadá neplatné jméno třídy jako detail LF
-   https://github.com/vvo/iron-session#session-wrappers
-   cookieOptions-secure... na produkci...
-   funkce checkClassAttrs - odstranit parametr tolerování chybějícího primary key a místo toho vložit přímo do definic objektů (nikoli formulářů!) required (s tím že defaultně bude true...)
-   kontroluje se při štení XML s defaultní definicí (myslím že ne) - možná už není potřeba díky optional a required při čtení XML?
-   attributeKey v definici LF - ignorovat (místo toho je přímo hodnota). Pozor v DF je potřeba - je tím řečeno jaký atribut objektu se upravuje
    -zrevidovat klíče (attributeKey v LF by možná nemuselo dávat smysl...)
    -odstranit atribut editable- needitovatelné jsou pouze primarní klíče v editaci a ty jsou vždy první...
    TODO implementation možná:
    -XML vzor (autocomplete+kontrola)

TECHNOLOGY STACK
HTML + JS + CSS (+ Bootstrap)
React
Nextjs (+ NextAuth)
SASS (+ modules)
Redux (+ Redux Toolkit, Redux Saga)
NOSQL (SQLite) + Prisma ORM
REST
