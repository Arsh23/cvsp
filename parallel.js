//size and margin
var basewidth = $('.graph').width()
var baseheight = $(window).height();
// var basewidth = 1500;
// var baseheight = 500;
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

function init_pixel(id, x, y, size, linewidth, image, offsetX, offsetY, imgsize) {
    var path = `M ${x},${y} l${size},0 l0,${size} l${-size},0 Z`
    var length = 4*size

    pixel = canvas.append('g')
        .attr('id', id)

    pixel.append("clipPath")  
        .attr("id", "clipPath"+id)
        .append("path") 
        .attr('id', 'clipPathShape'+id)
        .attr("d", `M ${x},${y}`)
        .style('fill', 'none')
        .style('stroke', 'black')
    pixel.append("clipPath")  
        .attr("id", "clipPathCrop"+id)
        .append("path")
        .attr('id', 'imgCropClip'+id)
        .attr("d", path)
        .style('fill', 'none')
        .style('stroke', 'black')
    
    // var imgsize = (size-(2*linewidth) )*2
    pixel.append("svg:image")
        .attr('id', 'bgimage'+id)
        .attr('x', x+offsetX)
        .attr('y', y+offsetY)
        .attr('width', imgsize)
        .attr('height', imgsize)
        .attr("xlink:href", image)
        .style('opacity', 0.60)
        .style('filter', 'url(#bw-filter)')
        .attr("clip-path", 'url(#clipPathCrop' + id + ')')

    pixel.append("svg:image")
        .attr('id', 'image'+id)
        .attr('x', x+linewidth+offsetX)
        .attr('y', y+linewidth+offsetY)
        .attr('width', imgsize)
        .attr('height', imgsize)
        .attr("xlink:href", image)
        .attr("clip-path", 'url(#clipPath' + id + ')')

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


}

function load_pixel(id, init_delay, delay) {
    canvas.select('#path'+id)
        .transition()
        .ease(d3.easeLinear)
        .duration(delay)
        .delay(init_delay)
        .attr('stroke-dashoffset', 0)
}

function render_pixel(id, x, y, size, linewidth, init_delay, delay, splits) {
    x += linewidth
    y += linewidth
    size -= (2*linewidth)
    var split = size/splits
    var midX, midY, clip

    for(midY=0; midY<=size-split; midY+=split) {
        for(midX=split; midX<=size; midX+=split) {
            clip = `M ${x},${y} l${size},0 l0,${midY} l${-(size-midX)},0 l0,${split} l${-midX},0 Z`
            canvas.select('#clipPathShape'+id)
                .transition()
                .ease(d3.easeLinear)
                .duration(0)
                .delay(init_delay)
                .attr('d', clip)
            init_delay += delay 
        }
    }
}


function parallel_animation() {
    
    var size = 100+4
    var linewidth = 8/2
    var imgpath = "testimage3.jpg"
    var x = 10
    var y = 10

    var gridsize = 4
    var gap = 15 
    var id = 0
    var d1, d2


    imgsize = size*gridsize
    for(var i=0; i<gridsize; i++) {
        for(var j=0; j<gridsize; j++) {
            id += 1
            init_pixel(
                id, 
                x+(j*size + j*gap), // x 
                y+(i*size + i*gap), // y
                size, 
                linewidth, 
                imgpath, 
                -(j*size ), // offsetX
                -(i*size ), // offsetY
                imgsize
            )
            d1 = Math.floor(Math.random() * (4000 - 1500 + 1)) + 1500
            d2 = Math.floor(Math.random() * (30 - 18 + 1)) + 18
            load_pixel(id, 3000, d1)
            render_pixel(id, x+(j*size + j*gap), y+(i*size + i*gap), size, linewidth, d1+3000, d2, 10)
        }
    }

}

parallel_animation()

// d3.json("data.json", function(d) {
// });
