'use client';

import React, { useEffect, useState } from 'react';
import {
  Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger,
} from '@/components/ui/dialog';
import {
  obtenerUsuarios,
  obtenerTareasPorUsuario,
} from '@/services/api';
import {
  calcularIndices,
  obtenerTipoRecomendado,
} from '@/services/predictor';
import {
  Command, CommandInput, CommandItem, CommandList,
} from '@/components/ui/command';
import {
  Popover, PopoverContent, PopoverTrigger,
} from '@/components/ui/popover';
import { ChevronsUpDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';

interface Usuario {
  id_usuario: number;
  nombre: string;
}

interface TareaSprint {
  id: number;
  usuario_id: number;
  sprint: number;
  [key: string]: any;
}

const tiposNombre = ['Básicas', 'Moderadas', 'Intermedias', 'Avanzadas', 'Épicas'];

const SprintAudit: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | null>(null);
  const [tareas, setTareas] = useState<TareaSprint[]>([]);
  const [sprintSeleccionado, setSprintSeleccionado] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  useEffect(() => {
    obtenerUsuarios().then(res => setUsuarios(res.data));
  }, []);

  useEffect(() => {
    if (usuarioSeleccionado) {
      obtenerTareasPorUsuario(usuarioSeleccionado.id_usuario).then(res => setTareas(res.data));
    }
  }, [usuarioSeleccionado]);

  const tareasDelSprint = tareas.find(t => t.sprint === sprintSeleccionado);
  const indicesGlobales = calcularIndices(tareas);
  const indicesSprint = tareasDelSprint ? calcularIndices([tareasDelSprint]) : [];

  const chartGlobal = indicesGlobales.map((val, i) => {
    const completadas = tareas.reduce((sum, t) => sum + t[`t${i + 1}_completadas`] || 0, 0);
    const asignadas = tareas.reduce((sum, t) => sum + t[`t${i + 1}_asignadas`] || 0, 0);
    const base = asignadas > 0 ? (completadas * 100) / asignadas : 0;
    return {
      tipo: tiposNombre[i],
      porcentaje: parseFloat(base.toFixed(2)),
      ponderado: val,
      completadas,
      asignadas
    };
  });

  const chartSprint = indicesSprint.map((val, i) => {
    const completadas = tareasDelSprint?.[`t${i + 1}_completadas`] || 0;
    const asignadas = tareasDelSprint?.[`t${i + 1}_asignadas`] || 0;
    const base = asignadas > 0 ? (completadas * 100) / asignadas : 0;
    return {
      tipo: tiposNombre[i],
      porcentaje: parseFloat(base.toFixed(2)),
      ponderado: val,
      completadas,
      asignadas
    };
  });

  const graficoEvolucion = tareas.map((t) => {
    const totalCompletadas = [1, 2, 3, 4, 5].reduce((sum, tipo) => sum + t[`t${tipo}_completadas`], 0);
    const totalAsignadas = [1, 2, 3, 4, 5].reduce((sum, tipo) => sum + t[`t${tipo}_asignadas`], 0);
    const porcentaje = totalAsignadas > 0 ? (totalCompletadas * 100) / totalAsignadas : 0;

    return {
      sprint: `Sprint ${t.sprint}`,
      rendimiento: parseFloat(porcentaje.toFixed(2))
    };
  });

  const tipoRecomendadoGlobal = obtenerTipoRecomendado(indicesGlobales);
  const tipoRecomendadoSprint = obtenerTipoRecomendado(indicesSprint);

  return (
    <Layout>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Auditoría de Sprints</h2>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button variant="outline">Ver cómo se calcula</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>🧠 Cómo se calculan los porcentajes</DialogTitle>
              <DialogDescription>
                El sistema aplica un porcentaje extra según la dificultad:
                <ul className="mt-2 list-disc list-inside">
                  <li>Básicas: 10%</li>
                  <li>Moderadas: 15%</li>
                  <li>Intermedias: 20%</li>
                  <li>Avanzadas: 25%</li>
                  <li>Épicas: 30%</li>
                </ul>
                <p className="mt-2 text-muted-foreground">Ejemplo: 6 de 6 Avanzadas = 100% + 25% = 125%</p>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6">
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" className="w-full justify-between">
              {usuarioSeleccionado ? usuarioSeleccionado.nombre : 'Selecciona un usuario'}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Buscar usuario..." />
              <CommandList>
                {usuarios.map((user) => (
                  <CommandItem
                    key={user.id_usuario}
                    value={user.nombre}
                    onSelect={() => {
                      setUsuarioSeleccionado(user);
                      setPopoverOpen(false);
                      setSprintSeleccionado(null);
                    }}
                  >
                    <Check className={cn('mr-2 h-4 w-4', usuarioSeleccionado?.id_usuario === user.id_usuario ? 'opacity-100' : 'opacity-0')} />
                    {user.nombre}
                  </CommandItem>
                ))}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {usuarioSeleccionado && tareas.length > 0 && (
        <div className="mb-6">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" className="w-full justify-between">
                {sprintSeleccionado !== null
                  ? `Sprint ${sprintSeleccionado}`
                  : 'Selecciona un sprint'}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Buscar sprint..." />
                <CommandList>
                  {tareas.map((t) => (
                    <CommandItem
                      key={t.sprint}
                      value={`Sprint ${t.sprint}`}
                      onSelect={() => {
                        setSprintSeleccionado(t.sprint);
                      }}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          sprintSeleccionado === t.sprint ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      Sprint {t.sprint}
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      )}
      
      <Separator className="mb-4" />

      {usuarioSeleccionado && (
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Global del Usuario</CardTitle>
              <p className="text-muted-foreground">Recomendado: {tipoRecomendadoGlobal}</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1">
                {chartGlobal.map((d, i) => (
                  <li key={i}>{d.tipo}: {d.porcentaje}% (Ponderado: {d.ponderado}%) — {d.completadas}/{d.asignadas}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {tareasDelSprint && (
            <Card>
              <CardHeader>
                <CardTitle>Sprint {tareasDelSprint.sprint} (Auditoría específica)</CardTitle>
                <p className="text-muted-foreground">Recomendado: {tipoRecomendadoSprint}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {chartSprint.map((d, i) => (
                    <li key={i}>{d.tipo}: {d.porcentaje}% (Ponderado: {d.ponderado}%) — {d.completadas}/{d.asignadas}</li>
                  ))}
                </ul>

                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={chartSprint}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="tipo" />
                    <YAxis domain={[0, 150]} />
                    <Tooltip />
                    <Bar dataKey="porcentaje" fill="#2ecc71" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {usuarioSeleccionado && tareas.length > 1 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>📈 Evolución del rendimiento por Sprint</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={graficoEvolucion}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="sprint" />
                <YAxis domain={[0, 150]} />
                <Tooltip />
                <Line type="monotone" dataKey="rendimiento" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </Layout>
  );
};

export default SprintAudit;
