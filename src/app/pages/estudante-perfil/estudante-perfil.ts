import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-estudante-perfil',
  standalone: true,
  imports: [CommonModule, RouterModule, BaseChartDirective],
  templateUrl: './estudante-perfil.html'
})
export class EstudantePerfil {

  private location = inject(Location);

  voltar(): void {
    this.location.back();
  }

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['MAR', 'ABR', 'MAI', 'JUN'],
    datasets: [
      {
        data: [85, 82, 75, 68],
        backgroundColor: ['#071e3d', '#071e3d', '#fbbf24', '#dc2626'],
        borderRadius: 4,
        barThickness: 40
      }
    ]
  };

  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true }
    },
    scales: {
      y: { display: false, min: 0, max: 100 },
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { font: { size: 10, weight: 'bold' }, color: '#64748b' }
      }
    }
  };
}