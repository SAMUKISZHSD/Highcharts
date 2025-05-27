# Implementação de Gráfico de Gantt no Amazon QuickSight com Highcharts

## Visão Geral
Este guia explica como implementar um gráfico de Gantt no Amazon QuickSight utilizando a biblioteca Highcharts para visualização de ausências de colaboradores.

## Pré-requisitos
- Conjunto de dados no QuickSight com:
  - Nomes dos colaboradores
  - Datas de início (formato de data)
  - Datas de término (formato de data)
  - Tipos de ausência
- Acesso a visualizações personalizadas no QuickSight

## Configuração dos Dados

Estrutura mínima necessária:

| Colaborador | Data_Início | Data_Término | Tipo_Ausência |
|-------------|------------|-------------|--------------|
| Alice       | 2023-06-01 | 2023-06-05  | Férias       |
| Bruno       | 2023-06-03 | 2023-06-08  | Licença Médica |

## Implementação no QuickSight

### 1. Criar Visualização Personalizada

1. Na análise do QuickSight:
   - Clique em "Adicionar" → "Adicionar visualização personalizada"
   - Selecione "Highcharts" como biblioteca

### 2. Código Highcharts Personalizado

```javascript
// Função principal que será chamada pelo QuickSight
function render(settings, data) {
    // Transformar os dados do QuickSight para o formato esperado pelo Highcharts
    const seriesData = data.records.map(record => {
        const startDate = new Date(record[settings.startDateField]).getTime();
        const endDate = new Date(record[settings.endDateField]).getTime();
        const days = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
        
        return {
            name: record[settings.nameField],
            start: startDate,
            end: endDate,
            y: settings.categories.indexOf(record[settings.nameField]),
            type: record[settings.typeField],
            days: days,
            color: getColorForType(record[settings.typeField])
        };
    }).filter(point => point.start > Date.now()); // Filtra apenas eventos futuros

    // Obter categorias únicas de colaboradores
    const categories = [...new Set(data.records.map(record => record[settings.nameField]))].sort();

    // Configuração do gráfico
    const options = {
        chart: {
            type: 'gantt',
            inverted: true
        },
        title: {
            text: settings.title || 'Ausências de Colaboradores (D+1)'
        },
        subtitle: {
            text: settings.subtitle || 'Mostrando apenas eventos futuros a partir de amanhã'
        },
        xAxis: [{
            tickInterval: 24 * 3600 * 1000,
            labels: {
                format: '{value:%d}',
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
            linkedTo: 0,
            opposite: true,
            tickInterval: 24 * 3600 * 1000 * 30,
            labels: {
                format: '{value:%B %Y}',
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
            categories: categories,
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
        series: [{
            name: 'Ausências',
            data: seriesData,
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
                min: Date.now()
            }
        },
        scrollbar: {
            enabled: true
        }
    };

    // Adicionar configurações de idioma para português
    Highcharts.setOptions({
        lang: {
            months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                   'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
            weekdays: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
            shortMonths: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
        }
    });

    return options;
}

// Função auxiliar para definir cores por tipo de ausência
function getColorForType(type) {
    const colors = {
        'Férias': '#7cb5ec',
        'Licença Médica': '#f7a35c',
        'Saída Antecipada': '#90ee7e',
        'Licença Maternidade': '#aaeeee'
    };
    return colors[type] || '#8085e9';
}

// Configurações que aparecerão na interface do QuickSight
const settings = {
    fields: {
        nameField: {
            type: 'string',
            label: 'Campo com o nome do colaborador',
            defaultValue: ''
        },
        startDateField: {
            type: 'string',
            label: 'Campo com a data de início',
            defaultValue: ''
        },
        endDateField: {
            type: 'string',
            label: 'Campo com a data de término',
            defaultValue: ''
        },
        typeField: {
            type: 'string',
            label: 'Campo com o tipo de ausência',
            defaultValue: ''
        },
        title: {
            type: 'string',
            label: 'Título do gráfico',
            defaultValue: 'Ausências de Colaboradores (D+1)'
        },
        subtitle: {
            type: 'string',
            label: 'Subtítulo do gráfico',
            defaultValue: 'Mostrando apenas eventos futuros a partir de amanhã'
        }
    }
};