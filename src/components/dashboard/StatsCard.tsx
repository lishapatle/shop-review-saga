import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend: string;
  trendUp: boolean;
  description: string;
}

const StatsCard = ({ title, value, icon: Icon, trend, trendUp, description }: StatsCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 animate-fade-in">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-center space-x-2">
              <p className="text-2xl font-bold">{value}</p>
              <Badge 
                variant="secondary" 
                className={`text-xs ${trendUp ? 'bg-success/10 text-success border-success/20' : 'bg-destructive/10 text-destructive border-destructive/20'}`}
              >
                {trend}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          <div className="p-3 rounded-xl bg-gradient-primary">
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;