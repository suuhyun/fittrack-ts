import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type DashboardCardProps = {
  title: string;
  stats: {
    value: string | number;
    changeText?: string;
    changeColor?: string;
  };
  icon: React.ReactNode;
};

const DashboardCard = ({ title, stats, icon }: DashboardCardProps) => {
  return (
    <div className="w-full">
      <Card className="p-6 border-0">
        <CardHeader className="p-0 flex flex-row items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <div>{icon}</div>
        </CardHeader>
        <CardContent className="p-0 py-2 text-4xl font-bold">
          {stats.value}
        </CardContent>
        <p
          className={`text-sm ${
            stats.changeColor ? stats.changeColor : "text-gray-400"
          }`}
        >
          {stats.changeText}
        </p>
      </Card>
    </div>
  );
};

export default DashboardCard;
