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
  const { sidebarMenus } = sidebar || {};

  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState({
    headcount: null,
    nht: null,
    terms: null,
  });
  const [error, setError] = useState("");

  // Get upload progress & uploading state from Redux
  const headcountProgress = useSelector((state) => state.headcount.uploadProgress);
  const nhtProgress = useSelector((state) => state.nht.uploadProgress);
  const termsProgress = useSelector((state) => state.terms.uploadProgress);

  const headcountUploading = useSelector((state) => state.headcount.uploading);
  const nhtUploading = useSelector((state) => state.nht.uploading);
  const termsUploading = useSelector((state) => state.terms.uploading);

  // -------------------------
  // Role helpers & filtering
  // -------------------------
  const normalizeRole = (r) => {
    if (!r && r !== 0) return "";
    return String(r).toLowerCase().replace(/[^a-z0-9]/g, "");
  };

  const getUserRoles = () => {
    const raw = localStorage.getItem("access") || "";
    if (!raw) return [];
    return raw
      .split(",")
      .map((s) => normalizeRole(s))
      .filter(Boolean);
  };

  const isMenuVisibleForRoles = (menuItem, userRoles) => {
    if (!menuItem) return false;
    if (!Array.isArray(menuItem.roles) || menuItem.roles.length === 0) return true;
    const allowed = menuItem.roles.map((r) => normalizeRole(r));
    return allowed.some((a) => userRoles.includes(a));
  };

  const userRoles = getUserRoles();

  // defensive: if sidebarMenus or category1 missing, render nothing for menus
  const rawCategory1 = (sidebarMenus && sidebarMenus.category1) ? sidebarMenus.category1 : [];

  // Filter child routes by user roles, drop menus that become empty
  // NOTE: we intentionally create filtered copies for rendering only — the reducer still works with the original objects stored in Redux.
  const filteredCategory1 = rawCategory1
    .map((menu) => {
      if (!menu.child_routes || !Array.isArray(menu.child_routes)) return menu;
      const filteredChildren = menu.child_routes.filter((child) =>
        isMenuVisibleForRoles(child, userRoles)
      );
      return { ...menu, child_routes: filteredChildren };
    })
    .filter((menu) => {
      if (menu.child_routes && Array.isArray(menu.child_routes)) {
        return menu.child_routes.length > 0;
      }
      return true;
    });

  // -------------------------
  // toggleMenu: dispatch original reference from Redux state
  // -------------------------
  const toggleMenu = (displayMenu, stateCategory) => {
    // Find the original menu object reference in Redux state's sidebarMenus for the given category.
    // We use menu_title as a stable key — change to a different unique key if you have one.
    let originalMenu = null;
    const bucket = (sidebarMenus && sidebarMenus[stateCategory]) || [];
    for (let i = 0; i < bucket.length; i++) {
      const m = bucket[i];
      if (!m) continue;
      // match by menu_title (fallback to path if available)
      if (m.menu_title && displayMenu.menu_title && m.menu_title === displayMenu.menu_title) {
        originalMenu = m;
        break;
      }
      // if top-level link without menu_title, try match by path
      if (m.path && displayMenu.path && m.path === displayMenu.path) {
        originalMenu = m;
        break;
      }
    }

    // If we didn't find it by key (edge cases), fallback to finding by index position
    if (!originalMenu && typeof displayMenu === "object") {
      const idx = bucket.findIndex((m) => {
        // best-effort: compare serialized titles/paths
        return (m?.menu_title === displayMenu?.menu_title) || (m?.path === displayMenu?.path);
      });
      if (idx >= 0) originalMenu = bucket[idx];
    }

    // If still not found, fallback to using the displayMenu (this is last-resort and may break reducer expectations)
    const menuToDispatch = originalMenu || displayMenu;

    dispatch(onToggleMenu({ menu: menuToDispatch, stateCategory }));
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

    // Track uploaded types in LocalStorage
    const uploadedTypes = [];
    if (files.headcount) uploadedTypes.push("headcount");
    if (files.nht) uploadedTypes.push("nht");
    if (files.terms) uploadedTypes.push("terms");
    localStorage.setItem("uploadedFiles", JSON.stringify(uploadedTypes));

    // Notify dashboard
    const event = new CustomEvent("filesUploaded", { detail: uploadedTypes });
    window.dispatchEvent(event);
  };

  // If any of them is true → overall uploading is true
  const isUploading = headcountUploading || nhtUploading || termsUploading;

  // Calculate overall progress
  const calculateOverallProgress = () => {
    let total = 0;
    let count = 0;

    if (files.headcount) {
      total += headcountProgress || 0;
      count++;
    }

    if (files.nht) {
      total += nhtProgress || 0;
      count++;
    }

    if (files.terms) {
      total += termsProgress || 0;
      count++;
    }

    return count > 0 ? Math.round(total / count) : 0;
  };

  const overallProgress = calculateOverallProgress();

  // Check if all uploads are complete
  const allUploadsComplete = () => {
    return (
      (!files.headcount || !headcountUploading) &&
      (!files.nht || !nhtUploading) &&
      (!files.terms || !termsUploading)
    );
  };

  const handleClose = () => {
    if (!isUploading) {
      setOpen(false);
      setFiles({ headcount: null, nht: null, terms: null });
    }
  };

  const showUploadButton = userRoles.includes("superuser");

  return (
    <div className="rct-sidebar-nav">
      <nav className="navigation">
        {filteredCategory1 && filteredCategory1.length > 0 && (
          <List
            className="rct-mainMenu p-0 m-0 list-unstyled"
            subheader={
              <ListSubheader className="side-title" component="li">
                <IntlMessages id="sidebar.general" />
              </ListSubheader>
            }
          >
            {filteredCategory1.map((menu, key) => (
              <NavMenuItem
                menu={menu} // render the filtered copy
                key={key}
                onToggleMenu={() => toggleMenu(menu, "category1")} // dispatch original reference
              />
            ))}
          </List>
        )}
      </nav>

      {/* Upload Button */}
      {showUploadButton && (
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

      {/* Upload Modal (unchanged) */}
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
          <Typography variant="body2" color="textSecondary" align="center" gutterBottom>
            Please upload the latest Excel files for analysis.
          </Typography>

          {["headcount", "nht", "terms"].map((type, index) => (
            <Box key={type} mt={index === 0 ? 2 : 3}>
              <Typography variant="subtitle2" style={{ fontWeight: 600, marginBottom: "6px" }}>
                {type.charAt(0).toUpperCase() + type.slice(1)} File
              </Typography>
              <input
                accept=".xlsx,.xls"
                style={{ display: "none" }}
                id={`${type}-file`}
                type="file"
                onChange={(e) => handleFileChange(e, type)}
                disabled={isUploading && files[type]}
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
                  disabled={isUploading && files[type]}
                >
                  {files[type] ? files[type].name : `Choose ${type.charAt(0).toUpperCase() + type.slice(1)} File`}
                </Button>
              </label>

              {files[type] && (
                <Box mt={1}>
                  {type === "headcount" && headcountUploading && (
                    <Box>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="caption">Uploading...</Typography>
                        <Typography variant="caption">{headcountProgress}%</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={headcountProgress} />
                    </Box>
                  )}
                  {type === "nht" && nhtUploading && (
                    <Box>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="caption">Uploading...</Typography>
                        <Typography variant="caption">{nhtProgress}%</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={nhtProgress} />
                    </Box>
                  )}
                  {type === "terms" && termsUploading && (
                    <Box>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="caption">Uploading...</Typography>
                        <Typography variant="caption">{termsProgress}%</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={termsProgress} />
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          ))}

          {error && (
            <Typography color="error" variant="body2" style={{ marginTop: "16px", fontWeight: 500 }} align="center">
              {error}
            </Typography>
          )}
        </DialogContent>
        <DialogActions style={{ padding: "16px 24px" }}>
          <Button onClick={handleClose} color="secondary" variant="outlined" style={{ borderRadius: "8px" }} disabled={isUploading}>
            {allUploadsComplete() ? "Close" : "Cancel"}
          </Button>
          <Button onClick={handleUpload} color="primary" variant="contained" disabled={(!files.headcount && !files.nht && !files.terms) || isUploading} style={{ borderRadius: "8px", fontWeight: "600", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default withRouter(SidebarContent);
