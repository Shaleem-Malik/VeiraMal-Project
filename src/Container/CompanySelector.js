// CompanySelector.jsx
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
  alpha,
  Chip
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';
import { 
  Business as BusinessIcon,
  // CorporateFare as CorporateFareIcon,
  ArrowForward,
  CheckCircle
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import api from 'Api'

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
    marginBottom: theme.spacing(2),
  },
  companyCard: {
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
  companyName: {
    fontWeight: 600,
    fontSize: '1.1rem',
    marginBottom: theme.spacing(1),
  },
  companyType: {
    marginBottom: theme.spacing(1),
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

export default function CompanySelector() {
  const classes = useStyles();
  const history = useHistory();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        // Try to get from localStorage first
        const storedCompanies = localStorage.getItem('availableCompanies');
        if (storedCompanies) {
          const companiesData = JSON.parse(storedCompanies);
          setCompanies(companiesData);
          setLoading(false);
          return;
        }

        // Fallback: Fetch companies from API
        const parentCompanyId = localStorage.getItem('companyId');
        const userId = localStorage.getItem('userId');
        
        if (!parentCompanyId || !userId) {
          throw new Error('Missing company or user information');
        }

        const token = localStorage.getItem('token');
        const response = await api.get(`/company/${parentCompanyId}/user-assignments/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const companiesData = response.data || [];
        setCompanies(companiesData);
        localStorage.setItem('availableCompanies', JSON.stringify(companiesData));
        
      } catch (error) {
        console.error('Failed to load companies:', error);
        NotificationManager.error('Failed to load company assignments. Please login again.');
        setTimeout(() => history.push('/signin'), 2000);
      } finally {
        setLoading(false);
      }
    };

    loadCompanies();
  }, [history]);

  const handleCompanySelect = (company) => {
    setSelectedCompany(company);
  };

  const handleConfirm = () => {
    if (!selectedCompany) {
      NotificationManager.warning('Please select a company to continue.');
      return;
    }
    
    // Store selected company info
    localStorage.setItem('selectedCompanyId', selectedCompany.companyId);
    localStorage.setItem('selectedCompanyName', selectedCompany.companyName);
    
    // Cleanup
    localStorage.removeItem('availableCompanies');
    localStorage.removeItem('postLoginChooseCompany');

    NotificationManager.success(`Welcome to ${selectedCompany.companyName}!`);

    // Route to dashboard based on access level
    const access = localStorage.getItem('access') || '';
    routeToDashboard(access, history);
  };

  const routeToDashboard = (access, history) => {
    const normalizedAccess = (access || '').toString().toLowerCase();

    if (normalizedAccess === 'admin') {
      history.push('/app/dashboard/ecommerce');
    } else if (normalizedAccess === 'ceo' || normalizedAccess === 'hr') {
      history.push('/dashboard/crm/dashboard');
    } else if (normalizedAccess === 'superuser' || normalizedAccess === 'super_user' || normalizedAccess === 'super-user') {
      history.push('/agency/dashboard/agency');
    } else if (normalizedAccess === 'team manager' || normalizedAccess === 'teammanager') {
      history.push('/horizontal/dashboard/saas');
    } else {
      history.push('/app/dashboard/ecommerce');
    }
  };

  const handleCancel = () => {
    localStorage.removeItem('availableCompanies');
    localStorage.removeItem('postLoginChooseCompany');
    history.push('/signin');
  };

  if (loading) {
    return (
      <div className={classes.root}>
        <Container className={classes.container}>
          <Paper className={classes.paper}>
            <div className={classes.loadingContainer}>
              <CircularProgress size={40} />
              <Typography variant="h6" className={classes.loadingText}>
                Loading company assignments...
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
              {/* <CorporateFareIcon className={classes.icon} /> */}
              <Typography variant="h4" className={classes.title}>
                Select Company
              </Typography>
              <Typography variant="h6" className={classes.subtitle}>
                Choose the company you want to manage in this session
              </Typography>
              <Typography variant="body2" color="textSecondary">
                You have access to multiple companies. Please select one to continue.
              </Typography>
            </div>

            <Grid container spacing={3}>
              {companies.map((company) => (
                <Grid item xs={12} md={6} key={company.companyId}>
                  <Card 
                    className={`${classes.companyCard} ${
                      selectedCompany?.companyId === company.companyId ? classes.selectedCard : ''
                    }`}
                  >
                    <CardActionArea onClick={() => handleCompanySelect(company)}>
                      <CardContent className={classes.cardContent}>
                        <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
                          <BusinessIcon color="primary" />
                        </Box>
                        <Typography variant="h6" className={classes.companyName}>
                          {company.companyName}
                          {selectedCompany?.companyId === company.companyId && (
                            <CheckCircle className={classes.checkIcon} />
                          )}
                        </Typography>
                        {company.companyType && (
                          <Chip 
                            label={company.companyType} 
                            size="small" 
                            color={company.isParent ? "primary" : "secondary"}
                            className={classes.companyType}
                          />
                        )}
                        {company.location && (
                          <Typography variant="body2" color="textSecondary">
                            {company.location}
                          </Typography>
                        )}
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
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button 
                className={classes.continueBtn}
                variant="contained" 
                color="primary" 
                onClick={handleConfirm}
                disabled={!selectedCompany}
                endIcon={<ArrowForward />}
              >
                Continue to {selectedCompany?.companyName || 'Dashboard'}
              </Button>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </div>
  );
}