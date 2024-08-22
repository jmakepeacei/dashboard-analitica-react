import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "./lib/utils"
import { Button } from "../components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover"

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

  // Filtrar los valores únicos de la columna especificada
  function filterDataByValueColumn(groupColumn: string): { label: string; value: string }[] {
    const groupedData: { [key: string]: string } = {};
    //console.log(groupColumn);
    //console.log(data2);
    data2.forEach(item => {
      const groupKey = String(item[groupColumn]); // Convertir a string
      const value = String(item[groupColumn]); // Convertir a string
      groupedData[groupKey] = value;

    });
  
    return Object.entries(groupedData).map(([label, value]) => ({
      label,
      value,
    }));
  }

  const options = filterDataByValueColumn('name');
  //console.log(options);

  const handleSelect = (currentValue: string) => {
    setValue(currentValue);
    setOpen(false);
    // Aquí deberías pasar el valor seleccionado al componente padre o manejar el filtro
    // Por ejemplo:
     onProductSelect(currentValue);
  };

  return (
    <div>

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
              : "Seleccione elemento..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search framework..." />
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
                      // Aquí puedes realizar la acción necesaria al seleccionar un valor
                      // Por ejemplo, actualizar el gráfico
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={dataKey1} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey={dataKey} fill={barColor} />
                </BarChart>
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
                <BarChart data={data2}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={dataKey1} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey={dataKey} fill={barColor} />
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
                  <TableHead>Nombre</TableHead>
                  <TableHead>{dataKey}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item[dataKey]}</TableCell>
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
                  <TableHead>Nombre</TableHead>
                  <TableHead>{dataKey}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data2.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.name}</TableCell>
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