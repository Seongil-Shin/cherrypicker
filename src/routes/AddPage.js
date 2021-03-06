import {
   Button,
   Container,
   FormControl,
   FormHelperText,
   IconButton,
   InputLabel,
   makeStyles,
   OutlinedInput,
   Snackbar,
} from "@material-ui/core";
import React, { useState } from "react";
import CloseIcon from "@material-ui/icons/Close";
import clsx from "clsx";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const useStyles = makeStyles((theme) => ({
   paper: {
      padding: theme.spacing(2),
      display: "flex",
      overflow: "auto",
      flexDirection: "column",
   },

   margin: {
      margin: theme.spacing(1),
   },
   content: {
      flexGrow: 1,
      height: "100vh",
      overflow: "auto",
   },
   field: {
      margin: "10px 0px",
   },
   textField: {
      width: "100%",
      margin: "10px 0px",
   },
   container: {
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(4),
   },
   submit: {
      width: "100px",
   },
   loading: {
      position: "absolute",
      top: "47%",
      left: "47%",
   },
   error: {
      color: "red",
   },
   appBarSpacer: theme.mixins.toolbar,
}));

function AddPage({ uid }) {
   const classes = useStyles();
   const [info, setInfo] = useState({
      name: "",
      url: "",
   });
   const [wrong, setWrong] = useState({
      url: false,
   });
   const [openSnackbar, setSnack] = useState(false);

   const onSubmit = async () => {
      if (info.name && info.name.length >= 4) {
         setWrong((prev) => ({ ...prev, name: false }));
         if (
            info.url.match(
               /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/
            )
         ) {
            setWrong((prev) => ({ ...prev, url: false }));
            const uuid = uuidv4();
            setSnack(true);
            setInfo({ name: "", url: "" });
            await axios.post(
               "https://us-central1-cherrypicker-6c0fa.cloudfunctions.net/crawl",
               {
                  uid: uid,
                  uuid: uuid,
                  name: info.name,
                  url: info.url,
               }
            ); /*
               .then(async (res) => {
                  //?????? ????????? ???????????? ?????????
                  const updateObj = {};
                  const curTime = Date.now();
                  updateObj[`${uuid}`] = {
                     uid: uid,
                     createdAt: curTime,
                     name: info.name,
                     url: info.url,
                     id: uuid,
                  };
                  await fbStore
                     .collection("schedule")
                     .doc(`${Round5Minutes(curTime)}`)
                     .update(updateObj);
                  await fbStore.collection(`${uid}`).doc(`${uuid}`).set({
                     url: info.url,
                     name: info.name,
                     createdAt: Date.now(),
                  });
               })
               .catch((err) => {
                  console.log(err);
               });*/
         } else {
            setWrong((prev) => ({ ...prev, url: true }));
         }
      } else {
         setWrong((prev) => ({ ...prev, name: true }));
      }
   };
   return (
      <>
         <main className={classes.content}>
            <div className={classes.appBarSpacer} />

            <Container maxWidth="lg" className={classes.container}>
               <h1>????????? ??????</h1>
               <div className={classes.field}>
                  1. ????????? ???????????????.
                  <br />
                  <FormControl
                     className={clsx(classes.margin, classes.textField)}
                     variant="outlined"
                  >
                     <InputLabel htmlFor="name">??????</InputLabel>
                     <OutlinedInput
                        id="name"
                        type="text"
                        value={info.name}
                        onChange={(e) =>
                           setInfo((prev) => ({
                              ...prev,
                              name: e.target.value,
                           }))
                        }
                        labelWidth={30}
                     />
                     <FormHelperText id="name-helper-text">
                        ????????? ??????, ??? ???????????? ?????? ???????????????.
                     </FormHelperText>
                  </FormControl>
                  {wrong.name && (
                     <div className={classes.error}>
                        ?????? 4?????? ????????? ????????? ??????????????????.
                     </div>
                  )}
               </div>
               <div className={classes.field}>
                  2. ???????????? ?????? ????????? ????????? ???????????????.
                  <br />
                  <FormControl
                     className={clsx(classes.margin, classes.textField)}
                     variant="outlined"
                  >
                     <InputLabel htmlFor="url">??????</InputLabel>
                     <OutlinedInput
                        id="url"
                        type="text"
                        value={info.url}
                        onChange={(e) =>
                           setInfo((prev) => ({ ...prev, url: e.target.value }))
                        }
                        labelWidth={30}
                     />
                     <FormHelperText id="url-helper-text">
                        https:// ?????? http:// ???????????? ????????????????????????.
                     </FormHelperText>
                  </FormControl>
                  {wrong.url && (
                     <div className={classes.error}>
                        url ????????? ???????????????. ??????????????? ????????? ????????????
                        ?????????.
                     </div>
                  )}
               </div>
               <Button
                  color="primary"
                  className={classes.submit}
                  variant="contained"
                  onClick={onSubmit}
                  disableElevation
               >
                  ??????
               </Button>
            </Container>
            <Snackbar
               anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
               }}
               open={openSnackbar}
               autoHideDuration={10000}
               onClose={() => setSnack(false)}
               message="????????? ??? ????????? ?????? 30??? ????????????."
               action={
                  <React.Fragment>
                     <IconButton
                        size="small"
                        aria-label="close"
                        color="inherit"
                        onClick={() => setSnack(false)}
                     >
                        <CloseIcon fontSize="small" />
                     </IconButton>
                  </React.Fragment>
               }
            />
         </main>
      </>
   );
}
export default AddPage;
