import type { NextPage } from 'next'
import { withIronSession } from 'next-iron-session'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import ErrorDialog from '../../components/admin/ErrorDialog'
import SaveDialog from '../../components/admin/SaveDialog'
import AppTable from '../../components/Table/Table'
import classes from './foto.module.scss'


enum ComponentTypes {
  INPUT,
  SELECTBOX
}

enum ShownLevel {
  YEARS,
  ALBUMS,
  PHOTOS
}

enum ObjectManagerMode {
  NEW_ENTRY,
  EDITING_ENTRY
}

const AdminPhotosPage: NextPage = (props: any) => {
  const [breadcrumbItems, setBreadcrumbItemsState] = useState([]);
  const [yearEntries, setYearEntries] = useState([]);
  console.log('yearEntries: ', yearEntries);
  const [albumEntries, setAlbumEntries] = useState([]);
  const [photoEntries, setPhotoEntries] = useState([]);
  const [DBObject, setDBObject] = useState({ actual: null, toSet: null, edited: null })
  const [objectManagerMode, setObjectManagerMode] = useState(ObjectManagerMode.NEW_ENTRY);
  const [errorMsg, setErrorMsg] = useState("")

  let shownLevel = (breadcrumbItems.length == 0) ? ShownLevel.YEARS : (breadcrumbItems.length == 1) ? ShownLevel.ALBUMS : ShownLevel.PHOTOS;

  useEffect(() => {
    fetch("/api/admin/years").then((resp) => {
      console.log('respffffffffffff: ', resp);
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
  }

  const itemClickedHandler = async (item) => {
    let url = "";
    if (shownLevel == ShownLevel.YEARS) {
      url = "getAlbums?year=" + item.year;
    } else if (shownLevel == ShownLevel.ALBUMS) {
      url = "getPhotos?albumID=" + item.id;
    }

    let resp = await fetch(
      "/api/admin/" + url,
      { method: "GET" }
    );

    if (resp.status == 200) {
      let json = await resp.json();
      console.log('json: ', json);
      if (shownLevel == ShownLevel.YEARS) {
        setAlbumEntries(json);
        setBreadcrumbItemsState(prevState => [...prevState, item.year]);
      } else if (shownLevel == ShownLevel.ALBUMS) {
        setPhotoEntries(json);
        setBreadcrumbItemsState(prevState => [...prevState, item.name]);
      }
    } else {
      let text = await resp.text();
      console.log("tvalue: ", text);
    }
  }

  const deleteItemHandler = async (item) => {
    let url = "";
    let body = {};
    if (shownLevel == ShownLevel.YEARS) {
      url = "years";
      body["year"] = item.year;
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
      let text = await resp.text();
      console.log("tvalue: ", text);
    }
  }

  const [saveDialogVisible, setSaveDialogVisible] = useState(false);

  const changeItemHandler = (item) => {
    console.log('changeItemHandler: ', item);
    if(isEmptyObject(DBObject.actual, shownLevel) || DBObject.actual == DBObject.edited){
      console.log("EROOOOOOOOOOOR");
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
      setObjectManagerMode(ObjectManagerMode.NEW_ENTRY);
    }
  }

  const setNextDBObject = () => {
    console.log("EROOOOOOOOOOOR");
    setDBObject(prevState => {
      return { ...prevState, actual: prevState.toSet, edited: prevState.toSet, toSet: null };
    });
    setSaveDialogVisible(false);
  }

  const headerItems: Array<any> = getTableHeaderItems(breadcrumbItems.length);
  const bodyRows: Array<any> = getTableRows(breadcrumbItems.length, yearEntries, albumEntries, photoEntries, itemClickedHandler, deleteItemHandler, changeItemHandler, DBObject);

  const [objectManagerVisible, setObjectManagerVisible] = useState(false)

  const showObjectManager = (setEmptyObject?) => {
    if(setEmptyObject){
      console.log("EROOOOOOOOOOOR");
      setDBObject(prevState => {
        return { ...prevState, actual: getEmptyDBObject(shownLevel), edited: getEmptyDBObject(shownLevel) }
      });
    }
    console.log('DBObject: ', DBObject);
    setObjectManagerVisible(true)
  }

  const hideObjectManager = () => {
    console.log("EROOOOOOOOOOOR");
    setObjectManagerVisible(false);
    setDBObject(prevState => {
      return { ...prevState, actual: null }
    });
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
          <ObjectManager setErrorMsg={setErrorMsg} mode={objectManagerMode} hideObjectManager={hideObjectManager} headerItems={headerItems} shownLevel={shownLevel} DBObject={DBObject} setDBObject={setDBObject} />}
          <AppTable headerItems={headerItems} bodyRows={bodyRows} />
          {saveDialogVisible && 
          <SaveDialog onSave={null} onDontSave={setNextDBObject} onCancel={() => { setSaveDialogVisible(false) }} />}
          {(errorMsg && errorMsg.length) && <ErrorDialog msg={errorMsg} onOk={() => { setErrorMsg("") }} />}
        </div>
      </main>
    </div>
  )
}


const getTableHeaderItems = (index) => {
  const getYears = () => {
    let years = [];
    let actualYear = new Date().getFullYear();
    for (let i = 0; i < 10; i++) {
      years.push((actualYear - i) + "/" + (actualYear + 1 - i));
    }
    return years;
  }
  if (index == 0) { // Years...
    return [
      { content: "Školní rok", editable: true, type: ComponentTypes.SELECTBOX, values: getYears(), id: "school-year", objectParamName: "year" },
      { content: "Heslo", editable: true, editableInEditMode: true, type: ComponentTypes.INPUT, inputType: "password", id: "school-year-pwd", objectParamName: "password" },
      { content: "Akce" },
    ]
  } else if (index == 1) { // Albums
    return [
      { content: "ID" },
      { content: "Datum", editable: true, type: ComponentTypes.INPUT, inputType: "date" },
      { content: "URL", editable: true, type: ComponentTypes.INPUT, inputType: "text" },
      { content: "Název", editable: true, type: ComponentTypes.INPUT, inputType: "text" },
      { content: "Akce" },
    ]
  } else if (index == 2) { // Photos
    return [
      { content: "ID" },
      { content: "URL", editable: true, type: ComponentTypes.INPUT, inputType: "text" },
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
          { className: "actions", content: (<><span className={"link-danger"} onClick={deleteItemHandler.bind(this, entry)}>Smazat</span><span className={"link"} onClick={changeItemHandler.bind(this, entry)}>Přejmenovat</span></>) }
        ],
        selected: JSON.stringify(DBObject.actual) == JSON.stringify(entry)
      })
    })

  } else if (index == 2) { // Photos
    return photoEntries.map((entry, index) => {
      console.log('entryentry: ', albumEntries[0]);
      return ({
        items: [
          { content: entry.id },
          { content: (<a href={"/api/getPhoto?file=" + albumEntries[0].title + "/" + entry.filename} target="_blank" rel="noreferrer">{entry.filename}</a>), className: "link" },
          // eslint-disable-next-line @next/next/no-img-element
          { content: <a href={"/api/getPhoto?file=" + albumEntries[0].title + "/" + entry.filename} target="_blank" rel="noreferrer"><img className={classes.imgPreview} src={"/api/getPhoto?file=" + albumEntries[0].title + "/" + entry.filename + "&minify"} alt="Náhled obrázku" /></a> },
          { className: "actions", content: (<><span className={"link-danger"} onClick={deleteItemHandler.bind(this, entry)}>Smazat</span><span className={"link"} onClick={changeItemHandler.bind(this, entry)}>Přejmenovat</span></>) }
        ],
        selected: JSON.stringify(DBObject.actual) == JSON.stringify(entry)
      })
    })

  }
}

const getEmptyDBObject = (level: ShownLevel) =>{
  switch (level) {
    case ShownLevel.YEARS:
      return {year: "", password: ""}
    default:
      break;
  }
}

const isEmptyObject = (dbObject: any, level: ShownLevel) =>{
  return (dbObject == null || JSON.stringify(dbObject) == JSON.stringify(getEmptyDBObject(level)));
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


const ObjectManager = (props) => {
  /*
    const initFileName = "Název souboru";
    const [fileName, setFileName] = useState(initFileName);
    const [urlName, setUrlName] = useState("");
    const [fileLabel, setFileLabel] = useState("Vyberte soubor")
    const [file, setFile] = useState(null);
  
    const fileChange = (event) => {
      if (event?.target?.files[0]?.name?.length) {
        const f = event.target.files[0];
        setFile(f);
        setUrlName(f.name);
        setFileLabel("Vybráno: " + f.name);
        if (fileName === initFileName || fileName === "") {
          setFileName(f.name);
        }
      }
    }
    
    const fileNameChanged = (e) => {
      setFileName(e.target.value);
    }
  
    const clearFileName = (e) => {
      if (fileName === initFileName) {
        setFileName("");
      }
    }
    */


  const formSubmitted = async (event) => {
    event.preventDefault();
    let level = props.shownLevel;
    let url = "";

    let body = {};
    if (level == ShownLevel.YEARS) {
      url = "years";
      body["year"] = (document.getElementById("school-year") as HTMLInputElement).value;
      body["pwd"] = (document.getElementById("school-year-pwd") as HTMLSelectElement).value;
    } else if (level == ShownLevel.ALBUMS) {
      url = "albums";
    } else if (level == ShownLevel.PHOTOS) {
      url = "photos";
    } else {
      return;
    }
    
    const method = (props.mode == ObjectManagerMode.EDITING_ENTRY) ? "PATCH" : "POST";
    const response = await fetch("/api/admin/" + url,
      {
        method,
        mode: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      })

    if (response.status == 200) {
      window.location.reload();
    }else{
      let text = "";
      try {
        text = await response.text();
        if(text.includes("UNIQUE constraint failed")){
          props.setErrorMsg("Daný rok již existuje!")
        }
      } catch (error) {
        
      }
    }
  };

  const updateDBObject = (objectParamName, e) => {
    props.setDBObject(prevState => {
      console.log('prevState: ', prevState.actual);
      let nextState = { ...prevState };
      console.log('nextState10: ', nextState.actual);
      let objectType = "edited";
      if(props.mode == ObjectManagerMode.EDITING_ENTRY){
        objectType = "edited";
      }
      console.log('nextState1: ', nextState.actual);
      nextState["edited"][objectParamName] = e.target.value;
      console.log('nextState: ', nextState.actual);
      return nextState;
    })
  }

  let level = props.shownLevel;
  return (
    <div>
      <form className="d-flex flex-column bordered p-2 mb-3" onSubmit={formSubmitted}>
        {props.headerItems.map(((item, i) => {
          if (item.editable) {
            if (item.type == ComponentTypes.INPUT) {
              return (
                <div key={"input-" + i}>
                  <div className="d-flex justify-content-center">
                    <input type={item.inputType ? item.inputType : "text"} id={item.id ? item.id : ""} className={classes.fileName} placeholder={item.content} value={(props.DBObject.actual && item.objectParamName)? props.DBObject.actual[item.objectParamName] : ""} onChange={updateDBObject.bind(this, item.objectParamName) }/>
                  </div>
                </div>
              );
            } else if (item.type == ComponentTypes.SELECTBOX) {
              if(props.mode == ObjectManagerMode.EDITING_ENTRY){
                return (
                  <select key={"selectbox-" + i} id={item.id ? item.id : ""} value={(item.objectParamName)? props.DBObject.actual[item.objectParamName] : item.values[0]} disabled={!item.editableInEditMode} onChange={updateDBObject.bind(this, item.objectParamName)}>
                    {item.values.map((val, j) => {
                      return <option key={"selectbox-" + i + "-option-" + j} value={val}>{val}</option>
                    })}
                  </select>
                );
              }else{
                return (
                  <select key={"selectbox-" + i} id={item.id ? item.id : ""}>
                    {item.values.map((val, j) => {
                      return <option key={"selectbox-" + i + "-option-" + j} value={val}>{val}</option>
                    })}
                  </select>
                );
              }
            } else {
              return (
                <div key={"component-" + i}>

                </div>
              );
            }
          }
        }))}

        <div className="d-flex justify-content-center">
          <input className="button" type="submit" value="Uložit" />
          <input className="button button-danger" onClick={props.hideObjectManager} type="button" value="Zrušit" />
        </div>
      </form>
    </div>
  )
}
//"řetězec".normalize("NFD").replace(/[\u0300-\u036f]/g, "").replaceAll(" ", "-").toLowerCase() diakritika...


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
