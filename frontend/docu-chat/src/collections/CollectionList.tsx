import { useState } from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

interface Comparison {
  id: number;
  title: string;
  description: string;
}

interface ComparisonListProps {
  comparisons: Comparison[];
}

const ComparisonList: React.FC<ComparisonListProps> = ({ comparisons }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleClick = (index: number) => {
    if (selectedIndex === index) {
      setSelectedIndex(null);
    } else {
      setSelectedIndex(index);
    }
  };

  return (
    <div>
      {comparisons.map((comparison, index) => (
        <div key={comparison.id}>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleClick(index)}
              selected={selectedIndex === index}
            >
              <ListItemText primary={comparison.title} />
            </ListItemButton>
          </ListItem>
          <Collapse in={selectedIndex === index} timeout="auto" unmountOnExit>
            <Card sx={{ marginBottom: 1 }}>
              <CardContent>
                <Typography variant="h6" component="div">
                  {comparison.title}
                </Typography>
                <Typography>{comparison.description}</Typography>
              </CardContent>
            </Card>
          </Collapse>
        </div>
      ))}
    </div>
  );
};
