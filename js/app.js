var anoChart = dc.barChart("#anoChart");
var numporEstadoChart = dc.barChart("#numporEstadoChart");
var sexoChart = dc.pieChart("#sexoChart");
var tipoEscolaChart = dc.pieChart("#tipoEscolaChart");
var localEscolaChart = dc.pieChart("#localEscolaChart");
//nota media
var md_redChart = dc.rowChart("#md_redChart");
var md_objChart = dc.rowChart("#md_objChart");
//linechart
var evoLineObjChart = dc.lineChart("#evoLineObjChart")
var evoLineRedChart = dc.lineChart("#evoLineRedChart")

// var url = "base/enem-2009-16-escolas.csv";
var url = "https://raw.githubusercontent.com/cmartins-ifpa/educ-br/master/datasets/enem-2009-16-escolas.csv";

/** 
 nu_ano,co_escola,sg_uf_esc,co_municipio_esc,tp_sexo,tp_dependencia_adm_esc,tp_localizacao_esc,inscritos,md_cn,md_ch,md_lc,md_mt,md_red
 2009,11000058,RO,1100205,F,4,1,90,624.6,629.1,623.0,582.6,740.6
 2009,11000058,RO,1100205,M,4,1,56,620.2,615.7,558.3,605.7,650.9
 2009,11000198,RO,1100205,F,4,1,28,601.7,610.2,577.8,559.9,646.4
 **/

// ifpa 15588947

var codEscola;


dc.config.defaultColors(d3.schemeSet2)

d3.csv(url).then(function (data) {

    var ndx = crossfilter(data);
    var ndx2 = crossfilter(data);
    var all = ndx.groupAll();
    var all2 = ndx2.groupAll();


// escutar cod escola
    var escolaDim = ndx.dimension(escola => escola.co_escola)

    function myFunction() {
        existe = false;
        codEscola = document.getElementById("codEscola").value
        escolaDim.top(Infinity).forEach(function (element) {
            if (element.co_escola == codEscola) {
                existe = true;
            }
        });
        if (existe) {
            escolaDim.filter(codEscola);
            dc.renderAll();
            return;
        } else {
            escolaDim.filter(null)
            dc.renderAll();
            window.alert("Escola não encontrada")
        }
    }

    document.getElementById("myBtn").addEventListener("click", myFunction);

    //*** Sexo charts  ***//

    var generoDim = ndx.dimension(function (d) {
        return  d.tp_sexo === "M" ? 'Masc.' : 'Femi.';
    });

    sexoChart
            .width(300)
            .height(250)
            .radius(100)
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
            .ordinalColors(d3.schemeCategory10)
            .legend(dc.legend().x(10).y(10).itemHeight(13).gap(5))


//    /**    Tipo de Escola **/

    var tipoAdmEscolaDim = ndx.dimension(escola =>
        escola.tp_dependencia_adm_esc == 1 ? 'Fed' : escola.tp_dependencia_adm_esc == 2 ? 'Est' : escola.tp_dependencia_adm_esc == 3 ? 'Mun' : 'Par');

    tipoEscolaChart
            .width(300)
            .height(250)
            .radius(100)
            .dimension(tipoAdmEscolaDim)
            .group(tipoAdmEscolaDim.group())
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
            .ordinalColors(d3.schemeCategory10)
            .legend(dc.legend().x(10).y(10).itemHeight(13).gap(5))


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
            .ordinalColors(d3.schemeCategory10)
            .legend(dc.legend().x(10).y(10).itemHeight(13).gap(5))

    /**    Numero de Participantes                       **/

    var anoDim = ndx.dimension(ano => ano.nu_ano);
    var anoGroup = anoDim.group().reduceSum(function (d) {
        return d.inscritos;
    });


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
            .ordinalColors(d3.schemeCategory10);

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
            .ordinalColors(d3.schemeCategory10);

    /** **************  Percentual de participantes em relacao ao ano anterior  ******************** **/




    /** **************  Media  das Notas  ******************** **/

    var md_redGroup = anoDim.group().reduce(reduceREDAdd, reduceREDRemove, reduceREDInitial);
    var notaPorGrupoGroup = anoDim.group().reduce(reduceMedObjAdd, reduceMedObjRemove, reduceMedObjInitial)

////reduce media Provas OBjetivas  ---------------------------------------------------
    function reduceMedObjAdd(p, v) {
        ++p.count;
        p.total += (parseFloat(v.md_cn) + parseFloat(v.md_ch) + parseFloat(v.md_lc) + parseFloat(v.md_mt)) / 4;
        return p;
    }
    function reduceMedObjRemove(p, v) {
        --p.count;
        p.total -= (parseFloat(v.md_cn) + parseFloat(v.md_ch) + parseFloat(v.md_lc) + parseFloat(v.md_mt)) / 4;
        return p;
    }
    function reduceMedObjInitial() {
        return {count: 0, total: 0};
    }

//reduce media RED ------------------------------------------------
    function reduceREDAdd(p, v) {
        ++p.count;
        p.total += (v.md_red) * 1;
        //console.log(p.total)
        return p;
    }
    function reduceREDRemove(p, v) {
        --p.count;
        p.total -= (v.md_red) * 1;
        return p;
    }
    function reduceREDInitial() {
        return {count: 0, total: 0};
    }

    md_redChart
            .width(450)
            .height(200)
            .ordinalColors(d3.schemeCategory10)
            .dimension(anoDim)
            .group(md_redGroup, '5')
            .x(d3.scaleLinear().domain(["teste"]))
            .elasticX(true)
            .valueAccessor(function (p) {
                return p.value.count > 0 ? p.value.total / p.value.count : 0;
            })
            .label(function (d) {
                if (localEscolaChart.hasFilter() && !localEscolaChart.hasFilter(d.key)) {
                    return d.key + '(0%)';
                }
                var label = d.key;
                if (all.value()) {
                    label += ' (' + (d.value.total / d.value.count).toFixed(2) + ')';
                }
                return label;
            })
    md_objChart
            .width(450)
            .height(200)
            .ordinalColors(d3.schemeCategory10)
            .dimension(anoDim)
            .group(notaPorGrupoGroup, '6')
            .x(d3.scaleLinear().domain(["teste"]))
            .elasticX(true)
            .valueAccessor(function (p) {
                return p.value.count > 0 ? p.value.total / p.value.count : 0;
            })
            .label(function (d) {
                if (localEscolaChart.hasFilter() && !localEscolaChart.hasFilter(d.key)) {
                    return d.key + '(0%)';
                }
                var label = d.key;
                if (all.value()) {
                    label += ' (' + (d.value.total / d.value.count).toFixed(2) + ')';
                }
                return label;
            })

//// 

    var percentGroup = anoDim.group().reduce(
            function (p, v) {
                ++p.count;
                p.total += parseFloat(v.inscritos);
                return p;
            },
            function (p, v) {
                --p.count;
                p.total -= parseFloat(v.inscritos);
                return p;
            },
            function () {
                return {
                    count: 0,
                    total: 0,
                };
            }
    );

    evoLineObjChart
            .width(450)
            .height(200)
            .margins({top: 10, right: 20, bottom: 30, left: 50})
            .x(d3.scaleBand())
            .elasticY(true)
            .xUnits(dc.units.ordinal)
            .yAxisLabel("Decay %")
            .dimension(anoDim)
            .valueAccessor(function (d) {
                return (d.value.total / d.value.count)
            })
            .group(notaPorGrupoGroup)
            .on('renderlet', function (chart) {
                chart.selectAll('rect').on("click", function (d) {
                    console.log("click!", d);
                });
            })

    evoLineRedChart
            .width(450)
            .height(200)
            .margins({top: 10, right: 20, bottom: 30, left: 50})
            .x(d3.scaleBand())
            .elasticY(true)
            .xUnits(dc.units.ordinal)
            .yAxisLabel("Decay %")
            .dimension(anoDim)
            .valueAccessor(function (d) {
                return (d.value.total / d.value.count)
            })
            .group(md_redGroup)
            .on('renderlet', function (chart) {
                chart.selectAll('rect').on("click", function (d) {
                    console.log("click!", d);
                });
            })


    dc.renderAll();
});
