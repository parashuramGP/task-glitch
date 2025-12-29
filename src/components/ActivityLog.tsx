import { Card, CardContent, List, ListItem, ListItemText, Typography } from '@mui/material';

export interface ActivityItem {
  id: string;
  ts: number;
  type: 'add' | 'update' | 'delete' | 'undo';
  summary: string;
}

interface Props {
  items: ActivityItem[];
}

export default function ActivityLog({ items }: Props) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Activity
        </Typography>

        <List dense>
          {items.length === 0 && (
            <ListItem>
              <ListItemText primary="No recent activity" />
            </ListItem>
          )}

          {items.map(item => (
            <ListItem key={item.id} divider>
              <ListItemText
                primary={item.summary}
                secondary={new Date(item.ts).toLocaleString()}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
