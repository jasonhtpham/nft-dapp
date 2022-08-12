import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Grid, Typography } from "@mui/material";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import PropTypes from 'prop-types';

export const DragDrop = (props) => {
  const { handleUploadImage, defaultImage } = props;

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: "image/jpeg, image/png",
  });

  const [uploadImageStatus, setUploadImageStatus] = useState(false);
  const [image, setImage] = useState();
  const [_defaultImage, _setDefaultImage] = useState();

  useEffect(() => {
    _setDefaultImage(defaultImage);
  }, [defaultImage]);

  useEffect(() => {
    if (acceptedFiles.length > 0) {
      setUploadImageStatus(true);
      const uploadImageImported = async (data) => {
        setImage(data.map(file => Object.assign(file, {
          preview: URL.createObjectURL(file)
        })));
        setUploadImageStatus(false);
      };
      uploadImageImported(acceptedFiles);
    }
  }, [acceptedFiles]);


  let icon =
    image !== "" ? <img src={image} alt="backgroundImage" style={{ height: "100%", width: "100%" }} />
      : _defaultImage !== "" && _defaultImage !== null && _defaultImage !== undefined ? (
        <img src={_defaultImage} alt="backgroundImage" style={{ height: "100%", width: "100%" }} />
      ) : (
        <CameraAltOutlinedIcon fontSize="large" />
      );

  if (uploadImageStatus) {
    return (
      <Grid container justify="center">
        <Grid item>
          <Typography variant="h5" component="h5">
            Uploading ....
          </Typography>
        </Grid>
      </Grid>
    );
  }
  else {
    image ? handleUploadImage(image[0]) : handleUploadImage(_defaultImage[0]);
    return (
      <Grid
        container
        direction="row"
        className="container"
        justify="center"
        alignItems="center"
        {...getRootProps({ className: "dropzone" })}
        style={{ border: " 1px  dashed #d0d0d0", minHeight: "15vh" }}
      >

        <Grid
          item
          xs={12}
          style={{ textAlign: "center" }}
        >
          <Grid> {icon} </Grid>
          {image ? <Typography style={{ display: "none" }} ></Typography> : <Typography variant="body">Drag n drop some files here, or click to select files</Typography>}
          <input {...getInputProps()} />
        </Grid>
      </Grid>
    );
  }
};

DragDrop.propTypes = {
  handleUploadImage: PropTypes.func.isRequired,
  defaultImage: PropTypes.string,
};