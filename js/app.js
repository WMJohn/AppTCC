var anoChart = dc.barChart("#anoChart");
var sexoChart = dc.pieChart("#sexoChart");
var tipoEscolaChart = dc.pieChart("#tipoEscolaChart");
var localEscolaChart = dc.pieChart("#localEscolaChart");
var mediaFinalChart = dc.row

var url = "base/enem-2009-16-escolas.csv";

/** 
 nu_ano,co_escola,sg_uf_esc,co_municipio_esc,tp_sexo,tp_dependencia_adm_esc,tp_localizacao_esc,inscritos,md_cn,md_ch,md_lc,md_mt,md_red
 2009,11000058,RO,1100205,F,4,1,90,624.6,629.1,623.0,582.6,740.6
 2009,11000058,RO,1100205,M,4,1,56,620.2,615.7,558.3,605.7,650.9
 2009,11000198,RO,1100205,F,4,1,28,601.7,610.2,577.8,559.9,646.4
 **/

d3.csv(url, function (err, data) {

    if (err)
        throw err;

    var ndx = crossfilter(data);
    var all = ndx.groupAll();



    var mediaObjDim = ndx.dimension(function (d) {
        return d.md_cn + d.md_ch + d.md_lc + d.md_mt;
    });

    var colorScale = d3.scale.ordinal().range(['#00adb5', '#f8b500', '#d34c26', '#f7de1c']);


    //*** Sexo charts  ***//

    var generoDim = ndx.dimension(function (d) {
        return  d.tp_sexo === "M" ? 'Masc.' : 'Femi.';
    });

    sexoChart
            .width(300)
            .height(250)
            .radius(100)
            .innerRadius(10)
            .colors(colorScale)
            .dimension(generoDim)
            .group(generoDim.group())
            .minAngleForLabel(0)
            .on('pretransition', function (chart) {
                chart.selectAll('text.pie-slice').text(function (d) {
                    return d.data.key + ' ' + dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2 * Math.PI) * 100) + '%';
                })
            });

    /**    Tipo de escola **/

    var tipoEscolaDim = ndx.dimension(function (d) {
        return  d.tp_dependencia_adm_esc == 1 ? 'Fed' : d.tp_dependencia_adm_esc == 2 ? 'Est' : d.tp_dependencia_adm_esc == 3 ? 'Mun' : 'Par';
    });

    tipoEscolaChart
            .width(300)
            .height(250)
            .radius(100)
            .innerRadius(10)
            .colors(colorScale)
            .dimension(tipoEscolaDim)
            .group(tipoEscolaDim.group())
            .minAngleForLabel(0)
            .on('pretransition', function (chart) {
                chart.selectAll('text.pie-slice').text(function (d) {
                    return d.data.key + ' ' + dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2 * Math.PI) * 100) + '%';
                })
            });

    /**    local de escola **/

    var localEscolaDim = ndx.dimension(function (d) {
        return  d.tp_localizacao_esc == 1 ? 'Urbana' : 'Rural';
    });

    localEscolaChart
            .width(300)
            .height(250)
            .radius(100)
            .innerRadius(10)
            .colors(colorScale)
            .dimension(localEscolaDim)
            .group(localEscolaDim.group())
            .minAngleForLabel(0)
            .on('pretransition', function (chart) {
                chart.selectAll('text.pie-slice').text(function (d) {
                    return d.data.key + ' ' + dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2 * Math.PI) * 100) + '%';
                })
            });

//***      Numero de Participantes                       ****//

    var anoDim = ndx.dimension(function (d) {
        return d.nu_ano;
    });

    var anoGroup = anoDim.group();

    anoChart
            .width(500)
            .height(200)
            .margins({top: 10, right: 50, bottom: 30, left: 40})
            .x(d3.scale.linear().domain([2009, 2017]))
            .brushOn(true)
            .yAxisLabel("Qtd")
            .xAxisLabel("Ano")
            .dimension(anoDim)
            .group(anoDim.group());

    /**        Media Geral Nota Objetiva        **/
    /**        Media Geral Nota Redacao         **/


    dc.renderAll();
});