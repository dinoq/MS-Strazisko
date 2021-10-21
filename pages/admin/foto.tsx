import type { NextPage } from 'next'
import { withIronSession } from 'next-iron-session'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import ErrorDialog from '../../components/admin/ErrorDialog'
import ListFrame from '../../components/admin/ListFrame'
import ObjectManager from '../../components/admin/ObjectManager'
import TreeChoiceDialog from '../../components/admin/TreeChoiceDialog'
import AppTable from '../../components/Table/Table'
import { ComponentType, ObjectManagerMode } from '../../constants/constants'
import { FormDefinitions } from '../../constants/form-definitions'
import { FormDefinition } from '../../constants/types'
import classes from './foto.module.scss'

enum ShownLevel {
  YEARS,
  ALBUMS,
  PHOTOS
}

const AdminPhotosPage: NextPage = (props: any) => {
  const [breadcrumbItems, setBreadcrumbItemsState] = useState([]);
  const [yearEntries, setYearEntries] = useState([]);
  const [albumEntries, setAlbumEntries] = useState([]);
  const [photoEntries, setPhotoEntries] = useState([]);
  const [objectManagerMode, setObjectManagerMode] = useState(ObjectManagerMode.NEW_ENTRY);
  const [errorMsg, setErrorMsg] = useState("")
  const [url, setUrl] = useState("");
  let shownLevel = (breadcrumbItems.length == 0) ? ShownLevel.YEARS : (breadcrumbItems.length == 1) ? ShownLevel.ALBUMS : ShownLevel.PHOTOS;
  const [DBObject, setDBObject] = useState({ actual: getEmptyDBObject(shownLevel), edited: getEmptyDBObject(shownLevel), toSet: getEmptyDBObject(shownLevel) })
  const [formClassName, setFormClassName] = useState(["albumPasswords"]);

  useEffect(() => {
    setUrl("years");
    fetch("/api/admin/years").then((resp) => {
      if (resp.status == 200) {
        resp.json().then((json) => {
          setYearEntries(json);
        });
      } else {
        resp.text().then((value) => {
          console.log("tvalue: ", value);
        });
      }
    });
  }, []);

  const setBreadcrumbItems = (items) => {
    hideObjectManager();
    setBreadcrumbItemsState(items);
    setFormClassName(prevClassNames => {
      return prevClassNames.slice(0, items.length+1);
    });
  }

  /**
   * Bylo kliknuto na položku, změní se úroveň
   */
  const detailClickedHandler = async (item) => {    //JSON.parse(JSON.stringify("asd"))
    setFormClassName(prevClassNames => {
      return [...prevClassNames, FormDefinitions[prevClassNames[prevClassNames.length - 1]].config.detailClass];
    });
    setBreadcrumbItemsState(prevState => [...prevState, item[FormDefinitions[formClassName[formClassName.length - 1]].items.find(item => item.breadcrumb).objectParamName]]);

    let url = "";
    if (shownLevel == ShownLevel.YEARS) {
      url = "albums?year=" + item.year;
    } else if (shownLevel == ShownLevel.ALBUMS) {
      url = "photos?albumID=" + item.id;
    }

    /*
    let resp = await fetch(
      "/api/admin/" + url,
      { method: "GET" }
    );
        if (resp.status == 200) {
          let json = await resp.json();
          if (shownLevel == ShownLevel.YEARS) {
            setAlbumEntries(json);
            setBreadcrumbItemsState(prevState => [...prevState, item.year]);
            setUrl("albums");
          } else if (shownLevel == ShownLevel.ALBUMS) {
            setPhotoEntries(json);
            setBreadcrumbItemsState(prevState => [...prevState, item.name]);
            setUrl("photos");
          }
        } else {
          let text = await resp.text();
          console.log("tvalue: ", text);
        }*/
  }

  const deleteItemHandler = async (item) => {
    if (!isEqualObjects(DBObject.actual, DBObject.edited)) {
      setErrorMsg("Nejprve zrušte editaci položky!");
      return;
    }
    let url = "";
    let body = {};
    if (shownLevel == ShownLevel.YEARS) {
      url = "years";
      body = item;
    } else if (shownLevel == ShownLevel.ALBUMS) {
      url = "albums";
    }

    let resp = await fetch(
      "/api/admin/" + url,
      {
        method: "DELETE",
        mode: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      }
    );

    if (resp.status == 200) {
      if (resp.status == 200) {
        window.location.reload();
      }
    } else {
      try {
        let text = await resp.text();
        setErrorMsg(text);
      } catch (error) {

      }
    }
  }

  const [saveDialogVisible, setSaveDialogVisible] = useState(false);

  const changeItemHandler = (item) => {
    if (isEmptyObject(DBObject.actual, shownLevel) || DBObject.actual == DBObject.edited) {
      setDBObject(prevState => {
        return { ...prevState, actual: item, edited: item }
      });
      setObjectManagerMode(ObjectManagerMode.EDITING_ENTRY);
      showObjectManager();
    } else {
      setSaveDialogVisible(true);
      setDBObject(prevState => {
        return { ...prevState, toSet: item };
      });
    }
  }

  const setNextDBObject = () => {
    setDBObject(prevState => {
      return { ...prevState, actual: prevState.toSet, edited: prevState.toSet, toSet: getEmptyDBObject(shownLevel) };
    });
    setSaveDialogVisible(false);
  }

  const headerItems: Array<any> = getTableHeaderItems(breadcrumbItems.length);
  const bodyRows: Array<any> = getTableRows(breadcrumbItems.length, yearEntries, albumEntries, photoEntries, detailClickedHandler, deleteItemHandler, changeItemHandler, DBObject);

  const [objectManagerVisible, setObjectManagerVisible] = useState(false)

  const showObjectManager = (setEmptyObject?) => {
    if (setEmptyObject) {
      setDBObject(prevState => {
        return { ...prevState, actual: getEmptyDBObject(shownLevel), edited: getEmptyDBObject(shownLevel) }
      });
    }
    setObjectManagerVisible(true)
  }

  const hideObjectManager = () => {
    setObjectManagerVisible(false);
    setDBObject(prevState => {
      return { ...prevState, actual: getEmptyDBObject(shownLevel), edited: getEmptyDBObject(shownLevel) }
    });
    setObjectManagerMode(ObjectManagerMode.NEW_ENTRY);
  }
  let title = (shownLevel == ShownLevel.YEARS) ? "Přidat nový školní rok" : (shownLevel == ShownLevel.ALBUMS) ? "Přidat nové album" : "Přidat fotky";

  return (
    <div className={""}>
      <Head>
        <title>Stránky</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={""}>
        <Breadcrumb items={breadcrumbItems} setItems={setBreadcrumbItems} />

        <div className={"form-wrapper"}>
          {!objectManagerVisible && <span className={"link " + "add-document-btn mb-3"} onClick={showObjectManager.bind(this, true)}>{title}</span>}
          {objectManagerVisible &&
            <ObjectManager url={url} setErrorMsg={setErrorMsg} mode={objectManagerMode} hideObjectManager={hideObjectManager} headerItems={headerItems} DBObject={DBObject} setDBObject={setDBObject} />}
          <ListFrame formClassName={formClassName[formClassName.length - 1]} DBObject={DBObject.actual} detailClickedHandler={detailClickedHandler} deleteItemHandler={deleteItemHandler} editItemHandler={changeItemHandler} />
          {saveDialogVisible &&
            <TreeChoiceDialog dialogText="Chcete změny uložit?" overlayCancels={true} onYes={null} yesText="Uložit" onNo={setNextDBObject} noText="Neukládat" onCancel={() => { setSaveDialogVisible(false) }} cancelText="Zrušit" />}
          {(errorMsg && errorMsg.length) && <ErrorDialog msg={errorMsg} onOk={() => { setErrorMsg("") }} />}
        </div>
      </main>
    </div>
  )
}

const getYears = () => {
  let years = [];
  let actualYear = new Date().getFullYear();
  for (let i = 0; i < 10; i++) {
    years.push((actualYear - i) + "/" + (actualYear + 1 - i));
  }
  return years;
}

const getTableHeaderItems = (index) => {
  if (index == 0) { // Years...
    return [
      { content: "Detail" },
      { content: "Školní rok", editable: true, type: ComponentType.SELECTBOX, values: getYears(), objectParamName: "year", constraints: [{ condition: "$['#'].length", errorIfFail: "Musí být zvolen školní rok" }] },
      { content: "Heslo", editable: true, editableInEditMode: true, type: ComponentType.INPUT, inputType: "text", objectParamName: "password", constraints: [{ condition: "$['#'].length", errorIfFail: "Heslo nesmí být prázdné!" }, { condition: "$['#'].length > 5", errorIfFail: "Heslo nesmí být kratší než 6 znaků!" }] },
      { content: "Akce" },
    ]
  } else if (index == 1) { // Albums
    return [
      { content: "ID" },
      { content: "Datum", editable: true, type: ComponentType.INPUT, inputType: "date", objectParamName: "date" },
      { content: "URL", editable: true, type: ComponentType.INPUT, inputType: "text", objectParamName: "title" },
      { content: "Název", editable: true, type: ComponentType.INPUT, inputType: "text", objectParamName: "name" },
      { content: "Akce" },
    ]
  } else if (index == 2) { // Photos
    return [
      { content: "ID" },
      { content: "URL" },
      { content: "Náhled" },
      { content: "Akce" },
    ]
  }
}

const getTableRows = (index, yearEntries, albumEntries, photoEntries, itemClickedHandler, deleteItemHandler, changeItemHandler, DBObject) => {
  if (index == 0) { // Years...
    return yearEntries.map((entry, index) => {
      return ({
        items: [
          { content: <span onClick={itemClickedHandler.bind(this, entry)}> Detail </span>, className: "link" },
          { content: <span onClick={itemClickedHandler.bind(this, entry)}> {entry.year} </span>, className: "link" },
          { content: entry.password },
          { className: "actions", content: (<><span className={"link-danger"} onClick={deleteItemHandler.bind(this, entry)}>Smazat</span><span className={"link"} onClick={changeItemHandler.bind(this, entry)}>Změnit heslo</span></>) }
        ],
        selected: JSON.stringify(DBObject.actual) == JSON.stringify(entry)
      })
    })

  } else if (index == 1) { // Albums
    return albumEntries.map((entry, index) => {
      let date = new Date(entry.date);

      return ({
        items: [
          { content: entry.id },
          { content: date.getDate() + ". " + (date.getMonth() + 1) + ". " + date.getFullYear() },
          { content: entry.title },
          { content: <span onClick={itemClickedHandler.bind(this, entry)}> {entry.name} </span>, className: "link" },
          { className: "actions", content: (<><span className={"link-danger"} onClick={deleteItemHandler.bind(this, entry)}>Smazat</span><span className={"link"} onClick={changeItemHandler.bind(this, entry)}>Upravit</span></>) }
        ],
        selected: JSON.stringify(DBObject.actual) == JSON.stringify(entry)
      })
    })

  } else if (index == 2) { // Photos
    return photoEntries.map((entry, index) => {
      return ({
        items: [
          { content: entry.id },
          { content: (<a href={"/api/getPhoto?file=" + albumEntries[0].title + "/" + entry.filename} target="_blank" rel="noreferrer">{entry.filename}</a>), className: "link" },
          // eslint-disable-next-line @next/next/no-img-element
          { content: <a href={"/api/getPhoto?file=" + albumEntries[0].title + "/" + entry.filename} target="_blank" rel="noreferrer"><img className={classes.imgPreview} src={"/api/getPhoto?file=" + albumEntries[0].title + "/" + entry.filename + "&minify"} alt="Náhled obrázku" /></a> },
          { className: "actions", content: (<><span className={"link-danger"} onClick={deleteItemHandler.bind(this, entry)}>Smazat</span></>) }
        ],
        selected: JSON.stringify(DBObject.actual) == JSON.stringify(entry)
      })
    })
  }
}

const getEmptyDBObject = (level: ShownLevel) => {
  let headers = getTableHeaderItems(level);
  let fields = { id: -1 };
  headers.forEach(header => {
    if (header.objectParamName)
      fields[header.objectParamName] = "";
  });
  return fields;
}

const isEmptyObject = (dbObject: any, level: ShownLevel) => {
  return (dbObject == null || JSON.stringify(dbObject) == JSON.stringify(getEmptyDBObject(level)));
}


const isEqualObjects = (dbObject1: any, dbObject2: any) => {
  return ((dbObject1 == null && dbObject2 == null) || (JSON.stringify(dbObject1) == JSON.stringify(dbObject2)));
}

const Breadcrumb = (props) => {

  let items: [] = props.items ? props.items : [];

  const resetNav = () => {
    props.setItems([]);
  }

  const itemClicked = (index) => {
    props.setItems(items.slice(0, index + 1));
  }
  return (
    <div className={classes.breadcrumb}>
      <span className={classes.breadcrumbItem + " link"} onClick={resetNav}>
        Foto
      </span>&nbsp;&gt;&nbsp;
      {items.map((item, index) => {
        return (
          <span key={"breadcrumb-item-" + index} className={""}>
            {index != 0 && " > "}
            <span className={classes.breadcrumbItem + " link"} onClick={itemClicked.bind(this, index)}>
              {item}
            </span>
          </span>
        )
      })}
    </div>
  )
}

export const getServerSideProps = withIronSession(
  async ({ req, res }) => {
    const adminLogged: Array<any> = req.session.get("adminLogged");

    if (adminLogged
    ) {
      return {
        props: {},
      };
    } else {
      return {
        redirect: {
          destination: '/admin/login',
          permanent: false,
        }
      };
    }
  },
  {
    cookieName: "myapp_cookiename",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production" ? true : false,
    },
    password: "P5hBP4iHlvp6obqtWK0mNuMrZow5x6DQV61W3EUG",
  }
);

export default AdminPhotosPage
