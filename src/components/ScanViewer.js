import React from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { CSSTransition } from "react-transition-group";
import LinearProgress from "@material-ui/core/LinearProgress";

import DisplayImage from "./DisplayImage";

function previousImage(mangaURL, idxChapter, idxImage, mangaDict) {
  const chapters = mangaDict[mangaURL].chapters;
  if (0 < idxImage) {
    // Go to the previous image
    return [idxChapter, idxImage - 1];
  } else if (0 === idxImage) {
    const aChapters = Object.keys(chapters).sort();
    const idxInTabChapter = aChapters.indexOf(idxChapter);
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
  const chapters = mangaDict[mangaURL].chapters;
  const idxImageMax = chapters[idxChapter] - 1;
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
    errorMsg: "",
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
    let followingImageFct;
    if (evt.key === "ArrowLeft") {
      followingImageFct = previousImage;
    } else if (evt.key === "ArrowRight") {
      followingImageFct = nextImage;
    }

    if (followingImageFct) {
      const mangaInfo = followingImageFct(
        mangaURL,
        idxChapter,
        idxImage,
        this.props.mangaDict
      );
      if (mangaInfo) {
        const [idxChapter, idxImage] = mangaInfo;
        this.setState({ idxChapter, idxImage });
      }
    }
  };

  componentDidUpdate = () => {
    this.mayUpdateMangaURL();
  };

  render() {
    const { mangaURL, idxChapter, idxImage } = this.state;

    let progressBarValue = 0;
    if (this.props.mangaDict && this.props.mangaDict[mangaURL]) {
      const nbImage = this.props.mangaDict[mangaURL].chapters[idxChapter];
      progressBarValue = ((idxImage + 1) / nbImage) * 100;
    }

    if (mangaURL !== "" && idxChapter !== null && idxImage !== null) {
      return (
        <React.Fragment>
          <Button
            style={{
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
            timeout={500}
            classNames="fade"
          >
            <DisplayImage mangaInfo={{ mangaURL, idxChapter, idxImage }} />
          </CSSTransition>

          <LinearProgress
            style={{
              position: "fixed",
              bottom: "0px",
              overflow: "inherit",
              height: "0.4em",
              width: "-webkit-fill-available",
              zIndex: 10000,
            }}
            variant="determinate"
            value={progressBarValue}
          />
        </React.Fragment>
      );
    } else {
      return null;
    }
  }
}

export default ScanViewer;
