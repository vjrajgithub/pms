import React from 'react';
import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import CategoryTree from '../components/Categories/CategoryTree';
import CategoryCascader from '../components/Categories/CategoryCascader';
import { useAuth } from '../contexts/AuthContext';

export default function Categories() {
  const { user } = useAuth();
  const permissions = user?.role?.permissions || {};
  const canManage = (permissions.categories || []).some(p => ['create','update','delete','manage'].includes(p)) || user?.role?.name === 'manager';

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight="bold" mb={2}>Client Hierarchy</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <CategoryTree canManage={canManage} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={5}>
          <Card>
            <CardContent>
              <CategoryCascader />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
