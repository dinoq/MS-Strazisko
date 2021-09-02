// eslint-disable-next-line
import classes from "./year.module.scss";
import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { withIronSession } from "next-iron-session";

const AlbumDetail: React.FC<{ logged: boolean }> = (props) => {
  const router = useRouter();
  const { year } = router.query;

  return (
    <>
      <div className="container-fluid">
        <div className={" row my-4 justify-content-center align-items-center"}>
          <div className="col-11 col-md-10">ssssssssssssssss
          </div>
        </div>
      </div>
    </>
  );
};

export default AlbumDetail;
