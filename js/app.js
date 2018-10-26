var anoChart = dc.barChart("#anoChart");
var sexoChart = dc.pieChart("#sexoChart");
var topEscolasChart = dc.barChart("#topEscolasChart");
var mediaFinalChart = dc.row

var url = "base/enem-2009-16-escolas.csv";

d3.csv(url, function (err, data) {

    if (err)
        throw err;

    var ndx = crossfilter(data);
    var all = ndx.groupAll();

    var anoDim = ndx.dimension(function (d) {
        return d.nu_ano;
    });

    var generoDim = ndx.dimension(function (d) {
        return  d.tp_sexo === "M" ? 'Masc.' : 'Femi.';
    });

    var escolaDim = ndx.dimension(function (d) {
        return d.co_escola;
    });

    var tpAdmEscDim = ndx.dimension(function (d) {
        return d.tp_dependencia_adm_esc;
    });


//    var mediaObjDim = ndx.dimension(function (d) {
//        return ( d.md_cn + d.md_ch + d.md_lc + d.md_mt) / 4.0 ;
//    });


    var anoGroup = anoDim.group();


    var colorScale = d3.scale.ordinal().range(['#ed9cb0', '#3d59f7']);


    sexoChart
            .width(200)
            .height(200)
            .radius(100)
            .innerRadius(30)
            .colors(colorScale)
            .dimension(generoDim)
            .group(generoDim.group()
//               {
//            all: function() {
//                return genderDimension.group().all().filter(function(d) {
//                    return d.key != "unspecified";
//                });
//            }
//        }
                    )
            .minAngleForLabel(0)
            .on('pretransition', function (chart) {
                chart.selectAll('text.pie-slice').text(function (d) {
                    return d.data.key + ' ' + dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2 * Math.PI) * 100) + '%';
                })
            });

    anoChart
            .width(500)
            .height(300)
            .x(d3.scale.linear().domain([2009, 2017]))
            .brushOn(true)
            .yAxisLabel("Qtd")
            .xAxisLabel("Ano")
            .dimension(anoDim)
            .group(anoDim.group());
    
     topEscolasChart
            .width(500)
            .height(300)
            .x(d3.scale.linear().domain([2008, 2018]))
            .brushOn(true)
            .yAxisLabel("Qtd")
            .xAxisLabel("Ano")
            .dimension(escolaDim)
            .group(escolaDim.group());

    dc.renderAll();
});