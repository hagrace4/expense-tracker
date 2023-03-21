// main.js

// Set up the dimensions and radius for the donut chart
const width = 500;
const height = 500;
const radius = Math.min(width, height) / 2;
const innerRadius = radius * 0.5;

// Create the SVG container and set its dimensions
const svg = d3.select('#chart-container')
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .append('g')
  .attr('transform', `translate(${width / 2}, ${height / 2})`);

// Define the arc generator for the donut chart
const arc = d3.arc()
  .innerRadius(innerRadius)
  .outerRadius(radius);

// Set up the pie generator to calculate angles for each expense
const pie = d3.pie()
  .value(d => d.cost)
  .sort(null);

// Set up the color scale for the chart
const color = d3.scaleOrdinal(d3.schemeCategory10);

// Initialize the expenses array
let expenses = [];

// Function to add a new expense to the array and update the chart
function addExpense(title, cost) {
  expenses.push({ title, cost });
  updateChart();
}

// Function to update the chart based on the current expenses
function updateChart() {
  // Generate the pie data for the current expenses
  const pieData = pie(expenses);

  // Bind the pie data to the wedges in the chart
  const wedges = svg.selectAll('.wedge')
    .data(pieData, d => d.data.title);

  // Remove any wedges that are no longer needed
  wedges.exit().remove();

  // Create new wedges for any new expenses
  const newWedges = wedges.enter()
    .append('g')
    .attr('class', 'wedge');

  // Add the donut chart path for each new wedge
  newWedges.append('path')
    .attr('d', arc)
    .attr('fill', (d, i) => color(i));

  // Add the text label for each new wedge
  newWedges.append('text')
    .attr('transform', d => `translate(${arc.centroid(d)})`)
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .style('fill', 'white')
    .style('font-size', '12px')
    .text(d => d.data.title);

  // Update the paths and text labels for existing wedges
  wedges.select('path')
    .attr('d', arc)
    .attr('fill', (d, i) => color(i));

  wedges.select('text')
    .attr('transform', d => `translate(${arc.centroid(d)})`)
    .text(d => d.data.title);

  // Update item name and cost to list
  const list = document.getElementById('item-list');
  list.innerHTML = '';
  expenses.forEach(expense => {
    const item = document.createElement('li');
    item.innerHTML = `${expense.title} - $${expense.cost}`;
    list.appendChild(item);
  })

}

// Handle the form submission to add a new expense
document.getElementById('expense-form').addEventListener('submit', event => {
  event.preventDefault();

  const title = document.getElementById('expense-title').value;
  const cost = parseFloat(document.getElementById('expense-cost').value);

  addExpense(title, cost);

  // Clear the form fields after submitting
  document.getElementById('expense-title').value = '';
  document.getElementById('expense-cost').value = '';
});
