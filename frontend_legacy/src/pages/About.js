import React, { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link,
  Skeleton
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import { getComponents } from '../services/api';

const isPlainObject = (val) =>
  val !== null && typeof val === 'object' && !Array.isArray(val);

const KeyValueList = ({ data }) => {
  if (!isPlainObject(data)) return null;
  return (
    <Box component="ul" sx={{ pl: 2, m: 0 }}>
      {Object.entries(data).map(([k, v]) => (
        <li key={k}>
          <Typography variant="body2" color="text.secondary">
            <strong>{k}</strong>: {String(v)}
          </Typography>
        </li>
      ))}
    </Box>
  );
};

const About = () => {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComponents = async () => {
      try {
        const res = await getComponents();
        setComponents(res.data || []);
      } catch (e) {
        console.error('Error fetching components:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchComponents();
  }, []);

  const features = [
    'Motion-based cursor control using gyroscope',
    'Bluetooth Low Energy connectivity',
    'Configurable sensitivity and dead zones',
    'Dynamic sensitivity scaling',
    'Four programmable buttons',
    'Low latency response',
    'Battery efficient design',
    'Cross-platform compatibility'
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      {/* Header */}
      <Paper className="glass-card hover-lift" sx={{ p: 4, mb: 4 }}>
        <Typography variant="h3" className="gradient-text" sx={{ fontWeight: 900, letterSpacing: -0.5 }}>
          ESP32 BLE Mouse
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
          A wireless motion-controlled mouse using ESP32 and MPU6050
        </Typography>

        <Box mt={3}>
          <Typography variant="body1" color="text.secondary">
            This project transforms an ESP32 microcontroller and MPU6050 motion sensor into a fully 
            functional Bluetooth Low Energy (BLE) mouse. By detecting gyroscopic movements, it allows 
            intuitive cursor control through physical motion, while tactile buttons provide click and 
            scroll functionality.
          </Typography>
        </Box>

        <Grid container spacing={2} mt={1}>
          {[
            { label: '6-Axis', sub: 'Motion Tracking' },
            { label: 'BLE 4.2', sub: 'Wireless Connection' },
            { label: '4 Buttons', sub: 'Full Control' }
          ].map((item, i) => (
            <Grid item xs={12} sm={4} key={i}>
              <Box textAlign="center" p={2}>
                <Typography variant="h4" color="primary" sx={{ fontWeight: 800 }}>{item.label}</Typography>
                <Typography color="text.secondary">{item.sub}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Features */}
      <Paper className="glass-card hover-lift" sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }} gutterBottom>
          Key Features
        </Typography>
        <Grid container spacing={2} mt={1}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Chip
                label={feature}
                color="primary"
                variant="outlined"
                sx={{ width: '100%', justifyContent: 'flex-start', py: 2, fontWeight: 600 }}
              />
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Components */}
      <Typography variant="h4" className="gradient-text" sx={{ fontWeight: 900, mb: 2 }}>
        Components Used
      </Typography>
      <Grid container spacing={3} mb={4}>
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <Grid item xs={12} md={4} key={i}>
                <Card className="glass-card hover-lift" sx={{ height: '100%' }}>
                  <Box sx={{ height: 200, backgroundColor: '#1e1e2e' }} />
                  <CardContent>
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="text" width="90%" />
                    <Skeleton variant="rectangular" height={120} sx={{ mt: 2 }} />
                  </CardContent>
                </Card>
              </Grid>
            ))
          : components.map((component) => (
              <Grid item xs={12} md={4} key={component.id || component.name}>
                <Card className="glass-card hover-lift" sx={{ height: '100%' }}>
                  <Box
                    sx={{
                      height: 200,
                      background: 'linear-gradient(135deg, rgba(0, 188, 212, 0.15), rgba(0, 151, 167, 0.15))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 700 }}>
                      {component.name}
                    </Typography>
                  </Box>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 800 }}>
                      {component.name}
                    </Typography>
                    {component.description && (
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {component.description}
                      </Typography>
                    )}

                    {/* Specifications */}
                    {component.specifications && (
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography sx={{ fontWeight: 700 }}>Specifications</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          {Object.entries(component.specifications).map(([key, value]) => (
                            <Box key={key} mb={1}>
                              <Typography variant="body2" fontWeight={700}>{key}:</Typography>
                              {isPlainObject(value) ? (
                                <KeyValueList data={value} />
                              ) : (
                                <Typography variant="body2" color="text.secondary">
                                  {String(value)}
                                </Typography>
                              )}
                            </Box>
                          ))}
                        </AccordionDetails>
                      </Accordion>
                    )}

                    {/* Extra fields like datasheet, wiring, pinout */}
                    <Box mt={2} display="flex" flexDirection="column" gap={1}>
                      {component.datasheet && (
                        <Link
                          href={component.datasheet}
                          target="_blank"
                          rel="noopener"
                          underline="hover"
                          sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 700 }}
                        >
                          <DescriptionIcon fontSize="small" /> View Datasheet
                        </Link>
                      )}

                      {component.wiring && (
                        <Box>
                          <Typography variant="subtitle2" fontWeight={700}>Wiring</Typography>
                          {isPlainObject(component.wiring) ? (
                            <KeyValueList data={component.wiring} />
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              {String(component.wiring)}
                            </Typography>
                          )}
                        </Box>
                      )}

                      {component.pinout && (
                        <Box>
                          <Typography variant="subtitle2" fontWeight={700}>Pinout</Typography>
                          {isPlainObject(component.pinout) ? (
                            <KeyValueList data={component.pinout} />
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              {String(component.pinout)}
                            </Typography>
                          )}
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
      </Grid>

      {/* How it works */}
      <Paper className="glass-card hover-lift" sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }} gutterBottom>
          How It Works
        </Typography>
        <Grid container spacing={3} mt={1}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" color="primary" sx={{ fontWeight: 800 }} gutterBottom>
              1. Motion Detection
            </Typography>
            <Typography color="text.secondary">
              The MPU6050 sensor reads gyroscope and accelerometer data. The gyroscope measures rotational
              velocity across three axes (X, Y, Z).
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" color="primary" sx={{ fontWeight: 800 }} gutterBottom>
              2. Data Processing
            </Typography>
            <Typography color="text.secondary">
              The ESP32 processes sensor data, applies deadzone filtering to reduce jitter, and dynamic sensitivity
              scaling for smooth, responsive cursor movement.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" color="primary" sx={{ fontWeight: 800 }} gutterBottom>
              3. BLE Transmission
            </Typography>
            <Typography color="text.secondary">
              Processed movement data and button states are transmitted via Bluetooth Low Energy using the HID protocol,
              appearing as a standard mouse to the computer.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" color="primary" sx={{ fontWeight: 800 }} gutterBottom>
              4. Button Input
            </Typography>
            <Typography color="text.secondary">
              Four tactile buttons provide left click, right click, scroll up, and scroll down functionality, with software
              debouncing for reliable operation.
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default About;