import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { OrderService } from '../services/order.service';
import { CategoryService } from '../services/category.service';
import { Category, ChartDataPoint, Order, Product } from '../data-type';
import { CanvasJS } from '@canvasjs/angular-charts';

@Component({
	selector: 'app-seller-dashboard',
	templateUrl: './seller-dashboard.component.html',
	styleUrls: ['./seller-dashboard.component.css']
})
export class SellerDashboardComponent implements OnInit {
	totalOrder: number = 0;
	totalSold: number = 0;
	totalRevenue: number = 0;
	chartOptions: any = {};
	chartOptions2: any = {};
	constructor(private order: OrderService) { }
	ngOnInit(): void {
		this.loadDashboardData();
		this.loadChartData();
		this.loadDataForChart();
	}
	loadDashboardData() {
		//số lượng bán ra
		this.order.orderList().subscribe((orders) => {
			const completedOrders = orders.filter((order) => order.status !== 'Hủy đơn hàng');
			this.totalSold = completedOrders.reduce((acc, order) => {
				const orderQuantity = order.orderDetails.reduce(
					(orderAcc, detail) => orderAcc + detail.quantity,
					0
				);
				return acc + orderQuantity;
			}, 0);
		});
		//tổng doanh thu
		this.order.orderList().subscribe((orders) => {
			const completedOrders = orders.filter((order) => order.status !== 'Hủy đơn hàng');
			this.totalRevenue = completedOrders.reduce((acc, order) => {
				const orderTotal = order.totalPrice;
				return acc + orderTotal;
			}, 0);
		});

		this.order.orderList().subscribe((orders) => {
			this.totalOrder = orders.length;
		})
	}

	loadChartData() {
		this.order.orderList().subscribe((orders: Order[]) => {
			const processingOrders = orders.filter(order => order.status === 'Đang xử lý');
			const deliveringOrders = orders.filter(order => order.status === 'Đang giao hàng');
			const deliveredOrders = orders.filter(order => order.status === 'Đã giao hàng');
			const canceledOrders = orders.filter(order => order.status === 'Hủy đơn hàng');

			const totalOrders = orders.length;
			const percentageProcessing = (processingOrders.length / totalOrders) * 100;
			const percentageDelivering = (deliveringOrders.length / totalOrders) * 100;
			const percentageDelivered = (deliveredOrders.length / totalOrders) * 100;
			const percentageCanceled = (canceledOrders.length / totalOrders) * 100;

			const chartData = [
				{ y: percentageProcessing, name: 'Đang xử lý', color: '#007bff' },
				{ y: percentageDelivering, name: 'Đang giao hàng', color: '#28a745' },
				{ y: percentageDelivered, name: 'Đã giao hàng', color: '#dc3545' },
				{ y: percentageCanceled, name: 'Hủy đơn hàng', color: '#ffc107' }
			];

			this.chartOptions = {
				animationEnabled: true,
				data: [{
					type: "pie",
					startAngle: -90,
					indexLabel: "{name}: {y}%",
					yValueFormatString: "#,###.###",
					dataPoints: chartData
				}]
			};
		});
	}

	loadDataForChart() {
		this.order.orderList().subscribe((orders: Order[]) => {
			const chartDataQuantity: { x: Date; y: number; }[] = [];
			const chartDataRevenue: { x: Date; y: number; }[] = [];

			orders.forEach((order: Order) => {
				let totalQuantity = 0;
				let totalPrice = order.totalPrice;

				order.orderDetails.forEach((orderDetail) => {
					totalQuantity += orderDetail.quantity;
				});

				chartDataQuantity.push({
					x: new Date(order.date),
					y: totalQuantity
				});

				chartDataRevenue.push({
					x: new Date(order.date),
					y: totalPrice
				});
			});

			this.chartOptions2 = {
				animationEnabled: true,
				title: {
					text: "Thống kê doanh thu",
					fontFamily: "Arial",
					fontSize: 20,
					fontWeight: "normal",
					fontColor: "#333"
				},
				axisX: {
					title: "Ngày",
					titleFontColor: "#333",
					lineColor: "transparent",
					tickColor: "transparent",
					labelFontColor: "#333",
					valueFormatString: "DD MMM, YYYY"
				},
				axisY: {
					title: "Doanh thu (VNĐ)",
					titleFontColor: "#369EAD",
					lineColor: "transparent",
					tickColor: "#369EAD",
					labelFontColor: "#369EAD",
					suffix: "",
					includeZero: true,
				},
				axisY2: {
					title: "Số lượng sản phẩm",
					titleFontColor: "#C24642",
					lineColor: "transparent",
					tickColor: "#C24642",
					labelFontColor: "#C24642",
					suffix: "",
					includeZero: true,
				},
				toolTip: {
					shared: true
				},
				legend: {
					cursor: "pointer",
					verticalAlign: "top",
					fontSize: 14,
					fontColor: "#555"
				},
				data: [{
					type: "line",
					name: "Doanh thu",
					showInLegend: true,
					axisYType: "primary",
					xValueFormatString: "DD MMM, YYYY",
					yValueFormatString: "#,### VNĐ",
					dataPoints: chartDataRevenue,
					markerType: "circle",
					markerSize: 8,
					markerColor: "#369EAD",
					lineColor: "#369EAD" // Đổi màu của đường dữ liệu "Doanh thu"
				},
				{
					type: "line",
					name: "Số lượng sản phẩm",
					showInLegend: true,
					axisYType: "secondary",
					xValueFormatString: "DD MMM, YYYY",
					yValueFormatString: "#,###",
					dataPoints: chartDataQuantity,
					markerType: "square",
					markerSize: 8,
					markerColor: "#C24642",
					lineColor: "#C24642" // Đổi màu của đường dữ liệu "Số lượng sản phẩm"
				}
				]
			};

		});
	}



}
