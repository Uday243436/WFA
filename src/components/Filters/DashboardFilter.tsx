import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { Calendar, RotateCcw, Search, SlidersHorizontal } from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';
import type { DashboardFilters } from '../../models/DashboardModels';

const departments = ['Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'HR'];
const roles = [
  'Frontend Engineer',
  'Backend Engineer',
  'Fullstack Engineer',
  'Engineering Manager',
  'Product Manager',
  'Product Designer',
  'Marketing Specialist',
  'Sales Executive',
  'HR Manager',
];
const locations = ['Chennai', 'Bangalore', 'Hyderabad', 'Pune'];
const statuses: DashboardFilters['status'][] = ['All', 'Active', 'Inactive'];
const riskLevels: DashboardFilters['riskLevel'][] = ['All', 'Low', 'Medium', 'High'];

const filterControlSx = {
  '& .MuiInputLabel-root': {
    color: 'var(--text-secondary)',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: 'var(--primary-accent)',
  },
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    backgroundColor: 'var(--bg-surface)',
    color: 'var(--text-primary)',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'var(--border-color)',
  },
  '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'var(--border-strong)',
  },
  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: 'var(--primary-accent)',
  },
  '& .MuiSvgIcon-root': {
    color: 'var(--text-secondary)',
  },
};

export function DashboardFilter() {
  const {
    filters,
    changeDepartment,
    changeRole,
    changeLocation,
    changeStatus,
    changeRiskLevel,
    changeSearchQuery,
    changeDateRange,
    resetAllFilters,
  } = useDashboard();
  const [searchText, setSearchText] = useState(filters.searchQuery);
  const [startDate, setStartDate] = useState(filters.dateRange.startDate || '');
  const [endDate, setEndDate] = useState(filters.dateRange.endDate || '');

  const handleApply = () => {
    changeSearchQuery(searchText);
    changeDateRange(startDate || null, endDate || null);
  };

  const handleReset = () => {
    setSearchText('');
    setStartDate('');
    setEndDate('');
    resetAllFilters();
  };

  return (
    <Box sx={{ pt: 5, pb: 2 }}>
      <Paper
        elevation={12}
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          p: 4,
          borderRadius: '8px',
          border: '1px solid var(--glass-border)',
          background: 'var(--surface-gradient)',
          boxShadow: 'var(--shadow-md)',
          color: 'var(--text-primary)',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
            <SlidersHorizontal color="var(--primary-accent)" size={28} />
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', letterSpacing: 0, color: 'var(--primary-accent)' }}>
                Workforce Dashboard
              </Typography>
              <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                Refine your view with department, role, location, risk, date range, and search filters.
              </Typography>
            </Box>
          </Box>
          <Typography sx={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
            5 filter categories - quick search
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(5, minmax(0, 1fr))' },
            gap: 3,
          }}
        >
          <FormControl fullWidth sx={filterControlSx}>
            <InputLabel>Department</InputLabel>
            <Select
              value={filters.department === 'All' ? '' : filters.department}
              label="Department"
              onChange={(e: SelectChangeEvent<string>) => changeDepartment(e.target.value || 'All')}
            >
              <MenuItem value="">All Departments</MenuItem>
              {departments.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={filterControlSx}>
            <InputLabel>Role</InputLabel>
            <Select
              value={filters.role === 'All' ? '' : filters.role}
              label="Role"
              onChange={(e: SelectChangeEvent<string>) => changeRole(e.target.value || 'All')}
            >
              <MenuItem value="">All Roles</MenuItem>
              {roles.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={filterControlSx}>
            <InputLabel>Location</InputLabel>
            <Select
              value={filters.location === 'All' ? '' : filters.location}
              label="Location"
              onChange={(e: SelectChangeEvent<string>) => changeLocation(e.target.value || 'All')}
            >
              <MenuItem value="">All Locations</MenuItem>
              {locations.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={filterControlSx}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status === 'All' ? '' : filters.status}
              label="Status"
              onChange={(e: SelectChangeEvent<string>) => changeStatus((e.target.value || 'All') as DashboardFilters['status'])}
            >
              <MenuItem value="">All Status</MenuItem>
              {statuses.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={filterControlSx}>
            <InputLabel>Risk Level</InputLabel>
            <Select
              value={filters.riskLevel === 'All' ? '' : filters.riskLevel}
              label="Risk Level"
              onChange={(e: SelectChangeEvent<string>) =>
                changeRiskLevel((e.target.value || 'All') as DashboardFilters['riskLevel'])
              }
            >
              <MenuItem value="">All Risk Levels</MenuItem>
              {riskLevels
                .filter((item) => item !== 'All')
                .map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, minmax(0, 1fr))' },
            gap: 3,
            mt: 3,
          }}
        >
          <TextField
            fullWidth
            label="Search"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            variant="outlined"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="rgba(100,116,139,0.8)" size={18} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              ...filterControlSx,
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-primary)',
              },
            }}
          />
          <TextField
            fullWidth
            type="date"
            label="Start Date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
            variant="outlined"
            slotProps={{
              inputLabel: {
                shrink: true,
                sx: { left: 12 },
              },
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <Calendar color="rgba(100,116,139,0.65)" size={18} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              ...filterControlSx,
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                minHeight: 56,
              },
              '& .MuiOutlinedInput-input': {
                padding: '14px 12px 12px',
              },
            }}
          />
          <TextField
            fullWidth
            type="date"
            label="End Date"
            value={endDate}
            onChange={(event) => setEndDate(event.target.value)}
            variant="outlined"
            slotProps={{
              inputLabel: {
                shrink: true,
                sx: { left: 12 },
              },
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <Calendar color="rgba(100,116,139,0.65)" size={18} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              ...filterControlSx,
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                minHeight: 56,
              },
              '& .MuiOutlinedInput-input': {
                padding: '14px 12px 12px',
              },
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 5, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<RotateCcw size={18} />}
            onClick={handleReset}
            sx={{
              borderRadius: '8px',
              px: 3,
              py: 1.2,
              textTransform: 'none',
              fontWeight: 'bold',
              borderColor: 'var(--border-color)',
              color: 'var(--text-secondary)',
            }}
          >
            Reset
          </Button>
          <Button
            variant="contained"
            startIcon={<Search size={18} />}
            onClick={handleApply}
            sx={{
              borderRadius: '8px',
              px: 4,
              py: 1.2,
              textTransform: 'none',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, var(--primary-accent), var(--secondary-accent))',
              boxShadow: '0 16px 32px var(--primary-accent-glow)',
            }}
          >
            Apply Filters
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default DashboardFilter;
