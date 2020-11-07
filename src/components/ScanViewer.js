import React from "react";
// import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
// import Slide from "@material-ui/core/Slide";
// import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { CSSTransition } from "react-transition-group";

import DisplayImage from "./DisplayImage";
// import WaitingScreen from "./WaitingScreen";
// import {
//   // discoverManga,
//   // pingMangaDict,
//   // previousImage,
//   // nextImage,
//   KEY_LAST_CHAPTER,
// } from "../probe";

function previousImage(mangaURL, idxChapter, idxImage, mangaDict) {
  // console.log(mangaURL, idxChapter, idxImage, mangaDict);
  const chapters = mangaDict[mangaURL].chapters;
  // const idxImageMax = chapters[idxChapter];
  // console.log("idxImageMax", idxImageMax);
  if (0 < idxImage) {
    // Go to the previous image
    return [idxChapter, idxImage - 1];
  } else if (0 === idxImage) {
    const aChapters = Object.keys(chapters).sort();
    const idxInTabChapter = aChapters.indexOf(idxChapter);
    // const idxInTabChapterMax = aChapters.length - 1;
    if (0 < idxInTabChapter) {
      // Go to the next chapter
      const idxPreviousChapter = aChapters[idxInTabChapter - 1];
      console.log("idxPreviousChapter", idxPreviousChapter);
      const idxImageMax = chapters[idxPreviousChapter] - 1;
      return [idxPreviousChapter, idxImageMax];
    } else {
      // No more scan
      console.info("Previous: no more scan");
      return null;
    }
  }
}

function nextImage(mangaURL, idxChapter, idxImage, mangaDict) {
  // console.log(mangaURL, idxChapter, idxImage, mangaDict);
  const chapters = mangaDict[mangaURL].chapters;
  const idxImageMax = chapters[idxChapter] - 1;
  // console.log("idxImage", idxImage);
  // console.log("idxImageMax", idxImageMax);
  if (idxImage < idxImageMax) {
    // Go to the next image
    return [idxChapter, idxImage + 1];
  } else if (idxImage === idxImageMax) {
    const aChapters = Object.keys(chapters).sort();
    const idxInTabChapter = aChapters.indexOf(idxChapter);
    const idxInTabChapterMax = aChapters.length - 1;
    if (idxInTabChapter < idxInTabChapterMax) {
      // Go to the next chapter
      const idxNextChapter = aChapters[idxInTabChapter + 1];
      return [idxNextChapter, 0];
    } else {
      // No more scan
      console.info("Next: no more scan");
      return null;
    }
  }
}

class ScanViewer extends React.Component {
  initState = {
    idxChapter: null,
    idxImage: 0,
    // displayedImage: false,
    // offsetX: 0,
    errorMsg: "",
    // action: "",
    // in: false,
  };
  state = {
    mangaURL: "",
    initIdxChapter: 0,
    ...this.initState,
  };

  mayUpdateMangaURL = () => {
    if (this.state.mangaURL !== this.props.mangaURL) {
      this.setState({
        mangaURL: this.props.mangaURL,
        ...this.initState,
      });
      // discoverManga(this.props.mangaURL, this.updateIdxLastChapter);
    } else if (this.state.initIdxChapter !== this.props.idxChapter) {
      this.setState({
        ...this.initState,
        mangaURL: this.props.mangaURL,
        initIdxChapter: this.props.idxChapter,
        idxChapter: this.props.idxChapter,
        idxImage: 0,
      });
    }
  };

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown);
    this.mayUpdateMangaURL();
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  handleKeyDown = (evt) => {
    const { mangaURL, idxChapter, idxImage } = this.state;
    // let action;
    let followingImageFct;
    if (evt.key === "ArrowLeft") {
      // action = "PREVIOUS";
      followingImageFct = previousImage;
    } else if (evt.key === "ArrowRight") {
      // action = "NEXT";
      followingImageFct = nextImage;
    }

    if (followingImageFct) {
      // console.log("followingImage", followingImage);
      const res = followingImageFct(
        mangaURL,
        idxChapter,
        idxImage,
        this.props.mangaDict
      );
      if (res) {
        const [idxChapter, idxImage] = res;
        this.setState({ idxChapter, idxImage });
      }
    }
    // }
  };

  componentDidUpdate = () => {
    this.mayUpdateMangaURL();
    // const { offsetX } = this.state;
    // console.log({ offsetX });
    // if (offsetX === null) {
    // const { mangaURL, idxChapter, idxImage } = this.state;
    // console.log("componentDidUpdate", { mangaURL, idxChapter, idxImage });
    // probeImage(
    //   "probe-current",
    //   { mangaURL, idxChapter, idxImage },
    //   this.setOffsetX
    // );
    // console.log("this.state", this.state);
    // }
  };

  // moveImage = (previousOrNextImage, errorMsg) => {
  //   const { mangaURL, idxChapter, idxImage } = this.state;
  //   let answer = previousOrNextImage(mangaURL, idxChapter, idxImage);
  //   while (answer === "NOT_READY") {
  //     answer = previousOrNextImage(mangaURL, idxChapter, idxImage);
  //   }
  //   if (answer === "NO_IMAGE") {
  //     this.setState({ errorMsg });
  //   } else if (typeof answer === "object") {
  //     this.setState({
  //       ...answer,
  //       displayedImage: false,
  //       offsetX: 0,
  //       // action: "",
  //     });
  //     window.scrollTo(0, 0);
  //   }
  // };

  // handleOnExited = () => {
  //   this.setState({ offsetX: 0 });
  //   window.scrollTo(0, 0);
  // };

  imageLoaded = () => {
    // this.setState({
    //   displayedImage: true,
    // });
    window.scrollTo(0, 0);
    // console.log("Should scroll");
    // const { mangaURL, idxChapter, idxImage } = this.state;
    // // I - Discover the current and sibling chapter if not done
    // pingMangaDict(mangaURL, idxChapter, idxImage);
    // // II - Probe the next image
    // const nextMangaInfo = nextImage(mangaURL, idxChapter, idxImage);
    // if (typeof nextMangaInfo === "object") {
    //   // console.log("BEFORE nextMangaInfo");
    //   probeImage("probe-next", nextMangaInfo);
    //   // console.log("AFTER  nextMangaInfo");
    // }
    // const previousMangaInfo = previousImage(mangaURL, idxChapter, idxImage);
    // if (typeof previousMangaInfo === "object") {
    //   // console.log("BEFORE previousMangaInfo");
    //   probeImage("probe-previous", previousMangaInfo);
    //   // console.log("AFTER  previousMangaInfo");
    // }
  };

  // updateIdxLastChapter = (mangaURL, dict) => {
  //   const idxLastChapter = dict[KEY_LAST_CHAPTER];
  //   this.setState({ mangaURL, idxChapter: idxLastChapter });
  // };

  // TODO: Show a progress bar over the current chapter
  render() {
    const { mangaURL, idxChapter, idxImage } = this.state;
    // console.log("ScanViewer: state:", this.state);

    // if (mangaURL !== this.props.mangaURL) {
    //   return <WaitingScreen open={true} />;
    // }

    // if (!(mangaURL !== "" && idxChapter !== null && idxImage !== null)) {
    //   // return <WaitingScreen open={true} />;
    //   return null;
    // } else {
    if (mangaURL !== "" && idxChapter !== null && idxImage !== null) {
      // const displayedImageProp = this.state.displayedImage;
      // const offsetXProp = this.state.offsetX;
      // const inProp = this.state.in;
      // console.log("displayedImageProp", displayedImageProp);
      // console.log("in", inProp);

      return (
        <React.Fragment>
          {/* <WaitingScreen open={!displayedImageProp} /> */}
          <Button
            style={{
              // position: "fixed",
              float: "left",
              top: "10px",
              left: "10px",
            }}
            variant="contained"
            color="primary"
          >
            <Link
              style={{ color: "white" }}
              to="/select/manga"
              className="item"
            >
              Select Manga
            </Link>
          </Button>
          <CSSTransition
            in={true}
            appear={true}
            timeout={2000}
            classNames="fade"
          >
            <DisplayImage
              mangaInfo={{ mangaURL, idxChapter, idxImage }}
              imageLoaded={this.imageLoaded}
              // offsetX={offsetXProp}
            />
          </CSSTransition>
        </React.Fragment>
      );
    } else {
      return null;
    }
  }
}

// /**
//  * Allow to get the HTML ref of an image (used to position the image
//  * on the page).
//  *
//  * @param {*} htmlId
//  * @param {*} mangaInfo
//  * @param {*} getRef
//  */
// function probeImage(htmlId, mangaInfo, getRef) {
//   // console.log("probeImage mangaInfo:", mangaInfo);
//   const { mangaURL, idxChapter, idxImage } = mangaInfo;
//   if (mangaURL !== "" && idxChapter !== null && idxImage !== null) {
//     ReactDOM.render(
//       <Box style={{ visibility: "hidden", position: "fixed", top: 0, left: 0 }}>
//         <DisplayImage {...{ mangaInfo, getRef }} />
//       </Box>,
//       document.querySelector("#" + htmlId)
//     );
//   }
// }

export default ScanViewer;
