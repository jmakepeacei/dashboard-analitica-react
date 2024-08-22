import React from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area, ScatterChart, Scatter, RadarChart, Radar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Cell } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

type DataItem = {
  producto?: string;
  ventas?: number;
  [key: string]: any;
};

interface ChartWithTableProps {
  data: DataItem[];
}

const DashboardIntegrado: React.FC<ChartWithTableProps> = ({ data }) => {

  const sumByCategory = (category: string): number => {
    return data.reduce((acc, curr) => acc + (Number(curr[category]) || 0), 0);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const sumByProduct = (producto: string, data: DataItem[]): number => {
    const filteredData = data.filter(item => item.producto === producto);
    return filteredData.reduce((acc, curr) => acc + (curr.ventas || 0), 0);
  };

  const dataForChart = [
    { name: 'Producto 1', value: sumByProduct('producto1', data) },
    { name: 'Producto 2', value: sumByProduct('producto2', data) },
    { name: 'Producto 3', value: sumByProduct('producto3', data) },
    { name: 'Producto 4', value: sumByProduct('producto4', data) },
    { name: 'Producto 5', value: sumByProduct('producto5', data) },
    { name: 'Producto 6', value: sumByProduct('producto6', data) },
    { name: 'Producto 7', value: sumByProduct('producto7', data) },
    { name: 'Producto 8', value: sumByProduct('producto8', data) },
    { name: 'Producto 9', value: sumByProduct('producto9', data) },
  ];

  const averageByCategory = (category: string): number => {
    return data.length ? sumByCategory(category) / data.length : 0;
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      {data.length > 0 && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Gráfico de Barras: Ventas por Producto</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="producto" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="ventas" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gráfico de Líneas: Tendencia de Ventas</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="fecha" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="ventas" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gráfico Circular: Distribución de Ventas</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie dataKey="value" data={dataForChart} fill="#8884d8" label />
                    {dataForChart.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gráfico de Área: Ventas vs Gastos</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="fecha" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="ventas" stackId="1" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone" dataKey="gastos" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gráfico de Dispersión: Precio vs Cantidad</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="precio" name="Precio" />
                    <YAxis dataKey="salidas" name="Cantidad" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter name="Productos" data={data} fill="#8884d8" />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gráfico Radar: Métricas de Rendimiento</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={data}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="categoria" />
                    <PolarRadiusAxis />
                    <Radar name="Rendimiento" dataKey="precio" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gráfico de Barras Apiladas: Trazabilidad de Categorías</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="categoria" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="ventas" stackId="a" fill="#8884d8" />
                    <Bar dataKey="entradas" stackId="a" fill="#82ca9d" />
                    <Bar dataKey="salidas" stackId="a" fill="#ffc658" />
                    <Bar dataKey="gastos" stackId="a" fill="#ff8042" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gráfico de Líneas Múltiples: Comparación de Métricas</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="fecha" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="ventas" stroke="#8884d8" />
                    <Line type="monotone" dataKey="gastos" stroke="#82ca9d" />
                    <Line type="monotone" dataKey="entradas" stroke="#ffc658" />
                    <Line type="monotone" dataKey="salidas" stroke="#aac658" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Gráfico de Área Normalizada: Distribución Porcentual</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={data} stackOffset="expand">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="fecha" />
                    <YAxis tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="ventas" stackId="1" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone" dataKey="gastos" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                    <Area type="monotone" dataKey="precio" stackId="1" stroke="#ffc658" fill="#ffc658" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Tabla de Resumen</CardTitle>
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
                    <TableRow>
                      <TableCell>Total de Ventas</TableCell>
                      <TableCell>{sumByCategory('ventas').toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Promedio de Ventas</TableCell>
                      <TableCell>{averageByCategory('ventas').toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Total de Ingresos</TableCell>
                      <TableCell>{sumByCategory('ingresos').toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Total de Gastos</TableCell>
                      <TableCell>{sumByCategory('gastos').toFixed(2)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardIntegrado;