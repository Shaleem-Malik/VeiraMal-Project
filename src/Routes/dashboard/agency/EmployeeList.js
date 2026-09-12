import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import {
  Box,
  Button,
  Card,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  Typography,
} from '@material-ui/core';

import {
  People as PeopleIcon,
  EditOutlined as EditIcon,
  CheckCircleOutline as ActivateIcon,
  HighlightOffOutlined as DeactivateIcon,
  EmailOutlined as EmailIcon,
  Business as BusinessIcon,
  ArrowForward as ArrowForwardIcon,
  PersonOutline as PersonIcon,
} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  card: {
    borderRadius: 18,
    backgroundColor: '#ffffff',
    border: '1px solid #e7ecf2',
    boxShadow: '0 5px 20px rgba(31, 41, 55, 0.055)',
    overflow: 'hidden',
  },

  header: {
    padding: theme.spacing(2.25, 2.5),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',

    [theme.breakpoints.down('sm')]: {
      alignItems: 'flex-start',
      flexDirection: 'column',
      gap: theme.spacing(1.25),
    },
  },

  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.25),
  },

  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 11,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eef2ff',
    color: '#3f51b5',
  },

  title: {
    fontSize: '1rem',
    fontWeight: 750,
    color: '#202b3c',
  },

  subtitle: {
    color: '#8c96a3',
    fontSize: '0.72rem',
    marginTop: 2,
  },

  counters: {
    display: 'flex',
    alignItems: 'center',
    gap: 7,
  },

  counter: {
    height: 28,
    borderRadius: 14,
    padding: '0 10px',
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.7rem',
    fontWeight: 700,
  },

  activeCounter: {
    backgroundColor: '#edf9f2',
    color: '#23834a',
  },

  totalCounter: {
    backgroundColor: '#f1f4f8',
    color: '#667085',
  },

  tableWrapper: {
    width: '100%',
    overflowX: 'auto',
  },

  table: {
    width: '100%',
    minWidth: 1050,
    borderCollapse: 'separate',
    borderSpacing: 0,
  },

  thead: {
    backgroundColor: '#f8fafc',
  },

  headCell: {
    padding: theme.spacing(1.4, 2),
    color: '#7b8794',
    fontSize: '0.68rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    whiteSpace: 'nowrap',
    borderBottom: '1px solid #edf0f4',
  },

  row: {
    transition: 'background-color 0.18s ease',

    '&:hover': {
      backgroundColor: '#fafbfe',
    },

    '&:last-child td': {
      borderBottom: 0,
    },
  },

  inactiveRow: {
    backgroundColor: '#fafafa',
  },

  cell: {
    padding: theme.spacing(1.5, 2),
    borderBottom: '1px solid #eef1f5',
    verticalAlign: 'middle',
    color: '#526071',
    fontSize: '0.8rem',
  },

  index: {
    color: '#9aa4af',
    fontSize: '0.72rem',
    fontWeight: 700,
  },

  employeeCell: {
    display: 'flex',
    alignItems: 'center',
    minWidth: 180,
  },

  avatar: {
    width: 36,
    height: 36,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing(1.15),
    backgroundColor: '#eef2ff',
    color: '#4c60bd',
    flexShrink: 0,
  },

  avatarInactive: {
    backgroundColor: '#f0f1f3',
    color: '#929ba6',
  },

  employeeName: {
    fontSize: '0.81rem',
    fontWeight: 700,
    color: '#2e394b',
    lineHeight: 1.3,
  },

  employeeLastName: {
    fontSize: '0.68rem',
    color: '#9aa4af',
    marginTop: 2,
  },

  email: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    color: '#526071',
    fontSize: '0.77rem',
    whiteSpace: 'nowrap',
  },

  emailIcon: {
    fontSize: 16,
    color: '#9aa5b1',
  },

  accessChip: {
    height: 27,
    borderRadius: 7,
    backgroundColor: '#f3efff',
    color: '#6748af',
    border: '1px solid #dfd5fa',
    fontSize: '0.67rem',
    fontWeight: 700,
  },

  businessUnits: {
    maxWidth: 230,
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },

  businessIcon: {
    color: '#9aa5b1',
    fontSize: 16,
    flexShrink: 0,
  },

  businessText: {
    color: '#687587',
    fontSize: '0.76rem',
    lineHeight: 1.4,
  },

  statusChip: {
    height: 27,
    borderRadius: 7,
    fontSize: '0.67rem',
    fontWeight: 700,
  },

  activeStatus: {
    backgroundColor: '#eaf8f0',
    color: '#23834a',
    border: '1px solid #d3efde',
  },

  inactiveStatus: {
    backgroundColor: '#fff1f1',
    color: '#c53b3b',
    border: '1px solid #f8d6d6',
  },

  actionGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },

  editButton: {
    width: 34,
    height: 34,
    borderRadius: 9,
    color: '#6574c7',
    backgroundColor: '#f1f3ff',

    '&:hover': {
      backgroundColor: '#e5e9ff',
    },
  },

  activateButton: {
    width: 34,
    height: 34,
    borderRadius: 9,
    color: '#2e9d60',
    backgroundColor: '#edf9f2',

    '&:hover': {
      backgroundColor: '#def3e7',
    },
  },

  deactivateButton: {
    width: 34,
    height: 34,
    borderRadius: 9,
    color: '#d34a4a',
    backgroundColor: '#fff2f2',

    '&:hover': {
      backgroundColor: '#ffe5e5',
    },
  },

  emptyState: {
    padding: theme.spacing(6),
    textAlign: 'center',
  },

  emptyIcon: {
    width: 62,
    height: 62,
    borderRadius: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
    backgroundColor: '#f1f4f8',
    color: '#9ba5b1',
    marginBottom: theme.spacing(1.5),
  },

  emptyTitle: {
    fontSize: '0.95rem',
    fontWeight: 700,
    color: '#344054',
  },

  emptyText: {
    marginTop: 4,
    color: '#8c96a3',
    fontSize: '0.77rem',
  },
}));

function getEmployeeName(employee) {
  return (
    `${employee.firstName ?? employee.FirstName ?? ''} ${
      employee.middleName ?? employee.MiddleName ?? ''
    }`.trim()
  );
}

function getLastName(employee) {
  return (
    employee.lastName ??
    employee.LastName ??
    ''
  );
}

function getIsActive(employee) {
  return (
    employee.isActive ??
    employee.IsActive ??
    true
  );
}

function getUserId(employee) {
  return (
    employee.id ??
    employee.userId ??
    employee.UserId
  );
}

function getAccessLabel(employee) {
  const access =
    employee.accessLevel ??
    employee.AccessLevel;

  if (!access) {
    return '—';
  }

  if (typeof access === 'string') {
    return access;
  }

  return (
    access.name ??
    access.displayName ??
    '—'
  );
}

function getBusinessUnitLabel(employee) {
  const array =
    employee.businessUnits ??
    employee.BusinessUnits;

  if (Array.isArray(array)) {
    const values = array
      .map((item) => {
        if (
          typeof item === 'string'
        ) {
          return item;
        }

        return (
          item?.name ??
          item?.displayName ??
          item?.label ??
          ''
        );
      })
      .filter(Boolean);

    return values.length
      ? values.join(', ')
      : '—';
  }

  const single =
    employee.businessUnit ??
    employee.BusinessUnit;

  if (typeof single === 'string') {
    const values = single
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    return values.length
      ? values.join(', ')
      : '—';
  }

  return '—';
}

export default function EmployeeList({
  employees = [],
  onEdit = () => {},
  onToggleStatus = () => {},
}) {
  const classes = useStyles();

  const activeCount =
    employees.filter(
      (emp) => getIsActive(emp)
    ).length;

  return (
    <Card className={classes.card}>
      {/* HEADER */}

      <Box className={classes.header}>
        <Box className={classes.headerLeft}>
          <Box
            className={
              classes.headerIcon
            }
          >
            <PeopleIcon
              fontSize="small"
            />
          </Box>

          <Box>
            <Typography
              className={
                classes.title
              }
            >
              Company Employees
            </Typography>

            <Typography
              className={
                classes.subtitle
              }
            >
              View and manage employee accounts
            </Typography>
          </Box>
        </Box>

        <Box
          className={
            classes.counters
          }
        >
          <Box
            className={`${classes.counter} ${classes.activeCounter}`}
          >
            Active: {activeCount}
          </Box>

          <Box
            className={`${classes.counter} ${classes.totalCounter}`}
          >
            Total: {employees.length}
          </Box>
        </Box>
      </Box>

      <Divider />

      {employees.length === 0 ? (
        <Box
          className={
            classes.emptyState
          }
        >
          <Box
            className={
              classes.emptyIcon
            }
          >
            <PeopleIcon />
          </Box>

          <Typography
            className={
              classes.emptyTitle
            }
          >
            No employees found
          </Typography>

          <Typography
            className={
              classes.emptyText
            }
          >
            Employee accounts will appear here
            once they are created.
          </Typography>
        </Box>
      ) : (
        <Box
          className={
            classes.tableWrapper
          }
        >
          <table
            className={
              classes.table
            }
          >
            <thead
              className={
                classes.thead
              }
            >
              <tr>
                <th
                  className={
                    classes.headCell
                  }
                >
                  #
                </th>

                <th
                  className={
                    classes.headCell
                  }
                >
                  Employee
                </th>

                <th
                  className={
                    classes.headCell
                  }
                >
                  Email
                </th>

                <th
                  className={
                    classes.headCell
                  }
                >
                  Access Level
                </th>

                <th
                  className={
                    classes.headCell
                  }
                >
                  Business Units
                </th>

                <th
                  className={
                    classes.headCell
                  }
                >
                  Status
                </th>

                <th
                  className={
                    classes.headCell
                  }
                >
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {employees.map(
                (emp, idx) => {
                  const key =
                    getUserId(
                      emp
                    ) ?? idx;

                  const isActive =
                    getIsActive(
                      emp
                    );

                  const email =
                    emp.email ??
                    emp.Email ??
                    '—';

                  const firstName =
                    getEmployeeName(
                      emp
                    );

                  const lastName =
                    getLastName(
                      emp
                    );

                  const accessLabel =
                    getAccessLabel(
                      emp
                    );

                  const businessUnits =
                    getBusinessUnitLabel(
                      emp
                    );

                  return (
                    <tr
                      key={key}
                      className={`${classes.row} ${
                        !isActive
                          ? classes.inactiveRow
                          : ''
                      }`}
                    >
                      {/* INDEX */}

                      <td
                        className={
                          classes.cell
                        }
                      >
                        <span
                          className={
                            classes.index
                          }
                        >
                          {idx + 1}
                        </span>
                      </td>

                      {/* EMPLOYEE */}

                      <td
                        className={
                          classes.cell
                        }
                      >
                        <Box
                          className={
                            classes.employeeCell
                          }
                        >
                          <Box
                            className={`${classes.avatar} ${
                              !isActive
                                ? classes.avatarInactive
                                : ''
                            }`}
                          >
                            <PersonIcon
                              fontSize="small"
                            />
                          </Box>

                          <Box>
                            <Typography
                              className={
                                classes.employeeName
                              }
                            >
                              {firstName ||
                                'Unnamed Employee'}
                            </Typography>

                            {lastName && (
                              <Typography
                                className={
                                  classes.employeeLastName
                                }
                              >
                                {lastName}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </td>

                      {/* EMAIL */}

                      <td
                        className={
                          classes.cell
                        }
                      >
                        <Box
                          className={
                            classes.email
                          }
                        >
                          <EmailIcon
                            className={
                              classes.emailIcon
                            }
                          />

                          {email !==
                          '—' ? (
                            <a
                              href={`mailto:${email}`}
                              style={{
                                color:
                                  'inherit',
                                textDecoration:
                                  'none',
                              }}
                            >
                              {email}
                            </a>
                          ) : (
                            '—'
                          )}
                        </Box>
                      </td>

                      {/* ACCESS */}

                      <td
                        className={
                          classes.cell
                        }
                      >
                        <Chip
                          label={
                            accessLabel
                          }
                          size="small"
                          className={
                            classes.accessChip
                          }
                        />
                      </td>

                      {/* BUSINESS UNITS */}

                      <td
                        className={
                          classes.cell
                        }
                      >
                        <Box
                          className={
                            classes.businessUnits
                          }
                        >
                          <BusinessIcon
                            className={
                              classes.businessIcon
                            }
                          />

                          <Typography
                            className={
                              classes.businessText
                            }
                            title={
                              businessUnits
                            }
                          >
                            {businessUnits}
                          </Typography>
                        </Box>
                      </td>

                      {/* STATUS */}

                      <td
                        className={
                          classes.cell
                        }
                      >
                        <Chip
                          label={
                            isActive
                              ? 'Active'
                              : 'Inactive'
                          }
                          size="small"
                          className={`${classes.statusChip} ${
                            isActive
                              ? classes.activeStatus
                              : classes.inactiveStatus
                          }`}
                        />
                      </td>

                      {/* ACTIONS */}

                      <td
                        className={
                          classes.cell
                        }
                      >
                        <Box
                          className={
                            classes.actionGroup
                          }
                        >
                          <Tooltip
                            title="Edit employee"
                            arrow
                          >
                            <IconButton
                              size="small"
                              className={
                                classes.editButton
                              }
                              onClick={() =>
                                onEdit(
                                  emp
                                )
                              }
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip
                            title={
                              isActive
                                ? 'Deactivate employee'
                                : 'Activate employee'
                            }
                            arrow
                          >
                            <IconButton
                              size="small"
                              className={
                                isActive
                                  ? classes.deactivateButton
                                  : classes.activateButton
                              }
                              onClick={() =>
                                onToggleStatus(
                                  getUserId(
                                    emp
                                  )
                                )
                              }
                            >
                              {isActive ? (
                                <DeactivateIcon fontSize="small" />
                              ) : (
                                <ActivateIcon fontSize="small" />
                              )}
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </Box>
      )}
    </Card>
  );
}