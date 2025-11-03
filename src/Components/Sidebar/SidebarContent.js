import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadNhtFile } from "Store/Actions/nhtActions";
import { uploadHeadcountFile } from "Store/Actions/headcountActions";
// import { CircularProgress } from "@material-ui/core";
import { uploadTermsFile } from "Store/Actions/termsActions";
import {
  List,
  ListSubheader,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Divider,
  LinearProgress,
} from "@material-ui/core";
import { CloudUpload } from "@material-ui/icons";
import { withRouter } from "react-router-dom";
import IntlMessages from "Util/IntlMessages";
import NavMenuItem from "./NavMenuItem";
// redux actions
import { onToggleMenu } from "Store/Actions";

function SidebarContent() {
  const dispatch = useDispatch();
  const sidebar = useSelector((state) => state.sidebar);
  const { sidebarMenus } = sidebar;

  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState({
    headcount: null,
    nht: null,
    terms: null,
  });
  const [error, setError] = useState("");

  // Get upload progress from Redux
  const headcountProgress = useSelector((state) => state.headcount.uploadProgress);
  const nhtProgress = useSelector((state) => state.nht.uploadProgress);
  const termsProgress = useSelector((state) => state.terms.uploadProgress);

  const toggleMenu = (menu, stateCategory) => {
    let data = { menu, stateCategory };
    dispatch(onToggleMenu(data));
  };

  const handleFileChange = (e, type) => {
    setFiles({
      ...files,
      [type]: e.target.files[0],
    });
    setError(""); // clear error on change
  };

  const handleUpload = () => {
    if (!files.headcount && !files.nht && !files.terms) {
      setError("Please upload at least one file before proceeding.");
      return;
    }

    if (files.headcount) dispatch(uploadHeadcountFile(files.headcount));
    if (files.nht) dispatch(uploadNhtFile(files.nht));
    if (files.terms) dispatch(uploadTermsFile(files.terms));

    // Track uploaded types in local storage
    const uploadedTypes = [];
    if (files.headcount) uploadedTypes.push("headcount");
    if (files.nht) uploadedTypes.push("nht");
    if (files.terms) uploadedTypes.push("terms");

    localStorage.setItem("uploadedFiles", JSON.stringify(uploadedTypes));

    // Immediately notify dashboard to update checkboxes without refresh
    const event = new CustomEvent("filesUploaded", { detail: uploadedTypes });
    window.dispatchEvent(event);

    // Don't close the dialog immediately - let the user see the progress
  };

  const headcountUploading = useSelector((state) => state.headcount.uploading);
  const nhtUploading = useSelector((state) => state.nht.uploading);
  const termsUploading = useSelector((state) => state.terms.uploading);

  // If any of them is true → overall uploading is true
  const isUploading = headcountUploading || nhtUploading || termsUploading;
  
  // Calculate overall progress
  const calculateOverallProgress = () => {
    let total = 0;
    let count = 0;
    
    if (files.headcount) {
      total += headcountProgress;
      count++;
    }
    
    if (files.nht) {
      total += nhtProgress;
      count++;
    }
    
    if (files.terms) {
      total += termsProgress;
      count++;
    }
    
    return count > 0 ? Math.round(total / count) : 0;
  };
  
  const overallProgress = calculateOverallProgress();
  
  // Check if all uploads are complete
  const allUploadsComplete = () => {
    // If a file was selected but isn't uploading anymore, it's complete
    return (
      (!files.headcount || !headcountUploading) &&
      (!files.nht || !nhtUploading) &&
      (!files.terms || !termsUploading)
    );
  };

  const handleClose = () => {
    // Only allow closing if not currently uploading
    if (!isUploading) {
      setOpen(false);
      setFiles({ headcount: null, nht: null, terms: null });
    }
  };

  return (
    <div className="rct-sidebar-nav">
      <nav className="navigation">
        {sidebarMenus.category1 && (
          <List
            className="rct-mainMenu p-0 m-0 list-unstyled"
            subheader={
              <ListSubheader className="side-title" component="li">
                <IntlMessages id="sidebar.general" />
              </ListSubheader>
            }
          >
            {sidebarMenus.category1.map((menu, key) => (
              <NavMenuItem
                menu={menu}
                key={key}
                onToggleMenu={() => toggleMenu(menu, "category1")}
              />
            ))}
          </List>
        )}
      </nav>

      {/* Show Upload Button only if fullName is Admin */}
      {localStorage.getItem("access") === "superUser" && (
        <Button
          variant="contained"
          color="primary"
          style={{
            margin: "20px auto",
            display: "block",
            width: "85%",
            borderRadius: "10px",
            fontWeight: "600",
            position: "relative",
            overflow: "hidden",
          }}
          onClick={() => setOpen(true)}
          disabled={isUploading}
        >
          {isUploading ? (
            <Box width="100%" textAlign="center">
              <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                height="100%"
                bgcolor="rgba(0, 0, 0, 0.1)"
              >
                <LinearProgress 
                  variant="determinate" 
                  value={overallProgress} 
                  style={{ height: "100%" }}
                />
              </Box>
              <Box position="relative" zIndex={1}>
                Uploading... {overallProgress}%
              </Box>
            </Box>
          ) : (
            "Upload Excel"
          )}
        </Button>
      )}

      {/* Upload Modal */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          style: { borderRadius: 16, padding: "8px" },
        }}
      >
        <DialogTitle style={{ fontWeight: "700", textAlign: "center" }}>
          Upload Excel Files
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Typography
            variant="body2"
            color="textSecondary"
            align="center"
            gutterBottom
          >
            Please upload the latest Excel files for analysis.
          </Typography>

          {["headcount", "nht", "terms"].map((type, index) => (
            <Box key={type} mt={index === 0 ? 2 : 3}>
              <Typography
                variant="subtitle2"
                style={{ fontWeight: 600, marginBottom: "6px" }}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)} File
              </Typography>
              <input
                accept=".xlsx,.xls"
                style={{ display: "none" }}
                id={`${type}-file`}
                type="file"
                onChange={(e) => handleFileChange(e, type)}
                disabled={isUploading && files[type]} // Disable if uploading this file
              />
              <label htmlFor={`${type}-file`}>
                <Button
                  variant="outlined"
                  color="primary"
                  component="span"
                  fullWidth
                  startIcon={<CloudUpload />}
                  style={{
                    borderRadius: "10px",
                    textTransform: "none",
                    justifyContent: "flex-start",
                    padding: "10px 16px",
                  }}
                  disabled={isUploading && files[type]} // Disable if uploading this file
                >
                  {files[type]
                    ? files[type].name
                    : `Choose ${type.charAt(0).toUpperCase() + type.slice(1)} File`}
                </Button>
              </label>
              
              {/* Show progress bar only for files that are being uploaded */}
              {files[type] && (
                <Box mt={1}>
                  {type === "headcount" && headcountUploading && (
                    <Box>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="caption">Uploading...</Typography>
                        <Typography variant="caption">{headcountProgress}%</Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={headcountProgress} 
                      />
                    </Box>
                  )}
                  {type === "nht" && nhtUploading && (
                    <Box>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="caption">Uploading...</Typography>
                        <Typography variant="caption">{nhtProgress}%</Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={nhtProgress} 
                      />
                    </Box>
                  )}
                  {type === "terms" && termsUploading && (
                    <Box>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="caption">Uploading...</Typography>
                        <Typography variant="caption">{termsProgress}%</Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={termsProgress} 
                      />
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          ))}

          {error && (
            <Typography
              color="error"
              variant="body2"
              style={{ marginTop: "16px", fontWeight: 500 }}
              align="center"
            >
              {error}
            </Typography>
          )}
        </DialogContent>
        <DialogActions style={{ padding: "16px 24px" }}>
          <Button
            onClick={handleClose}
            color="secondary"
            variant="outlined"
            style={{ borderRadius: "8px" }}
            disabled={isUploading} // Disable cancel button while uploading
          >
            {allUploadsComplete() ? "Close" : "Cancel"}
          </Button>
          <Button
            onClick={handleUpload}
            color="primary"
            variant="contained"
            disabled={(!files.headcount && !files.nht && !files.terms) || isUploading}
            style={{
              borderRadius: "8px",
              fontWeight: "600",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default withRouter(SidebarContent);