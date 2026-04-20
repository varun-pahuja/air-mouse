import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Box,
  Paper,
  Avatar,
  Chip,
  Skeleton,
  Tooltip,
  Divider,
  Fade,
  Badge,
} from '@mui/material';
import {
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Code as CodeIcon,
  EmojiEvents as TrophyIcon,
  Lightbulb as IdeaIcon
} from '@mui/icons-material';
import { getTeam } from '../services/api';

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
};

const Team = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  const fallbackStudents = [
    {
      id: 's1',
      type: 'student',
      name: 'Varun Pahuja',
      college: 'Madhav Institute Of Science And Technology',
      github: 'https://github.com/itachi-47',
      linkedin: 'https://www.linkedin.com/in/varun-pahuja475',
      image: '',
      skills: ['React', 'Node.js', 'MongoDB']
    },
    {
      id: 's2',
      type: 'student',
      name: 'Ojaswi Anand sharma',
      college: 'Madhav Institute Of Science And Technology',
      github: 'https://github.com/ojaswii333',
      linkedin: 'https://www.linkedin.com/in/ojaswi-anand-sharma-7080b434a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
      image: '',
      skills: ['MPU6050', 'IOT', 'ESP32']
    }
  ];

  const fallbackFaculty = [
    {
      id: 'f1',
      type: 'faculty',
      name: 'Dr Aftab Ahmed Ansari',
      position: 'Assistant Professor',
      college: 'Madhav Institute Of Science And Technology',
      email: 'prof.a@example.com',
      linkedin: 'https://www.linkedin.com/in/dr-aftab-ahmed-ansari-8b5361a4?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
      image: '',
      department: 'IOT'
    },
    {
      id: 'f2',
      type: 'faculty',
      name: 'Dr Rupam Shrivastava',
      position: 'Associate Professor',
      college: 'Madhav Institute Of Science And Technology',
      linkedin: '',
      image: '',
      department: 'IOT'
    }
  ];

  // Function to check if data is placeholder/demo data
  const isPlaceholderData = (member) => {
    const placeholderNames = [
      'your name',
      'team member',
      'student name',
      'faculty name',
      'john doe',
      'jane doe',
      'member 1',
      'member 2'
    ];
    const name = (member.name || '').toLowerCase();
    return placeholderNames.some(placeholder => name.includes(placeholder));
  };

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await getTeam();
        const data = Array.isArray(res?.data) ? res.data : [];
        
        // Filter out placeholder data
        const validData = data.filter(member => !isPlaceholderData(member));
        
        setTeam(validData);
      } catch (e) {
        console.error('Error fetching team:', e);
        setTeam([]);
      } finally {
        setTimeout(() => setLoading(false), 300);
      }
    };
    fetchTeam();
  }, []);

  const studentsFromAPI = team.filter((m) =>
    (m.type === 'student') ||
    (m.category === 'student') ||
    ((/student|developer|engineer/i.test(m.role || '')) && (!/prof|faculty|mentor/i.test(m.role || '')))
  );

  const facultyFromAPI = team.filter((m) =>
    (m.type === 'faculty') ||
    (m.category === 'faculty') ||
    /prof|faculty|mentor/i.test((m.position || m.role || ''))
  );

  // Use fallback data if API data is empty or invalid
  const students = (studentsFromAPI.length > 0 ? studentsFromAPI : fallbackStudents).slice(0, 2);
  const faculty = (facultyFromAPI.length > 0 ? facultyFromAPI : fallbackFaculty).slice(0, 2);

  const StatsCard = ({ label, value, icon, gradient, delay = 0 }) => (
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
        <Box display="flex" flexDirection="column" alignItems="center" gap={1.5}>
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
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 900,
              background: gradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1
            }}
          >
            {value}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              fontWeight: 600,
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              fontSize: '0.75rem'
            }}
          >
            {label}
          </Typography>
        </Box>
      </Paper>
    </Fade>
  );

  const StudentCard = ({ member, delay = 0 }) => (
    <Fade in timeout={600} style={{ transitionDelay: `${delay}ms` }}>
      <Card 
        elevation={0}
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          borderRadius: 3,
          border: `1px solid ${palette.border}`,
          background: palette.cardBg,
          backdropFilter: 'blur(20px)',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
            border: `1px solid rgba(0, 188, 212, 0.3)`,
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: palette.cyanGradient,
          }
        }}
      >
        {/* Background decoration */}
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0, 188, 212, 0.1) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 5, pb: 2, position: 'relative' }}>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: palette.cyanGradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '3px solid rgba(16,18,24,0.9)'
                }}
              >
                <CodeIcon sx={{ fontSize: 14, color: '#fff' }} />
              </Box>
            }
          >
            <Avatar
              sx={{
                width: 120,
                height: 120,
                border: `4px solid transparent`,
                backgroundImage: palette.cyanGradient,
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box',
                boxShadow: '0 8px 32px rgba(0, 188, 212, 0.3)',
                fontSize: 48,
                fontWeight: 900,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 12px 40px rgba(0, 188, 212, 0.5)',
                }
              }}
              alt={member.name}
              src={member.image || ''}
            >
              {!member.image ? (member.name?.charAt(0) || <PersonIcon fontSize="large" />) : null}
            </Avatar>
          </Badge>
        </Box>

        <CardContent sx={{ flexGrow: 1, textAlign: 'center', px: 3, pb: 3 }}>
          <Typography 
            variant="h5" 
            component="h2" 
            gutterBottom 
            sx={{ 
              fontWeight: 800,
              mb: 1.5,
              background: palette.cyanGradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {member.name}
          </Typography>

          <Box display="flex" justifyContent="center" gap={1} flexWrap="wrap" mb={2}>
            {member.role && (
              <Chip 
                label={member.role} 
                size="small" 
                sx={{ 
                  fontWeight: 700,
                  background: 'rgba(0, 188, 212, 0.15)',
                  color: palette.cyan,
                  border: `1px solid rgba(0, 188, 212, 0.3)`,
                  fontSize: '0.75rem'
                }} 
              />
            )}
            {member.college && (
              <Chip 
                icon={<SchoolIcon sx={{ fontSize: 14 }} />}
                label={member.college} 
                size="small" 
                sx={{ 
                  fontWeight: 600,
                  bgcolor: 'rgba(255,255,255,0.05)',
                  fontSize: '0.7rem',
                  maxWidth: '100%',
                  height: 'auto',
                  '& .MuiChip-label': {
                    whiteSpace: 'normal',
                    padding: '4px 8px'
                  }
                }} 
              />
            )}
          </Box>

          {member.bio && (
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                mt: 2,
                mb: 2,
                lineHeight: 1.6,
                fontWeight: 500,
                minHeight: 40
              }}
            >
              {member.bio}
            </Typography>
          )}

          {member.skills && member.skills.length > 0 && (
            <Box display="flex" justifyContent="center" gap={0.5} flexWrap="wrap" mt={2} mb={2}>
              {member.skills.map((skill, idx) => (
                <Chip
                  key={idx}
                  label={skill}
                  size="small"
                  sx={{
                    fontSize: '0.7rem',
                    height: 24,
                    fontWeight: 600,
                    bgcolor: 'rgba(255,255,255,0.05)',
                    border: `1px solid ${palette.border}`,
                    '&:hover': {
                      bgcolor: 'rgba(0, 188, 212, 0.1)',
                      borderColor: palette.cyan
                    }
                  }}
                />
              ))}
            </Box>
          )}

          <Divider sx={{ my: 2, opacity: 0.1 }} />

          <Box display="flex" justifyContent="center" gap={1} mt={2}>
            {member.github && (
              <Tooltip title="GitHub" arrow>
                <IconButton 
                  component="a" 
                  href={member.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  sx={{
                    background: 'rgba(255,255,255,0.05)',
                    border: `1px solid ${palette.border}`,
                    transition: 'all 0.2s',
                    '&:hover': {
                      background: 'rgba(0, 188, 212, 0.1)',
                      borderColor: palette.cyan,
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <GitHubIcon sx={{ color: palette.cyan }} />
                </IconButton>
              </Tooltip>
            )}
            {member.linkedin && (
              <Tooltip title="LinkedIn" arrow>
                <IconButton 
                  component="a" 
                  href={member.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  sx={{
                    background: 'rgba(255,255,255,0.05)',
                    border: `1px solid ${palette.border}`,
                    transition: 'all 0.2s',
                    '&:hover': {
                      background: 'rgba(0, 188, 212, 0.1)',
                      borderColor: palette.cyan,
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <LinkedInIcon sx={{ color: palette.cyan }} />
                </IconButton>
              </Tooltip>
            )}
            {member.email && (
              <Tooltip title="Email" arrow>
                <IconButton 
                  component="a" 
                  href={`mailto:${member.email}`}
                  sx={{
                    background: 'rgba(255,255,255,0.05)',
                    border: `1px solid ${palette.border}`,
                    transition: 'all 0.2s',
                    '&:hover': {
                      background: 'rgba(0, 188, 212, 0.1)',
                      borderColor: palette.cyan,
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <EmailIcon sx={{ color: palette.cyan }} />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );

  const FacultyCard = ({ person, delay = 0 }) => (
    <Fade in timeout={600} style={{ transitionDelay: `${delay}ms` }}>
      <Card 
        elevation={0}
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          borderRadius: 3,
          border: `1px solid ${palette.border}`,
          background: palette.cardBg,
          backdropFilter: 'blur(20px)',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
            border: `1px solid rgba(171, 71, 188, 0.3)`,
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: palette.purpleGradient,
          }
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(171, 71, 188, 0.1) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 5, pb: 2, position: 'relative' }}>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: palette.purpleGradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '3px solid rgba(16,18,24,0.9)'
                }}
              >
                <IdeaIcon sx={{ fontSize: 14, color: '#fff' }} />
              </Box>
            }
          >
            <Avatar
              sx={{
                width: 120,
                height: 120,
                border: `4px solid transparent`,
                backgroundImage: palette.purpleGradient,
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box',
                boxShadow: '0 8px 32px rgba(171, 71, 188, 0.3)',
                fontSize: 48,
                fontWeight: 900,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 12px 40px rgba(171, 71, 188, 0.5)',
                }
              }}
              alt={person.name}
              src={person.image || ''}
            >
              {!person.image ? (person.name?.charAt(0) || <PersonIcon fontSize="large" />) : null}
            </Avatar>
          </Badge>
        </Box>

        <CardContent sx={{ flexGrow: 1, textAlign: 'center', px: 3, pb: 3 }}>
          <Typography 
            variant="h5" 
            component="h2" 
            gutterBottom 
            sx={{ 
              fontWeight: 800,
              mb: 1.5,
              background: palette.purpleGradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {person.name}
          </Typography>

          <Box display="flex" justifyContent="center" gap={1} flexWrap="wrap" mb={2}>
            {person.position && (
              <Chip 
                label={person.position} 
                size="small" 
                sx={{ 
                  fontWeight: 700,
                  background: 'rgba(171, 71, 188, 0.15)',
                  color: palette.purple,
                  border: `1px solid rgba(171, 71, 188, 0.3)`,
                  fontSize: '0.75rem'
                }} 
              />
            )}
            {person.department && (
              <Chip 
                label={person.department} 
                size="small" 
                sx={{ 
                  fontWeight: 600,
                  bgcolor: 'rgba(255,255,255,0.05)',
                  fontSize: '0.7rem'
                }} 
              />
            )}
          </Box>

          {person.college && (
            <Box display="flex" justifyContent="center" alignItems="center" gap={1} mt={2} px={2}>
              <SchoolIcon sx={{ fontSize: 16, color: 'text.secondary', flexShrink: 0 }} />
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  fontWeight: 500,
                  textAlign: 'center',
                  lineHeight: 1.4
                }}
              >
                {person.college}
              </Typography>
            </Box>
          )}

          <Divider sx={{ my: 2, opacity: 0.1 }} />

          <Box display="flex" justifyContent="center" gap={1} mt={2}>
            {person.linkedin && (
              <Tooltip title="LinkedIn" arrow>
                <IconButton 
                  component="a" 
                  href={person.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  sx={{
                    background: 'rgba(255,255,255,0.05)',
                    border: `1px solid ${palette.border}`,
                    transition: 'all 0.2s',
                    '&:hover': {
                      background: 'rgba(171, 71, 188, 0.1)',
                      borderColor: palette.purple,
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <LinkedInIcon sx={{ color: palette.purple }} />
                </IconButton>
              </Tooltip>
            )}
            {person.email && (
              <Tooltip title="Email" arrow>
                <IconButton 
                  component="a" 
                  href={`mailto:${person.email}`}
                  sx={{
                    background: 'rgba(255,255,255,0.05)',
                    border: `1px solid ${palette.border}`,
                    transition: 'all 0.2s',
                    '&:hover': {
                      background: 'rgba(171, 71, 188, 0.1)',
                      borderColor: palette.purple,
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <EmailIcon sx={{ color: palette.purple }} />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );

  const SkeletonCard = () => (
    <Card 
      elevation={0}
      sx={{ 
        height: '100%',
        borderRadius: 3,
        border: `1px solid ${palette.border}`,
        background: palette.cardBg,
        backdropFilter: 'blur(20px)'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 5, pb: 2 }}>
        <Skeleton variant="circular" width={120} height={120} sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
      </Box>
      <CardContent sx={{ textAlign: 'center', px: 3 }}>
        <Skeleton variant="text" width="70%" sx={{ mx: 'auto', mb: 1, bgcolor: 'rgba(255,255,255,0.05)' }} height={32} />
        <Skeleton variant="text" width="50%" sx={{ mx: 'auto', mb: 2, bgcolor: 'rgba(255,255,255,0.05)' }} />
        <Skeleton variant="rectangular" height={60} sx={{ mt: 2, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.05)' }} />
        <Box display="flex" justifyContent="center" gap={1} mt={3}>
          <Skeleton variant="circular" width={40} height={40} sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
          <Skeleton variant="circular" width={40} height={40} sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
          <Skeleton variant="circular" width={40} height={40} sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>
      {/* Enhanced Header */}
      <Fade in timeout={400}>
        <Paper 
          elevation={0}
          sx={{ 
            p: { xs: 3, md: 5 },
            mb: 5, 
            textAlign: 'center',
            borderRadius: 4,
            border: `1px solid ${palette.border}`,
            background: palette.cardBg,
            backdropFilter: 'blur(20px)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: `linear-gradient(90deg, ${palette.cyan}, ${palette.purple}, ${palette.orange})`,
            }
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: -100,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 300,
              height: 300,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0, 188, 212, 0.08) 0%, transparent 70%)',
              pointerEvents: 'none'
            }}
          />
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 900,
              mb: 1.5,
              letterSpacing: -1,
              background: `linear-gradient(135deg, ${palette.cyan}, ${palette.purple})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Meet Our Team
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500, maxWidth: 600, mx: 'auto' }}>
            The brilliant minds behind the ESP32 BLE Mouse Project
          </Typography>
        </Paper>
      </Fade>

      {/* Students Section */}
      <Fade in timeout={500}>
        <Box mb={3} display="flex" alignItems="center" gap={2}>
          <Box
            sx={{
              width: 4,
              height: 32,
              background: palette.cyanGradient,
              borderRadius: 2
            }}
          />
          <Box flex={1}>
            <Typography variant="h4" sx={{ fontWeight: 900, mb: 0.5 }}>
              Student Developers
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              Innovative minds building the future
            </Typography>
          </Box>
          <Chip 
            icon={<CodeIcon />}
            label={`${students.length} ${students.length === 1 ? 'Member' : 'Members'}`}
            sx={{
              fontWeight: 700,
              background: 'rgba(0, 188, 212, 0.15)',
              color: palette.cyan,
              border: `1px solid rgba(0, 188, 212, 0.3)`
            }}
          />
        </Box>
      </Fade>

      <Grid container spacing={3} sx={{ mb: 6 }}>
        {loading
          ? Array.from({ length: 2 }).map((_, i) => (
              <Grid item xs={12} md={6} key={`s-load-${i}`}>
                <SkeletonCard />
              </Grid>
            ))
          : students.map((m, idx) => (
              <Grid item xs={12} md={6} key={m.id || m.name}>
                <StudentCard member={{ ...m, type: 'student' }} delay={idx * 100} />
              </Grid>
            ))}
      </Grid>

      {/* Faculty Mentors Section */}
      <Fade in timeout={500} style={{ transitionDelay: '200ms' }}>
        <Box mb={3} display="flex" alignItems="center" gap={2}>
          <Box
            sx={{
              width: 4,
              height: 32,
              background: palette.purpleGradient,
              borderRadius: 2
            }}
          />
          <Box flex={1}>
            <Typography variant="h4" sx={{ fontWeight: 900, mb: 0.5 }}>
              Faculty Mentors
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              Guiding and inspiring excellence
            </Typography>
          </Box>
          <Chip 
            icon={<IdeaIcon />}
            label={`${faculty.length} ${faculty.length === 1 ? 'Mentor' : 'Mentors'}`}
            sx={{
              fontWeight: 700,
              background: 'rgba(171, 71, 188, 0.15)',
              color: palette.purple,
              border: `1px solid rgba(171, 71, 188, 0.3)`
            }}
          />
        </Box>
      </Fade>

      <Grid container spacing={3} sx={{ mb: 6 }}>
        {loading
          ? Array.from({ length: 2 }).map((_, i) => (
              <Grid item xs={12} md={6} key={`f-load-${i}`}>
                <SkeletonCard />
              </Grid>
            ))
          : faculty.map((f, idx) => (
              <Grid item xs={12} md={6} key={f.id || f.name}>
                <FacultyCard person={{ ...f, type: 'faculty' }} delay={(students.length + idx) * 100} />
              </Grid>
            ))}
      </Grid>

      {/* Enhanced Project Statistics */}
      <Fade in timeout={600} style={{ transitionDelay: '400ms' }}>
        <Paper 
          elevation={0}
          sx={{ 
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            border: `1px solid ${palette.border}`,
            background: palette.cardBg,
            backdropFilter: 'blur(20px)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              bottom: -50,
              right: -50,
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(102, 187, 106, 0.08) 0%, transparent 70%)',
              pointerEvents: 'none'
            }}
          />
          
          <Box textAlign="center" mb={4}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 900, mb: 1 }}>
              Project Highlights
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
              Key achievements and milestones
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={6} sm={6} md={3}>
              <StatsCard 
                label="Team Members" 
                value={students.length} 
                icon={<PersonIcon fontSize="large" />}
                gradient={palette.cyanGradient}
                delay={0}
              />
            </Grid>
            <Grid item xs={6} sm={6} md={3}>
              <StatsCard 
                label="Faculty Mentors" 
                value={faculty.length}
                icon={<IdeaIcon fontSize="large" />}
                gradient={palette.purpleGradient}
                delay={100}
              />
            </Grid>
            <Grid item xs={6} sm={6} md={3}>
              <StatsCard 
                label="Lines of Code" 
                value="500+"
                icon={<CodeIcon fontSize="large" />}
                gradient={palette.greenGradient}
                delay={200}
              />
            </Grid>
            <Grid item xs={6} sm={6} md={3}>
              <StatsCard 
                label="Components" 
                value="3"
                icon={<TrophyIcon fontSize="large" />}
                gradient={palette.orangeGradient}
                delay={300}
              />
            </Grid>
          </Grid>
        </Paper>
      </Fade>
    </Container>
  );
};

export default Team;