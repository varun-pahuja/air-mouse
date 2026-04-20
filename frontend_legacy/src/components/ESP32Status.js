import React, { useState, useEffect } from 'react';
import { Box, Chip, Tooltip } from '@mui/material';
import { 
  Bluetooth as BluetoothIcon,
  Wifi as WifiIcon,
  SignalWifiOff as WifiOffIcon 
} from '@mui/icons-material';
import { getESP32Status } from '../services/api';

const ESP32Status = () => {
  const [status, setStatus] = useState({ 
    connected: false, 
    wifi: false, 
    rssi: -100,
    ip: '' 
  });

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await getESP32Status();   // axios response
        // IMPORTANT: use response.data (not response)
        setStatus(response.data);
      } catch (error) {
        setStatus({ connected: false, wifi: false, rssi: -100, ip: '' });
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  const getSignalStrength = () => {
    const strength = Math.max(0, 100 + (Number(status.rssi) || -100));
    if (strength > 70) return { label: 'Excellent', color: '#4caf50' };
    if (strength > 50) return { label: 'Good', color: '#00bcd4' };
    if (strength > 30) return { label: 'Fair', color: '#ff9800' };
    return { label: 'Weak', color: '#f44336' };
  };

  const signal = getSignalStrength();

  return (
    <Box display="flex" gap={1} alignItems="center">
      <Tooltip title={status.connected ? `ESP32 Online — IP: ${status.ip}` : 'ESP32 Offline'}>
        <Chip
          icon={status.connected ? <BluetoothIcon /> : <WifiOffIcon />}
          label={status.connected ? 'ESP32 Live' : 'Offline'}
          size="small"
          sx={{
            background: status.connected 
              ? 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)'
              : 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
            color: 'white',
            fontWeight: 600,
            animation: status.connected ? 'pulse 2s infinite' : 'none',
            boxShadow: status.connected ? '0 0 20px rgba(76, 175, 80, 0.5)' : 'none'
          }}
        />
      </Tooltip>
      
      {status.connected && status.wifi && (
        <Tooltip title={`Signal: ${signal.label} (${Math.max(0, 100 + (Number(status.rssi) || -100))}%) • ${status.rssi} dBm`}>
          <Chip
            icon={<WifiIcon />}
            label={signal.label}
            size="small"
            sx={{
              background: signal.color,
              color: 'white',
              fontWeight: 600
            }}
          />
        </Tooltip>
      )}
    </Box>
  );
};

export default ESP32Status;