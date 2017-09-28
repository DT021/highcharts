
QUnit.test('Test algorithm on data updates.', function (assert) {

    var chart = Highcharts.stockChart('container', {
        yAxis: [{
            height: '50%'
        }, {
            top: '60%',
            height: '40%'
        }],
        series: [{
            id: 'main',
            data: [
                459.99,
                448.85,
                446.06,
                450.81,
                442.8,
                448.97,
                444.57,
                441.4,
                430.47,
                420.05,
                431.14,
                425.66,
                430.58,
                431.72,
                437.87,
                428.43,
                428.35,
                432.5,
                443.66,
                455.72,
                454.49,
                452.08,
                452.73,
                461.91,
                463.58,
                461.14,
                452.08,
                442.66,
                428.91,
                429.79,
                431.99,
                427.72,
                423.2,
                426.21,
                426.98,
                435.69,
                434.33
            ]
        }, {
            yAxis: 1,
            type: 'macd',
            linkedTo: 'main',
            params: {
                shortPeriod: 12,
                longPeriod: 26,
                signalPeriod: 9,
                period: 26
            }
        }]
    });


    assert.strictEqual(
        chart.series[0].points.length,
        chart.series[1].points.length + chart.series[1].options.params.period,
        'Initial number of MACD points is correct'
    );

    assert.deepEqual(
        chart.series[1].yData,
        [
            [0, null, 8.275269503907623],
            [0, null, 7.70337838145673],
            [0, null, 6.416074756955879 ],
            [0, null, 4.2375197832648155 ],
            [0, null, 2.5525833248657364 ],
            [0, null, 1.3788857198536562 ],
            [0, null, 0.10298149119910249 ],
            [0, null, -1.2584019528031263 ],
            [-5.108084058828859, 3.037525868733945, -2.070558190094914 ],
            [-4.527494557592668, 1.9056522293357783, -2.6218423282568892],
            [-3.387775175832581, 1.058708435377633, -2.329066740454948]
        ],
        'Correct values'
    );

    chart.series[0].addPoint(429.8);

    assert.strictEqual(
        chart.series[0].points.length,
        chart.series[1].points.length + chart.series[1].options.params.period,
        'After addPoint number of MACD points is correct'
    );

    chart.series[0].setData([
        459.99,
        448.85,
        446.06,
        450.81,
        442.8,
        448.97,
        444.57,
        441.4,
        430.47,
        420.05,
        431.14,
        425.66,
        430.58,
        431.72,
        437.87,
        428.43,
        428.35,
        432.5,
        443.66,
        455.72,
        454.49,
        452.08,
        452.73,
        461.91,
        463.58,
        461.14,
        452.08,
        442.66,
        428.91,
        429.79,
        431.99,
        427.72,
        423.2,
        426.21,
        426.98,
        435.69,
        434.33
    ], false);

    chart.series[1].update({
        signalLine: {
            styles: {
                lineWidth: 10,
                lineColor: 'red'
            }
        },
        macdLine: {
            styles: {
                lineWidth: 10,
                lineColor: 'blue'
            }
        },
        params: {
            shortPeriod: 10,
            longPeriod: 24,
            signalPeriod: 7,
            period: 24
        }
    });

    assert.deepEqual(
        chart.series[1].yData,
        [
            [0, null, 2.009761429289483], [0, null, 1.8993623815397882], [0, null, 3.495107645502287],
            [0, null, 5.685067060259314], [0, null, 7.728053717036346], [0, null, 8.874984710071601],
            [2.755190011641081, 5.407921159223316, 8.163111170864397],
            [-0.29114458390376186, 5.310872964588729, 5.019728380684967],
            [-1.7051015772638776, 4.742505772167436, 3.0374041949035586],
            [-1.837291791774346, 4.1300751749093205, 2.2927833831349744],
            [-2.49033513901796, 3.299963461903334, 0.8096283228853736],
            [-3.359983019981323, 2.1799691219095596, -1.1800138980717634],
            [-3.78373967629286, 0.9187225631452729, -2.8650171131475872]],
        'Correct values'
    );

    assert.strictEqual(
        chart.series[1].graphsignal.attr('stroke'),
        'red',
        'Line color changed'
    );

    assert.strictEqual(
        chart.series[1].graphmacd.attr('stroke'),
        'blue',
        'Line color changed'
    );

    chart.series[0].points[27].remove();

    assert.deepEqual(
        chart.series[1].yData,
        [[0, null, 2.009761429289483], [0, null, 1.8993623815397882], [0, null, 3.495107645502287],
        [0, null, 5.685067060259314], [0, null, 8.828053717036369], [0, null, 9.816584710071595],
        [0.9123374402124522, 5.441045730651881, 6.353383170864333],
        [-0.9975912415661963, 5.108515316796483, 4.110924075230287],
        [-1.4652281468941535, 4.620105934498431, 3.1548777876042777],
        [-2.340051362958811, 3.840088813512161, 1.50003745055335],
        [-3.3517260665056896, 2.722846791343598, -0.6288792751620917],
        [-3.8621861274859866, 1.4354514155149358, -2.4267347119710507]],
        'Correct values after point.remove()'
    );
});
