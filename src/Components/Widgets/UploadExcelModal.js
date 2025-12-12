// File: Components/Widgets/UploadExcelModal.js
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadNhtFile } from "Store/Actions/nhtActions";
import { uploadHeadcountFile } from "Store/Actions/headcountActions";
import { uploadTermsFile } from "Store/Actions/termsActions";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Divider,
  LinearProgress,
  Button,
} from "@material-ui/core";
import { CloudUpload } from "@material-ui/icons";

const UploadExcelModal = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const [files, setFiles] = useState({
    headcount: null,
    nht: null,
    terms: null,
  });
  const [error, setError] = useState("");
  const [uploadStarted, setUploadStarted] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

  // Get upload progress & uploading state from Redux
  const headcountProgress = useSelector((state) => state.headcount.uploadProgress);
  const nhtProgress = useSelector((state) => state.nht.uploadProgress);
  const termsProgress = useSelector((state) => state.terms.uploadProgress);

  const headcountUploading = useSelector((state) => state.headcount.uploading);
  const nhtUploading = useSelector((state) => state.nht.uploading);
  const termsUploading = useSelector((state) => state.terms.uploading);

  // Check if all uploads are complete
  const allUploadsComplete = () => {
    const headcountDone = !files.headcount || (!headcountUploading && headcountProgress === 100);
    const nhtDone = !files.nht || (!nhtUploading && nhtProgress === 100);
    const termsDone = !files.terms || (!termsUploading && termsProgress === 100);
    return headcountDone && nhtDone && termsDone;
  };

  // Effect to handle upload completion
  useEffect(() => {
    if (open && uploadStarted && allUploadsComplete() && (files.headcount || files.nht || files.terms)) {
      // Wait a bit then trigger save prompt
      const timer = setTimeout(() => {
        setUploadComplete(true);
        
        // Track uploaded types in LocalStorage
        const uploadedTypes = [];
        if (files.headcount) uploadedTypes.push("headcount");
        if (files.nht) uploadedTypes.push("nht");
        if (files.terms) uploadedTypes.push("terms");
        localStorage.setItem("uploadedFiles", JSON.stringify(uploadedTypes));

        // Dispatch event to notify parent component (AdminDashboard)
        const event = new CustomEvent("filesUploaded", { detail: uploadedTypes });
        window.dispatchEvent(event);

        // Close modal after showing success message
        setTimeout(() => {
          onClose();
          setUploadStarted(false);
          setUploadComplete(false);
          setFiles({ headcount: null, nht: null, terms: null });
        }, 1500);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [open, uploadStarted, headcountUploading, nhtUploading, termsUploading, 
      headcountProgress, nhtProgress, termsProgress, files, onClose]);

  // Reset upload state when modal opens
  useEffect(() => {
    if (open) {
      setUploadStarted(false);
      setUploadComplete(false);
      setError("");
    }
  }, [open]);

  const handleFileChange = (e, type) => {
    setFiles({
      ...files,
      [type]: e.target.files[0],
    });
    setError("");
  };

  const handleUpload = () => {
    if (!files.headcount && !files.nht && !files.terms) {
      setError("Please upload at least one file before proceeding.");
      return;
    }

    setUploadStarted(true);
    setError("");

    // Dispatch upload actions
    if (files.headcount) dispatch(uploadHeadcountFile(files.headcount));
    if (files.nht) dispatch(uploadNhtFile(files.nht));
    if (files.terms) dispatch(uploadTermsFile(files.terms));
  };

  const isUploading = headcountUploading || nhtUploading || termsUploading;

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

  const handleClose = () => {
    if (!isUploading) {
      onClose();
      setFiles({ headcount: null, nht: null, terms: null });
      setUploadStarted(false);
      setUploadComplete(false);
    }
  };

  return (
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
        {uploadComplete ? "Upload Complete!" : "Upload Excel Files"}
      </DialogTitle>
      <Divider />
      <DialogContent>
        {uploadComplete ? (
          <Box textAlign="center" py={3}>
            <Typography variant="h6" color="primary" gutterBottom>
              ✓ Files uploaded successfully!
            </Typography>
            <Typography variant="body2" color="textSecondary">
              The save analysis prompt will appear shortly...
            </Typography>
          </Box>
        ) : (
          <>
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
                    {!isUploading && uploadStarted && (
                      <Typography variant="caption" color="primary" style={{ fontWeight: 600 }}>
                        {type === "headcount" && headcountProgress === 100 && "✓ Upload complete"}
                        {type === "nht" && nhtProgress === 100 && "✓ Upload complete"}
                        {type === "terms" && termsProgress === 100 && "✓ Upload complete"}
                      </Typography>
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
          </>
        )}
      </DialogContent>
      {!uploadComplete && (
        <DialogActions style={{ padding: "16px 24px" }}>
          <Button onClick={handleClose} color="secondary" variant="outlined" style={{ borderRadius: "8px" }} disabled={isUploading}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpload} 
            color="primary" 
            variant="contained" 
            disabled={(!files.headcount && !files.nht && !files.terms) || isUploading} 
            style={{ borderRadius: "8px", fontWeight: "600", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}
          >
            {isUploading ? `Uploading... ${overallProgress}%` : "Upload Files"}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default UploadExcelModal;