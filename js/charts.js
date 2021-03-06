const defaultColors = {
  main: 'rgba(224,78, 57, 1)',
  borders: [
      'rgba(117,28,28,0.1)',
      'rgba(117,28,28,0.15)',
      'rgba(117,28,28,0.2)',
      'rgba(117,28,28,0.25)',
      'rgba(117,28,28,0.3)',
      'rgba(117,28,28,0.35)',
      'rgba(117,28,28,0.4)',
      'rgba(117,28,28,0.45)',
      'rgba(117,28,28,0.5)',
      'rgba(117,28,28,0.55)',
      'rgba(117,28,28,0.6)',
      'rgba(117,28,28,0.7)',
      'rgba(117,28,28,0.8)',
      'rgba(117,28,28,0.9)',
      'rgba(117,28,28,0.9)',
      'rgba(117,28,28,0.9)',

  ],
  backgrounds: [
    'rgba(224,78, 57, 0.1)',
    'rgba(224,78, 57, 0.15)',
    'rgba(224,78, 57, 0.2)',
    'rgba(224,78, 57, 0.25)',
    'rgba(224,78, 57, 0.3)',
    'rgba(224,78, 57, 0.35)',
    'rgba(224,78, 57, 0.4)',
    'rgba(224,78, 57, 0.45)',
    'rgba(224,78, 57, 0.5)',
    'rgba(224,78, 57, 0.55)',
    'rgba(224,78, 57, 0.6)',
    'rgba(224,78, 57, 0.7)',
    'rgba(224,78, 57, 0.8)',
    'rgba(224,78, 57, 0.9)',
  ],
  contrasts: [
    'rgba(224,78, 57, 0.8)',
    'rgba(78, 57, 224, 0.5)',
    'rgba(78, 57, 224, 0.2)',
    'rgba(57, 224, 78, 0.8)',
    'rgba(224,78, 57, 0.5)',
    'rgba(224,78, 57, 0.2)',
    'rgba(78, 57, 224, 0.8)',
    'rgba(57, 224, 78, 0.5)',
    'rgba(57, 224, 78, 0.2)',
  ],
};

const defaultOptions = {
  bars: {
      maintainAspectRatio: false,
      scales: {
          yAxes: [{
              ticks: {
                  beginAtZero: true,
              },
          }],
          xAxes: [{
              offset: true,
              bounds: 'ticks',
              type: 'time',
              distribution: 'series',
              gridLines: {
                   offsetGridLines: false,
              },
              time: {
                //  displayFormats: {
                      // month: 'MMM YYYY'
                      parser: 'MMM, YYYY',
                //  }
              }
          }],
      },
   },
   simpleBars: {
     maintainAspectRatio: false,
     scales: {
         yAxes: [{
             ticks: {
                 beginAtZero: true
             }
         }],
         xAxes: [{
           ticks: {
               beginAtZero: true
           }
         }],
      },
   },
   lines: {
       maintainAspectRatio: false,
       scales: {
           yAxes: [{
               ticks: {
                   beginAtZero:true
               }
           }],
           xAxes: [{
               type: 'time',
               time: {
                   displayFormats: {
                       month: 'MMM YYYY'
                   }
               }
           }],
       },
    },
};

const npmTotalDownloads = [6959080358,7287713518,9253309264,8544256533,9866551398,10526224587,10821685524,
  11927262465,12343332282,14216757113,14589759948,13318683306,15974325812,16655860047,
];

async function fetchData(url) {
  let data = await fetch(url);
  let response = await data.json();
  return await response;
}

function parseDataForLineChart(data, label, options) {
  if (options && options.x && options.y && options.type === 'time') {
    let sortedDataLabels = data
      .map((el) => new Date(el[options.x]));

    let sortedDataValues = data
        .map((el) => el[options.y]);
    let sortedData = { label, labels: sortedDataLabels, values: sortedDataValues };
    return sortedData;
  }
  throw('Cannot parse data. Please pass in the point coord options into the parseDataForLineChart method');
}

function roundData(data, options) {
  if (options && options.factor) {
    let filteredLabels = data.labels
      .filter((el, index) => index % options.factor === 0);
    let filteredValues = data.values
        .filter((el, index) => index % options.factor === 0);
    return { label: data.label, labels: filteredLabels, values: filteredValues };
  }
  throw('Cannot parse data. Please pass in required options into the roundData function');
}

async function parseDownloadData(dataList, options) {
  let factor = options && options.factor ? options.factor : 4;
  return Promise.all(dataList.map((el) => dataPipeline(el, factor))).then((res) => res);
}

async function parseDownloadDataNewsletter(file) {
  return Promise.all().then((res) => res);
}

async function dataPipeline(dataId, factor) {
  let data = await fetchData(`./data/${dataId}-downloads.json`);
  let label = dataId;
  let parsedData = parseDataForLineChart(data, label, { x: 'date',  y: 'value', type: 'time' });
  let roundedData = roundData(parsedData, { factor });
  return roundedData;
}


function createChart(elementId, type = 'line', mainLabel, inputData, configOptions, colorOptions, extraLabels) {
  var ctx = document.getElementById(elementId).getContext('2d');
  let dataIsArray = Object.keys(inputData)[0] === '0';

  const backgroundColor = colorOptions && colorOptions.backgroundColor ? colorOptions.backgroundColor : defaultColors.backgrounds;
  let borderColor = colorOptions && colorOptions.borderColor ? colorOptions.borderColor : defaultColors.main;
  const options = configOptions ? configOptions : defaultOptions.bars;
  const label = mainLabel ? mainLabel : data.label;
  const labels = dataIsArray ? extraLabels : inputData.labels;

  let datasets = dataIsArray ? inputData : [
    { label,
      data: inputData.values,
      fill: true,
      showLine: true,
      borderColor,
    },
  ];


  if (type === 'bar') {
    borderColor = colorOptions && colorOptions.borderColor ?  colorOptions.borderColor : defaultColors.borders;
  }

  if (type === 'bar') {
    if (!dataIsArray) {
      datasets = [
        { label,
          data: inputData.values,
          borderWidth: 1,
          backgroundColor,
          borderColor,
        },
      ];
    }
  }

  var chart = new Chart(ctx, {
      type,
      label,
      data: {
        labels,
        datasets,
      },
      options,
  });
}

function createPieChart(elementId, mainLabel, inputData, configOptions, colorOptions, extraLabels) {
  var ctx = document.getElementById(elementId).getContext('2d');
  let options = configOptions ? configOptions : { title: { display: true, text: mainLabel }, legend: { position: 'bottom'}};
  let backgroundColor = colorOptions && colorOptions.backgroundColor ? colorOptions.backgroundColor : defaultColors.contrasts;
  console.log(backgroundColor);

  return new Chart(ctx, {
    type: 'doughnut',
    data: {
      datasets: [{
        data: inputData.values,
        backgroundColor,
        label: mainLabel,
      }],
      labels: inputData.labels,
    },
    options: options
  });
}

function createCharts(dataDownloads) {
    var options = defaultOptions.bars;
    var ctx1 = document.getElementById("line-chart-framework-comparison").getContext('2d');
    const backgroundColor = defaultColors.backgrounds;
    const borderColor = defaultColors.borders;

    var myLineChartTwo = new Chart(ctx1, {
        type: 'bar',
        label: 'Downloads CLI',
        data: {
            labels: dataDownloads[0].labels,
            datasets: [
              { label: 'Ember CLI',
                data: dataDownloads[0].values,
                stack: 'ember',
                borderWidth: 1,
                backgroundColor,
                borderColor,
              },
              { label: 'Angular CLI',
                stack: 'angular',
                data: dataDownloads[1].values,
                borderWidth: 1,
                backgroundColor: 'blue',
                borderColor: 'blue',
              },
              { label: 'Vue CLI',
                stack: 'vue',
                data: dataDownloads[3].values,
                backgroundColor: 'green',
                borderColor: 'green',
              },
              { label: 'React CLI',
                stack: 'react',
                data: dataDownloads[2].values,
                backgroundColor: 'turquoise',
                borderColor: 'turquoise',
              },
              { label: '@Angular/CLI',
                stack: 'angular',
                data: dataDownloads[4].values,
                borderWidth: 1,
                backgroundColor: 'lightblue',
                borderColor: 'lightblue',
              },
            ],
        },
        options,
    });

  /*  createChart('top-1', 'line', 'Ember CLI Babel', dataDownloads[4]);
    createChart('top-2', 'line', 'Ember CLI Sass', dataDownloads[5]);
    createChart('top-3', 'line', 'Ember Data', dataDownloads[6]);
    createChart('top-4', 'line', 'Ember Try', dataDownloads[7]);
    createChart('top-5', 'line', 'Ember Wormhole', dataDownloads[8]);
    createChart('top-4', 'line', 'Ember Concurrency', dataDownloads[9]); */
}

function createStarsCharts() {
  const labels = ['ember-cli-babel 🔗',
  'ember-cli-sass',
  'ember-resolver 🐹',
  'ember-data 🐹 🔗',
  'ember-try 🐹',
  'ember-wormhole',
  'ember-concurrency',
  'ember-moment',
  'ember-native-dom-helpers',
  'ember-basic-dropdown'];

  const data = [103, 247, 80, 2856, 140, 261, 512, 372, 161, 94];
  const dataC = [31, 34, 46, 368, 25, 23, 38, 42, 19, 49];
  const dataD = [781350, 242248, 231739, 225789, 218795, 172294, 144698, 128051, 118112, 104634];

  const dataRatio = dataC.map((el, index) => el / dataD[index]);
  const options = {
      maintainAspectRatio: false,
      scales: {
          yAxes: [{
              ticks: {
                  beginAtZero:true
              }
          }]
      }
  }

  const datasetOne = [{
        label: '# of Stars',
        data,
        stack: 'Stars',
        backgroundColor: defaultColors.backgrounds,
        borderColor: defaultColors.borders,
        borderWidth: 1
    },
    {
        label: '# of Contributors',
        stack: 'Contributors',
        data: dataC,
        borderWidth: 1
  }];
  const dataTwo = { labels, values: normalizeData({values: dataD}) };
  const dataThree = { labels, values: dataRatio };

  var barCtx2 = document.getElementById("ember-dl").getContext('2d');
  var barCtx3 = document.getElementById("ember-ratio").getContext('2d');
  createChart('stars-ember', 'bar', 'Stars Ember', datasetOne, options, null, labels);
  createChart('ember-dl', 'bar', 'Downloads per month (normalized)', dataTwo, options);
  createChart('ember-ratio', 'bar', 'Contributors per Download', dataThree, options);
}

function createPieCharts(data) {
  const slackOverviewData =  {
    labels: [
      'Active Users',
      'Users actually messaging',
    ],
    values: [1268, 427]};
    const gitterOverviewData =  {
      labels: [
        'Slack',
        'Gitter: emberjs/emberjs',
      ],
      values: [2729873, 0]};
  const slackSummary = createPieChart('pie-chart-messages-slack', 'Number of weekly Users', slackOverviewData);
}

function getCommsOverviewData() {

  let slack = {
    datasets: [{
        data: [1268, 427],
        backgroundColor: [
          '#ff77ff',
          '#33ddff',
        ],
    }],

    // These labels appear in the legend and in the tooltips when hovering different arcs
    labels: [
        'Slack: Active Users (weekly)',
        'Slack: Users actually messaging',
    ],
  };
  let gitter = {
    datasets: [{
        data: [2729873, 0],
        backgroundColor: [
          '#ff77ff',
          '#33ddff',
        ],
        label: 'Messages in the last 30 days'
    }],

    // These labels appear in the legend and in the tooltips when hovering different arcs
    labels: [
        'Slack',
        'Gitter',
    ],
  };
  return { slack, gitter };
}

function parseNewsletterData() {
  return { values: [1,2,3], labels: ['a','b','c'] };
}

function normalize(actual, total) {
  return Number.parseFloat((actual / total) * 100);
}

function normalizeData(data) {
  return npmTotalDownloads.map((num, index) => normalize(data.values[index], num));
}

function parseNewsletter(data) {
  let data = parseDownloadDataNewsletter(data);
  return npmTotalDownloads.map((num, index) => normalize(data.values[index], num));
}

async function loadCharts() {
  const downloadList = ['ember-cli', 'angular-cli', 'react-cli', 'vue-cli', '@angular-cli', 'ember-cli-babel', 'ember-cli-sass', 'ember-data', 'ember-try', 'ember-wormhole', 'ember-concurrency', 'ember',
  'ember-cli-typescript', 'total'];
  let dataDownloads = await parseDownloadData(downloadList, { factor: 1 });
  let totalDownloads = dataDownloads[13].values;
  console.log(totalDownloads);
  createCharts(dataDownloads);
  createChart('chart-ember-download', 'bar', 'Ember CLI - Downloads / Month', dataDownloads[0]); // elementId, label, data, options, colorOptions
  createChart('chart-ember-download-2', 'bar', 'Ember CLI - Downloads / Month', dataDownloads[0]);
  createChart('chart-total-download', 'bar', 'Total Number of Downloads from NPM / Month', dataDownloads[13]);
  let normalizedCliDownloads = normalizeData(dataDownloads[0]);
  let normalizedCliDownloadsData = { labels: dataDownloads[0].labels, values: normalizedCliDownloads };
  console.log(normalizedCliDownloadsData);
  createChart('chart-ember-download-normalized', 'bar', 'Ember CLI - Downloads / Month (normalized)', normalizedCliDownloadsData);
  let channelCompData = { labels: ['Slack', 'Twitter: @emberjs', 'Gitter', 'IRC'], values: [11495, 38737, 718, 999]};
  createStarsCharts();
  createChart('channel-comparison', 'bar', '# of Users', channelCompData, defaultOptions.simpleBars);
  const addonData = { labels: ['UI Elements', 'Form Controls', 'Selects', 'List & Tables', 'Charts', 'Bootstrap', 'Datepickers', 'Images', 'Maps', 'and more',], values: [126, 92, 64, 62, 54, 51, 49, 42, 40,309]};
  createPieChart('pie-chart-addons', 'Component Addons', addonData);
  createPieChart('pie-chart-rfcs', 'Number of RFCs', { labels: ['open', 'merged in past year', 'merged more than a year ago', 'merged more than two years ago'], values: [54,24,10,10] });
  let pieData = getCommsOverviewData();
  createPieCharts(pieData);
  createChart('chart-contributors', 'bar', 'Number of Contributors per Project', { labels: ['emberjs/ember.js', 'glimmerjs/glimmer.js', 'glimmer-vm', 'guides','ember-data', 'ember-cli/ember-cli'], values: [706,26,80,508,421,385] }, defaultOptions.simpleBars);
  let topChannelLabels = ['#help','#general', '#random', '#ember-data', '#team-learning'];
  let topChannelLabelsWk = ['#help','#general', '#topic-typescript', '#team-learning', '#testing'];
  let slackChannelData = { labels: topChannelLabels,  values: [409728,231971,115270,57634,54760] };
  let slackChannelDataUserNum = { labels: topChannelLabels,  values: [10218,11493,10603,7402,799] };
  let slackChannelDataWk = { labels: topChannelLabelsWk,  values: [7340,3168,2859,2656,2361] };
  let slackChannelDataUserNumWk = { labels: topChannelLabelsWk,  values: [10218,11493,234,799,7034] };
  let channelDistributionData = { labels: ['Defaults', 'Core & Dev Channels', 'Local Channels (local-/lang-)', 'Addon Specific Channels', 'Event Channels', 'Other Fun Stuff'],
  values: [6,18,28,35,9,104] };
  createPieChart('pie-chart-channel-distribution', 'Channel Topics', channelDistributionData);
  createPieChart('pie-chart-messages-slack-distribution', 'Most Popular Channels: Total Messages all time', slackChannelData);
  createPieChart('pie-chart-messages-slack-channel-user-number', 'Most Popular Channels: Number of Users all time', slackChannelDataUserNum);
  let numOfMessagesRatio = { labels: topChannelLabels, values: slackChannelDataUserNum.values.map((usersNum, index) => slackChannelData.values[index] / usersNum) };
  let numOfMessagesRatioWk = { labels: topChannelLabelsWk, values: slackChannelDataUserNumWk.values.map((usersNum, index) => slackChannelDataWk.values[index] / usersNum) };
  createChart('chart-messages-ratio-slack', 'bar', '# Messages / User all time', numOfMessagesRatio, defaultOptions.simpleBars);
  createChart('chart-messages-ratio-trending', 'bar', '# Messages / User (past 30 days)', numOfMessagesRatioWk, defaultOptions.simpleBars);
  createChart('chart-typescript-download', 'bar', 'Ember CLI TypeScript - Downloads / Month', dataDownloads[12]); // elementId, label, data, options, colorOptions
  createChart('chart-typescript-download-normalized', 'bar', 'Ember CLI TypeScript - Downloads / Month', { labels: dataDownloads[12].labels, values: normalizeData(dataDownloads[12])}); // elementId, label, data, options, colorOptions
  createChart('chart-newsletter-subscribers', 'horizontalBar', '# Subscribers', { labels: ['Ember.js Times','Ember Weekly'], values: [1108,6055]}, defaultOptions.simpleBars); // elementId, label, data, options, colorOptions
  const goodbitsData = parseNewsletterData('./data/goodbitsstats.json');
  createChart('chart-subscriber-count', 'line', '# of Subscribers', goodbitsData);
}

loadCharts();
