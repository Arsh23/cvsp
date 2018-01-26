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
    var s = size-(2*linewidth)
    var path = `M ${x+linewidth},${y+linewidth} l${s},0 l0,${s} l${-s},0 Z`
    var clippath = `M ${x},${y} l${size},0 l0,${size} l${-size},0 Z`
    var length = 4*size

    var pixel = canvas.append('g')
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
        .attr("d", clippath)
        .style('fill', 'none')
        .style('stroke', 'black')
    
    pixel.append("svg:image")
        .attr('id', 'bgimage'+id)
        .attr('x', x+offsetX)
        .attr('y', y+offsetY)
        .attr('width', imgsize)
        .attr('height', imgsize)
        .attr("xlink:href", image)
        .style('stroke', 'black')
        .style('opacity', 0.20)
        .style('filter', 'url(#bw-filter)')
        .attr("clip-path", 'url(#clipPathCrop' + id + ')')

    pixel.append("svg:image")
        .attr('id', 'image'+id)
        .attr('x', x+offsetX)
        .attr('y', y+offsetY)
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
        .transition()
        .duration(0)
        .attr('d', '')
    canvas.select('#bgimage'+id)
        .transition()
        .duration(delay)
        .ease(d3.easeLinear)
        .delay(init_delay)
        .style('opacity', 0.7)
}

function render_pixel(id, x, y, size, linewidth, init_delay, delay, splits) {
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
    return init_delay-delay
}


function parallel_animation() {
    
    var linewidth = 6
    var size = 80+linewidth
    linewidth /= 2
    var imgpath = "testimage5.jpg"
    var x = 0
    var y = 0

    var gridsize = 4
    var gap = 3 
    var id = 0
    var init_delay = 1000
    var d1, d2

    var queue = d3.queue(1)

    var imgsize = size*gridsize
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
            d1 = Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000
            // d2 = Math.floor(Math.random() * (20 - 10 + 1)) + 10
            load_pixel(id, init_delay, d1)
            // render_pixel(id, x+(j*size + j*gap), y+(i*size + i*gap), size, linewidth, d1+init_delay, d2, 10)
            
            setTimeout(function(id, x, y, i, j, size, gap, linewidth, d1, init_delay) {
                // queue.push(id)
                queue.defer(function(id, x, y, i, j, size, gap, linewidth, d1, init_delay, callback) {
                    d2 = Math.floor(Math.random() * (20 - 10 + 1)) + 10
                    render_delay = render_pixel(id, x+(j*size + j*gap), y+(i*size + i*gap), size, linewidth, 0, d2, 10)
                    console.log(d2)
                    setTimeout(function() {
                        callback(null, 0)
                        // console.log(id)
                    }, render_delay)
                }, id, x, y, i, j, size, gap, linewidth, d1, init_delay)
                // console.log(id)
            }, init_delay+d1, id, x, y, i, j, size, gap, linewidth, d1, init_delay)
        }
    }

}

parallel_animation()


// d3.json("data.json", function(d) {
// });
