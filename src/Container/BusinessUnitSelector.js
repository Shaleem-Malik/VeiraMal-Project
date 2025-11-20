// File: BusinessUnitSelector.jsx
import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  CardActionArea,
  Grid,
  Fade,
  Container,
  CircularProgress,
  alpha
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';
import { 
  Business as BusinessIcon,
  ArrowForward,
  CheckCircle
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    // background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(3),
  },
  container: {
    maxWidth: 800,
    margin: '0 auto',
  },
  paper: {
    padding: theme.spacing(4),
    borderRadius: 20,
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  header: {
    textAlign: 'center',
    marginBottom: theme.spacing(4),
  },
  icon: {
    fontSize: 64,
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(2),
  },
  title: {
    fontWeight: 700,
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(1),
  },
  subtitle: {
    color: theme.palette.text.secondary,
    fontSize: '1.1rem',
  },
  unitCard: {
    height: '100%',
    borderRadius: 16,
    transition: 'all 0.3s ease',
    border: '2px solid transparent',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
    },
  },
  selectedCard: {
    border: `2px solid ${theme.palette.primary.main}`,
    background: alpha(theme.palette.primary.main, 0.04),
  },
  cardContent: {
    padding: theme.spacing(3),
    textAlign: 'center',
  },
  unitName: {
    fontWeight: 600,
    fontSize: '1.1rem',
  },
  checkIcon: {
    color: theme.palette.primary.main,
    marginLeft: theme.spacing(1),
  },
  actionArea: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing(4),
    padding: theme.spacing(2, 0, 0),
  },
  continueBtn: {
    borderRadius: 25,
    padding: theme.spacing(1, 4),
    fontSize: '1rem',
    fontWeight: 600,
    textTransform: 'none',
    minWidth: 200,
  },
  cancelBtn: {
    borderRadius: 25,
    padding: theme.spacing(1, 3),
    textTransform: 'none',
    fontWeight: 500,
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 400,
  },
  loadingText: {
    marginLeft: theme.spacing(2),
    color: theme.palette.text.secondary,
  },
}));

export default function BusinessUnitSelector() {
  const classes = useStyles();
  const history = useHistory();
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const json = localStorage.getItem('businessUnits');
    if (!json) {
      NotificationManager.error('No business units available. Please login again.');
      setTimeout(() => history.push('/signin'), 1200);
      return;
    }

    try {
      const arr = JSON.parse(json);
      const good = Array.isArray(arr) ? arr.map(String).map(s => s.trim()).filter(Boolean) : [];
      if (good.length === 0) {
        NotificationManager.error('No valid business units found. Please login again.');
        setTimeout(() => history.push('/signin'), 1200);
        return;
      }
      setUnits(good);
    } catch (err) {
      console.error('Invalid businessUnits in storage', err);
      NotificationManager.error('Invalid session state. Please login again.');
      setTimeout(() => history.push('/signin'), 1200);
    } finally {
      setLoading(false);
    }
  }, [history]);

  const onConfirm = () => {
    if (!selected) {
      NotificationManager.warning('Please select a business unit.');
      return;
    }
    
    localStorage.setItem('BusinessUnit', selected);
    localStorage.removeItem('businessUnits');
    localStorage.removeItem('postLoginChooseBU');

    NotificationManager.success(`Welcome to ${selected} Dashboard!`);

    const access = localStorage.getItem('access') || '';
    const normalizedAccess = access.toLowerCase();

    if (normalizedAccess === 'admin') {
      history.push('/app/dashboard/ecommerce');
    } else if (normalizedAccess === 'ceo' || normalizedAccess === 'hr') {
      history.push('/dashboard/crm/dashboard');
    } else if (normalizedAccess === 'superuser' || normalizedAccess === 'super_user' || normalizedAccess === 'super-user') {
      history.push('/agency/dashboard/agency');
    } else if (normalizedAccess === 'team manager' || normalizedAccess === 'teammanager') {
      history.push('/app/dashboard/saas');
    } else {
      history.push('/app/dashboard/ecommerce');
    }
  };

  if (loading) {
    return (
      <div className={classes.root}>
        <Container className={classes.container}>
          <Paper className={classes.paper}>
            <div className={classes.loadingContainer}>
              <CircularProgress size={40} />
              <Typography variant="h6" className={classes.loadingText}>
                Loading business units...
              </Typography>
            </div>
          </Paper>
        </Container>
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <Container className={classes.container}>
        <Fade in={true} timeout={800}>
          <Paper className={classes.paper}>
            <div className={classes.header}>
              <BusinessIcon className={classes.icon} />
              <Typography variant="h4" className={classes.title}>
                Select Business Unit
              </Typography>
              <Typography variant="h6" className={classes.subtitle}>
                Choose your workspace for this session
              </Typography>
            </div>

            <Grid container spacing={3}>
              {units.map((unit) => (
                <Grid item xs={12} sm={6} key={unit}>
                  <Card 
                    className={`${classes.unitCard} ${
                      selected === unit ? classes.selectedCard : ''
                    }`}
                  >
                    <CardActionArea onClick={() => setSelected(unit)}>
                      <CardContent className={classes.cardContent}>
                        <Typography variant="h6" className={classes.unitName}>
                          {unit}
                          {selected === unit && (
                            <CheckCircle className={classes.checkIcon} />
                          )}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Box className={classes.actionArea}>
              <Button 
                className={classes.cancelBtn}
                variant="outlined" 
                onClick={() => { 
                  localStorage.removeItem('businessUnits'); 
                  history.push('/signin'); 
                }}
              >
                Cancel
              </Button>
              <Button 
                className={classes.continueBtn}
                variant="contained" 
                color="primary" 
                onClick={onConfirm}
                disabled={!selected}
                endIcon={<ArrowForward />}
              >
                Continue to {selected || 'Dashboard'}
              </Button>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </div>
  );
}