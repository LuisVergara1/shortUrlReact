import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import data from '../../data.json';
import Grid from '@mui/material/Grid';

const ListUrl = () => {
  const [urls, setUrls] = useState([]);

  useEffect(() => {
    // Cargar datos del archivo JSON
    setUrls(data);
  }, []);

  const handleUrlClick = (url) => {
    window.open(url, '_blank');
  };

  return (
<Box display="flex" flexDirection="column" alignItems="center" p={2}>
  <Typography variant="h4" component="h1" gutterBottom>
    Lista de URLs
  </Typography>
  <Grid container spacing={2} justifyContent="center">
    {urls.map((item, index) => (
      <Grid item xs={12} sm={12} md={6} lg={6} key={index}>
        <Card variant="outlined" sx={{ width: '100%' }}>
          <CardContent>
            <Typography variant="h6" component="div">
              {item.name}
            </Typography>
            <Typography 
              variant="body2" 
              color="textSecondary" 
              component="div" 
              sx={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '100%'
              }}
            >
              <Button onClick={() => handleUrlClick(item.url)}>{item.url}</Button>
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
</Box>
);
};

export default ListUrl;