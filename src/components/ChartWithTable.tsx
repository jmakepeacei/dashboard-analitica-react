import React from 'react';
import { ResponsiveContainer, BarChart, Bar, Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList } from 'recharts';
import { ChartTooltip, ChartTooltipContent } from "./ui/chart"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "./lib/utils"
import { Button } from "../components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover"

interface DataItem {
  [key: string]: string | number;
}

interface ChartWithTableProps {
  title: string;
  title2: string;
  data: DataItem[];
  data2: DataItem[];
  dataKey: string;
  dataKey1: string;
  barColor?: string;
  groupcolumn2: string;
  onProductSelect: (product: string) => void;
}

const ChartWithTable: React.FC<ChartWithTableProps> = ({ title, title2, data, data2, dataKey, dataKey1, groupcolumn2, onProductSelect, barColor = "#8884d8" }) => {

  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  function filterDataByValueColumn(groupColumn: string): { label: string; value: string }[] {
    const groupedData: { [key: string]: string } = {};
    data2.forEach(item => {
      const groupKey = String(item[groupColumn]); 
      const value = String(item[groupColumn]); 
      groupedData[groupKey] = value;
    });

    return Object.entries(groupedData).map(([label, value]) => ({
      label,
      value,
    }));
  }

  const options = filterDataByValueColumn('name');
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        <Card className="mb-4">
          <CardHeader>
          <div className="w-full text-right">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[200px] justify-between"
                >
                  {value
                    ? options.find((option) => option.value === value)?.label
                    : "Seleccione " + groupcolumn2}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>              
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder={"Buscar " + groupcolumn2} />
                  <CommandList>
                    <CommandEmpty>No framework found.</CommandEmpty>
                    <CommandGroup>
                      {options.map((option) => (
                        <CommandItem
                          key={option.value}
                          value={option.value}
                          onSelect={(currentValue: string) => {
                            setValue(currentValue === value ? "" : currentValue);
                            setOpen(false);
                            onProductSelect(currentValue);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              value === option.value ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {option.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            </div>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid vertical={false} strokeDasharray="1 1" />
                  <XAxis dataKey={dataKey1} tickLine={false} tickMargin={10} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey={dataKey} stroke={barColor} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>{title2}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart accessibilityLayer data={data2} margin={{ top: 20, }}>
                  <CartesianGrid vertical={false} strokeDasharray="1 1" />
                  <XAxis dataKey={dataKey1} tickLine={false} tickMargin={10} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Legend />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar dataKey={dataKey} fill={barColor} radius={8}>
                    <LabelList
                      position="top"
                      offset={12}
                      className="fill-foreground"
                      fontSize={12}
                    />
                  </Bar>                 
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Metrica</TableHead>
                  <TableHead>Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell className="text-left">{item[dataKey]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>{title2}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Métrica</TableHead>
                  <TableHead>Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data2.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-left">{item.name}</TableCell>
                    <TableCell>{item[dataKey]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChartWithTable;