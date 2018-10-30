var anoChart = dc.barChart("#anoChart");
var numporEstadoChart = dc.barChart("#numporEstadoChart");
var sexoChart = dc.pieChart("#sexoChart");
var tipoEscolaChart = dc.pieChart("#tipoEscolaChart");
var localEscolaChart = dc.pieChart("#localEscolaChart");
//var notaporDisciplinaChart = dc.compositeChart('#notaporDisciplinaChart');

//nota media
//var md_cnChart = dc.rowChart("#md_cnChart");
//var md_chChart = dc.rowChart("#md_chChart");
//var md_lcChart = dc.rowChart("#md_lcChart");
//var md_mtChart = dc.rowChart("#md_mtChart");
//var md_cn;

var url = "base/enem-2009-16-escolas.csv";


/** 
 nu_ano,co_escola,sg_uf_esc,co_municipio_esc,tp_sexo,tp_dependencia_adm_esc,tp_localizacao_esc,inscritos,md_cn,md_ch,md_lc,md_mt,md_red
 2009,11000058,RO,1100205,F,4,1,90,624.6,629.1,623.0,582.6,740.6
 2009,11000058,RO,1100205,M,4,1,56,620.2,615.7,558.3,605.7,650.9
 2009,11000198,RO,1100205,F,4,1,28,601.7,610.2,577.8,559.9,646.4
 **/
dc.config.defaultColors(d3.schemeSet1)

d3.csv(url).then(function (data) {

    var ndx = crossfilter(data);
    var all = ndx.groupAll();

    var ndx2 = crossfilter(data);
    var all2 = ndx2.groupAll();

    var mediaObjDim = ndx.dimension(function (d) {
        return d.md_cn + d.md_ch + d.md_lc + d.md_mt;
    });

    //*** Sexo charts  ***//

    var generoDim = ndx.dimension(function (d) {
        return  d.tp_sexo === "M" ? 'Masc.' : 'Femi.';
    });

    sexoChart
            .width(300)
            .height(250)
            .radius(100)
            //   .colors()
            .dimension(generoDim)
            .group(generoDim.group())
            .label(function (d) {
                if (sexoChart.hasFilter() && !sexoChart.hasFilter(d.key)) {
                    return d.key + '(0%)';
                }
                var label = d.key;
                if (all.value()) {
                    label += '(' + Math.floor(d.value / all.value() * 100) + '%)';
                }
                return label;
            })
            .ordinalColors(d3.schemeSet2);


//    /**    Tipo de Escola **/

    var tipoEscolaDim = ndx.dimension(escola =>
        escola.tp_dependencia_adm_esc == 1 ? 'Fed' : escola.tp_dependencia_adm_esc == 2 ? 'Est' : escola.tp_dependencia_adm_esc == 3 ? 'Mun' : 'Par');

    tipoEscolaChart
            .width(300)
            .height(250)
            .radius(100)
            .dimension(tipoEscolaDim)
            .group(tipoEscolaDim.group())
            .label(function (d) {
                if (tipoEscolaChart.hasFilter() && !tipoEscolaChart.hasFilter(d.key)) {
                    return d.key + '(0%)';
                }
                var label = d.key;
                if (all.value()) {
                    label += '(' + Math.floor(d.value / all.value() * 100) + '%)';
                }
                return label;
            })
            .ordinalColors(d3.schemeSet2);


    /**  local da Escola **/

    var localEscolaDim = ndx.dimension(escola => escola.tp_localizacao_esc == 1 ? 'Urbana' : 'Rural');

    localEscolaChart
            .width(300)
            .height(250)
            .radius(100)
            .dimension(localEscolaDim)
            .group(localEscolaDim.group())
            .label(function (d) {
                if (localEscolaChart.hasFilter() && !localEscolaChart.hasFilter(d.key)) {
                    return d.key + '(0%)';
                }
                var label = d.key;
                if (all.value()) {
                    label += '(' + Math.floor(d.value / all.value() * 100) + '%)';
                }
                return label;
            })
            .ordinalColors(d3.schemeSet2);

    /**    Numero de Participantes                       **/

    var anoDim = ndx.dimension(ano => ano.nu_ano);
    var anoGroup = anoDim.group().reduceSum(function (d) {
        return d.inscritos;
    });

    anoDimMax = anoGroup.top(1)[0].value;
    console.log(anoDimMax)

    anoChart
            .width(300)
            .height(200)
            .margins({top: 10, right: 20, bottom: 30, left: 50})
            //.y(d3.scaleLinear().domain([0,anoDimMax]))
            .elasticY(true)
            .x(d3.scaleBand().domain([2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016]))
            .xUnits(dc.units.ordinal)
            .yAxisLabel("Qtd")
            .xAxisLabel("Ano")
            .dimension(anoDim)
            .group(anoGroup)
            .ordinalColors(d3.schemeSet2);

////***      Numero de Participantes           por estado             ****//

    var numporestaDim = ndx.dimension(uf => uf.sg_uf_esc);
    var numporestaGroup = numporestaDim.group().reduceSum(function (d) {
        return d.inscritos;
    });

    numporEstadoChart
            .width(600)
            .height(200)
            .margins({top: 10, right: 20, bottom: 30, left: 50})
            .x(d3.scaleBand().domain(numporestaDim))
            .xUnits(dc.units.ordinal)
            .elasticY(true)
            .yAxisLabel("Qtd")
            .xAxisLabel("UF")
            .dimension(numporestaDim)
            .group(numporestaGroup)
            .ordinalColors(d3.schemeSet2);

////    /**        Media  Nota Objetiva        **/

    var md_cnDim = ndx.dimension(nota => nota.md_cn);
    var md_chDim = ndx.dimension(nota => nota.md_ch);
    var md_lcDim = ndx.dimension(nota => nota.md_lc);
    var md_mtDim = ndx.dimension(nota => nota.md_mt);

    var md_cnGroup = md_cnDim.group().reduce(reduceAdd, reduceRemove, reduceInitial);
    var md_chGroup = md_chDim.group().reduce(reduceAdd, reduceRemove, reduceInitial);
    var md_lcGroup = md_lcDim.group().reduce(reduceAdd, reduceRemove, reduceInitial);
    var md_mtGroup = md_mtDim.group().reduce(reduceAdd, reduceRemove, reduceInitial);

    function reduceAdd(p, v) {
        ++p.count;
        p.total += v.value;
        return p;
    }

    function reduceRemove(p, v) {
        --p.count;
        p.total -= v.value;
        return p;
    }

    function reduceInitial() {
        return {count: 0, total: 0};
    }

//    md_cnChart
//            .dimension(md_cnDim)
//            .group(md_cnGroup, "cd")
//
//    md_chChart
//            .dimension(md_chDim)
//            .group(md_chGroup, "ch")
//
//    md_lcChart
//            .dimension(md_lcDim)
//            .group(md_lcGroup, "lc")
//
//    md_mtChart
//            .dimension(md_mtDim)
//            .group(md_mtGroup, "mt")

//    notaporDisciplinaChart
//            .width(400)
//            .height(250)
//            .ordinalColors(d3.schemeSet2)
//            .margins({top: 10, right: 10, bottom: 30, left: 40})
//            .x(d3.scaleLinear().domain([300, 1000]))
//            .y(d3.scaleOr)
//            .compose([
//                dc.rowChart(notaporDisciplinaChart)
//                        .dimension(md_cnDim)
//                        .group(md_cnGroup, "cd"),
//
//                dc.rowChart(notaporDisciplinaChart)
//                        .dimension(md_chDim)
//                        .group(md_chGroup, "ch"),
//
//                dc.rowChart(notaporDisciplinaChart)
//                        .dimension(md_lcDim)
//                        .group(md_lcGroup, "lc"),
//
//                dc.rowChart(notaporDisciplinaChart)
//                        .dimension(md_mtDim)
//                        .group(md_mtGroup, "mt"),
//            ]);

////    /**        Media Geral Nota Redacao         **/


    dc.renderAll();
});
