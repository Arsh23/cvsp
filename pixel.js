//size and margin
//var basewidth = $('.graph').width()
//var baseheight = $(window).height()*75 / 100;
var basewidth = 1500;
var baseheight = 500;
var margin = {
            top: 50,
            right: 30,
            bottom: 30,
            left: 30
        },
    width = basewidth - margin.left - margin.right,
    height = baseheight - margin.top - margin.bottom

// main canvas
var svg = d3.select('.graph')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
var canvas = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")") 

var defs = svg.append("defs");
defs.append("filter")
    .attr("id", "bw-filter")
    .append('feColorMatrix')
    .attr('type', 'saturate')
    .attr('values', '0')



function init_pixel(id, x, y, size, linewidth) {
    var path = `M ${x},${y} l${size},0 l0,${size} l${-size},0 Z`
    var length = 4*size

    pixel = canvas.append('g')
        .attr('id', id)

    pixel.append("path")     
        .style("stroke", "black")
        .style('stroke-width', linewidth*2)
        .style("fill", "none")
        .attr('id', 'path'+id)
        .attr('d', path)
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('stroke-dasharray', length + ' ' + length)
        .attr('stroke-dashoffset', length)

    pixel.append("clipPath")  
        .attr("id", "clipPath"+id)
        .append("path") 
        .attr('id', 'clipPathShape'+id)
        .attr("d", `M ${x},${y}`)
        .style('fill', 'none')
        .style('stroke', 'black')
    
    pixel.append("svg:image")
        .attr('id', 'bgimage'+id)
        .attr('x', x+linewidth)
        .attr('y', y+linewidth)
        .attr('width', size-(2*linewidth))
        .attr('height', size-(2*linewidth))
        .attr("xlink:href", "testimage.png")
        .style('opacity', 0.60)
        .style('filter', 'url(#bw-filter)')

    pixel.append("svg:image")
        .attr('id', 'image'+id)
        .attr('x', x+linewidth)
        .attr('y', y+linewidth)
        .attr('width', size-(2*linewidth))
        .attr('height', size-(2*linewidth))
        .attr("xlink:href", "testimage.png")
        .attr("clip-path", 'url(#clipPath' + id + ')')
}

function load_pixel(id, delay) {
    canvas.select('#path'+id)
        .transition()
        .ease(d3.easeLinear)
        .duration(delay)
        .attr('stroke-dashoffset', 0)
}

function render_pixel(id, x, y, size, linewidth, delay, delay2, splits) {
    x += linewidth
    y += linewidth
    size -= (2*linewidth)
    var split = size/splits
    var midX, midY, clip

    for(midY=0; midY<=size-split; midY+=split) {
        for(midX=split; midX<=size; midX+=split) {
            clip = `M ${x},${y} l${size},0 l0,${midY} l${-(size-midX)},0 l0,${split} l${-midX},0 Z`
            delay += delay2 
            canvas.select('#clipPathShape'+id)
                .transition()
                .ease(d3.easeLinear)
                .duration(0)
                .delay(delay)
                .attr('d', clip)
        }
    }
}

init_pixel(1, 10, 10, 100+4, 4/2)

setTimeout(function() {
    load_pixel(1, 1500)
    render_pixel(1, 10, 10, 100+4, 4/2, 1500, 18, 10)
}, 1000);

// d3.json("data.json", function(d) {
// });
