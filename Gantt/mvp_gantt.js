Highcharts.ganttChart('container', {
    title: {
        text: 'Ausências de Colaboradores (D+1)'
    },
    subtitle: {
        text: 'Mostrando apenas eventos futuros a partir de amanhã'
    },
    xAxis: [{
        // Eixo inferior (dias)
        tickInterval: 24 * 3600 * 1000, // 1 dia
        labels: {
            format: '{value:%d}', // Mostra apenas o dia do mês
            style: {
                fontSize: '10px'
            }
        },
        title: {
            text: 'Dias'
        },
        currentDateIndicator: {
            color: 'red',
            label: {
                format: 'Hoje: %d/%m',
                style: {
                    color: 'red'
                }
            }
        },
        plotLines: [{
            color: 'red',
            width: 2,
            value: Date.now(),
            zIndex: 5,
            label: {
                text: 'HOJE',
                rotation: 0,
                style: {
                    color: 'red',
                    fontWeight: 'bold'
                },
                verticalAlign: 'top',
                y: 30
            }
        }],
        minPadding: 0.05,
        maxPadding: 0.05
    }, {
        // Eixo superior (mês)
        linkedTo: 0,
        opposite: true,
        tickInterval: 24 * 3600 * 1000 * 30, // ~1 mês
        labels: {
            format: '{value:%B %Y}', // Mostra mês e ano
            style: {
                fontSize: '12px',
                fontWeight: 'bold'
            }
        },
        title: {
            text: 'Mês'
        }
    }],
    yAxis: {
        categories: ['Alice', 'Bruno', 'Carla', 'Daniel', 'Elena'],
        title: {
            text: 'Colaboradores'
        }
    },
    tooltip: {
        outside: true,
        formatter: function() {
            return `<span style="color:${this.point.color}">●</span> 
                    <b>${this.point.name}</b><br/>
                    ${this.point.type}<br/>
                    De ${Highcharts.dateFormat('%d/%m/%Y', this.point.start)} 
                    a ${Highcharts.dateFormat('%d/%m/%Y', this.point.end)}<br/>
                    <b>${this.point.days} dias</b>`;
        }
    },
    accessibility: {
        point: {
            valueDescriptionFormat: '{point.name}, {point.type} de {point.x:%d/%m/%Y} a {point.x2:%d/%m/%Y} ({point.days} dias).'
        }
    },
    lang: {
        months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
               'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
        weekdays: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
        shortMonths: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    },
    series: [{
        name: 'Ausências',
        data: [{
            name: 'Alice',
            start: Date.now() + 86400000 * 2, // 2 dias no futuro
            end: Date.now() + 86400000 * 6,   // 6 dias no futuro
            y: 0,
            type: 'Férias',
            days: 4,
            color: '#7cb5ec'
        }, {
            name: 'Bruno',
            start: Date.now() + 86400000 * 5, // 5 dias no futuro
            end: Date.now() + 86400000 * 10,  // 10 dias no futuro
            y: 1,
            type: 'Licença Médica',
            days: 5,
            color: '#f7a35c'
        }, {
            name: 'Carla',
            start: Date.now() + 86400000 * 1, // Amanhã
            end: Date.now() + 86400000 * 3,   // 3 dias no futuro
            y: 2,
            type: 'Saída Antecipada',
            days: 2,
            color: '#90ee7e'
        }, {
            name: 'Daniel',
            start: Date.now() + 86400000 * 7,  // 7 dias no futuro
            end: Date.now() + 86400000 * 20,   // 20 dias no futuro
            y: 3,
            type: 'Férias',
            days: 13,
            color: '#7cb5ec'
        }, {
            name: 'Elena',
            start: Date.now() + 86400000 * 3,  // 3 dias no futuro
            end: Date.now() + 86400000 * 15,  // 15 dias no futuro
            y: 4,
            type: 'Licença Maternidade',
            days: 12,
            color: '#aaeeee'
        }].filter(point => point.start > Date.now()),
        dataLabels: {
            enabled: true,
            format: '{point.type}',
            style: {
                color: '#333333',
                textOutline: 'none',
                fontWeight: 'normal'
            },
            inside: true
        }
    }],
    plotOptions: {
        series: {
            dataLabels: {
                align: 'left',
                allowOverlap: true,
                crop: false,
                padding: 5,
                verticalAlign: 'middle',
                x: 5
            }
        }
    },
    navigator: {
        enabled: true,
        liveRedraw: true,
        series: {
            type: 'gantt',
            pointPlacement: 0.5,
            pointPadding: 0.25
        },
        xAxis: {
            min: Date.now() // Mostrar a partir de hoje no navegador
        }
    },
    scrollbar: {
        enabled: true
    }
});