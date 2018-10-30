var anoChart = dc.barChart("#anoChart");
var numporEstadoChart = dc.barChart("#numporEstadoChart");
var sexoChart = dc.pieChart("#sexoChart");
var tipoEscolaChart = dc.pieChart("#tipoEscolaChart");
var localEscolaChart = dc.pieChart("#localEscolaChart");
//var notaporDisciplinaChart = dc.barChart('#notaporDisciplinaChart');

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
//***      Numero de Participantes                       ****//

    var anoDim = ndx.dimension(ano => ano.nu_ano);
    var anoGroup = anoDim.group().reduceSum(function (d) {
        return d.inscritos;
    });

    anoChart
            .width(350)
            .height(200)
            .margins({top: 10, right: 50, bottom: 30, left: 40})
            .x(d3.scaleBand().domain([2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016]))
            .xUnits(dc.units.ordinal)
            .yAxisLabel("Qtd")
            .xAxisLabel("Ano")
            .dimension(anoDim)
            .group(anoGroup)
    //.brushOn(true)

////***      Numero de Participantes           por estado             ****//

    var numporestaDim = ndx.dimension(uf => uf.sg_uf_esc);
    var numporestaGroup = numporestaDim.group().reduceSum(function (d) {
        return d.inscritos;
    });

    numporEstadoChart
            .width(600)
            .height(200)
            .margins({top: 10, right: 10, bottom: 30, left: 40})
            .x(d3.scaleBand().domain(['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
                'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO']))
            .xUnits(dc.units.ordinal)
            .yAxisLabel("Qtd")
            .xAxisLabel("UF")
            .dimension(numporestaDim)
            .group(numporestaGroup);

////    /**        Media  Nota Objetiva        **/


////    /**        Media Geral Nota Redacao         **/


    dc.renderAll();
});
