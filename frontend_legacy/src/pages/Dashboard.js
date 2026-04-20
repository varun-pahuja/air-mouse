import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  ToggleButtonGroup,
  ToggleButton,
  Chip,
  LinearProgress,
  Fade,
  Skeleton,
  Badge,
  Avatar
} from '@mui/material';
import {
  Mouse as MouseIcon,
  TouchApp as TouchIcon,
  SwapVert as ScrollIcon,
  Bluetooth as BluetoothIcon,
  TrendingUp,
  TrendingDown,
  FiberManualRecord as DotIcon
} from '@mui/icons-material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { getUsageStats, getESP32Stats } from '../services/api';

const palette = {
  cyan: '#00bcd4',
  cyanGradient: 'linear-gradient(135deg, #00bcd4 0%, #00838f 100%)',
  orange: '#ff7043',
  orangeGradient: 'linear-gradient(135deg, #ff7043 0%, #f4511e 100%)',
  green: '#66bb6a',
  greenGradient: 'linear-gradient(135deg, #66bb6a 0%, #43a047 100%)',
  purple: '#ab47bc',
  purpleGradient: 'linear-gradient(135deg, #ab47bc 0%, #8e24aa 100%)',
  border: 'rgba(255,255,255,0.1)',
  cardBg: 'rgba(16,18,24,0.6)',
  glassBg: 'rgba(255,255,255,0.02)',
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('7d');
  const [isLive, setIsLive] = useState(false);
  const hasLoadedRef = useRef(false);

  const fetchStats = useCallback(async (silent = false) => {
    try {
      if (!hasLoadedRef.current && !silent) setLoading(true);

      try {
        const esp = await getESP32Stats();
        const d = esp?.data || {};
        setStats({
          totalActions: d.totalActions || 0,
          clicks: d.clicks || 0,
          scrolls: d.scrolls || 0,
          moves: d.moves || 0,
          connections: d.connections || 0,
          totalDuration: d.sessionDuration || 0,
          dailyActivity: d.dailyActivity || {}
        });
        setIsLive(true);
      } catch {
        const res = await getUsageStats(period);
        setStats(res.data);
        setIsLive(false);
      }
    } catch (err) {
      console.error(err);
      setStats({
        totalActions: 0,
        clicks: 0,
        scrolls: 0,
        moves: 0,
        connections: 0,
        totalDuration: 0,
        dailyActivity: {}
      });
      setIsLive(false);
    } finally {
      if (!hasLoadedRef.current) {
        hasLoadedRef.current = true;
        setLoading(false);
      }
    }
  }, [period]);

  useEffect(() => {
    hasLoadedRef.current = false;
    fetchStats(false);
  }, [fetchStats]);

  useEffect(() => {
    const id = setInterval(() => fetchStats(true), 2000);
    return () => clearInterval(id);
  }, [fetchStats]);

  const formatDailyActivity = () => {
    if (!stats?.dailyActivity || Object.keys(stats.dailyActivity).length === 0) {
      return Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - (6 - i) * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        actions: 0
      }));
    }
    return Object.entries(stats.dailyActivity).map(([date, count]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      actions: count
    }));
  };

  const actionDistribution = stats ? [
    { name: 'Clicks', value: stats.clicks || 0, color: palette.orange },
    { name: 'Scrolls', value: stats.scrolls || 0, color: palette.green },
    { name: 'Moves', value: stats.moves || 0, color: palette.cyan },
  ] : [];

  const StatCard = ({ title, value, icon, gradient, delay = 0 }) => (
    <Fade in timeout={600} style={{ transitionDelay: `${delay}ms` }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          height: '100%',
          borderRadius: 3,
          border: `1px solid ${palette.border}`,
          background: palette.cardBg,
          backdropFilter: 'blur(20px)',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
            border: `1px solid rgba(255,255,255,0.15)`,
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: gradient,
          }
        }}
      >
        <Box display="flex" alignItems="flex-start" justifyContent="space-between">
          <Box flex={1}>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'text.secondary', 
                fontWeight: 600, 
                letterSpacing: 1,
                textTransform: 'uppercase',
                fontSize: '0.7rem'
              }}
            >
              {title}
            </Typography>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 800, 
                background: gradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mt: 1,
                mb: 0.5,
                lineHeight: 1.2
              }}
            >
              {loading && !stats ? (
                <Skeleton width={80} />
              ) : (
                Number(value || 0).toLocaleString()
              )}
            </Typography>
          </Box>
          <Avatar
            sx={{
              background: gradient,
              width: 56,
              height: 56,
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
            }}
          >
            {icon}
          </Avatar>
        </Box>
      </Paper>
    </Fade>
  );

  if (loading && !stats) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
        <Box textAlign="center">
          <CircularProgress size={60} thickness={4} sx={{ color: palette.cyan }} />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Loading analytics...
          </Typography>
        </Box>
      </Box>
    );
  }

  const activityPct = Math.min(100, Math.round(
    (stats?.totalActions || 0) / Math.max(1, (stats?.totalActions || 1000) / 100)
  ));

  const totalValue = actionDistribution.reduce((sum, item) => sum + item.value, 0);

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 5 }}>
      {/* Enhanced Header */}
      <Fade in timeout={400}>
        <Box mb={4} display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
          <Box>
            <Box display="flex" alignItems="center" gap={2} mb={1}>
              <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: -1 }}>
                Dashboard
              </Typography>
              <Chip
                icon={<DotIcon sx={{ fontSize: 12, animation: 'none !important' }} />}
                label={isLive ? 'LIVE' : 'HISTORICAL'}
                size="small"
                sx={{
                  background: isLive ? 'rgba(102, 187, 106, 0.15)' : 'rgba(255,255,255,0.05)',
                  color: isLive ? palette.green : 'text.secondary',
                  border: `1px solid ${isLive ? palette.green : palette.border}`,
                  fontWeight: 700,
                  animation: 'none !important',
                  '& .MuiChip-icon': {
                    animation: 'none !important'
                  }
                }}
              />
            </Box>
            <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
              Real-time analytics and performance metrics
              {isLive && ' • Updating every 2 seconds'}
            </Typography>
          </Box>

          <ToggleButtonGroup
            value={period}
            exclusive
            onChange={(e, v) => v && setPeriod(v)}
            size="medium"
            sx={{
              border: `1px solid ${palette.border}`,
              borderRadius: 2,
              backgroundColor: palette.glassBg,
              backdropFilter: 'blur(10px)',
              '& .MuiToggleButton-root': {
                color: 'text.secondary',
                px: 2.5,
                py: 1,
                border: 'none',
                fontWeight: 600,
                transition: 'all 0.2s',
                '&:hover': {
                  background: 'rgba(0, 188, 212, 0.08)'
                }
              },
              '& .Mui-selected': {
                color: palette.cyan,
                background: 'rgba(0, 188, 212, 0.15) !important',
                fontWeight: 700
              }
            }}
          >
            <ToggleButton value="1d">Today</ToggleButton>
            <ToggleButton value="7d">7 Days</ToggleButton>
            <ToggleButton value="30d">30 Days</ToggleButton>
            <ToggleButton value="90d">90 Days</ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Fade>

      <Grid container spacing={3}>
        {/* Enhanced Summary Cards */}
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Actions"
            value={stats?.totalActions}
            gradient={palette.cyanGradient}
            icon={<MouseIcon sx={{ fontSize: 28 }} />}
            delay={0}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Clicks"
            value={stats?.clicks}
            gradient={palette.orangeGradient}
            icon={<TouchIcon sx={{ fontSize: 28 }} />}
            delay={100}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Scrolls"
            value={stats?.scrolls}
            gradient={palette.greenGradient}
            icon={<ScrollIcon sx={{ fontSize: 28 }} />}
            delay={200}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Connections"
            value={stats?.connections}
            gradient={palette.purpleGradient}
            icon={<BluetoothIcon sx={{ fontSize: 28 }} />}
            delay={300}
          />
        </Grid>

        {/* Enhanced Activity Timeline */}
        <Grid item xs={12} lg={8}>
          <Fade in timeout={600} style={{ transitionDelay: '400ms' }}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3.5, 
                height: 420, 
                borderRadius: 3, 
                border: `1px solid ${palette.border}`, 
                background: palette.cardBg,
                backdropFilter: 'blur(20px)',
                transition: 'all 0.3s',
                '&:hover': {
                  border: `1px solid rgba(255,255,255,0.15)`,
                }
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
                    Activity Timeline
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Track your daily usage patterns
                  </Typography>
                </Box>
                <Chip
                  label={`${formatDailyActivity().reduce((sum, d) => sum + d.actions, 0)} total`}
                  size="small"
                  sx={{
                    background: 'rgba(0, 188, 212, 0.1)',
                    color: palette.cyan,
                    fontWeight: 700,
                    border: `1px solid rgba(0, 188, 212, 0.3)`
                  }}
                />
              </Box>

              <Box sx={{ height: 320, mt: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={formatDailyActivity()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="areaCyan" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={palette.cyan} stopOpacity={0.4} />
                        <stop offset="95%" stopColor={palette.cyan} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="5 5" />
                    <XAxis 
                      dataKey="date" 
                      stroke="rgba(255,255,255,0.4)" 
                      style={{ fontSize: 12, fontWeight: 600 }}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="rgba(255,255,255,0.4)" 
                      style={{ fontSize: 12, fontWeight: 600 }}
                      tickLine={false}
                    />
                    <RechartsTooltip
                      contentStyle={{ 
                        background: 'rgba(10,12,16,0.98)', 
                        border: `1px solid ${palette.border}`, 
                        borderRadius: 12,
                        padding: '12px 16px',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
                      }}
                      labelStyle={{ color: '#fff', fontWeight: 700, marginBottom: 8 }}
                      itemStyle={{ color: palette.cyan, fontWeight: 600 }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="actions" 
                      stroke={palette.cyan} 
                      strokeWidth={3} 
                      fill="url(#areaCyan)"
                      animationDuration={1000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Fade>
        </Grid>

        {/* Enhanced Distribution & Activity Score */}
        <Grid item xs={12} lg={4}>
          <Grid container spacing={3}>
            {/* Distribution Pie Chart */}
            <Grid item xs={12}>
              <Fade in timeout={600} style={{ transitionDelay: '500ms' }}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 3, 
                    height: 200, 
                    borderRadius: 3, 
                    border: `1px solid ${palette.border}`, 
                    background: palette.cardBg,
                    backdropFilter: 'blur(20px)',
                    transition: 'all 0.3s',
                    '&:hover': {
                      border: `1px solid rgba(255,255,255,0.15)`,
                    }
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                    Action Distribution
                  </Typography>
                  <Box sx={{ height: 130, display: 'flex', alignItems: 'center' }}>
                    {totalValue > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie 
                            data={actionDistribution} 
                            innerRadius={40} 
                            outerRadius={60} 
                            paddingAngle={5} 
                            dataKey="value"
                            animationDuration={800}
                          >
                            {actionDistribution.map((d, i) => (
                              <Cell key={i} fill={d.color} stroke="none" />
                            ))}
                          </Pie>
                          <RechartsTooltip 
                            contentStyle={{ 
                              background: 'rgba(10,12,16,0.98)', 
                              border: `1px solid ${palette.border}`, 
                              borderRadius: 12,
                              padding: '8px 12px'
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <Box width="100%" textAlign="center">
                        <Typography variant="body2" color="text.secondary">
                          No data available
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Paper>
              </Fade>
            </Grid>

            {/* Enhanced Activity Score */}
            <Grid item xs={12}>
              <Fade in timeout={600} style={{ transitionDelay: '600ms' }}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 3, 
                    borderRadius: 3, 
                    border: `1px solid ${palette.border}`, 
                    background: palette.cardBg,
                    backdropFilter: 'blur(20px)',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s',
                    '&:hover': {
                      border: `1px solid rgba(255,255,255,0.15)`,
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      background: palette.cyanGradient,
                    }
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
                    Activity Score
                  </Typography>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Typography 
                      variant="h2" 
                      sx={{ 
                        background: palette.cyanGradient,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: 900,
                        lineHeight: 1
                      }}
                    >
                      {activityPct}
                    </Typography>
                    <Box>
                      <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 700 }}>
                        %
                      </Typography>
                      <Chip
                        icon={activityPct >= 50 ? <TrendingUp sx={{ fontSize: 14 }} /> : <TrendingDown sx={{ fontSize: 14 }} />}
                        label={activityPct >= 50 ? 'High' : 'Low'}
                        size="small"
                        sx={{
                          background: activityPct >= 50 ? 'rgba(102, 187, 106, 0.15)' : 'rgba(255, 112, 67, 0.15)',
                          color: activityPct >= 50 ? palette.green : palette.orange,
                          fontWeight: 700,
                          height: 20,
                          fontSize: '0.7rem',
                          mt: 0.5
                        }}
                      />
                    </Box>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={activityPct}
                    sx={{
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      '& .MuiLinearProgress-bar': { 
                        background: palette.cyanGradient,
                        borderRadius: 6,
                        transition: 'transform 0.4s ease'
                      }
                    }}
                  />
                </Paper>
              </Fade>
            </Grid>
          </Grid>
        </Grid>

        {/* Enhanced Session Insights */}
        <Grid item xs={12}>
          <Fade in timeout={600} style={{ transitionDelay: '700ms' }}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3.5, 
                borderRadius: 3, 
                border: `1px solid ${palette.border}`, 
                background: palette.cardBg,
                backdropFilter: 'blur(20px)',
                transition: 'all 0.3s',
                '&:hover': {
                  border: `1px solid rgba(255,255,255,0.15)`,
                }
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>
                Session Insights
              </Typography>
              <Grid container spacing={3}>
                {[
                  {
                    label: 'Total Usage Time',
                    value: `${Math.floor((stats?.totalDuration || 0) / 60)} min`,
                    progress: Math.min(100, ((stats?.totalDuration || 0) / 3600) * 100),
                    gradient: palette.cyanGradient,
                    color: palette.cyan,
                    subtitle: `${Math.floor((stats?.totalDuration || 0) % 60)} seconds`
                  },
                  {
                    label: 'Mouse Movements',
                    value: (stats?.moves || 0).toLocaleString(),
                    progress: Math.min(100, ((stats?.moves || 0) / 1000) * 100),
                    gradient: palette.greenGradient,
                    color: palette.green,
                    subtitle: `${((stats?.moves || 0) / Math.max((stats?.totalDuration || 1), 1)).toFixed(1)}/sec`
                  },
                  {
                    label: 'Click Rate',
                    value: `${((stats?.clicks || 0) / Math.max((stats?.totalActions || 1), 1) * 100).toFixed(1)}%`,
                    progress: ((stats?.clicks || 0) / Math.max((stats?.totalActions || 1), 1) * 100),
                    gradient: palette.orangeGradient,
                    color: palette.orange,
                    subtitle: `${stats?.clicks || 0} total clicks`
                  },
                  {
                    label: 'Scroll Rate',
                    value: `${((stats?.scrolls || 0) / Math.max((stats?.totalActions || 1), 1) * 100).toFixed(1)}%`,
                    progress: ((stats?.scrolls || 0) / Math.max((stats?.totalActions || 1), 1) * 100),
                    gradient: palette.purpleGradient,
                    color: palette.purple,
                    subtitle: `${stats?.scrolls || 0} total scrolls`
                  }
                ].map((item, idx) => (
                  <Grid item xs={12} sm={6} lg={3} key={idx}>
                    <Card 
                      elevation={0} 
                      sx={{ 
                        p: 2.5, 
                        borderRadius: 2.5, 
                        border: `1px solid ${palette.border}`, 
                        background: palette.glassBg,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        height: '100%',
                        position: 'relative',
                        overflow: 'hidden',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          border: `1px solid ${item.color}`,
                          boxShadow: `0 12px 40px ${item.color}20`,
                        },
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '2px',
                          background: item.gradient,
                        }
                      }}
                    >
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: 'text.secondary', 
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: 0.5,
                          fontSize: '0.7rem'
                        }}
                      >
                        {item.label}
                      </Typography>
                      <Typography 
                        variant="h4" 
                        sx={{ 
                          fontWeight: 800, 
                          background: item.gradient,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          mt: 1,
                          mb: 0.5 
                        }}
                      >
                        {item.value}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                        {item.subtitle}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={item.progress}
                        sx={{
                          mt: 2,
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: 'rgba(255,255,255,0.05)',
                          '& .MuiLinearProgress-bar': { 
                            background: item.gradient,
                            borderRadius: 3,
                            transition: 'transform 0.6s ease'
                          }
                        }}
                      />
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Fade>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;