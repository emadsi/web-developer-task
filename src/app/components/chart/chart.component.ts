import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { ChartDataService } from '../../services/chart-data/chart-data.service';


@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() chartType!: string;
  @Input() filters!: any;
  chartInstance!: Chart;

  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;


  constructor(private chartService: ChartDataService) {
    Chart.register(...registerables); // Register Chart.js components
  }

  ngOnInit(): void {
    console.log(`Chart Loaded: ${this.chartType}`);
  }

  ngAfterViewInit(): void {
    this.drawChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
      if(changes['filters']) {
        this.drawChart();
      }
  }

  drawChart(): void {
    if (!this.chartCanvas) return;

    // const ctx = document.getElementById(this.chartType) as HTMLCanvasElement;

    // this.chartService.getChartData(this.chartType, this.filters).subscribe(data => {
    //   this.chartInstance = new Chart(ctx, {
    //     type: 'line',
    //     data,
    //     options: { responsive: true }
    //   });
    // });

    this.chartService.getChartData(this.chartType, this.filters).subscribe(data => {
      if (this.chartInstance) {
        this.chartInstance.destroy(); // Prevent duplicate charts
      }

      this.chartInstance = new Chart(this.chartCanvas.nativeElement, {
        type: 'line', // Default type (change dynamically if needed)
        data,
        options: { responsive: true }
      });
    });
  }
}
