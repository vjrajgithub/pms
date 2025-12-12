import React, { useEffect, useState } from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { getChildren } from '../../api/categories';

export default function CategoryCascader({ maxLevels = 6 }) {
  const [levels, setLevels] = useState([[]]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    (async () => {
      const top = await getChildren(null);
      setLevels([top]);
      setSelected([]);
    })();
  }, []);

  const handleChange = async (levelIndex, value) => {
    const newSelected = selected.slice(0, levelIndex);
    newSelected[levelIndex] = value;
    setSelected(newSelected);

    const parentId = value || null;
    const children = parentId ? await getChildren(parentId) : [];

    const newLevels = levels.slice(0, levelIndex + 1);
    if (children.length > 0 && levelIndex + 1 < maxLevels) {
      newLevels[levelIndex + 1] = children;
    } else {
      newLevels.length = levelIndex + 1;
    }
    setLevels(newLevels);
  };

  return (
    <Box>
      <Typography variant="h6" mb={1}>Select Category Path</Typography>
      <Box display="flex" gap={2} flexWrap="wrap">
        {levels.map((opts, idx) => (
          <FormControl key={idx} size="small" sx={{ minWidth: 220 }}>
            <InputLabel>Level {idx + 1}</InputLabel>
            <Select
              label={`Level ${idx + 1}`}
              value={selected[idx] || ''}
              onChange={(e) => handleChange(idx, e.target.value)}
            >
              <MenuItem value="">None</MenuItem>
              {opts.map(o => (
                <MenuItem key={o.id} value={o.id}>{o.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        ))}
      </Box>
      {selected.length > 0 && (
        <Typography variant="body2" color="text.secondary" mt={1}>
          Selected Path: {selected.filter(Boolean).join(' > ')}
        </Typography>
      )}
    </Box>
  );
}
