import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Slider,
  Switch,
  FormControlLabel,
  Button,
  Grid,
  Snackbar,
  Divider,
  Chip,
  Card,
  CardContent,
  CircularProgress
} from '@mui/material';
import Alert from '@mui/material/Alert';
import {
  RestartAlt as ResetIcon,
  Save as SaveIcon,
  Sync as SyncIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';
import { 
  getSettings, 
  updateSettings, 
  resetSettings,
  getESP32Settings,
  updateESP32Settings 
} from '../services/api';

const Settings = () => {
  const [settings, setSettings] = useState({
    baseSensitivity: 10,
    threshold: 0.01,
    dynamicScaling: true,
    invertX: true,
    invertY: false
  });
  const [originalSettings, setOriginalSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isESP32Connected, setIsESP32Connected] = useState(false);

  const hasChanges = JSON.stringify(settings) !== JSON.stringify(originalSettings);
  const showSnackbar = (message, severity) => setSnackbar({ open: true, message, severity });

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      // Try ESP32 first (live)
      try {
        const esp32Response = await getESP32Settings();
        const d = (esp32Response && esp32Response.data) || {};
        const merged = {
          baseSensitivity: d.baseSensitivity ?? 10,
          threshold: d.threshold ?? 0.01,
          dynamicScaling: d.dynamicScaling ?? true,
          invertX: d.invertX ?? true,
          invertY: d.invertY ?? false
        };
        setSettings(merged);
        setOriginalSettings(merged);
        setIsESP32Connected(true);
      } catch {
        // Fallback to DB
        setIsESP32Connected(false);
        const response = await getSettings();
        const d = response.data || {};
        const merged = {
          baseSensitivity: d.baseSensitivity ?? 10,
          threshold: d.threshold ?? 0.01,
          dynamicScaling: d.dynamicScaling ?? true,
          invertX: d.invertX ?? true,
          invertY: d.invertY ?? false
        };
        setSettings(merged);
        setOriginalSettings(merged);
      }
    } catch {
      showSnackbar('Error loading settings', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = async () => {
    try {
      // Update device (only supported fields)
      try {
        await updateESP32Settings({
          baseSensitivity: settings.baseSensitivity,
          threshold: settings.threshold
        });
        setIsESP32Connected(true);
        showSnackbar('Settings updated on ESP32! ✓', 'success');
      } catch {
        setIsESP32Connected(false);
        showSnackbar('ESP32 not connected, saved to database only', 'warning');
      }

      // Persist full settings to DB
      await updateSettings(settings);
      setOriginalSettings(settings);
    } catch {
      showSnackbar('Error saving settings', 'error');
    }
  };

  const handleReset = async () => {
    try {
      const response = await resetSettings();
      setSettings(response.data);
      setOriginalSettings(response.data);
      showSnackbar('Settings reset to default', 'info');
    } catch {
      showSnackbar('Error resetting settings', 'error');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={48} />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {/* Connection Status Card */}
      <Card 
        sx={{ 
          mb: 3,
          background: isESP32Connected 
            ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%)'
            : 'linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(255, 152, 0, 0.05) 100%)',
          border: isESP32Connected 
            ? '1px solid rgba(76, 175, 80, 0.3)'
            : '1px solid rgba(255, 152, 0, 0.3)'
        }}
      >
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="h6" fontWeight={700}>Device Connection</Typography>
              <Typography variant="body2" color="text.secondary">
                {isESP32Connected 
                  ? 'ESP32 is online — Changes can update in real-time'
                  : 'ESP32 offline — Settings will be saved to database'}
              </Typography>
            </Box>
            <Box display="flex" gap={1}>
              <Button
                variant="outlined"
                startIcon={<SyncIcon />}
                onClick={fetchSettings}
                disabled={hasChanges}
                title={hasChanges ? 'Save or reset your changes before refreshing' : 'Refresh from device/database'}
              >
                Refresh
              </Button>
              <Chip
                icon={<CheckIcon />}
                label={isESP32Connected ? 'Connected' : 'Offline'}
                color={isESP32Connected ? 'success' : 'warning'}
                sx={{ fontWeight: 600 }}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Settings Panel */}
      <Paper className="glass-card" sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight={800}>
          Mouse Settings
        </Typography>
        <Typography color="textSecondary" paragraph>
          Configure your ESP32 BLE Mouse behavior
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={4}>
          {/* Base Sensitivity */}
          <Grid item xs={12}>
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography gutterBottom fontWeight={600}>Base Sensitivity</Typography>
                <Chip label={settings.baseSensitivity.toFixed(1)} color="primary" size="small" sx={{ fontWeight: 700, fontSize: '1rem', minWidth: 60 }} />
              </Box>
              <Slider
                value={settings.baseSensitivity}
                onChange={(e, value) => setSettings({ ...settings, baseSensitivity: value })}
                min={1}
                max={50}
                step={0.5}
                marks={[
                  { value: 1, label: 'Slow' },
                  { value: 25, label: 'Medium' },
                  { value: 50, label: 'Fast' }
                ]}
                valueLabelDisplay="auto"
                sx={{ mt: 2 }}
              />
              <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                Controls overall cursor speed (1 = slowest, 50 = fastest)
              </Typography>
            </Box>
          </Grid>

          {/* Threshold */}
          <Grid item xs={12}>
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography gutterBottom fontWeight={600}>Deadzone Threshold</Typography>
                <Chip label={settings.threshold.toFixed(3)} color="secondary" size="small" sx={{ fontWeight: 700, fontSize: '1rem', minWidth: 60 }} />
              </Box>
              <Slider
                value={settings.threshold}
                onChange={(e, value) => setSettings({ ...settings, threshold: value })}
                min={0.001}
                max={0.1}
                step={0.001}
                valueLabelDisplay="auto"
                sx={{ mt: 2 }}
              />
              <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                Minimum movement required to register (higher = less jitter)
              </Typography>
            </Box>
          </Grid>

          {/* Dynamic Scaling */}
          <Grid item xs={12}>
            <Card variant="outlined" sx={{ p: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.dynamicScaling}
                    onChange={(e) => setSettings({ ...settings, dynamicScaling: e.target.checked })}
                    color="success"
                  />
                }
                label={
                  <Box>
                    <Typography fontWeight={600}>Enable Dynamic Sensitivity Scaling</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Adjusts sensitivity based on movement speed
                    </Typography>
                  </Box>
                }
              />
            </Card>
          </Grid>

          {/* Invert Controls */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom fontWeight={600} mt={2}>Axis Inversion</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Card variant="outlined" sx={{ p: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.invertX}
                        onChange={(e) => setSettings({ ...settings, invertX: e.target.checked })}
                        color="primary"
                      />
                    }
                    label={
                      <Box>
                        <Typography fontWeight={600}>Invert X-Axis</Typography>
                        <Typography variant="caption" color="text.secondary">Reverse horizontal movement</Typography>
                      </Box>
                    }
                  />
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card variant="outlined" sx={{ p: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.invertY}
                        onChange={(e) => setSettings({ ...settings, invertY: e.target.checked })}
                        color="primary"
                      />
                    }
                    label={
                      <Box>
                        <Typography fontWeight={600}>Invert Y-Axis</Typography>
                        <Typography variant="caption" color="text.secondary">Reverse vertical movement</Typography>
                      </Box>
                    }
                  />
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Actions */}
        <Box display="flex" justifyContent="space-between" flexWrap="wrap" gap={2}>
          <Button variant="outlined" color="secondary" startIcon={<ResetIcon />} onClick={handleReset} size="large">
            Reset to Default
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={!hasChanges}
            size="large"
          >
            {hasChanges ? 'Save Changes' : 'No Changes'}
          </Button>
        </Box>

        {/* Arduino snippet */}
        <Box mt={4} p={3} sx={{ backgroundColor: '#0a0e27', borderRadius: 2, border: '1px solid rgba(0, 188, 212, 0.3)' }}>
          <Typography variant="subtitle2" color="primary" gutterBottom fontWeight={700}>
            Current Configuration (Arduino):
          </Typography>
          <Typography component="pre" sx={{ fontFamily: 'monospace', fontSize: '0.9rem', overflow: 'auto', color: '#00ff00', lineHeight: 1.6, m: 0 }}>
{`float baseSensitivity = ${settings.baseSensitivity.toFixed(1)};
float threshold = ${settings.threshold.toFixed(3)};
bool dynamicScaling = ${settings.dynamicScaling ? 'true' : 'false'};
bool invertX = ${settings.invertX ? 'true' : 'false'};
bool invertY = ${settings.invertY ? 'true' : 'false'};`}
          </Typography>
        </Box>
      </Paper>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Settings;