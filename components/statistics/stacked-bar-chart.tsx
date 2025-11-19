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
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

interface StackedBarChartComponentProps {
    title: string;
    description?: string;
    data: Array<{ label: string; [key: string]: string | number }>;
    categories: Array<{ key: string; label: string; color: string }>;
}

export function StackedBarChartComponent({
    title,
    description,
    data,
    categories,
}: StackedBarChartComponentProps) {
    // Generate config dari categories
    const chartConfig = categories.reduce((acc, cat) => {
        acc[cat.key] = {
            label: cat.label,
            color: cat.color,
        };
        return acc;
    }, {} as ChartConfig);

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
                    <BarChart accessibilityLayer data={data}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="label"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => {
                                // Potong label jika terlalu panjang
                                return value.length > 12
                                    ? value.slice(0, 12) + "..."
                                    : value;
                            }}
                        />
                        <YAxis tickLine={false} axisLine={false} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        {categories.map((cat, index) => (
                            <Bar
                                key={cat.key}
                                dataKey={cat.key}
                                stackId="a"
                                fill={cat.color}
                                radius={
                                    index === categories.length - 1
                                        ? [4, 4, 0, 0]
                                        : [0, 0, 0, 0]
                                }
                            />
                        ))}
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
