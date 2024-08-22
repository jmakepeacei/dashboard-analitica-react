import React, { useState, useRef, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { CalendarIcon } from "@radix-ui/react-icons"
import { Button } from "../components/ui/button";
import { cn } from "./lib/utils"
import { Input } from "../components/ui/input";
import { format } from 'date-fns';
import { DateRange } from "react-day-picker"
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover"
import { Calendar } from "../components/ui/calendar"
import { AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import ChartWithTable from './ChartWithTable';
import DashboardIntegrado from './DashboardIntegrado';

type DataItem = {
  producto?: string;
  ventas?: number;
  [key: string]: any;
};

const Dashboard: React.FC = () => {
  const today = new Date();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>('');
  const [data, setData] = useState<DataItem[]>([]);
  const [currentView, setCurrentView] = useState<string>('integrado');
  const [selectedProduct, setSelectedProduct] = React.useState<string | null>('');

  const handleProductSelect = (product: string) => {
    setSelectedProduct(product);
  };

  const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: firstDayOfMonth,
    to: today,
  })

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (evt: ProgressEvent<FileReader>) => {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        let data = XLSX.utils.sheet_to_json(ws) as DataItem[];
        setData(data);

        data = data.map(item => {
          const formattedItem: DataItem = {};
          for (const key in item) {
            const value = item[key];
            if (typeof value === 'number') {
              formattedItem[key] = value.toFixed(2);
            } else {
              formattedItem[key] = value;
            }
          }
          return formattedItem;
        });
      };
      reader.readAsBinaryString(file);
    }
  };

  const clearData = () => {
    setData([]);
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  function numeroAFecha(numeroDeDias: any, esExcel = false) {
    var diasDesde1900 = esExcel ? 25567 + 2 : 25567;
    return new Date((numeroDeDias - diasDesde1900) * 86400 * 1000);
  }

  const sumByColumnWithDateRange = (groupColumn: string, groupColumn2: string, selectedProduct: string | null | undefined, valueColumn: string, data: DataItem[], fechaInicialp: Date | any, fechaFinalp: Date | any, noFilter: boolean): { name: string | any; value: number }[] => {
    const groupedData: { [key: string]: number } = {};

    const filteredData = data.filter(item => {
      const itemDate = numeroAFecha(item.fecha, true);
      itemDate.setHours(0, 0, 0, 0);
      const fechaInicialx = new Date(fechaInicialp)
      fechaInicialx.setHours(0, 0, 0, 0);
      const fechaFinaly = new Date(fechaFinalp)
      fechaFinaly.setHours(0, 0, 0, 0);

      if (!fechaInicialp || !fechaFinalp) {
        return false;
      }

      const f0 = itemDate.toISOString();
      const f1 = fechaInicialx.toISOString();
      const f2 = fechaFinaly.toISOString();

      if (!noFilter) {
        return (f0 >= f1 && f0 <= f2)
      }
      else {
        if (selectedProduct) {
          switch (groupColumn2) {
            case 'producto':
              return (f0 >= f1 && f0 <= f2) && item.producto === selectedProduct;
              break;
            case 'categoria':
              return (f0 >= f1 && f0 <= f2) && item.categoria === selectedProduct;
              break;
            case 'grupo':
              return (f0 >= f1 && f0 <= f2) && item.grupo === selectedProduct;
              break;
            case 'subgrupo':
              return (f0 >= f1 && f0 <= f2) && item.subgrupo === selectedProduct;
              break;
            case 'marca':
              return (f0 >= f1 && f0 <= f2) && item.marca === selectedProduct;
              break;
            case 'segmento':
              return (f0 >= f1 && f0 <= f2) && item.segmento === selectedProduct;
              break;
            case 'ruta':
              return (f0 >= f1 && f0 <= f2) && item.ruta === selectedProduct;
              break;
            case 'region':
              return (f0 >= f1 && f0 <= f2) && item.region === selectedProduct;
              break;
            default:
              return (f0 >= f1 && f0 <= f2)
          }
        }
        else {
          return (f0 >= f1 && f0 <= f2)
        }
      }
    });

    filteredData.forEach(item => {
      const groupKey = item[groupColumn];
      const value = item[valueColumn] || 0;

      if (groupedData[groupKey]) {
        groupedData[groupKey] += value;
      } else {
        groupedData[groupKey] = value;
      }
    });

    const datos = Object.entries(groupedData).map(([name, value]) => {
      const formattedName = isDate(numeroAFecha(name, true)) ? formatDate(new Date(numeroAFecha(name, true))) : name;

      return {
        name: formattedName,
        value
      };
    });

    return datos;

  };

  function isDate(value: any) {
    const date = new Date(value);
    return !isNaN(date.getTime());
  }

  const dataForChart = useCallback((groupColumn: string, valueColumn: string, groupColumn2: string, noFilter: boolean) => {
    return sumByColumnWithDateRange(
      groupColumn,
      groupColumn2,
      selectedProduct,
      valueColumn,
      data,
      date?.from, date?.to,
      noFilter,
    );
  }, [selectedProduct, date?.from, date?.to, data]);

  const chartConfigs = [
    { key: 'integrado', title: 'Dashboard Integrado', title2: 'Dashboard Integrado', dataKey1: 'integrado', dataKey: 'integrado', groupcolumn: '', groupcolumn2: '', valuecolumn: '', color: '#ffc658' },
    { key: 'producto', title: 'Ventas por Producto', title2: 'Productos', dataKey1: 'name', dataKey: 'value', groupcolumn: 'fecha', groupcolumn2: 'producto', valuecolumn: 'ventas', color: '#8884d8' },
    { key: 'categoria', title: 'Ventas por Categoria', title2: 'Categorias', dataKey1: 'name', dataKey: 'value', groupcolumn: 'fecha', groupcolumn2: 'categoria', valuecolumn: 'ventas', color: '#82ca9d' },
    { key: 'grupo', title: 'Ventas por Grupo', title2: 'Grupos', dataKey1: 'name', dataKey: 'value', groupcolumn: 'fecha', groupcolumn2: 'grupo', valuecolumn: 'ventas', color: '#ffc658' },
    { key: 'subgrupo', title: 'Ventas por Subgrupo', title2: 'Subgrupos', dataKey1: 'name', dataKey: 'value', groupcolumn: 'fecha', groupcolumn2: 'subgrupo', valuecolumn: 'ventas', color: '#7ac658' },
    { key: 'marca', title: 'Ventas por Marca', title2: 'Marcas', dataKey1: 'name', dataKey: 'value', groupcolumn: 'fecha', groupcolumn2: 'marca', valuecolumn: 'ventas', color: '#ccc658' },
    { key: 'segmento', title: 'Ventas por Segmento', title2: 'Segmentos', dataKey1: 'name', dataKey: 'value', groupcolumn: 'fecha', groupcolumn2: 'segmento', valuecolumn: 'ventas', color: '#aff158' },
    { key: 'ruta', title: 'Ventas por Ruta', title2: 'Rutas', dataKey1: 'name', dataKey: 'value', groupcolumn: 'fecha', groupcolumn2: 'ruta', valuecolumn: 'ventas', color: '#edcff8' },
    { key: 'region', title: 'Ventas por Región', title2: 'Regiones', dataKey1: 'name', dataKey: 'value', groupcolumn: 'fecha', groupcolumn2: 'region', valuecolumn: 'ventas', color: '#eec658' },
  ];

  function formatDate(fecha: any) {
    if (!fecha) {
      return;
    }

    if (isNaN(fecha.getTime())) {
      return String(date);
    }

    const day = String(fecha.getDate()).padStart(2, '0');
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const year = fecha.getFullYear();

    return `${day}/${month}/${year}`;
  }

  const handleDownloadTemplate = () => {
    const link = document.createElement('a');
    link.href = 'https://makepeacecorp.com/da/datos.xlsx'; 
    link.click();
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Dashboard de Analítica</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <Input type="file" id="filedatos" ref={fileInputRef} onChange={handleFileUpload} accept=".xlsx, .xls" />
            <Button onClick={handleDownloadTemplate}>Descargar Plantilla</Button>
            <Button onClick={clearData}>Limpiar Datos</Button>
            
          </div>
          {fileName && <p className="text-sm text-gray-500 mb-2">Archivo cargado: {fileName}</p>}
          {!data.length && (
            <div className="flex items-center text-yellow-600">
              <AlertCircle className="mr-2" />
              <span>Por favor, carga un archivo Excel para ver los gráficos.</span>
            </div>
          )}
        </CardContent>
      </Card>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Intervalo de Fechas</CardTitle>
        </CardHeader>
        <CardContent>
          <label><b>
            Fecha Inicial:</b>
          </label>
          <span style={{ padding: '10px' }}>{formatDate(date?.from)}</span>
          <label><b>
            Fecha Final:</b>
          </label>
          <span style={{ padding: '10px', marginBottom: '10px' }}>{formatDate(date?.to)}</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !date?.from && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? format(date?.from, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </CardContent>
      </Card>
      <div>
        {data.length > 0 && (
          <div>
            <div className="grid grid-cols-6 gap-4">
              <div className="col-span-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
                {chartConfigs.map(config => (
                  <Button
                    key={config.key}
                    onClick={() => {
                      setCurrentView(config.key);
                      setSelectedProduct('');
                    }}
                    variant={currentView === config.key ? "default" : "outline"}
                  >
                    {config.title}
                  </Button>
                ))}
              </div>
            </div>
            {chartConfigs.map(config => {
              if (currentView === config.key) {
                if (config.key === "integrado") {
                  return (
                    <DashboardIntegrado
                      data={data}
                    />
                  );
                } else {
                  return (
                    <ChartWithTable
                      key={config.key}
                      title={config.title}
                      title2={config.title2}
                      data={dataForChart(config.groupcolumn, config.valuecolumn, config.groupcolumn2, true)}
                      data2={dataForChart(config.groupcolumn2, config.valuecolumn, config.groupcolumn2, false)}
                      groupcolumn2={config.groupcolumn2}
                      onProductSelect={handleProductSelect}
                      dataKey={config.dataKey}
                      dataKey1={config.dataKey1}
                      barColor={config.color}
                    />
                  );
                }
              }
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;