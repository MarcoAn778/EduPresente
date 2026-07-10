// src/app/pages/dashboard/dashboard.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './dashboard.html'
})
export class Dashboard {
  
  // Gráfico 1: Níveis de Atenção (Barras)
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['LEVE', 'MOD', 'PRIO'],
    datasets: [
      {
        data: [146, 58, 21],
        // Cores respectivas: Verde, Amarelo, Vermelho
        backgroundColor: ['#16a34a', '#fbbf24', '#dc2626'], 
        borderRadius: 4, // Bordas arredondadas como na imagem
        barThickness: 40
      }
    ]
  };

  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false } // Oculta a legenda
    },
    scales: {
      y: { display: false }, // Oculta o eixo Y (valores laterais)
      x: { 
        grid: { display: false }, // Remove as linhas de grade
        border: { display: false }
      }
    }
  };

  // Gráfico 2: Tendência de Faltas (Linha)
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['1', '2', '3', '4', '5', '6', '7'], // Pontos invisíveis no eixo X
    datasets: [
      {
        data: [10, 15, 8, 22, 12, 30, 18], // Desenha uma curva similar à imagem
        borderColor: '#071e3d', // Azul escuro
        borderWidth: 3,
        tension: 0.4, // Deixa a linha suave/curvada
        pointBackgroundColor: '#071e3d',
        pointRadius: 4,
        fill: false
      }
    ]
  };

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: { display: false },
      x: { display: false }
    }
  };
}