// LiabilityGraphs.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Typography,
  Paper,
  Grid,
  Chip,
  IconButton,
  Divider,
  InputBase,
} from "@material-ui/core";

import {
  Assessment as AssessmentIcon,
  CloudUpload as CloudUploadIcon,
  AccountBalanceWallet as LiabilityIcon,
  EventAvailable as DaysIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  Search as SearchIcon,
  ArrowForward as ArrowForwardIcon,
  Refresh as RefreshIcon,
} from "@material-ui/icons";

import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import { NotificationManager } from "react-notifications";
import { useHistory } from "react-router-dom";

import { fetchLiabilityTracker } from "../../../Store/Actions/liabilityActions";

// ============================================================
// COLOURS
// ============================================================

const FUNCTION_COLORS = [
  "#5B7CFA",
  "#55C97A",
  "#F6B94A",
  "#F47B61",
  "#8B7CF6",
  "#63C7D8",
  "#E986C8",
  "#7FA6E8",
  "#76C893",
  "#E9A26A",
  "#8094D6",
  "#D78391",
  "#8D96A6",
  "#D28C77",
  "#7159A8",
  "#4C63C2",
  "#D95787",
  "#2FA9BF",
  "#3A9D89",
  "#E38B25",
];

const API_BASE_URL =
  process.env.REACT_APP_BASE_URL || "/api/";

// ============================================================
// STYLES
// ============================================================

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100%",
    padding: theme.spacing(3),
    background: "#F5F7FB",

    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(2),
    },
  },

  topHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: theme.spacing(3),

    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      gap: theme.spacing(2),
    },
  },

  heading: {
    fontSize: "1.9rem",
    fontWeight: 700,
    color: "#172033",
    marginBottom: 5,
  },

  subtitle: {
    color: "#7B8495",
    fontSize: "0.95rem",
  },

  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1.5),

    [theme.breakpoints.down("sm")]: {
      width: "100%",
      flexWrap: "wrap",
    },
  },

  primaryButton: {
    borderRadius: 10,
    textTransform: "none",
    fontWeight: 600,
    padding: theme.spacing(1.1, 2),
    boxShadow: "none",
    minHeight: 42,

    "&:hover": {
      boxShadow: "0 6px 14px rgba(66, 91, 214, 0.18)",
    },
  },

  secondaryButton: {
    borderRadius: 10,
    textTransform: "none",
    fontWeight: 600,
    padding: theme.spacing(1.1, 2),
    minHeight: 42,
    border: "1px solid #E0E5ED",
    color: "#46536A",
    background: "#FFFFFF",

    "&:hover": {
      background: "#F8FAFD",
      borderColor: "#C9D1DD",
    },
  },

  statCard: {
    height: "100%",
    borderRadius: 16,
    padding: theme.spacing(2.2),
    border: "1px solid #E7EBF2",
    boxShadow: "0 4px 14px rgba(34, 48, 73, 0.045)",
    background: "#FFFFFF",
  },

  statHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#EFF4FF",
    color: "#5273E8",
  },

  statLabel: {
    color: "#7C8698",
    fontSize: "0.83rem",
    fontWeight: 500,
    marginBottom: 4,
  },

  statValue: {
    color: "#172033",
    fontWeight: 700,
    fontSize: "1.65rem",
    lineHeight: 1.2,
  },

  statDescription: {
    color: "#98A1AF",
    fontSize: "0.76rem",
    marginTop: 5,
  },

  chartCard: {
    borderRadius: 16,
    border: "1px solid #E7EBF2",
    boxShadow: "0 4px 14px rgba(34, 48, 73, 0.045)",
    background: "#FFFFFF",
    overflow: "hidden",
  },

  chartCardHeader: {
    padding: theme.spacing(2.2, 2.5),
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: theme.spacing(2),

    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      alignItems: "flex-start",
    },
  },

  chartTitle: {
    fontWeight: 700,
    color: "#20293A",
    fontSize: "1rem",
  },

  chartSubtitle: {
    color: "#8A94A6",
    fontSize: "0.8rem",
    marginTop: 4,
  },

  chartBody: {
    padding: theme.spacing(1, 2.5, 2.5),
  },

  filterCard: {
    marginBottom: theme.spacing(2),
    padding: theme.spacing(1.5),
    borderRadius: 12,
    border: "1px solid #E8ECF2",
    background: "#F9FAFC",
  },

  filterTopRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: theme.spacing(1.5),
    flexWrap: "wrap",
    marginBottom: theme.spacing(1.25),
  },

  filterTitle: {
    fontSize: "0.83rem",
    color: "#667085",
    fontWeight: 600,
  },

  filterActions: {
    display: "flex",
    gap: theme.spacing(1),
    alignItems: "center",
  },

  smallButton: {
    borderRadius: 7,
    textTransform: "none",
    fontSize: "0.76rem",
    fontWeight: 600,
    minWidth: "auto",
    padding: theme.spacing(0.55, 1.1),
  },

  searchBox: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    maxWidth: 320,
    height: 38,
    border: "1px solid #E0E5ED",
    background: "#FFFFFF",
    borderRadius: 8,
    padding: "0 10px",
    marginBottom: theme.spacing(1.25),
  },

  searchIcon: {
    color: "#98A2B3",
    marginRight: 7,
    fontSize: 19,
  },

  searchInput: {
    flex: 1,
    fontSize: "0.82rem",
    color: "#344054",

    "& input::placeholder": {
      color: "#98A2B3",
      opacity: 1,
    },
  },

  checkboxGroup: {
    display: "flex",
    flexWrap: "wrap",
    gap: 7,
    maxHeight: 110,
    overflowY: "auto",
    padding: 3,
  },

  functionChip: {
    cursor: "pointer",
    fontSize: "0.72rem",
    height: 30,
    borderRadius: 7,
    background: "#FFFFFF",
    border: "1px solid #E3E7EE",
    color: "#566174",

    "&:hover": {
      background: "#F4F7FB",
    },
  },

  selectedFunctionChip: {
    background: "#EEF3FF",
    border: "1px solid #C9D6FF",
    color: "#4664D6",
    fontWeight: 600,

    "&:hover": {
      background: "#E7EDFF",
    },
  },

  emptyState: {
    minHeight: 280,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "#8B95A5",
  },

  emptyIcon: {
    fontSize: 45,
    color: "#D4DAE3",
    marginBottom: theme.spacing(1),
  },

  legendContainer: {
    marginTop: theme.spacing(1.5),
    paddingTop: theme.spacing(1.5),
    borderTop: "1px solid #EEF1F5",
  },

  legendItems: {
    display: "flex",
    flexWrap: "wrap",
    gap: theme.spacing(1.5),
  },

  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    color: "#667085",
    fontSize: "0.75rem",
  },

  colorSwatch: {
    width: 10,
    height: 10,
    borderRadius: 3,
  },

  refreshButton: {
    width: 34,
    height: 34,
    border: "1px solid #E2E6ED",
    background: "#FFFFFF",
    color: "#667085",

    "&:hover": {
      background: "#F6F8FB",
    },
  },

  modalText: {
    color: "#667085",
    fontSize: "0.88rem",
    lineHeight: 1.6,
    marginBottom: theme.spacing(2),
  },

  uploadField: {
    marginBottom: theme.spacing(2),

    "& label": {
      display: "block",
      fontWeight: 600,
      fontSize: "0.84rem",
      color: "#344054",
      marginBottom: 6,
    },

    "& input[type='file']": {
      width: "100%",
      padding: "8px",
      border: "1px solid #E0E5ED",
      borderRadius: 8,
      background: "#FAFBFC",
      fontSize: "0.8rem",
    },
  },

  uploadFileName: {
    display: "block",
    marginTop: 5,
    color: "#7B8495",
    fontSize: "0.74rem",
    wordBreak: "break-all",
  },
}));

// ============================================================
// HELPER FUNCTIONS
// ============================================================

const getFunctionColor = (func) => {
  if (!func) return "#CBD1D9";

  let hash = 0;

  for (let i = 0; i < func.length; i++) {
    hash =
      ((hash << 5) - hash) +
      func.charCodeAt(i);

    hash |= 0;
  }

  const index =
    Math.abs(hash) %
    FUNCTION_COLORS.length;

  return FUNCTION_COLORS[index];
};

const formatDays = (value) =>
  `${Number(value).toLocaleString()} days`;

const formatCurrency = (value) =>
  Number(value).toLocaleString(undefined, {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

// ============================================================
// TOOLTIP
// ============================================================

const CustomTooltip = ({
  active,
  payload,
}) => {
  if (
    active &&
    payload &&
    payload.length
  ) {
    const data =
      payload[0].payload;

    return (
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E2E6ED",
          borderRadius: 10,
          padding: "12px 14px",
          boxShadow:
            "0 8px 24px rgba(25, 39, 63, 0.12)",
          minWidth: 190,
        }}
      >
        <div
          style={{
            fontWeight: 700,
            color: "#20293A",
            marginBottom: 6,
          }}
        >
          {data.name}
        </div>

        <div
          style={{
            fontSize: 12,
            color: "#667085",
            marginBottom: 4,
          }}
        >
          Function:{" "}
          <strong>
            {data.function}
          </strong>
        </div>

        <div
          style={{
            fontSize: 12,
            color: "#667085",
          }}
        >
          Liability:{" "}
          <strong>
            {formatCurrency(
              data.liabilityAmount
            )}
          </strong>
        </div>

        {data.organizationalUnit && (
          <div
            style={{
              fontSize: 12,
              color: "#667085",
              marginTop: 4,
            }}
          >
            Department:{" "}
            <strong>
              {data.organizationalUnit}
            </strong>
          </div>
        )}
      </div>
    );
  }

  return null;
};

const EMPTY_FILES = {
  headcount: null,
  leaveTaken: null,
  sapLeaveBalance: null,
  baseRates: null,
};

async function uploadSingleFile(
  endpoint,
  file
) {
  const formData = new FormData();

  formData.append(
    "file",
    file
  );

  const res = await axios.post(
    `${API_BASE_URL}${endpoint}`,
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  return res.data;
}

// ============================================================
// COMPONENT
// ============================================================

export default function LiabilityGraphs({
  date = null,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const {
    loading,
    data,
    error,
  } = useSelector(
    (state) =>
      state.liabilities || {
        loading: false,
        data: [],
        error: null,
      }
  );

  const [deptSelectedFunctions, setDeptSelectedFunctions] =
    useState([]);

  const [empSelectedFunctions, setEmpSelectedFunctions] =
    useState([]);

  const [functionSearch, setFunctionSearch] =
    useState("");

  const [uploadOpen, setUploadOpen] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [files, setFiles] =
    useState(EMPTY_FILES);

  // ============================================================
  // LOAD DATA
  // ============================================================

  useEffect(() => {
    if (
      !data ||
      data.length === 0
    ) {
      dispatch(
        fetchLiabilityTracker()
      );
    }
  }, [
    dispatch,
    date,
    data,
  ]);

  useEffect(() => {
    if (error) {
      NotificationManager.error(
        error
      );
    }
  }, [error]);

  // ============================================================
  // FILES
  // ============================================================

  const allFilesAttached =
    useMemo(() => {
      return (
        !!files.headcount &&
        !!files.leaveTaken &&
        !!files.sapLeaveBalance &&
        !!files.baseRates
      );
    }, [files]);

  // ============================================================
  // FUNCTIONS
  // ============================================================

  const allFunctions =
    useMemo(() => {
      if (!Array.isArray(data))
        return [];

      const funcSet =
        new Set();

      data.forEach((item) => {
        if (item.function) {
          funcSet.add(
            item.function
          );
        }
      });

      return Array.from(
        funcSet
      ).sort();
    }, [data]);

  const filteredFunctions =
    useMemo(() => {
      if (
        !functionSearch.trim()
      ) {
        return allFunctions;
      }

      return allFunctions.filter(
        (f) =>
          f
            .toLowerCase()
            .includes(
              functionSearch
                .toLowerCase()
            )
      );
    }, [
      allFunctions,
      functionSearch,
    ]);

  // ============================================================
  // FILTER HANDLERS
  // ============================================================

  const toggleDeptFunction =
    (func) => {
      setDeptSelectedFunctions(
        (prev) =>
          prev.includes(func)
            ? prev.filter(
                (f) =>
                  f !== func
              )
            : [
                ...prev,
                func,
              ]
      );
    };

  const toggleEmpFunction =
    (func) => {
      setEmpSelectedFunctions(
        (prev) =>
          prev.includes(func)
            ? prev.filter(
                (f) =>
                  f !== func
              )
            : [
                ...prev,
                func,
              ]
      );
    };

  const selectAllDept =
    () =>
      setDeptSelectedFunctions(
        [...allFunctions]
      );

  const clearAllDept =
    () =>
      setDeptSelectedFunctions(
        []
      );

  const selectAllEmp =
    () =>
      setEmpSelectedFunctions(
        [...allFunctions]
      );

  const clearAllEmp =
    () =>
      setEmpSelectedFunctions(
        []
      );

  // ============================================================
  // FILTERED DATA
  // ============================================================

  const deptFilteredData =
    useMemo(() => {
      if (
        !Array.isArray(data)
      ) {
        return [];
      }

      if (
        deptSelectedFunctions.length ===
        0
      ) {
        return data;
      }

      return data.filter(
        (item) =>
          deptSelectedFunctions.includes(
            item.function
          )
      );
    }, [
      data,
      deptSelectedFunctions,
    ]);

  const empFilteredData =
    useMemo(() => {
      if (
        !Array.isArray(data)
      ) {
        return [];
      }

      if (
        empSelectedFunctions.length ===
        0
      ) {
        return data;
      }

      return data.filter(
        (item) =>
          empSelectedFunctions.includes(
            item.function
          )
      );
    }, [
      data,
      empSelectedFunctions,
    ]);

  // ============================================================
  // DEPARTMENT DATA
  // ============================================================

  const departmentData =
    useMemo(() => {
      const agg = {};

      deptFilteredData.forEach(
        (item) => {
          const dept =
            item.organizationalUnit ||
            "Unknown";

          const days =
            Number(
              item.balanceDays
            ) || 0;

          agg[dept] =
            (agg[dept] || 0) +
            days;
        }
      );

      return Object.entries(
        agg
      )
        .map(
          ([
            name,
            totalDays,
          ]) => ({
            name,
            totalDays,
          })
        )
        .sort(
          (a, b) =>
            b.totalDays -
            a.totalDays
        )
        .slice(0, 50);
    }, [
      deptFilteredData,
    ]);

  // ============================================================
  // EMPLOYEE DATA
  // ============================================================

  const employeeData =
    useMemo(() => {
      return [
        ...empFilteredData,
      ]
        .sort(
          (a, b) =>
            (Number(
              b.liabilityAmount
            ) || 0) -
            (Number(
              a.liabilityAmount
            ) || 0)
        )
        .slice(0, 50)
        .map((emp) => ({
          name:
            emp.employeeName ||
            "Unknown",

          liabilityAmount:
            Number(
              emp.liabilityAmount
            ) || 0,

          employeeId:
            emp.employeeId,

          function:
            emp.function ||
            "Unknown",

          organizationalUnit:
            emp.organizationalUnit,
        }));
    }, [
      empFilteredData,
    ]);

  const uniqueFunctionsInChart =
    useMemo(() => {
      const funcs =
        new Set();

      employeeData.forEach(
        (item) => {
          if (
            item.function
          ) {
            funcs.add(
              item.function
            );
          }
        }
      );

      return Array.from(
        funcs
      ).sort();
    }, [
      employeeData,
    ]);

  // ============================================================
  // KPI DATA
  // ============================================================

  const dashboardStats =
    useMemo(() => {
      if (
        !Array.isArray(data)
      ) {
        return {
          employees: 0,
          totalLiability: 0,
          totalDays: 0,
          functions: 0,
        };
      }

      const employees =
        new Set();

      let totalLiability =
        0;

      let totalDays =
        0;

      const functions =
        new Set();

      data.forEach(
        (item) => {
          if (
            item.employeeId !==
            undefined &&
            item.employeeId !==
            null
          ) {
            employees.add(
              item.employeeId
            );
          } else if (
            item.employeeName
          ) {
            employees.add(
              item.employeeName
            );
          }

          totalLiability +=
            Number(
              item.liabilityAmount
            ) || 0;

          totalDays +=
            Number(
              item.balanceDays
            ) || 0;

          if (
            item.function
          ) {
            functions.add(
              item.function
            );
          }
        }
      );

      return {
        employees:
          employees.size,
        totalLiability,
        totalDays,
        functions:
          functions.size,
      };
    }, [data]);

  // ============================================================
  // FILE HANDLERS
  // ============================================================

  const handleFileChange =
    (key) =>
    (e) => {
      setFiles(
        (prev) => ({
          ...prev,
          [key]:
            e.target.files?.[0] ||
            null,
        })
      );
    };

  const resetUploadModal =
    () => {
      setFiles(
        EMPTY_FILES
      );

      setUploading(false);
      setUploadOpen(false);
    };

  const handleUploadAndRecalculate =
    async () => {
      if (
        !allFilesAttached ||
        uploading
      ) {
        return;
      }

      try {
        setUploading(true);

        // 1) Headcount
        await uploadSingleFile(
          "headcount/upload",
          files.headcount
        );

        // 2) Leave Taken
        await uploadSingleFile(
          "leavetaken/upload",
          files.leaveTaken
        );

        // 3) SAP Leave Balance
        await uploadSingleFile(
          "leavebalance/upload",
          files.sapLeaveBalance
        );

        // 4) Base Rates
        await uploadSingleFile(
          "baserates/upload",
          files.baseRates
        );

        // Calculate liabilities
        await axios.post(
          `${API_BASE_URL}liability/calculate`
        );

        NotificationManager.success(
          "Files uploaded successfully and liabilities recalculated."
        );

        await dispatch(
          fetchLiabilityTracker()
        );

        resetUploadModal();
      } catch (err) {
        const msg =
          err?.response?.data ||
          err.message ||
          "Upload failed";

        NotificationManager.error(
          typeof msg ===
            "string"
            ? msg
            : "Upload failed"
        );

        setUploading(false);
      }
    };

  // ============================================================
  // REFRESH
  // ============================================================

  const handleRefresh =
    () => {
      dispatch(
        fetchLiabilityTracker()
      );
    };

  // ============================================================
  // FILTER COMPONENT
  // ============================================================

  const renderFunctionFilter =
    (
      selectedFunctions,
      toggleFunction,
      selectAll,
      clearAll
    ) => (
      <div
        className={
          classes.filterCard
        }
      >
        <div
          className={
            classes.filterTopRow
          }
        >
          <Typography
            className={
              classes.filterTitle
            }
          >
            Filter by Function
          </Typography>

          <div
            className={
              classes.filterActions
            }
          >
            <Button
              size="small"
              variant="outlined"
              className={
                classes.smallButton
              }
              onClick={
                selectAll
              }
            >
              Select All
            </Button>

            <Button
              size="small"
              variant="outlined"
              className={
                classes.smallButton
              }
              onClick={
                clearAll
              }
            >
              Clear All
            </Button>
          </div>
        </div>

        <div
          className={
            classes.searchBox
          }
        >
          <SearchIcon
            className={
              classes.searchIcon
            }
          />

          <InputBase
            className={
              classes.searchInput
            }
            placeholder="Search functions..."
            value={
              functionSearch
            }
            onChange={(e) =>
              setFunctionSearch(
                e.target.value
              )
            }
          />
        </div>

        <div
          className={
            classes.checkboxGroup
          }
        >
          {filteredFunctions.length ===
          0 ? (
            <Typography
              style={{
                color:
                  "#98A2B3",
                fontSize: 12,
                padding: 5,
              }}
            >
              No functions found
            </Typography>
          ) : (
            filteredFunctions.map(
              (func) => {
                const selected =
                  selectedFunctions.includes(
                    func
                  );

                return (
                  <Chip
                    key={func}
                    label={
                      selected
                        ? `✓ ${func}`
                        : func
                    }
                    size="small"
                    className={
                      selected
                        ? `${classes.functionChip} ${classes.selectedFunctionChip}`
                        : classes.functionChip
                    }
                    onClick={() =>
                      toggleFunction(
                        func
                      )
                    }
                  />
                );
              }
            )
          )}
        </div>
      </div>
    );

  // ============================================================
  // RETURN
  // ============================================================

  return (
    <div
      className={classes.root}
    >
      {/* ========================================================
          HEADER
      ======================================================== */}

      <div
        className={
          classes.topHeader
        }
      >
        <div>
          <Typography
            className={
              classes.heading
            }
          >
            Liability Dashboard
          </Typography>

          <Typography
            className={
              classes.subtitle
            }
          >
            Overview of employee liabilities,
            balance days and departmental exposure
          </Typography>
        </div>

        <div
          className={
            classes.headerActions
          }
        >
          <IconButton
            className={
              classes.refreshButton
            }
            onClick={
              handleRefresh
            }
            title="Refresh data"
          >
            <RefreshIcon />
          </IconButton>

          {/* KEEP EXISTING FUNCTION */}
          <Button
            variant="outlined"
            startIcon={
              <AssessmentIcon />
            }
            className={
              classes.secondaryButton
            }
            onClick={() =>
              history.push(
                "/app/dashboard/liability-tracker"
              )
            }
          >
            Show Detailed Analysis
          </Button>

          {/* KEEP EXISTING FUNCTION */}
          <Button
            variant="contained"
            color="primary"
            startIcon={
              <CloudUploadIcon />
            }
            className={
              classes.primaryButton
            }
            onClick={() =>
              setUploadOpen(true)
            }
          >
            Upload Files
          </Button>
        </div>
      </div>

      {/* ========================================================
          KPI CARDS
      ======================================================== */}

      <Grid
        container
        spacing={2}
        style={{
          marginBottom: 18,
        }}
      >
        {/* Employees */}
        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >
          <Paper
            className={
              classes.statCard
            }
          >
            <div
              className={
                classes.statHeader
              }
            >
              <div>
                <Typography
                  className={
                    classes.statLabel
                  }
                >
                  Employees
                </Typography>

                <Typography
                  className={
                    classes.statValue
                  }
                >
                  {dashboardStats.employees.toLocaleString()}
                </Typography>

                <Typography
                  className={
                    classes.statDescription
                  }
                >
                  Employees with liability data
                </Typography>
              </div>

              <div
                className={
                  classes.statIcon
                }
              >
                <PeopleIcon />
              </div>
            </div>
          </Paper>
        </Grid>

        {/* Liability */}
        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >
          <Paper
            className={
              classes.statCard
            }
          >
            <div
              className={
                classes.statHeader
              }
            >
              <div>
                <Typography
                  className={
                    classes.statLabel
                  }
                >
                  Total Liability
                </Typography>

                <Typography
                  className={
                    classes.statValue
                  }
                >
                  {formatCurrency(
                    dashboardStats.totalLiability
                  )}
                </Typography>

                <Typography
                  className={
                    classes.statDescription
                  }
                >
                  Current liability exposure
                </Typography>
              </div>

              <div
                className={
                  classes.statIcon
                }
              >
                <LiabilityIcon />
              </div>
            </div>
          </Paper>
        </Grid>

        {/* Days */}
        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >
          <Paper
            className={
              classes.statCard
            }
          >
            <div
              className={
                classes.statHeader
              }
            >
              <div>
                <Typography
                  className={
                    classes.statLabel
                  }
                >
                  Balance Days
                </Typography>

                <Typography
                  className={
                    classes.statValue
                  }
                >
                  {dashboardStats.totalDays.toLocaleString()}
                </Typography>

                <Typography
                  className={
                    classes.statDescription
                  }
                >
                  Total leave balance days
                </Typography>
              </div>

              <div
                className={
                  classes.statIcon
                }
              >
                <DaysIcon />
              </div>
            </div>
          </Paper>
        </Grid>

        {/* Functions */}
        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >
          <Paper
            className={
              classes.statCard
            }
          >
            <div
              className={
                classes.statHeader
              }
            >
              <div>
                <Typography
                  className={
                    classes.statLabel
                  }
                >
                  Functions
                </Typography>

                <Typography
                  className={
                    classes.statValue
                  }
                >
                  {dashboardStats.functions}
                </Typography>

                <Typography
                  className={
                    classes.statDescription
                  }
                >
                  Functions represented in data
                </Typography>
              </div>

              <div
                className={
                  classes.statIcon
                }
              >
                <BusinessIcon />
              </div>
            </div>
          </Paper>
        </Grid>
      </Grid>

      {/* ========================================================
          DEPARTMENT LIABILITY
      ======================================================== */}

      <Paper
        className={
          classes.chartCard
        }
      >
        <div
          className={
            classes.chartCardHeader
          }
        >
          <div>
            <Typography
              className={
                classes.chartTitle
              }
            >
              Department Liability
            </Typography>

            <Typography
              className={
                classes.chartSubtitle
              }
            >
              Top 50 departments by total balance days
            </Typography>
          </div>

          <Chip
            label={`${departmentData.length} departments`}
            size="small"
            style={{
              background:
                "#EEF3FF",
              color:
                "#506EDB",
              fontWeight: 600,
            }}
          />
        </div>

        <Divider />

        <div
          className={
            classes.chartBody
          }
        >
          {renderFunctionFilter(
            deptSelectedFunctions,
            toggleDeptFunction,
            selectAllDept,
            clearAllDept
          )}

          {loading ? (
            <div
              className={
                classes.emptyState
              }
            >
              <Typography>
                Loading data...
              </Typography>
            </div>
          ) : departmentData.length ===
            0 ? (
            <div
              className={
                classes.emptyState
              }
            >
              <BusinessIcon
                className={
                  classes.emptyIcon
                }
              />

              <Typography
                style={{
                  fontWeight: 600,
                  marginBottom: 4,
                }}
              >
                No department data available
              </Typography>

              <Typography
                variant="body2"
              >
                Upload the required files to generate liability data.
              </Typography>
            </div>
          ) : (
            <ResponsiveContainer
              width="100%"
              height={420}
            >
              <BarChart
                data={
                  departmentData
                }
                layout="vertical"
                margin={{
                  top: 10,
                  right: 25,
                  left: 10,
                  bottom: 10,
                }}
              >
                <CartesianGrid
                  stroke="#EEF1F5"
                  strokeDasharray="3 3"
                  horizontal={false}
                />

                <XAxis
                  type="number"
                  tickFormatter={
                    formatDays
                  }
                  tick={{
                    fontSize: 11,
                    fill: "#8A94A6",
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  type="category"
                  dataKey="name"
                  width={155}
                  tick={{
                    fontSize: 11,
                    fill: "#596579",
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  formatter={(
                    value
                  ) =>
                    formatDays(
                      value
                    )
                  }
                  contentStyle={{
                    borderRadius: 10,
                    border:
                      "1px solid #E1E6EE",
                    boxShadow:
                      "0 8px 22px rgba(25,39,63,0.10)",
                  }}
                />

                <Bar
                  dataKey="totalDays"
                  name="Total Days"
                  fill="#5B7CFA"
                  radius={[
                    0,
                    6,
                    6,
                    0,
                  ]}
                  barSize={14}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </Paper>

      {/* ========================================================
          EMPLOYEE LIABILITY
      ======================================================== */}

      <Paper
        className={
          classes.chartCard
        }
        style={{
          marginTop: 18,
        }}
      >
        <div
          className={
            classes.chartCardHeader
          }
        >
          <div>
            <Typography
              className={
                classes.chartTitle
              }
            >
              Employee Liability
            </Typography>

            <Typography
              className={
                classes.chartSubtitle
              }
            >
              Top 50 employees by liability amount
            </Typography>
          </div>

          <Chip
            label={`${employeeData.length} employees`}
            size="small"
            style={{
              background:
                "#ECF9F1",
              color:
                "#3F9B62",
              fontWeight: 600,
            }}
          />
        </div>

        <Divider />

        <div
          className={
            classes.chartBody
          }
        >
          {renderFunctionFilter(
            empSelectedFunctions,
            toggleEmpFunction,
            selectAllEmp,
            clearAllEmp
          )}

          {loading ? (
            <div
              className={
                classes.emptyState
              }
            >
              <Typography>
                Loading data...
              </Typography>
            </div>
          ) : employeeData.length ===
            0 ? (
            <div
              className={
                classes.emptyState
              }
            >
              <LiabilityIcon
                className={
                  classes.emptyIcon
                }
              />

              <Typography
                style={{
                  fontWeight: 600,
                  marginBottom: 4,
                }}
              >
                No employee data available
              </Typography>

              <Typography
                variant="body2"
              >
                Upload the required files to generate employee liability data.
              </Typography>
            </div>
          ) : (
            <>
              <ResponsiveContainer
                width="100%"
                height={420}
              >
                <BarChart
                  data={employeeData}
                  margin={{
                    top: 15,
                    right: 20,
                    left: 15,
                    bottom: 60,
                  }}
                >
                  <CartesianGrid
                    stroke="#EEF1F5"
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="name"
                    tick={{
                      fontSize: 10,
                      fill: "#6F7A8C",
                    }}
                    angle={-35}
                    textAnchor="end"
                    height={80}
                    interval={0}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    tickFormatter={
                      formatCurrency
                    }
                    tick={{
                      fontSize: 10,
                      fill: "#8A94A6",
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip
                    content={
                      <CustomTooltip />
                    }
                  />

                  <Bar
                    dataKey="liabilityAmount"
                    name="Liability Amount"
                    radius={[
                      6,
                      6,
                      0,
                      0,
                    ]}
                    barSize={22}
                  >
                    {employeeData.map(
                      (
                        entry,
                        index
                      ) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={getFunctionColor(
                            entry.function
                          )}
                        />
                      )
                    )}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              {uniqueFunctionsInChart.length >
                0 && (
                <div
                  className={
                    classes.legendContainer
                  }
                >
                  <Typography
                    style={{
                      fontWeight: 600,
                      fontSize: 12,
                      color:
                        "#667085",
                      marginBottom: 10,
                    }}
                  >
                    Function Colors
                  </Typography>

                  <div
                    className={
                      classes.legendItems
                    }
                  >
                    {uniqueFunctionsInChart.map(
                      (
                        func
                      ) => (
                        <div
                          key={func}
                          className={
                            classes.legendItem
                          }
                        >
                          <span
                            className={
                              classes.colorSwatch
                            }
                            style={{
                              backgroundColor:
                                getFunctionColor(
                                  func
                                ),
                            }}
                          />

                          <span>
                            {func}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </Paper>

      {/* ========================================================
          UPLOAD MODAL
      ======================================================== */}

      <Dialog
        open={uploadOpen}
        onClose={() =>
          !uploading &&
          resetUploadModal()
        }
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Upload Leave Tracker Files
        </DialogTitle>

        <DialogContent dividers>
          {uploading && (
            <LinearProgress
              style={{
                marginBottom: 16,
              }}
            />
          )}

          <Typography
            className={
              classes.modalText
            }
          >
            Upload the files in the required
            flow. Leave Taken must be uploaded
            before SAP Leave Balance.
          </Typography>

          <div
            className={
              classes.uploadField
            }
          >
            <label>
              1. Headcount
            </label>

            <input
              type="file"
              onChange={handleFileChange(
                "headcount"
              )}
            />

            {files.headcount && (
              <small
                className={
                  classes.uploadFileName
                }
              >
                {files.headcount.name}
              </small>
            )}
          </div>

          <div
            className={
              classes.uploadField
            }
          >
            <label>
              2. Leave Taken
            </label>

            <input
              type="file"
              onChange={handleFileChange(
                "leaveTaken"
              )}
            />

            {files.leaveTaken && (
              <small
                className={
                  classes.uploadFileName
                }
              >
                {files.leaveTaken.name}
              </small>
            )}
          </div>

          <div
            className={
              classes.uploadField
            }
          >
            <label>
              3. SAP Leave Balance
            </label>

            <input
              type="file"
              onChange={handleFileChange(
                "sapLeaveBalance"
              )}
            />

            {files.sapLeaveBalance && (
              <small
                className={
                  classes.uploadFileName
                }
              >
                {files.sapLeaveBalance.name}
              </small>
            )}
          </div>

          <div
            className={
              classes.uploadField
            }
          >
            <label>
              4. Base Rates
            </label>

            <input
              type="file"
              onChange={handleFileChange(
                "baseRates"
              )}
            />

            {files.baseRates && (
              <small
                className={
                  classes.uploadFileName
                }
              >
                {files.baseRates.name}
              </small>
            )}
          </div>
        </DialogContent>

        <DialogActions
          style={{
            padding:
              "14px 20px",
          }}
        >
          <Button
            onClick={
              resetUploadModal
            }
            disabled={uploading}
            style={{
              textTransform:
                "none",
              borderRadius: 8,
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={
              handleUploadAndRecalculate
            }
            disabled={
              !allFilesAttached ||
              uploading
            }
            style={{
              textTransform:
                "none",
              borderRadius: 8,
              fontWeight: 600,
            }}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}