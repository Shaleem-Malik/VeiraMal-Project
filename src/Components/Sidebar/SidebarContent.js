import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadNhtFile } from "Store/Actions/nhtActions";
import { uploadHeadcountFile } from "Store/Actions/headcountActions";
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
    if (!files.headcount || !files.nht || !files.terms) {
      setError("Please upload all three files before proceeding.");
      return;
    }

    const formData = new FormData();
    formData.append("headcount", files.headcount);
    formData.append("nht", files.nht);
    formData.append("terms", files.terms);

    console.log("Uploading files:", files);
    dispatch(uploadHeadcountFile(files.headcount));
    dispatch(uploadNhtFile(files.nht));
    dispatch(uploadTermsFile(files.terms));

    // axios.post("/api/upload", formData)
    setOpen(false);
    setFiles({ headcount: null, nht: null, terms: null });
  };

  const allFilesSelected = files.headcount && files.nht && files.terms;

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

      {/* Upload Button */}
      <Button
        variant="contained"
        color="primary"
        style={{
          margin: "20px auto",
          display: "block",
          width: "85%",
          borderRadius: "10px",
          fontWeight: "600",
        }}
        onClick={() => setOpen(true)}
      >
        Upload Excel
      </Button>

      {/* Upload Modal */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
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
                >
                  {files[type]
                    ? files[type].name
                    : `Choose ${type.charAt(0).toUpperCase() + type.slice(1)} File`}
                </Button>
              </label>
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
            onClick={() => setOpen(false)}
            color="secondary"
            variant="outlined"
            style={{ borderRadius: "8px" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            color="primary"
            variant="contained"
            disabled={!allFilesSelected}
            style={{
              borderRadius: "8px",
              fontWeight: "600",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default withRouter(SidebarContent);
