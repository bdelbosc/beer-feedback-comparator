<script>
  export let title;
  export let you;
  export let others;
  export let experimented;

  const dataOthers = {
    x: [],
    type: 'box',
    name: 'Others',
    boxpoints: 'all',
    boxmean: true
  };

  const dataYou = {
    x: [],
    type: 'box',
    name: 'You'
  };

  const dataExperimented = {
    x: [],
    type: 'box',
    name: 'Experts',
    boxpoints: 'all',
    boxmean: true
  };

  const data = [dataOthers, dataYou, dataExperimented];

  const layout = {
    // title: title,
    showlegend: false
  };

  function plotlyLoaded() {
    console.debug("plotly loaded");
    dataYou.x = you;
    dataOthers.x = others;
    dataExperimented.x = experimented;
    console.log(data);
    let plotDiv = document.getElementById('plotId' + title);
    Plotly.newPlot(plotDiv, data, layout, {displayModeBar: false});
  }
</script>

<style>
</style>

<div on:load={plotlyLoaded()}>
  <div id={'plotId' + title}><!-- Plotly chart will be drawn inside this DIV --></div>
</div>
