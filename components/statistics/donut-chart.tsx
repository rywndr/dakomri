"use client";

import { Pie, PieChart } from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

interface DonutChartComponentProps {
    title: string;
    description?: string;
    data: Array<{ label: string; value: number }>;
}

export function DonutChartComponent({
    title,
    description,
    data,
}: DonutChartComponentProps) {
    const colors = [
        "var(--chart-1)",
        "var(--chart-2)",
        "var(--chart-3)",
        "var(--chart-4)",
        "var(--chart-5)",
    ];

    // Transform data ke format recharts
    const chartData = data.map((item, index) => ({
        name: item.label,
        value: item.value,
        fill: colors[index % colors.length],
    }));

    // Generate config dinamis
    const chartConfig = data.reduce(
        (acc, item, index) => {
            const key = `item${index}`;
            acc[key] = {
                label: item.label,
                color: colors[index % colors.length],
            };
            return acc;
        },
        {} as Record<string, { label: string; color: string }>,
    );

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>{title}</CardTitle>
                {description && (
                    <CardDescription>{description}</CardDescription>
                )}
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[300px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={60}
                            strokeWidth={5}
                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
