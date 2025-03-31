// src/services/predictor.ts

export const calcularIndices = (tareas: any[]) => {
    const pesos = [0.10, 0.15, 0.20, 0.25, 0.30];
    const acumulado = [0, 0, 0, 0, 0];
    const asignadas = [0, 0, 0, 0, 0];
  
    tareas.forEach(t => {
      for (let i = 0; i < 5; i++) {
        acumulado[i] += t[`t${i + 1}_completadas`] || 0;
        asignadas[i] += t[`t${i + 1}_asignadas`] || 0;
      }
    });
  
    const indices = acumulado.map((comp, i) => {
      if (asignadas[i] === 0) return 0;
      let base = (comp * 100) / asignadas[i];
      base += base * pesos[i];
      return parseFloat(base.toFixed(2));
    });
  
    return indices;
  };
  
  const nombresTipos = ['Básicas', 'Moderadas', 'Intermedias', 'Avanzadas', 'Épicas'];
  
  export const obtenerTipoRecomendado = (indices: number[]): string => {
    const maxIndex = indices.reduce(
      (maxIdx, val, idx, arr) => val > arr[maxIdx] ? idx : maxIdx,
      0
    );
    return nombresTipos[maxIndex] || `Tipo ${maxIndex + 1}`;
  };
  