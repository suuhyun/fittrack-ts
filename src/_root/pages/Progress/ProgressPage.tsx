import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UserStats from "@/components/shared/UserStats";
import { useUserContext } from "@/context/AuthContext";

const ProgressPage = () => {
  const { user } = useUserContext();
  const chartData = Object.entries(user.weeklyProgress)
  
    .map(([week, progress]) => ({
      week,
      weekNumber: parseInt(week.split("-W")[1], 10), // Extract numeric week value
      ...progress,
    }))
    .sort((a, b) => a.weekNumber - b.weekNumber);
  console.log(chartData);
  const hasEnoughData = chartData.length > 1;

  return (
    <div className="px-10 md:px-15 pt-3">
      <header className="mt-5 mb-10">
        <h1 className="text-4xl font-bold mb-2">
          Your Weekly Progress
        </h1>
        <p className="text-gray-500">
          Gain insights into your workouts, activity trends, and calorie burn
          rates.
        </p>
      </header>
      <div className="flex flex-col gap-5">

      <UserStats />

      {hasEnoughData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white shadow">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800">
                Active Minutes Trend
              </CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer>
                <LineChart data={chartData}>
                  <Line
                    type="monotone"
                    dataKey="totalActiveMinutes"
                    stroke="#5046e5"
                    strokeWidth={3}
                    dot={{ r: 5 }}
                  />
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" tickMargin={10} />
                  <YAxis />
                  <Tooltip
                    content={({ payload, label }) => {
                      if (payload && payload.length) {
                        return (
                          <div className="bg-white p-2 shadow rounded text-sm">
                            <p className="font-semibold text-gray-800">
                              Week: {label}
                            </p>
                            <p className="text-gray-600">
                              Active Minutes:{" "}
                              <span className="font-medium text-[#6C66E2]">
                                {payload[0].value} mins
                              </span>
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-white shadow">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800">
                Calories Burned Per Week
              </CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              {/* Wrapper div with explicit background and hover style fixes */}
              <div className="bg-white h-full">
                <ResponsiveContainer>
                  <BarChart data={chartData} barCategoryGap="17%">
                    <Bar
                      dataKey="totalCaloriesBurned"
                      fill="#5046e5"
                      radius={[10, 10, 0, 0]}
                    />
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" tickMargin={10} />
                    <YAxis />
                    <Tooltip
                      cursor={false}
                      content={({ payload, label }) => {
                        if (payload && payload.length) {
                          return (
                            <div
                              className="bg-white p-3 shadow-lg rounded-md border text-sm"
                              style={{
                                background: "white",
                                color: "black",
                                pointerEvents: "none",
                              }}
                            >
                              <p className="font-semibold text-gray-800">
                                Week: {label}
                              </p>
                              <p className="text-gray-600">
                                Calories Burned:{" "}
                                <span className="font-medium text-[#6C66E2]">
                                  {payload[0].value} kcal
                                </span>
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="text-center py-10">
          <h2 className="text-xl font-semibold text-gray-700">
            Not enough data to display charts.
          </h2>
          <p className="text-gray-500">
            Start logging your workouts to see trends and insights here.
          </p>
        </div>
      )}
    </div>
    </div>
  );
};

export default ProgressPage;
