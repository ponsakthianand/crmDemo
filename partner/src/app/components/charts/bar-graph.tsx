'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

export const description = 'An interactive bar chart';

const chartConfig = {
  leadsTooltip: {
    label: 'Leads added',
  },
  customersTooltip: {
    label: 'Customers joined',
  },
  leads: {
    label: 'Leads',
    color: 'hsl(var(--chart-1))'
  },
  customers: {
    label: 'Customers',
    color: 'hsl(var(--chart-2))'
  }
} satisfies ChartConfig;

export function BarGraph({ chartData }: { chartData: { date: string, leads: number, customers: number }[] }) {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>('leads');

  const total = useMemo(
    () => ({
      leads: chartData?.reduce((acc, curr) => acc + curr?.leads, 0),
      customers: chartData?.reduce((acc, curr) => acc + curr?.customers, 0)
    }),
    [chartData]);

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Trend Chart</CardTitle>
          <CardDescription>
            {activeChart === 'leads' ? 'Showing total leads created based on the date selected' : 'Showing total customers joined based on the date selected'}
          </CardDescription>
        </div>
        <div className="flex">
          {['leads', 'customers'].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[key as keyof typeof total]?.toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[280px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date?.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey={activeChart === 'leads' ? 'leadsTooltip' : 'customersTooltip'}
                  labelFormatter={(value) => {
                    return new Date(value)?.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    });
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
