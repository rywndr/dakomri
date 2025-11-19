"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

interface BarChartComponentProps {
    title: string;
    description?: string;
    data: Array<{ label: string; value: number }>;
    dataKey?: string;
    labelKey?: string;
    color?: string;
}

export function BarChartComponent({
    title,
    description,
    data,
    dataKey = "value",
    labelKey = "label",
    color = "var(--chart-1)",
}: BarChartComponentProps) {
    // Transform data ke format recharts
    const chartData = data.map((item) => ({
        [labelKey]: item.label,
        [dataKey]: item.value,
    }));

    const chartConfig = {
        [dataKey]: {
            label: title,
            color: color,
        },
    } satisfies ChartConfig;

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                {description && (
                    <CardDescription>{description}</CardDescription>
                )}
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey={labelKey}
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => {
                                // Potong label jika terlalu panjang
                                return value.length > 15
                                    ? value.slice(0, 15) + "..."
                                    : value;
                            }}
                        />
                        <YAxis tickLine={false} axisLine={false} />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar
                            dataKey={dataKey}
                            fill={color}
                            radius={[8, 8, 0, 0]}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
